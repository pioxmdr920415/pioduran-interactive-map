import React, { useState } from 'react';
import { 
  Palette, Layers, Minus, Pentagon, Circle, Square, 
  Ruler, Trash2, ChevronDown, ChevronUp, Settings
} from 'lucide-react';

export default function UnifiedToolsPanel({
  // Drawing tools props
  activeTool,
  onToolSelect,
  onClearDrawings,
  drawingsCount,
  // Style picker props
  onStylePickerToggle,
  isStylePickerOpen,
  // Layer control props
  currentLayer,
  onLayerChange,
  mapLayers
}) {
  const [isDrawingExpanded, setIsDrawingExpanded] = useState(true);
  const [isLayersExpanded, setIsLayersExpanded] = useState(false);

  const drawingTools = [
    { id: 'line', icon: Minus, label: 'Line', color: 'green' },
    { id: 'polygon', icon: Pentagon, label: 'Polygon', color: 'purple' },
    { id: 'circle', icon: Circle, label: 'Circle', color: 'blue' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', color: 'blue' },
    { id: 'measure', icon: Ruler, label: 'Measure', color: 'red' },
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
    <div className="w-80 glass-panel rounded-2xl shadow-2xl border-2 border-white/40 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Tools Panel</h3>
            <p className="text-xs text-blue-100">All drawing & map controls</p>
          </div>
        </div>
      </div>

      <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        {/* Style Settings Section */}
        <div className="p-4 border-b border-slate-200/50">
          <button
            onClick={onStylePickerToggle}
            className={`w-full p-4 rounded-xl transition-all flex items-center gap-3 ${
              isStylePickerOpen
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Palette className="w-5 h-5" />
            <div className="flex-1 text-left">
              <p className="font-bold text-sm">Color & Style</p>
              <p className={`text-xs ${isStylePickerOpen ? 'text-blue-100' : 'text-slate-500'}`}>
                Customize drawings
              </p>
            </div>
            <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
              isStylePickerOpen ? 'bg-white/20' : 'bg-blue-100 text-blue-600'
            }`}>
              {isStylePickerOpen ? 'Open' : 'Click'}
            </div>
          </button>
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
                      Click to {activeTool === tool.id ? 'deactivate' : 'activate'}
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
                  onClick={() => {
                    onLayerChange(key);
                    toast.success(`Switched to ${layer.name}`);
                  }}
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
          <p className="text-xs text-slate-600 font-medium">
            💡 <span className="font-bold">Tip:</span> Select a tool, customize its style, then draw on the map!
          </p>
        </div>
      </div>
    </div>
  );
}
