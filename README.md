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
/app
├── src/                  # Source files
│   ├── components/      # React components
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
- **Tailwind CSS** - Styling
- **Turf.js** - Geospatial calculations
- **html2canvas** - Map export
- **Sonner** - Toast notifications

## 🎨 Styling

The app uses custom color presets and styling options:
- **Per-tool defaults**: Each tool has optimized default colors
- **Quick palettes**: Themed color sets for rapid styling
- **Real-time preview**: See changes as you draw

## 📝 Notes

- This is a frontend-only SPA (Single Page Application)
- All API calls are made directly to external services (OpenStreetMap, OSRM)
- No backend server required
