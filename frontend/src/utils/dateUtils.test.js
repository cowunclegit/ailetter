import { getWeekRange, getLastNWeeks, get28DayRange, getISOWeek } from './dateUtils';

describe('dateUtils', () => {
  it('calculates 28-day range correctly', () => {
    const { start, end } = get28DayRange();
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    expect(diffDays).toBe(28);
  });

  it('returns ISO week number correctly', () => {
    // Jan 13, 2026 is Tuesday, Week 3
    expect(getISOWeek('2026-01-13')).toBe(3);
    // Jan 5, 2026 is Monday, Week 2
    expect(getISOWeek('2026-01-05')).toBe(2);
  });

  it('calculates correct week range for a Wednesday', () => {
    const date = new Date('2026-01-14'); // Wednesday
    const { monday, sunday } = getWeekRange(date);
    
    expect(monday.toISOString()).toContain('2026-01-12'); // Monday
    expect(sunday.toISOString()).toContain('2026-01-18'); // Sunday
  });

  it('calculates correct week range for a Sunday', () => {
    const date = new Date('2026-01-18'); // Sunday
    const { monday, sunday } = getWeekRange(date);
    
    expect(monday.toISOString()).toContain('2026-01-12');
    expect(sunday.toISOString()).toContain('2026-01-18');
  });

  it('calculates correct week range for a Monday', () => {
    const date = new Date('2026-01-12'); // Monday
    const { monday, sunday } = getWeekRange(date);
    
    expect(monday.toISOString()).toContain('2026-01-12');
    expect(sunday.toISOString()).toContain('2026-01-18');
  });

  describe('getLastNWeeks', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-01-13T12:00:00Z'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('generates 12 weeks of history', () => {
      const weeks = getLastNWeeks(12);
      expect(weeks).toHaveLength(12);
    });

    it('formats labels correctly (Week N (MM.DD ~ MM.DD))', () => {
      const weeks = getLastNWeeks(1);
      // Example for Jan 13, 2026 (Week 3)
      // Monday is Jan 12, Sunday is Jan 18
      expect(weeks[0].label).toMatch(/Week \d+ \(01\.12 ~ 01\.18\)/);
    });
  });
});
