import { TimeSegment } from "../types";

/**
 * Convertit une heure au format "HH:mm" en minutes depuis minuit
 */
const timeToMinutes = (time: string | null): number | null => {
  if (!time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Vérifie si un enfant est présent pendant une plage horaire donnée
 * @param segments Les segments de présence de l'enfant
 * @param startMinutes Début de la plage en minutes depuis minuit
 * @param endMinutes Fin de la plage en minutes depuis minuit
 * @returns true si l'enfant est présent pendant au moins une partie de cette plage
 */
const isPresentDuring = (
  segments: TimeSegment[],
  startMinutes: number,
  endMinutes: number,
): boolean => {
  return segments.some((segment) => {
    const arrival = timeToMinutes(segment.arrivalTime);
    const leaving = timeToMinutes(segment.leavingTime);

    if (arrival === null || leaving === null) return false;

    // L'enfant est présent si ses horaires chevauchent la plage donnée
    return arrival < endMinutes && leaving > startMinutes;
  });
};

/**
 * Détermine automatiquement si l'enfant prend le repas de midi
 * en fonction de sa présence entre 11h et 13h
 */
export const shouldHaveMeal = (segments: TimeSegment[]): boolean => {
  const lunchStart = 11 * 60; // 11h00 en minutes
  const lunchEnd = 13 * 60; // 13h00 en minutes
  return isPresentDuring(segments, lunchStart, lunchEnd);
};

/**
 * Détermine automatiquement si l'enfant prend le goûter
 * en fonction de sa présence entre 15h et 17h
 */
export const shouldHaveSnack = (segments: TimeSegment[]): boolean => {
  const snackStart = 15 * 60; // 15h00 en minutes
  const snackEnd = 17 * 60; // 17h00 en minutes
  return isPresentDuring(segments, snackStart, snackEnd);
};
