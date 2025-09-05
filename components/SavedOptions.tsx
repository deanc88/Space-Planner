import React from 'react';
import { SavedOption } from '../types';

interface SavedOptionsProps {
  options: SavedOption[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

const SavedOptions: React.FC<SavedOptionsProps> = ({ options, onLoad, onDelete }) => {
  if (options.length === 0) {
    return null; // Don't render anything if there are no saved options
  }

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-slate-700 mb-4">Saved Options</h3>
      <ul className="space-y-3">
        {options.map((option) => (
          <li key={option.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 transition-shadow hover:shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex-grow">
                <h4 className="font-semibold text-slate-800">{option.label}</h4>
                <div className="text-sm text-slate-600 mt-1 flex flex-wrap gap-x-4">
                  <span>Area: <span className="font-medium">{option.totalAllocated} m²</span></span>
                  <span>Occupancy: <span className="font-medium">{option.totalOccupancy}</span></span>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                <button
                  onClick={() => onLoad(option.id)}
                  className="bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded-md text-sm hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors"
                  aria-label={`Load ${option.label}`}
                >
                  Load
                </button>
                <button
                  onClick={() => onDelete(option.id)}
                  className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors"
                  aria-label={`Delete ${option.label}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedOptions;
