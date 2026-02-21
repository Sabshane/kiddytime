import express from "express";
import { entriesDB } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get entries for a date range
router.get("/", (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate et endDate requis" });
    }

    const entries = entriesDB.findByDateRange(startDate, endDate);
    res.json(entries);
  } catch (error) {
    console.error("Get entries error:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des entrées" });
  }
});

// Get a specific entry
router.get("/:childId/:date", (req, res) => {
  try {
    const { childId, date } = req.params;
    const entry = entriesDB.findByChildAndDate(childId, date);

    if (!entry) {
      return res.status(404).json({ error: "Entrée non trouvée" });
    }

    res.json(entry);
  } catch (error) {
    console.error("Get entry error:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'entrée" });
  }
});

// Create or update an entry
router.post("/", (req, res) => {
  try {
    const { childId, date, arrivalTime, leavingTime, notes } = req.body;

    if (!childId || !date) {
      return res.status(400).json({ error: "childId et date requis" });
    }

    const entry = {
      id: `${childId}-${date}`,
      childId,
      date,
      arrivalTime: arrivalTime || null,
      leavingTime: leavingTime || null,
      notes: notes || "",
      updatedAt: new Date().toISOString(),
    };

    entriesDB.upsert(entry);
    res.json(entry);
  } catch (error) {
    console.error("Save entry error:", error);
    res.status(500).json({ error: "Erreur lors de la sauvegarde de l'entrée" });
  }
});

// Update an entry
router.put("/:childId/:date", (req, res) => {
  try {
    const { childId, date } = req.params;
    const { arrivalTime, leavingTime, notes } = req.body;

    const existing = entriesDB.findByChildAndDate(childId, date);

    const entry = {
      id: `${childId}-${date}`,
      childId,
      date,
      arrivalTime:
        arrivalTime !== undefined ? arrivalTime : existing?.arrivalTime || null,
      leavingTime:
        leavingTime !== undefined ? leavingTime : existing?.leavingTime || null,
      notes: notes !== undefined ? notes : existing?.notes || "",
      updatedAt: new Date().toISOString(),
    };

    entriesDB.upsert(entry);
    res.json(entry);
  } catch (error) {
    console.error("Update entry error:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de l'entrée" });
  }
});

export default router;
