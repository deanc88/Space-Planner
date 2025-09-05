
import React from 'react';
import { SpaceAllocation } from '../types';

interface AllocationChartProps {
  allocations: SpaceAllocation[];
  totalAllocated: number; // Represents NET allocated area
  totalSharedSpace: number;
}

const hatchStyle: React.CSSProperties = {
  // A subtle background to ensure the pattern is visible on any color bar beneath it.
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  backgroundImage: `repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.2) 2px,
    transparent 2px,
    transparent 4px
  )`,
};

const AllocationChart: React.FC<AllocationChartProps> = ({ allocations, totalAllocated, totalSharedSpace }) => {
  const visualTotal = totalAllocated;
  // FIX: Define grossTotalAllocated to fix an undefined variable error.
  const grossTotalAllocated = totalAllocated + totalSharedSpace;

  const chartItems = React.useMemo(() => {
    if (visualTotal <= 0) return [];
    
    const items: Array<{
        id: string;
        label: string;
        color: string;
        size: number;
        index: number;
        itemWidth: number;
        sharedWidth: number;
        currentLeft: number;
    }> = [];
    let cumulativeLeft = 0;

    allocations.forEach((alloc, index) => {
        if (alloc.size === 0) return;

        const itemWidth = (alloc.size / visualTotal) * 100;
        const sharedWidth = (alloc.size * (alloc.sharing || 0) / visualTotal) * 100;

        const currentLeft = cumulativeLeft;
        cumulativeLeft += (itemWidth - sharedWidth);

        items.push({
            id: alloc.id,
            label: alloc.label,
            color: alloc.color,
            size: alloc.size,
            index,
            itemWidth,
            sharedWidth,
            currentLeft,
        });
    });
    return items;
  }, [allocations, visualTotal]);


  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-slate-700 mb-4">Space Distribution</h3>
      <div className="relative w-full bg-slate-200 h-10 rounded-full overflow-hidden">
        {/* Pass 1: Render solid color bars */}
        {chartItems.map(item => (
            <div
              key={item.id}
              className={`h-full absolute ${item.color} flex items-center justify-center overflow-hidden`}
              style={{
                width: `${item.itemWidth}%`,
                left: `${item.currentLeft}%`,
                transition: 'width 0.3s ease, left 0.3s ease',
                zIndex: item.index,
              }}
              aria-label={`${item.label}: ${item.size} m²`}
            >
              {item.itemWidth > 5 && (
                <span className="relative text-white text-xs font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] z-10">
                  {totalAllocated > 0 ? `${Math.round(item.size / grossTotalAllocated * 100)}%` : ''}
                </span>
              )}
            </div>
        ))}
        {/* Pass 2: Render shared area hatches on top */}
        {chartItems.map(item => {
            if (item.sharedWidth <= 0) return null;

            const sharedAreaLeft = item.currentLeft + (item.itemWidth - item.sharedWidth);

            return (
                <div
                    key={`${item.id}-hatch`}
                    className="h-full absolute top-0"
                    style={{
                        ...hatchStyle,
                        left: `${sharedAreaLeft}%`,
                        width: `${item.sharedWidth}%`,
                        zIndex: allocations.length + item.index,
                        transition: 'width 0.3s ease, left 0.3s ease',
                    }}
                    aria-label={`Shared area for ${item.label}`}
                />
            );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {allocations.map(alloc => (
          <div key={alloc.id} className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${alloc.color}`}></span>
            <span className="text-sm text-slate-600">{alloc.label}</span>
          </div>
        ))}
        {totalSharedSpace > 0 && (
            <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 relative bg-slate-400 overflow-hidden">
                    <div
                        className="h-full w-full absolute top-0 left-0"
                        style={{
                            backgroundImage: `repeating-linear-gradient(45deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3) 1px, transparent 1px, transparent 2px)`
                        }}
                    ></div>
                </div>
                <span className="text-sm text-slate-600">Shared Area</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default AllocationChart;