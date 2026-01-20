import React, { useState } from 'react';
import { 
  Palette, Layers, Minus, Pentagon, Circle, Square, 
  Ruler, Trash2, ChevronDown, ChevronUp, Settings,
  MapPin, Route as RouteIcon, X, Menu
} from 'lucide-react';
import StylePickerPanel from './StylePickerPanel';

export default function Sidebar({
  // Drawing tools props
  activeTool,
  onToolSelect,
  onClearDrawings,
  drawingsCount,
  // Style picker props
  currentStyle,
  onStyleChange,
  // Layer control props
  currentLayer,
  onLayerChange,
  mapLayers,
  // Stats
  markersCount,
  routeDistance,
  // Sidebar state
  isOpen,
  onToggle
}) {
  const [isDrawingExpanded, setIsDrawingExpanded] = useState(true);
  const [isLayersExpanded, setIsLayersExpanded] = useState(false);
  const [isStylePickerExpanded, setIsStylePickerExpanded] = useState(false);
  const [isStatsExpanded, setIsStatsExpanded] = useState(true);

  const drawingTools = [
    { id: 'line', icon: Minus, label: 'Line', color: 'green', description: 'Draw lines with distance' },
    { id: 'polygon', icon: Pentagon, label: 'Polygon', color: 'purple', description: 'Draw polygons with area' },
    { id: 'circle', icon: Circle, label: 'Circle', color: 'blue', description: 'Draw circular shapes' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', color: 'blue', description: 'Draw rectangles' },
    { id: 'measure', icon: Ruler, label: 'Measure', color: 'red', description: 'Measure distances' },
  ];

  const getToolColor = (color) => {
    const colors = {
      green: 'from-green-500 to-emerald-500',
      purple: 'from-purple-500 to-violet-500',
      blue: 'from-blue-500 to-indigo-500',
      red: 'from-red-500 to-rose-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      {/* Sidebar Toggle Button - Always visible */}
      <button
        onClick={onToggle}
        className="fixed top-[110px] left-4 z-50 glass-panel p-3 rounded-xl shadow-xl border-2 border-white/40 hover:shadow-2xl transition-all active:scale-95"
        title={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed left-0 top-[92px] h-[calc(100vh-92px)] z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '380px' }}
      >
        <div className="h-full glass-panel shadow-2xl border-r-2 border-white/40 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Control Panel</h3>
                <p className="text-sm text-blue-100">Tools, Settings & Statistics</p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            
            {/* Map Statistics Section */}
            <div className="border-b border-slate-200/50">
              <button
                onClick={() => setIsStatsExpanded(!isStatsExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900">Map Statistics</h4>
                </div>
                {isStatsExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {isStatsExpanded && (
                <div className="p-4 pt-0 space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-600 block font-medium">Total Markers</span>
                        <span className="font-bold text-slate-900 text-2xl">{markersCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Ruler className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-600 block font-medium">Total Drawings</span>
                        <span className="font-bold text-slate-900 text-2xl">{drawingsCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  {routeDistance && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <RouteIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-xs text-slate-600 block font-medium">Route Distance</span>
                          <span className="font-bold text-slate-900 text-2xl">{routeDistance} km</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Style Settings Section */}
            <div className="border-b border-slate-200/50">
              <button
                onClick={() => setIsStylePickerExpanded(!isStylePickerExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-slate-600" />
                  <h4 className="font-bold text-slate-900">Color & Style</h4>
                </div>
                {isStylePickerExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {isStylePickerExpanded && (
                <div className="p-4 pt-0">
                  <StylePickerPanel 
                    isOpen={true}
                    onClose={() => {}}
                    currentStyle={currentStyle}
                    onStyleChange={onStyleChange}
                    activeTool={activeTool}
                    compact={true}
                  />
                </div>
              )}
            </div>

            {/* Drawing Tools Section */}
            <div className="border-b border-slate-200/50">
              <button
                onClick={() => setIsDrawingExpanded(!isDrawingExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900">Drawing Tools</h4>
                  {activeTool && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                      Active
                    </span>
                  )}
                </div>
                {isDrawingExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {isDrawingExpanded && (
                <div className="p-4 pt-0 space-y-2">
                  {drawingTools.map((tool) => (
                    <button
                      key={tool.id}
                      data-testid={`tool-${tool.id}`}
                      onClick={() => onToolSelect(tool.id)}
                      className={`w-full p-3 rounded-xl transition-all flex items-center gap-3 ${
                        activeTool === tool.id
                          ? `bg-gradient-to-r ${getToolColor(tool.color)} text-white shadow-lg scale-105`
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:scale-102'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activeTool === tool.id
                          ? 'bg-white/20'
                          : 'bg-slate-200'
                      }`}>
                        <tool.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-sm">{tool.label}</p>
                        <p className={`text-xs ${activeTool === tool.id ? 'text-white/80' : 'text-slate-500'}`}>
                          {tool.description}
                        </p>
                      </div>
                      {activeTool === tool.id && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </button>
                  ))}

                  {drawingsCount > 0 && (
                    <button
                      data-testid="clear-drawings"
                      onClick={onClearDrawings}
                      className="w-full p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all flex items-center gap-3 mt-4 border-2 border-red-200"
                    >
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-sm">Clear All Drawings</p>
                        <p className="text-xs text-red-500">{drawingsCount} drawing{drawingsCount > 1 ? 's' : ''} on map</p>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Map Layers Section */}
            <div className="border-b border-slate-200/50">
              <button
                onClick={() => setIsLayersExpanded(!isLayersExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                data-testid="layer-control-toggle"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-slate-600" />
                  <h4 className="font-bold text-slate-900">Map Layers</h4>
                </div>
                {isLayersExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {isLayersExpanded && (
                <div className="p-4 pt-0 space-y-2" data-testid="layer-control">
                  {Object.entries(mapLayers).map(([key, layer]) => (
                    <button
                      key={key}
                      data-testid={`layer-${key}`}
                      onClick={() => onLayerChange(key)}
                      className={`w-full p-3 rounded-xl transition-all flex items-center gap-3 ${
                        currentLayer === key
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        currentLayer === key
                          ? 'bg-white/20'
                          : 'bg-slate-200'
                      }`}>
                        <Layers className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-sm">{layer.name}</p>
                        <p className={`text-xs ${currentLayer === key ? 'text-white/80' : 'text-slate-500'}`}>
                          {currentLayer === key ? 'Currently active' : 'Click to switch'}
                        </p>
                      </div>
                      {currentLayer === key && (
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                💡 <span className="font-bold">Quick Tip:</span> Select a drawing tool, customize its style in the Color & Style section, then click on the map to start drawing!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is open - for mobile/tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}
