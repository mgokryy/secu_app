import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Handlers d'API existants
import loginHandler from "./api/login.js";
import registerHandler from "./api/register.js";
import logoutHandler from "./api/logout.js";

import gridsCreate from "./api/grids/create.js";
import gridsList from "./api/grids/list.js";
import gridsPublicList from "./api/grids/public-list.js";
import gridsView from "./api/grids/view/[id].js";
import gridsUpdate from "./api/grids/update/id.js";
import gridsDelete from "./api/grids/delete/id.js";

import scoreHandler from "./api/scores.js";
import leaderboardHandler from "./api/scores/leaderboard/[grid_id].js";

dotenv.config();

const app = express();

// Parsing JSON
app.use(express.json());

// CORS pour autoriser le front Vite en dev
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// --- Routes d'authentification ---
app.post("/api/login", (req, res) => loginHandler(req, res));
app.post("/api/register", (req, res) => registerHandler(req, res));
app.post("/api/logout", (req, res) => logoutHandler(req, res));

// --- Routes grilles (admin / user) ---
app.post("/api/grids/create", (req, res) => gridsCreate(req, res));
app.get("/api/grids/list", (req, res) => gridsList(req, res)); // admin
app.get("/api/grids/public-list", (req, res) => gridsPublicList(req, res)); // user connecté

// vue d'une grille (GET) - handler attend req.query.id
app.get("/api/grids/view/:id", (req, res) => {
  req.query = { id: req.params.id };
  gridsView(req, res);
});

// mise à jour / suppression d'une grille (admin) - handlers utilisent req.params.id
app.put("/api/grids/update/:id", (req, res) => gridsUpdate(req, res));
app.delete("/api/grids/delete/:id", (req, res) => gridsDelete(req, res));

// --- Scores & leaderboard ---
app.post("/api/scores", (req, res) => scoreHandler(req, res));

// handler leaderboard/[grid_id].js attend req.query.grid_id
app.get("/api/scores/leaderboard/:grid_id", (req, res) => {
  req.query = { grid_id: req.params.grid_id };
  leaderboardHandler(req, res);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API sécurisée démarrée sur http://localhost:${PORT}`);
});


