import express from "express";
import { childrenDB, entriesDB } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all children
router.get("/", (req, res) => {
  try {
    const children = childrenDB.getAll();
    res.json(children);
  } catch (error) {
    console.error("Get children error:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des enfants" });
  }
});

// Get a specific child
router.get("/:id", (req, res) => {
  try {
    const child = childrenDB.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ error: "Enfant non trouvé" });
    }
    res.json(child);
  } catch (error) {
    console.error("Get child error:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'enfant" });
  }
});

// Create a child
router.post("/", (req, res) => {
  try {
    const { name, defaultArrivalTime, defaultLeavingTime } = req.body;

    if (!name || !defaultArrivalTime || !defaultLeavingTime) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    const child = {
      id: Date.now().toString(),
      name,
      defaultArrivalTime,
      defaultLeavingTime,
      createdAt: new Date().toISOString(),
    };

    childrenDB.create(child);
    res.status(201).json(child);
  } catch (error) {
    console.error("Create child error:", error);
    res.status(500).json({ error: "Erreur lors de la création de l'enfant" });
  }
});

// Update a child
router.put("/:id", (req, res) => {
  try {
    const { name, defaultArrivalTime, defaultLeavingTime } = req.body;
    const child = childrenDB.findById(req.params.id);

    if (!child) {
      return res.status(404).json({ error: "Enfant non trouvé" });
    }

    const updates = {
      name: name || child.name,
      defaultArrivalTime: defaultArrivalTime || child.defaultArrivalTime,
      defaultLeavingTime: defaultLeavingTime || child.defaultLeavingTime,
      updatedAt: new Date().toISOString(),
    };

    childrenDB.update(req.params.id, updates);
    res.json({ ...child, ...updates });
  } catch (error) {
    console.error("Update child error:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de l'enfant" });
  }
});

// Delete a child
router.delete("/:id", (req, res) => {
  try {
    const child = childrenDB.findById(req.params.id);

    if (!child) {
      return res.status(404).json({ error: "Enfant non trouvé" });
    }

    // Delete child and related entries
    childrenDB.delete(req.params.id);
    entriesDB.deleteByChild(req.params.id);

    res.json({ success: true, message: "Enfant supprimé" });
  } catch (error) {
    console.error("Delete child error:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'enfant" });
  }
});

export default router;
