// controllers/match.controller.js
import { Match } from "../models/match.model.js";
import { Team } from "../models/team.model.js";
import { Sport } from "../models/sport.model.js";

/**
 * GET /api/matches
 * Lista todos los partidos
 */
export const listarPartidos = async (_req, res) => {
  try {
    const matches = await Match.find()
      .populate("teamA", "teamName")
      .populate("teamB", "teamName")
      .populate("sport", "name")
      .sort({ createdAt: 1 });

    return res.json({ ok: true, partidos: matches });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

/**
 * GET /api/matches/:id
 */
export const getMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("teamA", "teamName")
      .populate("teamB", "teamName")
      .populate("sport", "name");

    if (!match) {
      return res.status(404).json({ ok: false, message: "Partido no encontrado" });
    }

    return res.json({ ok: true, match });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

/**
 * POST /api/matches
 */
export const createMatch = async (req, res) => {
  try {
    const { sport, round, teamA, teamB } = req.body;

    const newMatch = await Match.create({
      sport,
      round,
      teamA,
      teamB,
      scoreA: 0,
      scoreB: 0,
      pasaSemi: null
    });

    const match = await Match.findById(newMatch._id)
      .populate("teamA", "teamName")
      .populate("teamB", "teamName")
      .populate("sport", "name");

    return res.status(201).json({ ok: true, match });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

/**
 * PUT /api/matches/:id
 */
export const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
      .populate("teamA", "teamName")
      .populate("teamB", "teamName")
      .populate("sport", "name");

    if (!match) {
      return res.status(404).json({ ok: false, message: "Partido no encontrado" });
    }

    return res.json({ ok: true, match });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

/**
 * DELETE /api/matches/:id
 */
export const deleteMatch = async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    return res.json({ ok: true, message: "Partido eliminado" });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

/**
 * PUT /api/matches/:id/score
 * Actualiza marcador y define ganador
 */
export const updateScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { score1, score2 } = req.body;

    const match = await Match.findById(id)
      .populate("teamA", "teamName")
      .populate("teamB", "teamName");

    if (!match) {
      return res.status(404).json({ ok: false, message: "Partido no encontrado" });
    }

    match.scoreA = score1;
    match.scoreB = score2;

    if (score1 > score2) match.pasaSemi = 1;
    else if (score2 > score1) match.pasaSemi = 2;
    else match.pasaSemi = null; // empate (solo si lo permites)

    await match.save();

    return res.json({ ok: true, partido: match });

  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};
