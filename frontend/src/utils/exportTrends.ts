import { ExportSummary } from '../hooks/useExports';

export type DailyTrendData = {
  date: string; // YYYY-MM-DD format
  count: number;
  totalValue: number;
};

/**
 * Generate daily trend data from export summaries
 * @param exports Array of export summaries
 * @param days Number of days to show in the trend (default: 7)
 * @returns Array of daily trend data points
 */
export const generateDailyTrendData = (
  exports: ExportSummary[],
  days: number = 7
): DailyTrendData[] => {
  // Create an array of the last N days
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD format
  }

  // Initialize trend data with zero values
  const trendData: DailyTrendData[] = dates.map(date => ({
    date,
    count: 0,
    totalValue: 0
  }));

  // Process each export and add to the appropriate date bucket
  exports.forEach(exportItem => {
    if (exportItem.submittedAt) {
      const exportDate = new Date(exportItem.submittedAt);
      const dateStr = exportDate.toISOString().split('T')[0];
      
      // Find the matching date in our trend data
      const dateIndex = trendData.findIndex(d => d.date === dateStr);
      if (dateIndex !== -1) {
        trendData[dateIndex].count += 1;
        trendData[dateIndex].totalValue += exportItem.totalValue;
      }
    }
  });

  return trendData;
};

/**
 * Generate weekly trend data from export summaries
 * @param exports Array of export summaries
 * @param weeks Number of weeks to show in the trend (default: 4)
 * @returns Array of weekly trend data points
 */
export const generateWeeklyTrendData = (
  exports: ExportSummary[],
  weeks: number = 4
): DailyTrendData[] => {
  // Create an array of the last N weeks (starting Monday)
  const weekStartDates: Date[] = [];
  const today = new Date();
  
  // Find the start of this week (Monday)
  const startOfWeek = new Date(today);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  startOfWeek.setDate(diff);
  
  // Generate previous weeks
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(startOfWeek);
    weekStart.setDate(weekStart.getDate() - (i * 7));
    weekStartDates.push(weekStart);
  }

  // Initialize trend data with zero values
  const trendData: DailyTrendData[] = weekStartDates.map(date => ({
    date: date.toISOString().split('T')[0], // Use Monday as the week identifier
    count: 0,
    totalValue: 0
  }));

  // Process each export and add to the appropriate week bucket
  exports.forEach(exportItem => {
    if (exportItem.submittedAt) {
      const exportDate = new Date(exportItem.submittedAt);
      
      // Find which week this export belongs to
      for (let i = 0; i < weekStartDates.length; i++) {
        const weekStart = weekStartDates[i];
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6); // End of the week (Sunday)
        
        if (exportDate >= weekStart && exportDate <= weekEnd) {
          trendData[i].count += 1;
          trendData[i].totalValue += exportItem.totalValue;
          break;
        }
      }
    }
  });

  return trendData;
};

/**
 * Format date for display in charts
 * @param date Date string in YYYY-MM-DD format
 * @param format Display format ('day', 'week', 'month')
 * @returns Formatted date string
 */
export const formatTrendDate = (date: string, format: 'day' | 'week' | 'month' = 'day'): string => {
  const d = new Date(date);
  
  switch (format) {
    case 'day':
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    case 'week':
      return `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    case 'month':
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    default:
      return date;
  }
};