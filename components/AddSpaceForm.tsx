import React, { useState } from 'react';

interface AddSpaceFormProps {
  onAddSpace: (label: string, density: number, maxSharing: number) => void;
}

const AddSpaceForm: React.FC<AddSpaceFormProps> = ({ onAddSpace }) => {
  const [label, setLabel] = useState('');
  const [density, setDensity] = useState(2.5);
  const [maxSharing, setMaxSharing] = useState(50);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label.trim() === '') {
      setError('Space name cannot be empty.');
      return;
    }
    if (density <= 0) {
      setError('m² per person must be a positive number.');
      return;
    }
    if (maxSharing < 0 || maxSharing > 100) {
      setError('Max sharing must be between 0 and 100.');
      return;
    }
    setError('');
    onAddSpace(label, density, maxSharing / 100);
    setLabel('');
    setDensity(2.5);
    setMaxSharing(50);
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
       <h3 className="text-lg font-medium text-slate-700 mb-4">Add a New Space Type</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-1">
          <label htmlFor="space-name" className="block text-sm font-medium text-slate-600 mb-1">
            Space Name
          </label>
          <input
            id="space-name"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Cafeteria"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="md:col-span-1">
          <label htmlFor="space-density" className="block text-sm font-medium text-slate-600 mb-1">
            m² per person
          </label>
          <input
            id="space-density"
            type="number"
            value={density}
            onChange={(e) => setDensity(parseFloat(e.target.value))}
            step="0.01"
            min="0.1"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="md:col-span-1">
          <label htmlFor="space-max-sharing" className="block text-sm font-medium text-slate-600 mb-1">
            Max Sharing (%)
          </label>
          <input
            id="space-max-sharing"
            type="number"
            value={maxSharing}
            onChange={(e) => setMaxSharing(parseInt(e.target.value, 10))}
            step="1"
            min="0"
            max="100"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="md:col-span-1">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Add Space
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default AddSpaceForm;
