import React, { useState } from 'react';
import { Palette, X, Check } from 'lucide-react';

// Preset color palettes
const COLOR_PALETTES = {
  emergency: {
    name: '🚨 Emergency',
    colors: ['#EF4444', '#F97316', '#FBBF24']
  },
  water: {
    name: '🌊 Water',
    colors: ['#3B82F6', '#0EA5E9', '#06B6D4', '#14B8A6']
  },
  nature: {
    name: '🌲 Nature',
    colors: ['#10B981', '#22C55E', '#84CC16', '#65A30D']
  },
  infrastructure: {
    name: '🏗️ Infrastructure',
    colors: ['#6B7280', '#475569', '#0EA5E9', '#3B82F6']
  }
};

// Default colors per tool
const TOOL_DEFAULTS = {
  line: { stroke: '#10B981', fill: '#10B981', name: 'Line', emoji: '🟢' },
  polygon: { stroke: '#8B5CF6', fill: '#8B5CF6', name: 'Polygon', emoji: '🟣' },
  circle: { stroke: '#0EA5E9', fill: '#0EA5E9', name: 'Circle', emoji: '🔵' },
  rectangle: { stroke: '#0EA5E9', fill: '#0EA5E9', name: 'Rectangle', emoji: '🔵' },
  measure: { stroke: '#EF4444', fill: '#EF4444', name: 'Measure', emoji: '🔴' }
};

// Line style options
const LINE_STYLES = [
  { value: 'solid', label: 'Solid', dashArray: null },
  { value: 'dashed', label: 'Dashed', dashArray: '10, 10' },
  { value: 'dotted', label: 'Dotted', dashArray: '2, 8' },
  { value: 'dash-dot', label: 'Dash-Dot', dashArray: '10, 5, 2, 5' }
];

export default function StylePickerPanel({ 
  isOpen, 
  onClose, 
  currentStyle, 
  onStyleChange,
  activeTool 
}) {
  const [showPalettes, setShowPalettes] = useState(false);
  const [customColors, setCustomColors] = useState([]);

  const handleStrokeColorChange = (color) => {
    onStyleChange({ ...currentStyle, strokeColor: color });
  };

  const handleFillColorChange = (color) => {
    onStyleChange({ ...currentStyle, fillColor: color });
  };

  const handleStrokeWidthChange = (e) => {
    onStyleChange({ ...currentStyle, strokeWidth: parseInt(e.target.value) });
  };

  const handleFillOpacityChange = (e) => {
    onStyleChange({ ...currentStyle, fillOpacity: parseFloat(e.target.value) / 100 });
  };

  const handleLineStyleChange = (style) => {
    onStyleChange({ ...currentStyle, lineStyle: style.value, dashArray: style.dashArray });
  };

  const applyToolDefault = (toolId) => {
    const defaults = TOOL_DEFAULTS[toolId];
    if (defaults) {
      onStyleChange({
        ...currentStyle,
        strokeColor: defaults.stroke,
        fillColor: defaults.fill
      });
    }
  };

  const addToCustomColors = (color) => {
    if (!customColors.includes(color)) {
      setCustomColors([...customColors, color].slice(-6)); // Keep last 6 custom colors
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-24 left-6 z-50 glass-panel rounded-2xl shadow-2xl border-2 border-white/40 w-[340px] animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/50">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-600" />
          <h3 className="font-manrope font-bold text-slate-900">Style Settings</h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {/* Active Tool Info */}
        {activeTool && (
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
            <p className="text-sm text-blue-900 font-medium">
              Current Tool: <span className="font-bold">{TOOL_DEFAULTS[activeTool]?.emoji} {TOOL_DEFAULTS[activeTool]?.name || activeTool}</span>
            </p>
          </div>
        )}

        {/* Stroke Color */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Stroke Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentStyle.strokeColor}
              onChange={(e) => {
                handleStrokeColorChange(e.target.value);
                addToCustomColors(e.target.value);
              }}
              className="w-16 h-10 rounded-lg cursor-pointer border-2 border-slate-200"
            />
            <input
              type="text"
              value={currentStyle.strokeColor}
              onChange={(e) => handleStrokeColorChange(e.target.value)}
              className="flex-1 px-3 py-2 bg-white/50 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Fill Color */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Fill Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentStyle.fillColor}
              onChange={(e) => {
                handleFillColorChange(e.target.value);
                addToCustomColors(e.target.value);
              }}
              className="w-16 h-10 rounded-lg cursor-pointer border-2 border-slate-200"
            />
            <input
              type="text"
              value={currentStyle.fillColor}
              onChange={(e) => handleFillColorChange(e.target.value)}
              className="flex-1 px-3 py-2 bg-white/50 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Stroke Width */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Stroke Width: <span className="text-blue-600">{currentStyle.strokeWidth}px</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={currentStyle.strokeWidth}
            onChange={handleStrokeWidthChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>1px</span>
            <span>10px</span>
          </div>
        </div>

        {/* Fill Opacity */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Fill Opacity: <span className="text-blue-600">{Math.round(currentStyle.fillOpacity * 100)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(currentStyle.fillOpacity * 100)}
            onChange={handleFillOpacityChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Line Style */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Line Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {LINE_STYLES.map((style) => (
              <button
                key={style.value}
                onClick={() => handleLineStyleChange(style)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  currentStyle.lineStyle === style.value
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="w-full h-0.5 bg-slate-700"
                    style={{
                      background: currentStyle.lineStyle === style.value ? '#3B82F6' : '#334155',
                      height: '3px',
                      ...(style.dashArray && {
                        backgroundImage: `repeating-linear-gradient(to right, currentColor, currentColor 5px, transparent 5px, transparent ${style.dashArray.split(',')[1].trim()}px)`
                      })
                    }}
                  />
                  <span className="text-xs font-medium">{style.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tool Defaults */}
        <div>
          <button
            onClick={() => setShowPalettes(!showPalettes)}
            className="w-full flex items-center justify-between text-sm font-semibold text-slate-700 mb-2 hover:text-blue-600 transition-colors"
          >
            <span>Quick Presets & Palettes</span>
            <span className={`transform transition-transform ${showPalettes ? 'rotate-180' : ''}`}>▼</span>
          </button>
          
          {showPalettes && (
            <div className="space-y-3 mt-2">
              {/* Tool Defaults */}
              <div>
                <p className="text-xs text-slate-500 mb-2 font-medium">Per-Tool Defaults</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(TOOL_DEFAULTS).map(([toolId, defaults]) => (
                    <button
                      key={toolId}
                      onClick={() => applyToolDefault(toolId)}
                      className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border-2"
                          style={{
                            backgroundColor: defaults.fill,
                            borderColor: defaults.stroke
                          }}
                        />
                        <span className="text-xs font-medium text-slate-700">
                          {defaults.emoji} {defaults.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palettes */}
              <div>
                <p className="text-xs text-slate-500 mb-2 font-medium">Color Palettes</p>
                {Object.entries(COLOR_PALETTES).map(([key, palette]) => (
                  <div key={key} className="mb-2">
                    <p className="text-xs text-slate-600 mb-1">{palette.name}</p>
                    <div className="flex gap-2">
                      {palette.colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            handleStrokeColorChange(color);
                            handleFillColorChange(color);
                          }}
                          className="w-10 h-10 rounded-lg border-2 border-slate-200 hover:border-blue-400 hover:scale-110 transition-all"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Colors History */}
              {customColors.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium">🎨 Recent Custom Colors</p>
                  <div className="flex gap-2 flex-wrap">
                    {customColors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          handleStrokeColorChange(color);
                          handleFillColorChange(color);
                        }}
                        className="w-8 h-8 rounded-lg border-2 border-slate-200 hover:border-blue-400 hover:scale-110 transition-all"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            if (activeTool) {
              applyToolDefault(activeTool);
            } else {
              onStyleChange({
                strokeColor: '#3B82F6',
                fillColor: '#3B82F6',
                strokeWidth: 3,
                fillOpacity: 0.2,
                lineStyle: 'solid',
                dashArray: null
              });
            }
          }}
          className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-all"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}
