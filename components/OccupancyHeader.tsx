import React from 'react';

interface OccupancyHeaderProps {
  totalOccupancy: number;
}

const OccupancyHeader: React.FC<OccupancyHeaderProps> = ({ totalOccupancy }) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md text-center">
      <h2 className="text-lg font-medium text-slate-500 mb-2">Total Building Occupancy</h2>
      <div className="flex items-center justify-center space-x-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        <div className="flex items-baseline space-x-2">
          <span className="text-6xl font-bold text-slate-800">{totalOccupancy}</span>
          <span className="text-2xl font-medium text-slate-600">people</span>
        </div>
      </div>
    </div>
  );
};

export default OccupancyHeader;
