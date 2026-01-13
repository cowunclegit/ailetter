/**
 * Returns the Monday and Sunday of the week for a given date.
 * @param {Date} date 
 * @returns {{ monday: Date, sunday: Date }}
 */
export const getWeekRange = (date) => {
  const d = new Date(date);
  const day = d.getUTCDay();
  // Adjust to Monday (1)
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1); 
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff, 0, 0, 0, 0));

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  sunday.setUTCHours(23, 59, 59, 999);

  return { monday, sunday };
};

/**
 * Returns a list of week ranges for the last N weeks.
 * @param {number} n 
 * @returns {Array<{label: string, start: string, end: string}>}
 */
export const getLastNWeeks = (n) => {
  const weeks = [];
  const today = new Date();
  
  for (let i = 0; i < n; i++) {
    const targetDate = new Date();
    targetDate.setDate(today.getDate() - (i * 7));
    const { monday, sunday } = getWeekRange(targetDate);
    
    const label = `Week ${getISOWeekNumber(monday)} (${formatDate(monday)} ~ ${formatDate(sunday)})`;
    weeks.push({
      label,
      start: monday.toISOString(),
      end: sunday.toISOString()
    });
  }
  
  return weeks;
};

const getISOWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

/**
 * Returns the start (28 days ago) and end (now) dates for the 4-week range.
 * @returns {{ start: string, end: string }}
 */
export const get28DayRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 28);
  
  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
};

export const getISOWeek = (dateString) => {
  return getISOWeekNumber(new Date(dateString));
};

const formatDate = (date) => {
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${m}.${d}`;
};
