import express from "express";
import bcrypt from "bcrypt";
import { userDB } from "../db.js";

const router = express.Router();

// Check if password is set
router.get("/has-password", (req, res) => {
  const users = userDB.getAll();
  res.json({ hasPassword: users.length > 0 });
});

// Check if user is authenticated
router.get("/check", (req, res) => {
  res.json({
    isAuthenticated: !!req.session?.userId,
    userId: req.session?.userId || null,
  });
});

// Set password (first time setup)
router.post("/setup", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 4) {
      return res
        .status(400)
        .json({ error: "Le mot de passe doit contenir au moins 4 caractères" });
    }

    // Check if user already exists
    const users = userDB.getAll();
    if (users.length > 0) {
      return res.status(400).json({ error: "Un utilisateur existe déjà" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: Date.now().toString(),
      username: "admin",
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    userDB.create(user);

    // Set session
    req.session.userId = user.id;

    res.json({ success: true, message: "Mot de passe créé avec succès" });
  } catch (error) {
    console.error("Setup error:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création du mot de passe" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Mot de passe requis" });
    }

    // Get user (should only be one)
    const users = userDB.getAll();
    if (users.length === 0) {
      return res.status(400).json({ error: "Aucun utilisateur trouvé" });
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Set session
    req.session.userId = user.id;

    res.json({ success: true, message: "Connexion réussie" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la déconnexion" });
    }
    res.json({ success: true, message: "Déconnexion réussie" });
  });
});

export default router;
