import {
  formatDateToDDMMYYYY,
  formatDateToYYYYMMDD,
  getCurrentDateYYYYMMDD,
  getDaysBetween,
  addDays,
  getWeekCommencingDate
} from '../utils/dateUtils';

describe('Date Utilities', () => {
  describe('formatDateToDDMMYYYY', () => {
    test('formats date string correctly', () => {
      expect(formatDateToDDMMYYYY('2025-06-13')).toBe('13/06/2025');
      expect(formatDateToDDMMYYYY('2025-12-31')).toBe('31/12/2025');
    });

    test('handles single digit months and days', () => {
      expect(formatDateToDDMMYYYY('2025-01-05')).toBe('05/01/2025');
    });
  });

  describe('formatDateToYYYYMMDD', () => {
    test('formats date string correctly', () => {
      expect(formatDateToYYYYMMDD('13/06/2025')).toBe('2025-06-13');
      expect(formatDateToYYYYMMDD('31/12/2025')).toBe('2025-12-31');
    });

    test('handles already formatted dates', () => {
      expect(formatDateToYYYYMMDD('2025-06-13')).toBe('2025-06-13');
    });
  });

  describe('getCurrentDateYYYYMMDD', () => {
    test('returns current date in YYYY-MM-DD format', () => {
      const result = getCurrentDateYYYYMMDD();
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      expect(result).toMatch(dateRegex);
    });

    test('returns valid date', () => {
      const result = getCurrentDateYYYYMMDD();
      const date = new Date(result);
      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });
  });

  describe('getDaysBetween', () => {
    test('calculates days between dates correctly', () => {
      expect(getDaysBetween('2025-01-01', '2025-01-05')).toBe(4);
      expect(getDaysBetween('2025-01-01', '2025-01-01')).toBe(0); // Same day returns 0
      expect(getDaysBetween('2025-01-05', '2025-01-01')).toBe(4); // Absolute difference
    });

    test('handles month boundaries', () => {
      expect(getDaysBetween('2025-01-30', '2025-02-02')).toBe(3);
    });

    test('handles year boundaries', () => {
      expect(getDaysBetween('2024-12-30', '2025-01-02')).toBe(3);
    });
  });

  describe('addDays', () => {
    test('adds days to date correctly', () => {
      const baseDate = new Date('2025-06-13');
      const result = addDays(baseDate, 5);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(5); // June is month 5 (0-indexed)
      expect(result.getDate()).toBe(18);
    });

    test('handles negative days', () => {
      const baseDate = new Date('2025-06-13');
      const result = addDays(baseDate, -5);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(8);
    });

    test('handles month boundaries', () => {
      const baseDate = new Date('2025-01-30');
      const result = addDays(baseDate, 5);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(4);
    });
  });

  describe('getWeekCommencingDate', () => {
    test('returns Monday for dates in the week', () => {
      // Test with a Wednesday (2025-06-18)
      const wednesday = new Date('2025-06-18');
      const result = getWeekCommencingDate(wednesday);
      
      expect(result.getDay()).toBe(1); // Monday is day 1
      expect(result.getDate()).toBe(16); // June 16, 2025 is the Monday
    });

    test('returns same date if already Monday', () => {
      const monday = new Date('2025-06-16');
      const result = getWeekCommencingDate(monday);
      
      expect(result.getTime()).toBe(monday.getTime());
    });

    test('handles Sunday correctly', () => {
      const sunday = new Date('2025-06-22');
      const result = getWeekCommencingDate(sunday);
      
      expect(result.getDay()).toBe(1); // Monday
      expect(result.getDate()).toBe(16); // Previous Monday
    });
  });
}); 