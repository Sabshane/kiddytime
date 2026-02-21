export interface Child {
  id: string;
  name: string;
  defaultArrivalTime: string; // Format: "HH:mm"
  defaultLeavingTime: string; // Format: "HH:mm"
  photoUrl?: string;
}

export interface TimeEntry {
  id: string;
  childId: string;
  date: string; // Format: "YYYY-MM-DD"
  arrivalTime: string | null; // Format: "HH:mm"
  leavingTime: string | null; // Format: "HH:mm"
  notes?: string;
}

export type ViewMode = "day" | "week" | "month";
