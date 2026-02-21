import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const FILES = {
  USERS: path.join(DATA_DIR, "users.json"),
  CHILDREN: path.join(DATA_DIR, "children.json"),
  ENTRIES: path.join(DATA_DIR, "entries.json"),
};

// Initialize files if they don't exist
Object.values(FILES).forEach((file) => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([]), "utf-8");
  }
});

// Generic file operations
const readFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
};

const writeFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
};

// User operations
export const userDB = {
  getAll: () => readFile(FILES.USERS),

  findByUsername: (username) => {
    const users = readFile(FILES.USERS);
    return users.find((u) => u.username === username);
  },

  create: (user) => {
    const users = readFile(FILES.USERS);
    users.push(user);
    return writeFile(FILES.USERS, users);
  },

  update: (username, updates) => {
    const users = readFile(FILES.USERS);
    const index = users.findIndex((u) => u.username === username);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      return writeFile(FILES.USERS, users);
    }
    return false;
  },
};

// Children operations
export const childrenDB = {
  getAll: () => readFile(FILES.CHILDREN),

  findById: (id) => {
    const children = readFile(FILES.CHILDREN);
    return children.find((c) => c.id === id);
  },

  create: (child) => {
    const children = readFile(FILES.CHILDREN);
    children.push(child);
    return writeFile(FILES.CHILDREN, children);
  },

  update: (id, updates) => {
    const children = readFile(FILES.CHILDREN);
    const index = children.findIndex((c) => c.id === id);
    if (index !== -1) {
      children[index] = { ...children[index], ...updates };
      return writeFile(FILES.CHILDREN, children);
    }
    return false;
  },

  delete: (id) => {
    const children = readFile(FILES.CHILDREN);
    const filtered = children.filter((c) => c.id !== id);
    return writeFile(FILES.CHILDREN, filtered);
  },
};

// Time entries operations
export const entriesDB = {
  getAll: () => readFile(FILES.ENTRIES),

  findByDateRange: (startDate, endDate) => {
    const entries = readFile(FILES.ENTRIES);
    return entries.filter((e) => e.date >= startDate && e.date <= endDate);
  },

  findByChildAndDate: (childId, date) => {
    const entries = readFile(FILES.ENTRIES);
    return entries.find((e) => e.childId === childId && e.date === date);
  },

  create: (entry) => {
    const entries = readFile(FILES.ENTRIES);
    entries.push(entry);
    return writeFile(FILES.ENTRIES, entries);
  },

  update: (id, updates) => {
    const entries = readFile(FILES.ENTRIES);
    const index = entries.findIndex((e) => e.id === id);
    if (index !== -1) {
      entries[index] = { ...entries[index], ...updates };
      return writeFile(FILES.ENTRIES, entries);
    }
    return false;
  },

  upsert: (entry) => {
    const entries = readFile(FILES.ENTRIES);
    const index = entries.findIndex(
      (e) => e.childId === entry.childId && e.date === entry.date,
    );

    if (index !== -1) {
      entries[index] = { ...entries[index], ...entry };
    } else {
      entries.push(entry);
    }

    return writeFile(FILES.ENTRIES, entries);
  },

  deleteByChild: (childId) => {
    const entries = readFile(FILES.ENTRIES);
    const filtered = entries.filter((e) => e.childId !== childId);
    return writeFile(FILES.ENTRIES, filtered);
  },
};
