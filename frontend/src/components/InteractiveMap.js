import React, { useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMap, Circle as LeafletCircle, Rectangle as LeafletRectangle, Polygon as LeafletPolygon } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { 
  MapPin, Navigation, Search, Layers, Route, Pencil, 
  Trash2, Upload, X, Target, Home, Settings, ZoomIn, 
  ZoomOut, Circle, Square, Ruler, Download, Printer, Minus, Pentagon
} from 'lucide-react';
import { toast } from 'sonner';
import * as turf from '@turf/turf';
import html2canvas from 'html2canvas';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Map layers configuration
const MAP_LAYERS = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri'
  },
  topo: {
    name: 'Topographic',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap'
  },
  dark: {
    name: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© CartoDB'
  }
};

// Component to handle map clicks
function MapClickHandler({ onMapClick, isAddingMarker }) {
  useMapEvents({
    click: (e) => {
      if (isAddingMarker) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

// Component to handle geolocation
function GeolocationButton({ onLocationFound }) {
  const map = useMap();
  
  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 16 });
    map.on('locationfound', (e) => {
      onLocationFound(e.latlng);
      toast.success('Location found!');
    });
    map.on('locationerror', () => {
      toast.error('Unable to find your location');
    });
  };

  return null;
}

// Search component
function SearchBar({ onSearchResult }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`
      );
      const data = await response.json();
      setResults(data);
      setShowResults(true);
      
      if (data.length === 0) {
        toast.error('No results found');
      }
    } catch (error) {
      toast.error('Search failed');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectResult = (result) => {
    onSearchResult({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
    setShowResults(false);
    setSearchQuery(result.display_name);
    toast.success('Location found!');
  };

  return (
    <div className="relative" data-testid="search-container">
      <div className="glass-panel rounded-2xl p-3 flex items-center gap-2 min-w-[300px] md:min-w-[400px]">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          data-testid="search-input"
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setShowResults(false);
            }}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          data-testid="search-button"
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-all active:scale-95 font-medium disabled:opacity-50"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass-panel rounded-2xl overflow-hidden animate-slide-in z-50">
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {results.map((result, index) => (
              <button
                key={index}
                data-testid={`search-result-${index}`}
                onClick={() => selectResult(result)}
                className="w-full text-left p-3 hover:bg-primary/10 transition-colors border-b border-slate-200/50 last:border-0"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-700 line-clamp-2">{result.display_name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Layer control component
function LayerControl({ currentLayer, onLayerChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" data-testid="layer-control">
      <button
        data-testid="layer-button"
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel p-3 rounded-xl hover:shadow-lg transition-all active:scale-95"
        title="Change map style"
      >
        <Layers className="w-6 h-6 text-slate-700" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 glass-panel rounded-2xl p-2 min-w-[200px] animate-slide-in z-50">
          <div className="space-y-1">
            {Object.entries(MAP_LAYERS).map(([key, layer]) => (
              <button
                key={key}
                data-testid={`layer-${key}`}
                onClick={() => {
                  onLayerChange(key);
                  setIsOpen(false);
                  toast.success(`Switched to ${layer.name}`);
                }}
                className={`w-full text-left px-4 py-2 rounded-xl transition-all ${
                  currentLayer === key
                    ? 'bg-primary text-white'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {layer.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Drawing toolbar
function DrawingToolbar({ 
  activeTool, 
  onToolSelect, 
  onClearDrawings,
  drawingsCount 
}) {
  const tools = [
    { id: 'line', icon: Minus, label: 'Draw Line' },
    { id: 'polygon', icon: Pentagon, label: 'Draw Polygon' },
    { id: 'circle', icon: Circle, label: 'Draw Circle' },
    { id: 'rectangle', icon: Square, label: 'Draw Rectangle' },
    { id: 'measure', icon: Ruler, label: 'Measure Distance/Area' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-2 flex flex-col gap-2" data-testid="drawing-toolbar">
      {tools.map((tool) => (
        <button
          key={tool.id}
          data-testid={`tool-${tool.id}`}
          onClick={() => onToolSelect(tool.id)}
          className={`p-3 rounded-xl transition-all active:scale-95 ${
            activeTool === tool.id
              ? 'bg-primary text-white shadow-lg'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          title={tool.label}
        >
          <tool.icon className="w-5 h-5" />
        </button>
      ))}
      
      {drawingsCount > 0 && (
        <button
          data-testid="clear-drawings"
          onClick={onClearDrawings}
          className="p-3 rounded-xl hover:bg-red-50 text-red-500 transition-all active:scale-95"
          title="Clear all drawings"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Route planning component
function RoutePlanner({ map, onRouteCalculated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateRoute = async () => {
    if (!start || !end) {
      toast.error('Please enter both start and end locations');
      return;
    }

    setIsCalculating(true);
    try {
      // Geocode start location
      const startResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(start)}&format=json&limit=1`
      );
      const startData = await startResponse.json();
      
      if (startData.length === 0) {
        toast.error('Start location not found');
        setIsCalculating(false);
        return;
      }

      // Geocode end location
      const endResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(end)}&format=json&limit=1`
      );
      const endData = await endResponse.json();
      
      if (endData.length === 0) {
        toast.error('End location not found');
        setIsCalculating(false);
        return;
      }

      const startCoords = { lat: parseFloat(startData[0].lat), lng: parseFloat(startData[0].lon) };
      const endCoords = { lat: parseFloat(endData[0].lat), lng: parseFloat(endData[0].lon) };

      // Get route from OSRM
      const routeResponse = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startCoords.lng},${startCoords.lat};${endCoords.lng},${endCoords.lat}?overview=full&geometries=geojson`
      );
      const routeData = await routeResponse.json();

      if (routeData.code !== 'Ok') {
        toast.error('Route calculation failed');
        setIsCalculating(false);
        return;
      }

      const route = routeData.routes[0];
      const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      const distance = (route.distance / 1000).toFixed(2);
      const duration = Math.round(route.duration / 60);

      onRouteCalculated({
        coordinates,
        distance,
        duration,
        start: startCoords,
        end: endCoords
      });

      toast.success(`Route: ${distance} km, ~${duration} min`);
      setIsOpen(false);
    } catch (error) {
      toast.error('Route calculation failed');
      console.error(error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <>
      <button
        data-testid="route-button"
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel p-3 rounded-xl hover:shadow-lg transition-all active:scale-95"
        title="Route planning"
      >
        <Route className="w-6 h-6 text-slate-700" />
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 glass-panel rounded-2xl p-4 w-[300px] animate-slide-in z-50" data-testid="route-planner">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-manrope font-bold text-slate-900">Route Planning</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-600 mb-1 block">Start</label>
              <input
                type="text"
                data-testid="route-start-input"
                placeholder="Enter start location"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full px-3 py-2 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-sm text-slate-600 mb-1 block">End</label>
              <input
                type="text"
                data-testid="route-end-input"
                placeholder="Enter end location"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full px-3 py-2 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <button
              data-testid="calculate-route-button"
              onClick={calculateRoute}
              disabled={isCalculating}
              className="w-full bg-primary text-white py-2 rounded-xl hover:bg-primary/90 transition-all active:scale-95 font-medium disabled:opacity-50"
            >
              {isCalculating ? 'Calculating...' : 'Calculate Route'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// File import component
function FileImporter({ onFileImport }) {
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result;
        let geojson;

        if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
          geojson = JSON.parse(content);
        } else if (file.name.endsWith('.kml')) {
          // Basic KML parsing - in production, use a library like togeojson
          toast.info('KML parsing - extracting coordinates');
          const parser = new DOMParser();
          const kml = parser.parseFromString(content, 'text/xml');
          const coordinates = kml.getElementsByTagName('coordinates');
          
          const features = [];
          for (let i = 0; i < coordinates.length; i++) {
            const coords = coordinates[i].textContent.trim().split(/\s+/);
            const points = coords.map(coord => {
              const [lng, lat] = coord.split(',').map(parseFloat);
              return [lng, lat];
            });
            
            if (points.length > 0) {
              features.push({
                type: 'Feature',
                geometry: {
                  type: points.length === 1 ? 'Point' : 'LineString',
                  coordinates: points.length === 1 ? points[0] : points
                },
                properties: {}
              });
            }
          }
          
          geojson = {
            type: 'FeatureCollection',
            features
          };
        }

        if (geojson) {
          onFileImport(geojson);
          toast.success('File imported successfully!');
        }
      } catch (error) {
        toast.error('Failed to parse file');
        console.error(error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <label
      data-testid="file-import-button"
      className="glass-panel p-3 rounded-xl hover:shadow-lg transition-all cursor-pointer active:scale-95"
      title="Import KML/GeoJSON"
    >
      <Upload className="w-6 h-6 text-slate-700" />
      <input
        type="file"
        data-testid="file-input"
        accept=".geojson,.json,.kml"
        onChange={handleFileUpload}
        className="hidden"
      />
    </label>
  );
}

// Export/Print component
function ExportMapButton({ onExport, onPrint }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" data-testid="export-control">
      <button
        data-testid="export-button"
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel p-3 rounded-xl hover:shadow-lg transition-all active:scale-95"
        title="Export/Print Map"
      >
        <Download className="w-6 h-6 text-slate-700" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 glass-panel rounded-2xl p-2 min-w-[180px] animate-slide-in z-50">
          <div className="space-y-1">
            <button
              data-testid="export-jpeg"
              onClick={() => {
                onExport();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-xl transition-all hover:bg-slate-100 text-slate-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Save as JPEG
            </button>
            <button
              data-testid="print-map"
              onClick={() => {
                onPrint();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-xl transition-all hover:bg-slate-100 text-slate-700 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InteractiveMap() {
  const [markers, setMarkers] = useState([]);
  const [currentLayer, setCurrentLayer] = useState('osm');
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [drawings, setDrawings] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const [route, setRoute] = useState(null);
  const [importedData, setImportedData] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [measurePoints, setMeasurePoints] = useState([]);
  const [drawingPoints, setDrawingPoints] = useState([]); // For line and polygon drawing
  const mapContainerRef = useRef(null);

  const handleMapClick = useCallback((latlng) => {
    const newMarker = {
      id: Date.now(),
      position: [latlng.lat, latlng.lng],
      title: `Marker ${markers.length + 1}`,
      description: `Location: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`
    };
    setMarkers([...markers, newMarker]);
    toast.success('Marker added!');
  }, [markers]);

  const handleSearchResult = (latlng) => {
    setMapCenter([latlng.lat, latlng.lng]);
    if (mapRef) {
      mapRef.setView([latlng.lat, latlng.lng], 13);
    }
  };

  const handleLocationFound = (latlng) => {
    setUserLocation([latlng.lat, latlng.lng]);
    setMapCenter([latlng.lat, latlng.lng]);
  };

  const deleteMarker = (id) => {
    setMarkers(markers.filter(m => m.id !== id));
    toast.success('Marker deleted');
  };

  const handleToolSelect = (toolId) => {
    if (activeTool === toolId) {
      setActiveTool(null);
      setMeasurePoints([]);
      setDrawingPoints([]);
      toast.info('Tool deactivated');
    } else {
      setActiveTool(toolId);
      setMeasurePoints([]);
      setDrawingPoints([]);
      if (toolId === 'measure') {
        toast.info('Click on map to start measuring distance/area');
      } else if (toolId === 'line') {
        toast.info('Click to add points, double-click to finish line');
      } else if (toolId === 'polygon') {
        toast.info('Click to add points, double-click to finish polygon');
      } else {
        toast.info(`${toolId.charAt(0).toUpperCase() + toolId.slice(1)} tool activated - Click on map`);
      }
    }
  };

  const handleMapClickForDrawing = useCallback((e) => {
    if (!activeTool) return;

    const latlng = e.latlng;

    if (activeTool === 'circle') {
      const newDrawing = {
        id: Date.now(),
        type: 'circle',
        center: [latlng.lat, latlng.lng],
        radius: 500 // 500 meters
      };
      setDrawings([...drawings, newDrawing]);
      toast.success('Circle added!');
      setActiveTool(null);
    } else if (activeTool === 'rectangle') {
      const offset = 0.01;
      const newDrawing = {
        id: Date.now(),
        type: 'rectangle',
        bounds: [
          [latlng.lat - offset, latlng.lng - offset],
          [latlng.lat + offset, latlng.lng + offset]
        ]
      };
      setDrawings([...drawings, newDrawing]);
      toast.success('Rectangle added!');
      setActiveTool(null);
    } else if (activeTool === 'line') {
      // Add point to line
      const newPoints = [...drawingPoints, [latlng.lat, latlng.lng]];
      setDrawingPoints(newPoints);
      
      if (newPoints.length === 1) {
        toast.info('Click to add more points, double-click to finish');
      } else {
        // Calculate distance
        const from = turf.point([newPoints[newPoints.length - 2][1], newPoints[newPoints.length - 2][0]]);
        const to = turf.point([latlng.lng, latlng.lat]);
        const distance = turf.distance(from, to, { units: 'kilometers' });
        toast.success(`Segment added: ${distance.toFixed(2)} km`);
      }
    } else if (activeTool === 'polygon') {
      // Add point to polygon
      const newPoints = [...drawingPoints, [latlng.lat, latlng.lng]];
      setDrawingPoints(newPoints);
      
      if (newPoints.length === 1) {
        toast.info('Click to add more points, double-click to finish');
      } else if (newPoints.length === 2) {
        toast.info('Add at least 3 points for a polygon');
      } else {
        toast.success(`Point ${newPoints.length} added`);
      }
    } else if (activeTool === 'measure') {
      const newPoints = [...measurePoints, [latlng.lat, latlng.lng]];
      setMeasurePoints(newPoints);
      
      if (newPoints.length >= 2) {
        // Calculate distance using turf
        const from = turf.point([newPoints[newPoints.length - 2][1], newPoints[newPoints.length - 2][0]]);
        const to = turf.point([latlng.lng, latlng.lat]);
        const distance = turf.distance(from, to, { units: 'kilometers' });
        
        // Calculate total distance
        let totalDistance = 0;
        for (let i = 1; i < newPoints.length; i++) {
          const p1 = turf.point([newPoints[i - 1][1], newPoints[i - 1][0]]);
          const p2 = turf.point([newPoints[i][1], newPoints[i][0]]);
          totalDistance += turf.distance(p1, p2, { units: 'kilometers' });
        }
        
        toast.success(`Segment: ${distance.toFixed(2)} km | Total: ${totalDistance.toFixed(2)} km`);
        
        // Add line to drawings
        const newDrawing = {
          id: Date.now(),
          type: 'measure',
          points: newPoints,
          distance: totalDistance
        };
        setDrawings([...drawings, newDrawing]);
      } else {
        toast.info('Click again to measure distance');
      }
    }
  }, [activeTool, drawings, measurePoints, drawingPoints]);

  const handleMapDoubleClickForDrawing = useCallback((e) => {
    if (!activeTool) return;
    
    // Prevent default map zoom on double click
    L.DomEvent.stopPropagation(e);
    
    if (activeTool === 'line' && drawingPoints.length >= 2) {
      // Finish line
      let totalDistance = 0;
      for (let i = 1; i < drawingPoints.length; i++) {
        const p1 = turf.point([drawingPoints[i - 1][1], drawingPoints[i - 1][0]]);
        const p2 = turf.point([drawingPoints[i][1], drawingPoints[i][0]]);
        totalDistance += turf.distance(p1, p2, { units: 'kilometers' });
      }
      
      const newDrawing = {
        id: Date.now(),
        type: 'line',
        points: drawingPoints,
        distance: totalDistance
      };
      setDrawings([...drawings, newDrawing]);
      setDrawingPoints([]);
      setActiveTool(null);
      toast.success(`Line completed! Total distance: ${totalDistance.toFixed(2)} km`);
    } else if (activeTool === 'polygon' && drawingPoints.length >= 3) {
      // Finish polygon and calculate area
      const polygonCoords = drawingPoints.map(p => [p[1], p[0]]);
      polygonCoords.push(polygonCoords[0]); // Close the polygon
      
      const polygon = turf.polygon([polygonCoords]);
      const area = turf.area(polygon); // in square meters
      const areaKm = area / 1000000; // convert to square kilometers
      
      // Also calculate perimeter
      let perimeter = 0;
      for (let i = 1; i < drawingPoints.length; i++) {
        const p1 = turf.point([drawingPoints[i - 1][1], drawingPoints[i - 1][0]]);
        const p2 = turf.point([drawingPoints[i][1], drawingPoints[i][0]]);
        perimeter += turf.distance(p1, p2, { units: 'kilometers' });
      }
      // Add distance from last to first point
      const p1 = turf.point([drawingPoints[drawingPoints.length - 1][1], drawingPoints[drawingPoints.length - 1][0]]);
      const p2 = turf.point([drawingPoints[0][1], drawingPoints[0][0]]);
      perimeter += turf.distance(p1, p2, { units: 'kilometers' });
      
      const newDrawing = {
        id: Date.now(),
        type: 'polygon',
        points: drawingPoints,
        area: area,
        areaKm: areaKm,
        perimeter: perimeter
      };
      setDrawings([...drawings, newDrawing]);
      setDrawingPoints([]);
      setActiveTool(null);
      
      const areaDisplay = areaKm >= 1 
        ? `${areaKm.toFixed(2)} km²` 
        : `${area.toFixed(2)} m²`;
      toast.success(`Polygon completed! Area: ${areaDisplay}, Perimeter: ${perimeter.toFixed(2)} km`);
    }
  }, [activeTool, drawingPoints, drawings]);

  const MapDrawingHandler = () => {
    useMapEvents({
      click: handleMapClickForDrawing,
      dblclick: handleMapDoubleClickForDrawing
    });
    return null;
  };

  const clearDrawings = () => {
    setDrawings([]);
    setMeasurePoints([]);
    setDrawingPoints([]);
    setActiveTool(null);
    toast.success('Drawings cleared');
  };

  const handleRouteCalculated = (routeData) => {
    setRoute(routeData);
    if (mapRef) {
      const bounds = L.latLngBounds(routeData.coordinates);
      mapRef.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const handleFileImport = (geojson) => {
    setImportedData(geojson);
    
    // Extract markers from GeoJSON
    if (geojson.type === 'FeatureCollection') {
      const newMarkers = geojson.features
        .filter(f => f.geometry.type === 'Point')
        .map((feature, index) => ({
          id: Date.now() + index,
          position: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
          title: feature.properties?.name || `Imported ${index + 1}`,
          description: feature.properties?.description || 'Imported from file'
        }));
      
      setMarkers([...markers, ...newMarkers]);
      
      // Fit map to imported data
      if (mapRef && newMarkers.length > 0) {
        const bounds = L.latLngBounds(newMarkers.map(m => m.position));
        mapRef.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  };

  const handleExportMap = async () => {
    if (!mapContainerRef.current) {
      toast.error('Map not ready for export');
      return;
    }

    toast.info('Preparing map export...');

    try {
      // Use html2canvas to capture the map
      const canvas = await html2canvas(mapContainerRef.current, {
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        scale: 2 // Higher quality
      });

      // Convert to JPEG
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
          link.download = `map-export-${timestamp}.jpg`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          toast.success('Map exported as JPEG!');
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export map');
    }
  };

  const handlePrintMap = () => {
    toast.info('Opening print dialog...');
    window.print();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden" data-testid="map-app" ref={mapContainerRef}>
      {/* Main Map */}
      <div className="map-container" data-testid="map-container">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          ref={setMapRef}
        >
          <TileLayer
            url={MAP_LAYERS[currentLayer].url}
            attribution={MAP_LAYERS[currentLayer].attribution}
          />

          {/* Map interaction handlers */}
          <MapClickHandler 
            onMapClick={handleMapClick} 
            isAddingMarker={isAddingMarker} 
          />
          <MapDrawingHandler />
          <GeolocationButton onLocationFound={handleLocationFound} />

          {/* Markers with clustering */}
          <MarkerClusterGroup>
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={customIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-manrope font-bold text-slate-900 mb-1">
                      {marker.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">{marker.description}</p>
                    <button
                      data-testid={`delete-marker-${marker.id}`}
                      onClick={() => deleteMarker(marker.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete Marker
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>

          {/* User location marker */}
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-manrope font-bold text-primary">Your Location</h3>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Route polyline */}
          {route && (
            <>
              <Polyline
                positions={route.coordinates}
                color="#0EA5E9"
                weight={4}
                opacity={0.7}
              />
              <Marker position={route.start}>
                <Popup>Start</Popup>
              </Marker>
              <Marker position={route.end}>
                <Popup>End</Popup>
              </Marker>
            </>
          )}

          {/* Drawings */}
          {drawings.map((drawing) => {
            if (drawing.type === 'circle') {
              return (
                <LeafletCircle
                  key={drawing.id}
                  center={drawing.center}
                  radius={drawing.radius}
                  pathOptions={{
                    color: '#0EA5E9',
                    fillColor: '#0EA5E9',
                    fillOpacity: 0.2
                  }}
                />
              );
            }
            if (drawing.type === 'rectangle') {
              return (
                <LeafletRectangle
                  key={drawing.id}
                  bounds={drawing.bounds}
                  pathOptions={{
                    color: '#0EA5E9',
                    fillColor: '#0EA5E9',
                    fillOpacity: 0.2
                  }}
                />
              );
            }
            if (drawing.type === 'line') {
              return (
                <Polyline
                  key={drawing.id}
                  positions={drawing.points}
                  color="#10B981"
                  weight={3}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-manrope font-bold text-slate-900">Line</h3>
                      <p className="text-sm text-slate-600">Distance: {drawing.distance.toFixed(2)} km</p>
                    </div>
                  </Popup>
                </Polyline>
              );
            }
            if (drawing.type === 'polygon') {
              const areaDisplay = drawing.areaKm >= 1 
                ? `${drawing.areaKm.toFixed(2)} km²` 
                : `${drawing.area.toFixed(2)} m²`;
              return (
                <LeafletPolygon
                  key={drawing.id}
                  positions={drawing.points}
                  pathOptions={{
                    color: '#8B5CF6',
                    fillColor: '#8B5CF6',
                    fillOpacity: 0.2,
                    weight: 3
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-manrope font-bold text-slate-900">Polygon</h3>
                      <p className="text-sm text-slate-600">Area: {areaDisplay}</p>
                      <p className="text-sm text-slate-600">Perimeter: {drawing.perimeter.toFixed(2)} km</p>
                    </div>
                  </Popup>
                </LeafletPolygon>
              );
            }
            if (drawing.type === 'measure') {
              return (
                <Polyline
                  key={drawing.id}
                  positions={drawing.points}
                  color="#EF4444"
                  weight={3}
                  dashArray="5, 10"
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-manrope font-bold text-slate-900">Distance</h3>
                      <p className="text-sm text-slate-600">{drawing.distance.toFixed(2)} km</p>
                    </div>
                  </Popup>
                </Polyline>
              );
            }
            return null;
          })}

          {/* Active measuring line */}
          {activeTool === 'measure' && measurePoints.length > 0 && (
            <Polyline
              positions={measurePoints}
              color="#EF4444"
              weight={3}
              dashArray="5, 10"
              opacity={0.7}
            />
          )}

          {/* Active line drawing */}
          {activeTool === 'line' && drawingPoints.length > 0 && (
            <Polyline
              positions={drawingPoints}
              color="#10B981"
              weight={3}
              opacity={0.7}
            />
          )}

          {/* Active polygon drawing */}
          {activeTool === 'polygon' && drawingPoints.length > 0 && (
            <LeafletPolygon
              positions={drawingPoints}
              pathOptions={{
                color: '#8B5CF6',
                fillColor: '#8B5CF6',
                fillOpacity: 0.2,
                weight: 3,
                opacity: 0.7
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Top bar - Search */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
        <SearchBar onSearchResult={handleSearchResult} />
      </div>

      {/* Top right controls */}
      <div className="absolute top-6 right-6 flex gap-3 z-10">
        <button
          data-testid="geolocation-button"
          onClick={() => {
            if (mapRef) {
              mapRef.locate({ setView: true, maxZoom: 16 });
              toast.info('Finding your location...');
            }
          }}
          className="glass-panel p-3 rounded-xl hover:shadow-lg transition-all active:scale-95"
          title="Find my location"
        >
          <Navigation className="w-6 h-6 text-slate-700" />
        </button>

        <LayerControl 
          currentLayer={currentLayer}
          onLayerChange={setCurrentLayer}
        />

        <FileImporter onFileImport={handleFileImport} />
        
        <ExportMapButton 
          onExport={handleExportMap}
          onPrint={handlePrintMap}
        />
      </div>

      {/* Right toolbar - Drawing tools */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
        <DrawingToolbar
          activeTool={activeTool}
          onToolSelect={handleToolSelect}
          onClearDrawings={clearDrawings}
          drawingsCount={drawings.length}
        />
      </div>

      {/* Bottom left - Add marker toggle */}
      <div className="absolute bottom-6 left-6 z-10">
        <button
          data-testid="add-marker-button"
          onClick={() => {
            setIsAddingMarker(!isAddingMarker);
            toast.info(isAddingMarker ? 'Marker mode disabled' : 'Click on map to add marker');
          }}
          className={`glass-panel px-6 py-3 rounded-2xl font-manrope font-semibold transition-all active:scale-95 flex items-center gap-2 ${
            isAddingMarker 
              ? 'bg-primary text-white pulse-glow' 
              : 'hover:shadow-lg text-slate-700'
          }`}
        >
          <MapPin className="w-5 h-5" />
          {isAddingMarker ? 'Click Map to Add' : 'Add Marker'}
        </button>
      </div>

      {/* Bottom right - Route planner */}
      <div className="absolute bottom-6 right-6 z-10">
        <RoutePlanner 
          map={mapRef}
          onRouteCalculated={handleRouteCalculated}
        />
      </div>

      {/* Info panel */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-2xl z-10">
        <div className="flex items-center gap-6 font-manrope">
          <div className="text-sm">
            <span className="text-slate-600">Markers:</span>
            <span className="ml-2 font-bold text-primary" data-testid="marker-count">{markers.length}</span>
          </div>
          <div className="text-sm">
            <span className="text-slate-600">Drawings:</span>
            <span className="ml-2 font-bold text-primary">{drawings.length}</span>
          </div>
          {route && (
            <div className="text-sm">
              <span className="text-slate-600">Route:</span>
              <span className="ml-2 font-bold text-primary">{route.distance} km</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
