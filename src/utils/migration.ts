import { TimeEntry, TimeSegment, Child } from "../types";

/**
 * Migrate old TimeEntry format to new format
 * Old format: { arrivalTime, leavingTime }
 * New format: { segments: [{ arrivalTime, leavingTime }], isAbsent, hasMeal }
 */
export const migrateTimeEntry = (entry: any): TimeEntry => {
  // If already migrated, return as is
  if (entry.segments && Array.isArray(entry.segments)) {
    return entry as TimeEntry;
  }

  // Migrate from old format
  const segment: TimeSegment = {
    id: "1",
    arrivalTime: entry.arrivalTime || null,
    leavingTime: entry.leavingTime || null,
  };

  return {
    id: entry.id,
    childId: entry.childId,
    date: entry.date,
    segments: [segment],
    isAbsent: false,
    absenceReason: "",
    hasMeal: null, // Will use child's default
    notes: entry.notes || "",
  };
};

/**
 * Migrate old Child format to new format
 * Adds hasMeal field if missing
 */
export const migrateChild = (child: any): Child => {
  return {
    ...child,
    hasMeal: child.hasMeal !== undefined ? child.hasMeal : true,
    absentDays: child.absentDays || [],
  };
};

/**
 * Check if data needs migration
 */
export const needsMigration = (data: any): boolean => {
  if (Array.isArray(data)) {
    return data.some((item) => {
      if (item.arrivalTime !== undefined && !item.segments) {
        return true; // Old TimeEntry format
      }
      if (item.name && item.hasMeal === undefined) {
        return true; // Old Child format
      }
      return false;
    });
  }
  return false;
};
