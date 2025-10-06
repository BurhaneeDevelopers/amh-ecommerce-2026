/**
 * Utility functions for handling IST (Indian Standard Time) dates
 */

/**
 * Get current time in IST
 * @returns Date object representing current IST time
 */
export const getCurrentISTTime = (): Date => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  return new Date(now.getTime() + istOffset);
};

/**
 * Get current time in IST as ISO string
 * @returns ISO string representing current IST time
 */
export const getCurrentISTString = (): string => {
  return getCurrentISTTime().toISOString();
};

/**
 * Check if current IST time is between start and end dates
 * @param startDate - Start date string or Date object
 * @param endDate - End date string or Date object
 * @returns boolean indicating if current time is within the range
 */
export const isCurrentTimeInRange = (startDate: string | Date, endDate: string | Date): boolean => {
  const currentIST = getCurrentISTTime();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return currentIST >= start && currentIST <= end;
};
