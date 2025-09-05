import React from 'react';
import { SpaceAllocation, SpaceType } from '../types';

interface BuildingSectionProps {
  allocations: SpaceAllocation[];
  storeys: number;
  buildingFootprint: number;
  totalAllocated: number;
}

interface SpaceOnFloor {
  id: string;
  label: string;
  color: string;
  area: number;
  people: number;
}

interface FloorLayout {
  level: number;
  spaces: SpaceOnFloor[];
  totalPeople: number;
}

const BuildingSection: React.FC<BuildingSectionProps> = ({ allocations, storeys, buildingFootprint, totalAllocated }) => {

  const floorLayouts = React.useMemo((): FloorLayout[] => {
    if (totalAllocated <= 0 || storeys <= 0) return [];

    // 1. Separate Balance Space from user-defined spaces.
    const balanceSpace = allocations.find(a => a.id === SpaceType.Balance);
    const balanceSpaceSize = balanceSpace?.size || 0;
    const spacesToPlace = allocations
      .filter(a => a.size > 0 && a.id !== SpaceType.Balance)
      .map(a => ({
        id: a.id,
        label: a.label,
        color: a.color,
        remainingSize: a.size,
        density: a.density,
      }));

    // 2. Initialize floor structures with their total capacity.
    const floors: { level: number; spaces: SpaceOnFloor[]; remainingArea: number }[] = Array.from({ length: storeys }, (_, i) => {
      const isTopFloor = i === storeys - 1;
      const maxArea = (isTopFloor && totalAllocated % buildingFootprint !== 0 && totalAllocated > buildingFootprint)
        ? totalAllocated % buildingFootprint
        : buildingFootprint;
      const finalMaxArea = storeys === 1 ? totalAllocated : maxArea;
      return { level: i, spaces: [], remainingArea: finalMaxArea };
    });

    // 3. Pre-allocate Balance Space equally across all floors first.
    if (balanceSpace && balanceSpaceSize > 0) {
      const balanceAreaPerStorey = balanceSpaceSize / storeys;
      let balanceRemainder = balanceSpaceSize;

      // First pass: give each floor its equal share, constrained by its capacity.
      floors.forEach(floor => {
        const areaToPlace = Math.min(balanceAreaPerStorey, floor.remainingArea);
        if (areaToPlace > 0) {
          floor.spaces.push({
            id: balanceSpace.id,
            label: balanceSpace.label,
            color: balanceSpace.color,
            area: areaToPlace,
            people: 0, // Balance space has no occupancy
          });
          floor.remainingArea -= areaToPlace;
          balanceRemainder -= areaToPlace;
        }
      });

      // Second pass: if any balance space remains (due to small floors),
      // distribute it to any floors that still have capacity.
      if (balanceRemainder > 0.1) {
        for (const floor of floors) {
          if (balanceRemainder < 0.1) break;
          const canFit = floor.remainingArea;
          if (canFit > 0) {
            const amountToAdd = Math.min(balanceRemainder, canFit);
            const existingBalance = floor.spaces.find(s => s.id === balanceSpace.id)!;
            existingBalance.area += amountToAdd;
            floor.remainingArea -= amountToAdd;
            balanceRemainder -= amountToAdd;
          }
        }
      }
    }
    
    // 4. Define helper to place remaining spaces into the now-reduced floor areas.
    const placeSpaceOnFloors = (
      spaceId: SpaceType | string,
      floorOrder: 'bottom-up' | 'top-down'
    ) => {
      const space = spacesToPlace.find(s => s.id === spaceId);
      if (!space || space.remainingSize <= 0) return;

      const floorIndexes = floorOrder === 'bottom-up'
        ? Array.from({ length: storeys }, (_, i) => i)
        : Array.from({ length: storeys }, (_, i) => storeys - 1 - i);

      for (const i of floorIndexes) {
        if (space.remainingSize <= 0) break;
        const floor = floors[i];
        if (floor.remainingArea > 0) {
          const areaToPlace = Math.min(space.remainingSize, floor.remainingArea);
          if (areaToPlace <= 0) continue;
          
          const peopleInSegment = space.density > 0 ? Math.floor(areaToPlace / space.density) : 0;

          floor.spaces.push({
            id: space.id,
            label: space.label,
            color: space.color,
            area: areaToPlace,
            people: peopleInSegment,
          });
          
          floor.remainingArea -= areaToPlace;
          space.remainingSize -= areaToPlace;
        }
      }
    };
    
    // 5. Place priority user spaces.
    placeSpaceOnFloors(SpaceType.Library, 'bottom-up');
    placeSpaceOnFloors(SpaceType.Workspace, 'top-down');

    // 6. Place remaining user spaces.
    const otherSpaces = spacesToPlace.filter(s => s.id !== SpaceType.Library && s.id !== SpaceType.Workspace);
    for (const space of otherSpaces) {
        for (let i = 0; i < storeys; i++) {
            if (space.remainingSize <= 0) break;
            const floor = floors[i];
            if (floor.remainingArea > 0) {
                const areaToPlace = Math.min(space.remainingSize, floor.remainingArea);
                if (areaToPlace <= 0) continue;

                const peopleInSegment = space.density > 0 ? Math.floor(areaToPlace / space.density) : 0;

                floor.spaces.push({
                    id: space.id,
                    label: space.label,
                    color: space.color,
                    area: areaToPlace,
                    people: peopleInSegment,
                });
                floor.remainingArea -= areaToPlace;
                space.remainingSize -= areaToPlace;
            }
        }
    }

    return floors.map(floor => ({
        ...floor,
        totalPeople: floor.spaces.reduce((sum, s) => sum + s.people, 0),
    }));
  }, [allocations, storeys, buildingFootprint, totalAllocated]);

  const getFloorLabel = (level: number, totalStoreys: number) => {
    if (level === 0 && totalStoreys === 1) return 'Ground Floor';
    if (level === 0) return 'Ground';
    if (level === totalStoreys - 1) return `Top (${level})`;
    return `Level ${level}`;
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-slate-700 mb-4">Building Section View</h3>
      <div className="space-y-2">
        {floorLayouts.length > 0 ? (
          floorLayouts.slice().reverse().map((floor) => (
            <div key={floor.level} className="flex items-center gap-4">
              <div className="text-right text-xs font-semibold text-slate-500 w-16 flex-shrink-0">
                {getFloorLabel(floor.level, storeys)}
              </div>
              <div className="flex-grow bg-slate-200 h-10 rounded-md flex overflow-hidden border border-slate-300">
                {floor.spaces.map((space, index) => (
                  <div
                    key={`${space.id}-${index}`}
                    className={`h-full ${space.color}`}
                    style={{ width: `${(space.area / buildingFootprint) * 100}%` }}
                    title={`${space.label}: ${Math.round(space.area)} m² (~${space.people} people)`}
                  ></div>
                ))}
              </div>
               <div className="w-24 flex-shrink-0 text-left">
                 <div className="flex items-center space-x-1 text-slate-700" title={`Approximately ${floor.totalPeople} people on this floor`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-sm">{floor.totalPeople}</span>
                 </div>
               </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 text-center py-4">No allocated area to display.</p>
        )}
      </div>
    </div>
  );
};

export default BuildingSection;
