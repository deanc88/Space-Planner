import React from 'react';

interface SummaryDisplayProps {
  totalAllocated: number;
  totalOccupancy: number;
  totalSharedSpace: number;
  storeys: number;
  buildingFootprint: number;
  maxFootprint: number;
}

const SummaryItem: React.FC<{ label: string; value: string | number; secondaryValue?: string; className?: string }> = ({ label, value, secondaryValue, className = '' }) => (
  <div className="flex flex-col items-center justify-center bg-slate-100 p-4 rounded-lg min-h-[90px]">
    <span className="text-sm font-medium text-slate-500">{label}</span>
    <span className={`text-2xl font-bold ${className}`}>{value}</span>
    {secondaryValue && <span className="text-sm text-slate-600 mt-1">{secondaryValue}</span>}
  </div>
);

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ totalAllocated, totalOccupancy, totalSharedSpace, storeys, buildingFootprint, maxFootprint }) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryItem 
          label="Total Allocated Area" 
          value={`${totalAllocated} m²`} 
          className="text-blue-600" 
        />
        <SummaryItem 
          label="Total Shared Area" 
          value={`${totalSharedSpace} m²`} 
          className="text-green-600" 
        />
        <SummaryItem 
          label="Total Occupancy" 
          value={totalOccupancy}
          secondaryValue="people"
          className="text-slate-800" 
        />
        <SummaryItem 
          label="Number of Storeys" 
          value={storeys}
          secondaryValue={storeys > 1 ? `(max ${maxFootprint}m² footprint)` : ''}
          className="text-slate-800" 
        />
        <SummaryItem 
          label="Building Footprint" 
          value={`${buildingFootprint} m²`}
          className="text-slate-800" 
        />
      </div>
    </div>
  );
};

export default SummaryDisplay;
