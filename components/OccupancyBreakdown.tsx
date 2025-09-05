import React from 'react';
import { SpaceAllocation } from '../types';

interface OccupancyBreakdownProps {
  allocations: SpaceAllocation[];
}

const OccupancyBreakdown: React.FC<OccupancyBreakdownProps> = ({ allocations }) => {
  const occupancyData = React.useMemo(() => {
    return allocations
      .filter(alloc => alloc.density > 0 && alloc.size > 0)
      .map(alloc => ({
        id: alloc.id,
        label: alloc.label,
        color: alloc.color,
        people: Math.floor(alloc.size / alloc.density),
      }))
      .sort((a, b) => b.people - a.people); // Sort by most populated
  }, [allocations]);

  if (occupancyData.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-slate-700 mb-4">Occupancy by Space Type</h3>
      <div className="flex flex-wrap gap-4">
        {occupancyData.map(item => (
          <div key={item.id} className="flex-1 min-w-[120px] bg-slate-50 p-3 rounded-md border border-slate-200">
            <div className="flex items-center mb-1">
              <span className={`w-3 h-3 rounded-full mr-2 ${item.color}`}></span>
              <span className="text-sm font-medium text-slate-600 truncate">{item.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-800 text-center">{item.people}</p>
            <p className="text-xs text-slate-500 text-center">people</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OccupancyBreakdown;
