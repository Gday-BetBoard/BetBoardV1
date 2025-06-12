import React from 'react';
import { User } from '../types';

interface FilterBarProps {
  filters: {
    owner: string;
    status: string;
  };
  onFiltersChange: (filters: { owner: string; status: string }) => void;
  users: User[];
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange, users }) => {
  const handleFilterChange = (field: 'owner' | 'status', value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="filter-owner">Filter by Owner:</label>
        <select
          id="filter-owner"
          value={filters.owner}
          onChange={(e) => handleFilterChange('owner', e.target.value)}
        >
          <option value="">All Owners</option>
          {users.map(user => (
            <option key={user.name} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-status">Filter by Status:</label>
        <select
          id="filter-status"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Blocked">Blocked</option>
          <option value="Done">Done</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar; 