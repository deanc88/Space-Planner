import React from 'react';

interface CalculatedSpaceDisplayProps {
  label: string;
  value: number;
  description: string;
  people?: number;
  isDashed?: boolean;
  isRemovable?: boolean;
  onRemove?: (spaceId: string) => void;
  spaceId?: string;
}

const CalculatedSpaceDisplay: React.FC<CalculatedSpaceDisplayProps> = ({
  label,
  value,
  description,
  people,
  isDashed = false,
  isRemovable = false,
  onRemove,
  spaceId,
}) => {
  const cardClasses = isDashed
    ? "bg-slate-100 border-2 border-dashed border-slate-300"
    : "bg-white";

  const handleRemove = () => {
    if (onRemove && spaceId) {
      onRemove(spaceId);
    }
  };

  return (
    <div className={`w-full p-4 rounded-lg shadow-md relative ${cardClasses}`}>
      {isRemovable && (
        <button
          onClick={handleRemove}
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
        </div>
        <div className="text-right">
          <span className={`font-bold text-lg text-slate-800`}>
            {value} <span className="text-sm font-normal text-slate-500">m²</span>
          </span>
          {people !== undefined && people >= 0 && (
             <span className="block text-lg font-semibold text-slate-700 mt-1" aria-label={`Approximately ${people} people`}>
                ~{people} people
             </span>
          )}
        </div>
      </div>
       <div className="mt-4 text-center text-sm text-slate-600">
         {description}
       </div>
    </div>
  );
};

export default CalculatedSpaceDisplay;