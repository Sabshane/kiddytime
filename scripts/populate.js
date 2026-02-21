import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, "../server/data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Generate dates for the current week (Monday to Sunday)
const getWeekDates = () => {
  const dates = [];
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
};

const dates = getWeekDates();

// Create 3 children
const children = [
  {
    id: "child-1",
    name: "Emma",
    defaultArrivalTime: "08:00",
    defaultLeavingTime: "17:00",
    hasMeal: true,
    hasSnack: true,
  },
  {
    id: "child-2",
    name: "Lucas",
    defaultArrivalTime: "08:30",
    defaultLeavingTime: "16:30",
    hasMeal: true,
    hasSnack: true,
  },
  {
    id: "child-3",
    name: "Léa",
    defaultArrivalTime: "09:00",
    defaultLeavingTime: "17:30",
    hasMeal: false,
    hasSnack: true,
  },
];

// Generate time entries for the week
const entries = [];

dates.forEach((date, dayIndex) => {
  children.forEach((child) => {
    const childId = child.id;
    const id = `${childId}-${date}`;

    // Lundi - Journée normale pour tous
    if (dayIndex === 0) {
      entries.push({
        id,
        childId,
        date,
        segments: [
          {
            id: "1",
            arrivalTime: child.defaultArrivalTime,
            leavingTime: child.defaultLeavingTime,
          },
        ],
        isAbsent: false,
        hasMeal: child.hasMeal,
        hasSnack: child.hasSnack,
        notes: "Journée normale",
      });
    }

    // Mardi - Emma avec 2 segments (matin + après-midi)
    else if (dayIndex === 1) {
      if (child.name === "Emma") {
        entries.push({
          id,
          childId,
          date,
          segments: [
            {
              id: "1",
              arrivalTime: "08:00",
              leavingTime: "10:00",
            },
            {
              id: "2",
              arrivalTime: "14:00",
              leavingTime: "17:00",
            },
          ],
          isAbsent: false,
          hasMeal: false,
          hasSnack: true, // Présente 14h-17h donc goûter
          notes: "Rendez-vous médical entre 10h et 14h",
        });
      } else {
        entries.push({
          id,
          childId,
          date,
          segments: [
            {
              id: "1",
              arrivalTime: child.defaultArrivalTime,
              leavingTime: child.defaultLeavingTime,
            },
          ],
          isAbsent: false,
          hasMeal: child.hasMeal,
          hasSnack: child.hasSnack,
          notes: "",
        });
      }
    }

    // Mercredi - Lucas absent (malade)
    else if (dayIndex === 2) {
      if (child.name === "Lucas") {
        entries.push({
          id,
          childId,
          date,
          segments: [
            {
              id: "1",
              arrivalTime: null,
              leavingTime: null,
            },
          ],
          isAbsent: true,
          absenceReason: "Malade",
          hasMeal: null,
          hasSnack: null,
          notes: "",
        });
      } else {
        entries.push({
          id,
          childId,
          date,
          segments: [
            {
              id: "1",
              arrivalTime: child.defaultArrivalTime,
              leavingTime: child.defaultLeavingTime,
            },
          ],
          isAbsent: false,
          hasMeal: child.hasMeal,
          hasSnack: child.hasSnack,
          notes: "",
        });
      }
    }

    // Jeudi - Léa arrivée tardive
    else if (dayIndex === 3) {
      if (child.name === "Léa") {
        entries.push({
          id,
          childId,
          date,
          segments: [
            {
              id: "1",
              arrivalTime: "10:30",
              leavingTime: "17:30",
            },
          ],
          isAbsent: false,
          hasMeal: true, // Exceptionnellement prend le repas
          hasSnack: true,
          notes: "Arrivée tardive",
        });
      } else {
        entries.push({
          id,
          childId,
          date,
          segments: [
            {
              id: "1",
              arrivalTime: child.defaultArrivalTime,
              leavingTime: child.defaultLeavingTime,
            },
          ],
          isAbsent: false,
          hasMeal: child.hasMeal,
          hasSnack: child.hasSnack,
          notes: "",
        });
      }
    }

    // Vendredi - Emma en vacances, Lucas avec horaires courts
    else if (dayIndex === 4) {
      if (child.name === "Emma") {
        entries.push({
          id,
          childId,
          date,
          segments: [
            {
              id: "1",
              arrivalTime: null,
              leavingTime: null,
            },
          ],
          isAbsent: true,
          absenceReason: "Vacances",
          hasMeal: null,
          hasSnack: null,
          notes: "",
        });
      } else if (child.name === "Lucas") {
        entries.push({
          id,
          childId,
          date,
          segments: [
            {
              id: "1",
              arrivalTime: "08:30",
              leavingTime: "12:00",
            },
          ],
          isAbsent: false,
          hasMeal: false,
          hasSnack: false, // Part avant 15h
          notes: "Demi-journée",
        });
      } else {
        entries.push({
          id,
          childId,
          date,
          segments: [
            {
              id: "1",
              arrivalTime: child.defaultArrivalTime,
              leavingTime: child.defaultLeavingTime,
            },
          ],
          isAbsent: false,
          hasMeal: child.hasMeal,
          hasSnack: child.hasSnack,
          notes: "",
        });
      }
    }

    // Samedi - Tous absents (weekend)
    else if (dayIndex === 5) {
      entries.push({
        id,
        childId,
        date,
        segments: [
          {
            id: "1",
            arrivalTime: null,
            leavingTime: null,
          },
        ],
        isAbsent: true,
        absenceReason: "Week-end",
        hasMeal: null,
        hasSnack: null,
        notes: "",
      });
    }

    // Dimanche - Tous absents (weekend)
    else if (dayIndex === 6) {
      entries.push({
        id,
        childId,
        date,
        segments: [
          {
            id: "1",
            arrivalTime: null,
            leavingTime: null,
          },
        ],
        isAbsent: true,
        absenceReason: "Week-end",
        hasMeal: null,
        hasSnack: null,
        notes: "",
      });
    }
  });
});

// Write files
const childrenPath = path.join(dataDir, "children.json");
const entriesPath = path.join(dataDir, "entries.json");

fs.writeFileSync(childrenPath, JSON.stringify(children, null, 2));
fs.writeFileSync(entriesPath, JSON.stringify(entries, null, 2));

console.log("✅ Données créées avec succès !");
console.log(`📅 Semaine du ${dates[0]} au ${dates[6]}`);
console.log(
  `👶 ${children.length} enfants créés: ${children.map((c) => c.name).join(", ")}`,
);
console.log(`📝 ${entries.length} entrées générées`);
console.log("\n📂 Fichiers créés:");
console.log(`   - ${childrenPath}`);
console.log(`   - ${entriesPath}`);
console.log("\n💡 Redémarrez le serveur pour voir les données !");
