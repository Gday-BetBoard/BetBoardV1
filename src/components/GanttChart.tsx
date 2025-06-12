import React from 'react';
import { Bet } from '../types';
import { formatDateToDDMMYYYY, getCurrentDateYYYYMMDD, getDaysBetween, addDays, getWeekCommencingDate } from '../utils/dateUtils';

interface GanttChartProps {
  bets: Bet[];
}

const GanttChart: React.FC<GanttChartProps> = ({ bets }) => {
  if (bets.length === 0) return null;

  const currentDate = getCurrentDateYYYYMMDD();
  const currentDateObj = new Date(currentDate);
  
  // Chart always starts from today's date
  const chartStartDate = new Date(currentDate);
  const chartStartDateStr = currentDate;
  
  // Find the latest due date to determine chart span
  const latestDueDate = bets.reduce((latest, bet) => {
    const betDate = new Date(bet.when);
    return betDate > new Date(latest) ? bet.when : latest;
  }, currentDate);

  // Calculate total days from today to latest due date (minimum 30 days)
  const totalDays = Math.max(getDaysBetween(chartStartDateStr, latestDueDate) + 14, 30);
  const chartEndDate = addDays(new Date(chartStartDate), totalDays);

  // Generate week markers starting from the next week after today to avoid overlap
  const weekMarkers = [];
  let weekStart = getWeekCommencingDate(addDays(new Date(currentDate), 7)); // Start from next week
  let weekCount = 0;
  
  while (weekStart <= chartEndDate) {
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const daysFromToday = getDaysBetween(chartStartDateStr, weekStartStr);
    const position = (daysFromToday / totalDays) * 100;
    
    // Only add markers that are within the chart bounds, every 2 weeks, and with minimum 10% spacing from today
    if (position <= 95 && position >= 10 && weekCount % 2 === 0) {
      weekMarkers.push({
        date: weekStart,
        position: Math.min(position, 95), // Cap at 95% to prevent overflow
        label: formatDateToDDMMYYYY(weekStartStr)
      });
    }
    
    weekStart = addDays(new Date(weekStart), 7);
    weekCount++;
  }

  // Calculate bet positions and widths - all bars start from today (0%)
  const betBars = bets.map(bet => {
    const betDueDate = new Date(bet.when);
    const daysFromToday = getDaysBetween(chartStartDateStr, bet.when);
    
    // All bars start from today (0%) and extend to their due date
    const width = Math.max(2, Math.min((daysFromToday / totalDays) * 100, 95));
    
    return {
      ...bet,
      position: 0, // Always start from today (0%)
      width: width, // Width extends to the due date
      isOverdue: betDueDate < currentDateObj && bet.status !== 'Done'
    };
  });

  const getStatusColor = (status: string, isOverdue: boolean) => {
    if (isOverdue) return '#ef4444'; // Red for overdue
    
    switch (status) {
      case 'Done': return '#22c55e'; // Green
      case 'In Progress': return '#f59e0b'; // Orange
      case 'Blocked': return '#ef4444'; // Red
      case 'Open': return '#3b82f6'; // Blue
      default: return '#6b7280'; // Gray
    }
  };

  return (
    <div className="gantt-chart">
      <div className="gantt-header">
        <h3>Timeline</h3>
        <div className="gantt-legend">
          <span className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
            Open
          </span>
          <span className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
            In Progress
          </span>
          <span className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
            Blocked/Overdue
          </span>
          <span className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#22c55e' }}></div>
            Done
          </span>
        </div>
      </div>

      <div className="gantt-container">
        {/* Timeline markers */}
        <div className="gantt-timeline">
          {/* Today marker - always at the beginning (0%) */}
          <div className="timeline-marker current-date" style={{ left: '0%' }}>
            <div className="marker-line"></div>
            <div className="marker-label">Today<br/>{formatDateToDDMMYYYY(currentDate)}</div>
          </div>
          
          {/* Week markers - start from next week to avoid overlap */}
          {weekMarkers.map((marker, index) => (
            <div 
              key={index}
              className="timeline-marker week-marker" 
              style={{ left: `${marker.position}%` }}
            >
              <div className="marker-line"></div>
              <div className="marker-label">Week<br/>{marker.label}</div>
            </div>
          ))}
        </div>

        {/* Bet bars */}
        <div className="gantt-bars">
          {betBars.map((bet, index) => (
            <div key={bet.id} className="gantt-row">
              <div className="gantt-label">
                <div className="bet-name">{bet.what}</div>
              </div>
              <div className="gantt-bar-container">
                <div 
                  className="gantt-bar"
                  style={{
                    left: `${bet.position}%`,
                    width: `${bet.width}%`,
                    backgroundColor: getStatusColor(bet.status, bet.isOverdue)
                  }}
                  title={`${bet.what} - Due: ${formatDateToDDMMYYYY(bet.when)} - Status: ${bet.status}`}
                >
                  <span className="bar-label">
                    Due: {formatDateToDDMMYYYY(bet.when)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GanttChart; 