export interface SeminarRoom {
  id: string;
  students: number;
  area: number;
}

export enum SpaceType {
  Library = 'Library',
  Seminar = 'Seminar Space',
  Collaborative = 'Collaborative Space',
  Workspace = 'Workspace',
  Balance = 'Balance Space',
}

export interface SpaceAllocation {
  id: string;
  label: string;
  size: number;
  sharing: number;
  maxSharing?: number;
  color: string;
  density: number;
  isRemovable?: boolean;
  rooms?: SeminarRoom[];
}

export interface SavedOption {
  id: string;
  label: string;
  allocations: SpaceAllocation[];
  maxFootprint: number;
  totalAllocated: number;
  totalOccupancy: number;
}
