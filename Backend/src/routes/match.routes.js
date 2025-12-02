// routes/match.routes.js
import express from "express";
import {
  listarPartidos,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
  updateScore
} from "../controllers/match.controller.js";

const router = express.Router();

router.get("/", listarPartidos);
router.get("/:id", getMatch);
router.post("/", createMatch);
router.put("/:id", updateMatch);
router.delete("/:id", deleteMatch);

// actualizar marcador:
router.put("/:id/score", updateScore);

export default router;
