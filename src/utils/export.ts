import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Child, TimeEntry } from "../types";

/**
 * Convert data to CSV format and trigger download
 */
export const exportToCSV = (
  data: string[][],
  filename: string = "export.csv",
) => {
  // Convert array to CSV string
  const csvContent = data
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  // Add BOM for proper UTF-8 encoding (fixes Excel accents issue)
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  // Create download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export time entries for a period
 */
export const exportTimeEntries = (
  children: Child[],
  entries: TimeEntry[],
  startDate: Date,
  endDate: Date,
) => {
  // Create CSV header
  const headers = [
    "Date",
    "Enfant",
    "Statut",
    "Segments horaires",
    "Durée totale",
    "Repas",
    "Goûter",
    "Raison absence",
    "Notes",
  ];

  // Create data rows
  const rows: string[][] = [headers];

  // Group entries by date and child
  const entriesByDate = new Map<string, Map<string, TimeEntry>>();

  entries.forEach((entry) => {
    const dateKey = entry.date;
    if (!entriesByDate.has(dateKey)) {
      entriesByDate.set(dateKey, new Map());
    }
    entriesByDate.get(dateKey)!.set(entry.childId, entry);
  });

  // Sort dates
  const sortedDates = Array.from(entriesByDate.keys()).sort();

  // Generate rows
  sortedDates.forEach((dateKey) => {
    const dateEntries = entriesByDate.get(dateKey)!;

    children.forEach((child) => {
      const entry = dateEntries.get(child.id);
      const date = new Date(dateKey);
      const formattedDate = format(date, "dd/MM/yyyy", { locale: fr });

      if (entry) {
        let status = "Non renseigné";
        let segmentsText = "-";
        let duration = "-";

        // Use explicit value or child default
        const hasMeal =
          entry.hasMeal !== null
            ? entry.hasMeal
              ? "Oui"
              : "Non"
            : child.hasMeal
              ? "Oui"
              : "Non";
        const hasSnack =
          entry.hasSnack !== null
            ? entry.hasSnack
              ? "Oui"
              : "Non"
            : child.hasSnack
              ? "Oui"
              : "Non";

        if (entry.isAbsent) {
          status = "Absent";
        } else if (entry.segments && entry.segments.length > 0) {
          // Build segments text
          const validSegments = entry.segments.filter(
            (seg) => seg.arrivalTime || seg.leavingTime,
          );

          if (validSegments.length > 0) {
            segmentsText = validSegments
              .map((seg) => {
                const arr = seg.arrivalTime || "?";
                const leave = seg.leavingTime || "?";
                return `${arr}-${leave}`;
              })
              .join(", ");

            // Calculate total duration
            let totalMinutes = 0;
            validSegments.forEach((seg) => {
              if (seg.arrivalTime && seg.leavingTime) {
                const [arrH, arrM] = seg.arrivalTime.split(":").map(Number);
                const [leaveH, leaveM] = seg.leavingTime.split(":").map(Number);
                const segDuration = leaveH * 60 + leaveM - (arrH * 60 + arrM);
                if (segDuration > 0) totalMinutes += segDuration;
              }
            });

            if (totalMinutes > 0) {
              const hours = Math.floor(totalMinutes / 60);
              const minutes = totalMinutes % 60;
              duration = `${hours}h${minutes.toString().padStart(2, "0")}`;
            }

            status = validSegments.every((seg) => seg.leavingTime)
              ? "Parti"
              : "Présent";
          }
        }

        rows.push([
          formattedDate,
          child.name,
          status,
          segmentsText,
          duration,
          hasMeal,
          hasSnack,
          entry.absenceReason || "-",
          entry.notes || "-",
        ]);
      } else {
        rows.push([
          formattedDate,
          child.name,
          "Non renseigné",
          "-",
          "-",
          child.hasMeal ? "Oui" : "Non",
          child.hasSnack ? "Oui" : "Non",
          "-",
          "-",
        ]);
      }
    });
  });

  // Generate filename
  const startStr = format(startDate, "yyyy-MM-dd");
  const endStr = format(endDate, "yyyy-MM-dd");
  const filename = `presences_${startStr}_${endStr}.csv`;

  exportToCSV(rows, filename);
};

/**
 * Export children list with their details
 */
export const exportChildrenList = (children: Child[]) => {
  const headers = [
    "Nom",
    "Heure d'arrivée par défaut",
    "Heure de départ par défaut",
    "Prend le repas",
    "Prend le goûter",
  ];

  const rows: string[][] = [headers];

  children.forEach((child) => {
    rows.push([
      child.name,
      child.defaultArrivalTime || "-",
      child.defaultLeavingTime || "-",
      child.hasMeal ? "Oui" : "Non",
      child.hasSnack ? "Oui" : "Non",
    ]);
  });

  const filename = `enfants_${format(new Date(), "yyyy-MM-dd")}.csv`;
  exportToCSV(rows, filename);
};
