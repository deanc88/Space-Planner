import React from 'react';

interface SpaceSliderProps {
  label: string;
  value: number;
  sharing: number;
  maxSharing: number;
  color: string;
  max: number;
  spaceId: string;
  density: number;
  onChange: (value: number) => void;
  onSharingChange: (value: number) => void;
  isRemovable?: boolean;
  onRemove: (spaceId: string) => void;
}

const SpaceSlider: React.FC<SpaceSliderProps> = ({ label, value, sharing, maxSharing, color, max, spaceId, density, onChange, onSharingChange, isRemovable, onRemove }) => {
  // Color classes need to be complete strings for Tailwind's JIT compiler.
  const accentColors: { [key: string]: string } = {
    'bg-blue-500': 'accent-blue-500',
    'bg-green-500': 'accent-green-500',
    'bg-yellow-500': 'accent-yellow-500',
    'bg-purple-500': 'accent-purple-500',
    'bg-indigo-500': 'accent-indigo-500',
    'bg-pink-500': 'accent-pink-500',
    'bg-red-500': 'accent-red-500',
    'bg-orange-500': 'accent-orange-500',
    'bg-teal-500': 'accent-teal-500',
    'bg-cyan-500': 'accent-cyan-500',
  };

  const accentColorClass = accentColors[color] || 'accent-slate-500';
  const people = density > 0 ? Math.floor(value / density) : 0;
  const maxPeople = density > 0 ? Math.floor(max / density) : 0;

  const handlePeopleChange = (newPeople: number) => {
    const newSize = Math.round(newPeople * density);
    onChange(newSize);
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md relative">
      {isRemovable && (
        <button
          onClick={() => onRemove(spaceId)}
          className="absolute top-2 right-2 p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <div className="flex justify-between items-start">
        <div>
          <label className="font-medium text-slate-700">{label}</label>
          <span className="block text-xs text-slate-500">{density.toFixed(2)} m²/person</span>
        </div>
        <div className="text-right">
          <span className={`font-bold text-lg text-slate-800`}>
            {value} <span className="text-sm font-normal text-slate-500">m²</span>
          </span>
          <span className="block text-lg font-semibold text-slate-700 mt-1" aria-label={`Approximately ${people} people`}>
            ~{people} people
          </span>
        </div>
      </div>
      
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor={`${spaceId}-area`} className="block text-sm font-medium text-slate-600 mb-1">Area</label>
          <input
            id={`${spaceId}-area`}
            type="range"
            min="0"
            max={max}
            step="1"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${accentColorClass}`}
            aria-label={`${label} Area`}
          />
        </div>
        <div>
          <label htmlFor={`${spaceId}-people`} className="block text-sm font-medium text-slate-600 mb-1">People</label>
          <input
            id={`${spaceId}-people`}
            type="range"
            min="0"
            max={maxPeople}
            step="1"
            value={people}
            onChange={(e) => handlePeopleChange(parseInt(e.target.value, 10))}
            className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${accentColorClass}`}
            aria-label={`${label} People`}
            disabled={density <= 0}
          />
        </div>
        {maxSharing > 0 && (
          <div>
              <div className="flex justify-between items-center">
                  <label htmlFor={`${spaceId}-sharing`} className="block text-sm font-medium text-slate-600 mb-1">Space Sharing</label>
                  <span className="text-sm font-semibold text-slate-700">
                    {Math.round(sharing * 100)}%
                    <span className="text-xs font-normal text-slate-500"> / {Math.round(maxSharing * 100)}% max</span>
                  </span>
              </div>
            <input
              id={`${spaceId}-sharing`}
              type="range"
              min="0"
              max={maxSharing}
              step="0.01"
              value={sharing}
              onChange={(e) => onSharingChange(parseFloat(e.target.value))}
              className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${accentColorClass}`}
              aria-label={`${label} Space Sharing`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceSlider;
