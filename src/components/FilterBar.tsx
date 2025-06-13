import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFilterChange = (field: 'owner' | 'status', value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({ owner: '', status: '' });
  };

  const hasActiveFilters = filters.owner || filters.status;

  return (
    <div className="filters">
      <div className="filters-content">
        <div className="filter-group">
          <label htmlFor="filter-owner" className="filter-label">
            {isMobile ? 'Owner' : 'Filter by Owner:'}
          </label>
          <select
            id="filter-owner"
            value={filters.owner}
            onChange={(e) => handleFilterChange('owner', e.target.value)}
            className="filter-select"
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
          <label htmlFor="filter-status" className="filter-label">
            {isMobile ? 'Status' : 'Filter by Status:'}
          </label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {!isMobile && hasActiveFilters && (
          <div className="filter-group filter-actions">
            <button 
              className="btn btn-small btn-secondary clear-filters-btn"
              onClick={clearAllFilters}
              aria-label="Clear all filters"
            >
              <span className="button-icon">✕</span>
              <span className="button-text">Clear Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar; 