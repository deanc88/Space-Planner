import React from 'react';

interface FootprintSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const FootprintSlider: React.FC<FootprintSliderProps> = ({ value, onChange, min = 100, max = 1000 }) => {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="footprint-slider" className="font-medium text-slate-700">Max Building Footprint</label>
        <span className="font-bold text-lg text-slate-800">
          {value} <span className="text-sm font-normal text-slate-500">m²</span>
        </span>
      </div>
      <input
        id="footprint-slider"
        type="range"
        min={min}
        max={max}
        step="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
        aria-label="Maximum building footprint"
      />
    </div>
  );
};

export default FootprintSlider;
