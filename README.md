# Interactive Map Application (SPA)

A powerful Single Page Application for interactive mapping with advanced drawing tools, measurements, and export capabilities.

## 🗺️ Features

- **Interactive Map** with multiple layer options (OpenStreetMap, Satellite, Terrain)
- **Drawing Tools**: Lines, Polygons, Circles, Rectangles
- **Measurement Tools**: Distance and area calculations
- **Markers & Routing**: Add markers and calculate routes
- **Style Customization**: Color pickers, stroke width, opacity, line styles
- **Preset Palettes**: Emergency, Water, Nature, Infrastructure themes
- **Export Functions**: Save map as JPEG or print
- **File Import**: Support for KML/KMZ files
- **Collapsible Sidebar**: Organize all tools and settings in one place

## 🎨 User Interface

### Layout
- **Header**: Search bar, geolocation, file import, and export buttons
- **Sidebar (Left)**: Collapsible control panel with all tools and settings
  - Toggle button to show/hide sidebar for maximum map viewing area
  - Map Statistics (markers count, drawings count, route distance)
  - Color & Style customization panel
  - Drawing Tools (Line, Polygon, Circle, Rectangle, Measure)
  - Map Layers selector (OSM, Satellite, Topographic, Dark)
- **Map Container**: Full responsive map display that adjusts to sidebar state
- **Bottom Controls**: Add marker and route planning buttons

### Sidebar Sections
1. **Map Statistics**: Real-time counts of markers, drawings, and route information
2. **Color & Style**: Complete styling controls for drawings
   - Stroke color picker
   - Fill color picker
   - Stroke width slider (1-10px)
   - Fill opacity slider (0-100%)
   - Line style options (solid, dashed, dotted, dash-dot)
   - Quick preset palettes
   - Per-tool default colors
3. **Drawing Tools**: All drawing and measurement tools with visual indicators
4. **Map Layers**: Switch between different map tile providers

## 🚀 Quick Start

### Installation
```bash
yarn install
```

### Development
```bash
yarn start
```
The app will be available at `http://localhost:3000`

### Production Build
```bash
yarn build
```

## 📁 Project Structure

```
/app/frontend
├── src/                  # Source files
│   ├── components/      # React components
│   │   ├── Header.js           # Top navigation bar
│   │   ├── Sidebar.js          # Main sidebar with all controls
│   │   ├── StylePickerPanel.js # Color and style settings
│   │   └── InteractiveMap.js   # Main map component
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities
│   └── App.js          # Main app component
├── public/             # Static assets
├── package.json        # Dependencies
└── craco.config.js     # Build configuration
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Leaflet** - Interactive maps
- **React Leaflet** - React bindings for Leaflet
- **Tailwind CSS** - Styling
- **Turf.js** - Geospatial calculations
- **html2canvas** - Map export
- **Sonner** - Toast notifications
- **Lucide React** - Icons

## 🎨 Styling

The app uses custom color presets and styling options:
- **Per-tool defaults**: Each tool has optimized default colors
  - Line: Green (#10B981)
  - Polygon: Purple (#8B5CF6)
  - Circle/Rectangle: Blue (#0EA5E9)
  - Measure: Red dashed (#EF4444)
- **Quick palettes**: Themed color sets for rapid styling
  - Emergency (Red, Orange, Yellow)
  - Water (Blues and Teals)
  - Nature (Greens)
  - Infrastructure (Grays and Blues)
- **Real-time preview**: See changes as you draw
- **Custom color history**: Recently used custom colors are saved

## 📝 Notes

- This is a frontend-only SPA (Single Page Application)
- All API calls are made directly to external services (OpenStreetMap, OSRM)
- No backend server required
- Sidebar can be toggled for maximum map viewing area
- All tools and settings are organized in the collapsible sidebar
