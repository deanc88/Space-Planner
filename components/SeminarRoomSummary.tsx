import React from 'react';
import { SeminarRoom } from '../types';

interface SeminarRoomSummaryProps {
  rooms: SeminarRoom[];
  onRemoveRoom: (roomId: string) => void;
}

const SeminarRoomSummary: React.FC<SeminarRoomSummaryProps> = ({ rooms, onRemoveRoom }) => {
  const totalStudents = React.useMemo(() => {
    return rooms.reduce((sum, room) => sum + room.students, 0);
  }, [rooms]);

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-baseline mb-4">
        <h3 className="text-lg font-medium text-slate-700">Seminar Room Breakdown</h3>
        {totalStudents > 0 && (
          <div className="text-right">
            <span className="text-sm font-medium text-slate-500">Total Capacity: </span>
            <span className="text-lg font-bold text-green-700">{totalStudents} Students</span>
          </div>
        )}
      </div>
      {rooms.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">No individual seminar rooms have been added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="relative bg-green-50 border border-green-200 p-3 rounded-lg text-center group min-w-[90px]"
              style={{ flexGrow: room.students, flexBasis: '0' }}
              aria-label={`Seminar room for ${room.students} students, ${room.area} square meters`}
            >
              <button
                onClick={() => onRemoveRoom(room.id)}
                className="absolute top-1 right-1 p-1 rounded-full text-green-400 bg-white opacity-0 group-hover:opacity-100 hover:bg-green-100 hover:text-green-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-opacity"
                aria-label={`Remove seminar room for ${room.students} students`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <p className="font-bold text-2xl text-green-800">{room.students}</p>
              <p className="text-xs font-medium text-green-600 uppercase">Students</p>
              <p className="text-xs text-slate-500 mt-2">{room.area} m²</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeminarRoomSummary;
