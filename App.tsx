import React, { useState, useMemo } from 'react';
import { SpaceType, SpaceAllocation, SeminarRoom, SavedOption } from './types';
import AllocationChart from './components/AllocationChart';
import SpaceSlider from './components/SpaceSlider';
import SummaryDisplay from './components/SummaryDisplay';
import CalculatedSpaceDisplay from './components/CalculatedSpaceDisplay';
import OccupancyHeader from './components/OccupancyHeader';
import FootprintSlider from './components/FootprintSlider';
import AddSpaceForm from './components/AddSpaceForm';
import AddSeminarSpaceForm from './components/AddSeminarSpaceForm';
import OccupancyBreakdown from './components/OccupancyBreakdown';
import SeminarRoomSummary from './components/SeminarRoomSummary';
import SavedOptions from './components/SavedOptions';
import BuildingSection from './components/BuildingSection';

// Define the user-adjustable spaces with their initial sizes and densities.
const initialUserAllocations: SpaceAllocation[] = [
  { id: SpaceType.Library, label: 'Library', size: 250, sharing: 0, maxSharing: 0.25, color: 'bg-blue-500', density: 2.25, isRemovable: true },
  { id: SpaceType.Seminar, label: 'Seminar Space', size: 0, rooms: [], sharing: 0, maxSharing: 0, color: 'bg-green-500', density: 2.25, isRemovable: true },
  { id: SpaceType.Collaborative, label: 'Collaborative Space', size: 300, sharing: 0, maxSharing: 0.75, color: 'bg-yellow-500', density: 1.0, isRemovable: true },
  { id: SpaceType.Workspace, label: 'Workspace', size: 500, sharing: 0, maxSharing: 0.1, color: 'bg-purple-500', density: 2.25, isRemovable: true },
];

// Calculate the initial balance space size to be 20% of the total.
const initialUserAllocatedSum = initialUserAllocations.reduce((sum, alloc) => sum + alloc.size, 0);
const initialBalanceSize = Math.round(initialUserAllocatedSum * 0.25);

// Combine user allocations with the calculated balance space for the initial state.
const initialAllocations: SpaceAllocation[] = [
  ...initialUserAllocations,
  { id: SpaceType.Balance, label: 'Balance Space', size: initialBalanceSize, sharing: 0, maxSharing: 0, color: 'bg-indigo-500', density: 0 },
];

// Predefined colors for new user-added spaces
const availableColors = ['bg-pink-500', 'bg-red-500', 'bg-orange-500', 'bg-teal-500', 'bg-cyan-500'];

const App: React.FC = () => {
  const [allocations, setAllocations] = useState<SpaceAllocation[]>(initialAllocations);
  const [maxFootprint, setMaxFootprint] = useState<number>(500);
  const [projectName, setProjectName] = useState('Building Space Planner');
  const [savedOptions, setSavedOptions] = useState<SavedOption[]>([]);

  const grossTotalAllocated = useMemo(() =>
    allocations.reduce((sum, alloc) => sum + alloc.size, 0),
    [allocations]
  );

  const totalSharedSpace = useMemo(() =>
    Math.round(allocations.reduce((sum, alloc) => sum + alloc.size * alloc.sharing, 0)),
    [allocations]
  );

  // Total allocated is now the NET area (gross minus shared space)
  const totalAllocated = useMemo(() =>
    grossTotalAllocated - totalSharedSpace,
    [grossTotalAllocated, totalSharedSpace]
  );

  const totalOccupancy = useMemo(() => {
    return allocations.reduce((acc, alloc) => {
      if (alloc.id === SpaceType.Balance || alloc.density <= 0) {
        return acc;
      }
      return acc + Math.floor(alloc.size / alloc.density);
    }, 0);
  }, [allocations]);

  const storeys = useMemo(() => 
    totalAllocated > 0 ? Math.ceil(totalAllocated / maxFootprint) : 1,
    [totalAllocated, maxFootprint]
  );

  const buildingFootprint = useMemo(() => 
    Math.min(totalAllocated, maxFootprint),
    [totalAllocated, maxFootprint]
  );

  const handleAddSpace = (label: string, density: number, maxSharing: number) => {
    const userDefinedSpaces = allocations.filter(a => a.id !== SpaceType.Balance && !Object.values(SpaceType).includes(a.id as SpaceType));
    const nextColorIndex = userDefinedSpaces.length % availableColors.length;
    
    const newSpace: SpaceAllocation = {
      id: `${label.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
      label,
      density,
      size: 100, // Default starting size for a new space
      sharing: 0,
      maxSharing,
      color: availableColors[nextColorIndex],
      isRemovable: true,
    };

    setAllocations(prev => {
      // Insert the new space before the balance space
      const balanceIndex = prev.findIndex(a => a.id === SpaceType.Balance);
      const newAllocations = [...prev];
      if (balanceIndex !== -1) {
        newAllocations.splice(balanceIndex, 0, newSpace);
      } else {
        newAllocations.push(newSpace);
      }
      return newAllocations;
    });
  };

  const handleRemoveSpace = (id: string) => {
    setAllocations(prevAllocations => {
        const updatedAllocs = prevAllocations.filter(alloc => alloc.id !== id);

        const userAllocatedSpace = updatedAllocs
            .filter(alloc => alloc.id !== SpaceType.Balance)
            .reduce((sum, alloc) => sum + alloc.size, 0);
        
        const newBalanceSize = Math.round(userAllocatedSpace * 0.25);

        return updatedAllocs.map(alloc =>
            alloc.id === SpaceType.Balance ? { ...alloc, size: newBalanceSize } : alloc
        );
    });
  };

  const handleAllocationChange = (id: string, newSize: number) => {
    if (id === SpaceType.Balance) return;

    setAllocations(prevAllocations => {
      const updatedAllocs = prevAllocations.map(alloc =>
        alloc.id === id ? { ...alloc, size: newSize } : alloc
      );

      const userAllocatedSpace = updatedAllocs
        .filter(alloc => alloc.id !== SpaceType.Balance)
        .reduce((sum, alloc) => sum + alloc.size, 0);
      
      const newBalanceSize = Math.round(userAllocatedSpace * 0.25);

      return updatedAllocs.map(alloc =>
        alloc.id === SpaceType.Balance ? { ...alloc, size: newBalanceSize } : alloc
      );
    });
  };

  const handleAddSeminarSpace = (studentCount: number) => {
    setAllocations(prevAllocations => {
      const seminarIndex = prevAllocations.findIndex(a => a.id === SpaceType.Seminar);
      if (seminarIndex === -1) return prevAllocations;

      const seminarSpace = prevAllocations[seminarIndex];
      const newRoomArea = Math.round(studentCount * seminarSpace.density);
      const newRoom: SeminarRoom = {
        id: `room-${Date.now()}`,
        students: studentCount,
        area: newRoomArea,
      };

      const updatedSeminarSpace = {
        ...seminarSpace,
        rooms: [...(seminarSpace.rooms || []), newRoom],
        size: seminarSpace.size + newRoomArea,
      };
      
      const tempAllocs = [...prevAllocations];
      tempAllocs[seminarIndex] = updatedSeminarSpace;

      const userAllocatedSpace = tempAllocs
        .filter(alloc => alloc.id !== SpaceType.Balance)
        .reduce((sum, alloc) => sum + alloc.size, 0);
      
      const newBalanceSize = Math.round(userAllocatedSpace * 0.25);

      return tempAllocs.map(alloc =>
        alloc.id === SpaceType.Balance ? { ...alloc, size: newBalanceSize } : alloc
      );
    });
  };

  const handleRemoveSeminarRoom = (roomId: string) => {
    setAllocations(prevAllocations => {
      const seminarIndex = prevAllocations.findIndex(a => a.id === SpaceType.Seminar);
      if (seminarIndex === -1) return prevAllocations;

      const seminarSpace = prevAllocations[seminarIndex];
      const roomToRemove = seminarSpace.rooms?.find(r => r.id === roomId);
      if (!seminarSpace || !seminarSpace.rooms || !roomToRemove) return prevAllocations;
      
      const updatedRooms = seminarSpace.rooms.filter(r => r.id !== roomId);
      const updatedSize = seminarSpace.size - roomToRemove.area;
      
      const updatedSeminarSpace = {
        ...seminarSpace,
        rooms: updatedRooms,
        size: updatedSize,
      };

      const tempAllocs = [...prevAllocations];
      tempAllocs[seminarIndex] = updatedSeminarSpace;
      
      const userAllocatedSpace = tempAllocs
        .filter(alloc => alloc.id !== SpaceType.Balance)
        .reduce((sum, alloc) => sum + alloc.size, 0);
      const newBalanceSize = Math.round(userAllocatedSpace * 0.25);

      return tempAllocs.map(alloc =>
        alloc.id === SpaceType.Balance ? { ...alloc, size: newBalanceSize } : alloc
      );
    });
  };


  const handleSharingChange = (id: string, newSharing: number) => {
    if (id === SpaceType.Balance) return;

    setAllocations(prevAllocations =>
      prevAllocations.map(alloc => {
        if (alloc.id === id) {
          const max = alloc.maxSharing ?? 1;
          const clampedSharing = Math.max(0, Math.min(newSharing, max));
          return { ...alloc, sharing: clampedSharing };
        }
        return alloc;
      })
    );
  };
  
  const handleSaveOption = () => {
    setSavedOptions(prevOptions => {
      const newOption: SavedOption = {
        id: `option-${Date.now()}`,
        label: `Option ${String.fromCharCode(65 + prevOptions.length)}`,
        allocations: JSON.parse(JSON.stringify(allocations)), // Deep copy to prevent mutation
        maxFootprint: maxFootprint,
        totalAllocated: totalAllocated,
        totalOccupancy: totalOccupancy,
      };
      return [...prevOptions, newOption];
    });
  };

  const handleLoadOption = (id: string) => {
    const optionToLoad = savedOptions.find(opt => opt.id === id);
    if (optionToLoad) {
      setAllocations(optionToLoad.allocations);
      setMaxFootprint(optionToLoad.maxFootprint);
    }
  };

  const handleDeleteOption = (id: string) => {
    setSavedOptions(prevOptions => {
      const remainingOptions = prevOptions.filter(opt => opt.id !== id);
      // Re-label the remaining options to keep them sequential
      return remainingOptions.map((opt, index) => ({
        ...opt,
        label: `Option ${String.fromCharCode(65 + index)}`,
      }));
    });
  };

  const sliderMax = useMemo(
    () => grossTotalAllocated + 1000,
    [grossTotalAllocated]
  );
  
  const balanceSpace = useMemo(() => allocations.find(a => a.id === SpaceType.Balance), [allocations]);
  const seminarSpace = useMemo(() => allocations.find(a => a.id === SpaceType.Seminar), [allocations]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-7xl mx-auto">
        <header className="flex justify-between items-start mb-8">
          <div className="flex-grow">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              aria-label="Project Name"
              className="text-4xl font-bold text-slate-800 bg-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-lg p-1 -m-1 w-full max-w-full"
            />
            <p className="mt-2 text-slate-600">Adjust sliders to allocate space. The building grows in storeys if the maximum footprint is exceeded.</p>
          </div>
          <button
            onClick={handleSaveOption}
            className="flex-shrink-0 ml-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Save Option
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left Column (Main Controls) */}
          <div className="lg:col-span-3 space-y-6">
            <AllocationChart 
              allocations={allocations} 
              totalAllocated={totalAllocated}
              totalSharedSpace={totalSharedSpace}
            />
            <OccupancyBreakdown allocations={allocations} />
            {seminarSpace?.rooms && seminarSpace.rooms.length > 0 && (
              <SeminarRoomSummary 
                rooms={seminarSpace.rooms}
                onRemoveRoom={handleRemoveSeminarRoom}
              />
            )}
            <AddSpaceForm onAddSpace={handleAddSpace} />
            <h2 className="text-2xl font-semibold text-slate-800 pt-4">Space Allocation Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allocations
                .filter((alloc) => alloc.id !== SpaceType.Balance)
                .map((alloc) => {
                  if (alloc.id === SpaceType.Seminar) {
                    const people = alloc.density > 0 ? Math.floor(alloc.size / alloc.density) : 0;
                    return (
                      <div key={alloc.id} className="space-y-4">
                        <CalculatedSpaceDisplay
                          spaceId={alloc.id}
                          label={alloc.label}
                          value={alloc.size}
                          people={people}
                          description="Size is managed by adding rooms below."
                          isRemovable={alloc.isRemovable}
                          onRemove={handleRemoveSpace}
                        />
                        <AddSeminarSpaceForm onAddSeminarSpace={handleAddSeminarSpace} />
                      </div>
                    );
                  }
                  
                  return (
                    <SpaceSlider
                      key={alloc.id}
                      spaceId={alloc.id}
                      label={alloc.label}
                      value={alloc.size}
                      sharing={alloc.sharing}
                      maxSharing={alloc.maxSharing ?? 1}
                      color={alloc.color}
                      max={sliderMax}
                      density={alloc.density}
                      isRemovable={alloc.isRemovable}
                      onChange={(newSize: number) => handleAllocationChange(alloc.id, newSize)}
                      onSharingChange={(newSharing: number) => handleSharingChange(alloc.id, newSharing)}
                      onRemove={handleRemoveSpace}
                    />
                  );
                })}

              {balanceSpace && (
                <CalculatedSpaceDisplay 
                  key={balanceSpace.id}
                  label={balanceSpace.label}
                  value={balanceSpace.size}
                  description="This space is fixed at 20% of the total allocated area."
                  isDashed={true}
                />
              )}
            </div>
          </div>
          
          {/* Right Column (Sidebar with Summary & Graphic) */}
          <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-8">
            <OccupancyHeader totalOccupancy={totalOccupancy} />
            <SummaryDisplay 
              totalAllocated={totalAllocated}
              totalSharedSpace={totalSharedSpace}
              totalOccupancy={totalOccupancy}
              storeys={storeys}
              buildingFootprint={buildingFootprint}
              maxFootprint={maxFootprint}
            />
            <BuildingSection
                allocations={allocations}
                storeys={storeys}
                buildingFootprint={buildingFootprint}
                totalAllocated={totalAllocated}
            />
            <SavedOptions
              options={savedOptions}
              onLoad={handleLoadOption}
              onDelete={handleDeleteOption}
            />
            <FootprintSlider
                value={maxFootprint}
                onChange={setMaxFootprint}
                min={100}
                max={1000}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;