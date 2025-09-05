import React, { useState } from 'react';

interface AddSeminarSpaceFormProps {
  onAddSeminarSpace: (studentCount: number) => void;
}

const AddSeminarSpaceForm: React.FC<AddSeminarSpaceFormProps> = ({ onAddSeminarSpace }) => {
  const [students, setStudents] = useState(80);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!students || students <= 0) {
      setError('Number of students must be a positive number.');
      return;
    }
    setError('');
    onAddSeminarSpace(students);
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
       <h4 className="text-md font-medium text-slate-700 mb-2">Add Seminar Room</h4>
       <p className="text-xs text-slate-500 mb-3">
         Adds space to the total based on student capacity (2.25 m²/person).
       </p>
      <form onSubmit={handleSubmit} className="flex items-end gap-2 sm:gap-4">
        <div className="flex-grow">
          <label htmlFor="student-count" className="block text-sm font-medium text-slate-600 mb-1">
            Student Capacity
          </label>
          <input
            id="student-count"
            type="number"
            value={students}
            onChange={(e) => setStudents(parseInt(e.target.value, 10) || 0)}
            step="1"
            min="1"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 80"
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Add
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default AddSeminarSpaceForm;
