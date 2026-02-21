export interface Child {
  id: string;
  name: string;
  defaultArrivalTime: string; // Format: "HH:mm"
  defaultLeavingTime: string; // Format: "HH:mm"
  hasMeal: boolean; // Prend le repas par défaut
  hasSnack: boolean; // Prend le goûter par défaut
  expectedDays: number[]; // Jours de présence attendus (0=Dimanche, 1=Lundi, ..., 6=Samedi)
  absentDays?: string[]; // Jours d'absence récurrents (ex: ["wednesday", "friday"])
  photoUrl?: string;
}

export interface TimeSegment {
  id: string;
  arrivalTime: string | null; // Format: "HH:mm"
  leavingTime: string | null; // Format: "HH:mm"
}

export interface TimeEntry {
  id: string;
  childId: string;
  date: string; // Format: "YYYY-MM-DD"
  segments: TimeSegment[]; // Plusieurs blocs horaires possibles
  isAbsent: boolean; // Marqué absent
  absenceReason?: string; // Raison de l'absence
  hasMeal: boolean | null; // null = utiliser la config par défaut de l'enfant
  hasSnack: boolean | null; // null = utiliser la config par défaut de l'enfant
  notes?: string;
}

export type ViewMode = "day" | "week" | "month";
