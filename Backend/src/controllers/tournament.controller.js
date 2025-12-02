// controllers/tournament.controller.js
import { Team } from "../models/team.model.js";
import { Sport } from "../models/sport.model.js";
import { Match } from "../models/match.model.js";

const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const formatMatch = (m) => ({
  id: m._id.toString(),
  partidoEtapa: m.round,
  equipo1: { id: m.teamA._id.toString(), nombre: m.teamA.teamName },
  equipo2: { id: m.teamB._id.toString(), nombre: m.teamB.teamName },
  score1: m.scoreA,
  score2: m.scoreB,
  fecha: m.playedAt,
  pasaSemi: m.pasaSemi
});

/* ---------------------------------------------------------- */
/*                       OCTAVOS DE FINAL                     */
/* ---------------------------------------------------------- */

export const generarPartidosFutsal = async (_req, res) => {
  try {
    const futsal = await Sport.findOne({ name: /microfutbol/i });
    if (!futsal) return res.status(400).json({ ok: false, message: "No se encontró el deporte Microfutbol" });

    const teams = await Team.find({ sport: futsal._id }).lean();

    if (teams.length !== 16) {
      return res.status(400).json({
        ok: false,
        message: "Se requieren exactamente 16 equipos para generar OCTAVOS"
      });
    }

    const shuffled = shuffleArray(teams);

    const docsToInsert = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      docsToInsert.push({
        sport: futsal._id,
        round: "OCTAVOS",
        teamA: shuffled[i]._id,
        teamB: shuffled[i + 1]._id,
        scoreA: 0,
        scoreB: 0
      });
    }

    const created = await Match.insertMany(docsToInsert);

    const matches = await Match.find({ _id: { $in: created.map((m) => m._id) } })
      .populate("teamA", "teamName")
      .populate("teamB", "teamName");

    return res.status(201).json({
      ok: true,
      partidos: matches.map(formatMatch)
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

/* ---------------------------------------------------------- */
/*                 LISTAR PARTIDOS POR RONDA                  */
/* ---------------------------------------------------------- */

export const listarPartidosFutsal = async (_req, res) => {
  try {
    const futsal = await Sport.findOne({ name: /microfutbol/i });
    if (!futsal) return res.status(400).json({ ok: false, message: "No se encontró el deporte Microfutbol" });

    const matches = await Match.find({ sport: futsal._id, round: "OCTAVOS" })
      .populate("teamA", "teamName")
      .populate("teamB", "teamName");

    return res.json({ ok: true, partidos: matches.map(formatMatch) });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

/* ---------------------------------------------------------- */
/*           GENERAR SIGUIENTE RONDA (CUARTOS/SEMIS/FINAL)    */
/* ---------------------------------------------------------- */

const generarSiguienteRonda = async (sportId, fromRound, toRound, res) => {
  const prev = await Match.find({ sport: sportId, round: fromRound });

  if (!prev.length) {
    return res.status(400).json({
      ok: false,
      message: `No existen partidos en la ronda ${fromRound}`
    });
  }

  const winners = prev.map((m) => (m.pasaSemi === 1 ? m.teamA : m.pasaSemi === 2 ? m.teamB : null));

  if (winners.includes(null)) {
    return res.status(400).json({
      ok: false,
      message: `Hay partidos sin ganador definido en ${fromRound}`
    });
  }

  const teams = await Team.find({ _id: { $in: winners } }).lean();
  const shuffled = shuffleArray(teams);

  const docs = [];
  for (let i = 0; i < shuffled.length; i += 2) {
    docs.push({
      sport: sportId,
      round: toRound,
      teamA: shuffled[i]._id,
      teamB: shuffled[i + 1]._id,
      scoreA: 0,
      scoreB: 0
    });
  }

  const created = await Match.insertMany(docs);

  const matches = await Match.find({ _id: { $in: created.map((m) => m._id) } })
    .populate("teamA", "teamName")
    .populate("teamB", "teamName");

  return res.status(201).json({
    ok: true,
    etapa: toRound,
    partidos: matches.map(formatMatch)
  });
};

/* ---------------------- CUARTOS ---------------------- */
export const generarCuartosFutsal = async (_req, res) => {
  const futsal = await Sport.findOne({ name: /microfutbol/i });
  if (!futsal) return res.status(400).json({ ok: false, message: "No se encontró Microfutbol" });

  return generarSiguienteRonda(futsal._id, "OCTAVOS", "CUARTOS", res);
};

/* ---------------------- SEMIS ------------------------ */
export const generarSemisFutsal = async (_req, res) => {
  const futsal = await Sport.findOne({ name: /microfutbol/i });
  if (!futsal) return res.status(400).json({ ok: false, message: "No se encontró Microfutbol" });

  return generarSiguienteRonda(futsal._id, "CUARTOS", "SEMIS", res);
};

/* ---------------------- FINAL ------------------------ */
export const generarFinalFutsal = async (_req, res) => {
  const futsal = await Sport.findOne({ name: /microfutbol/i });
  if (!futsal) return res.status(400).json({ ok: false, message: "No se encontró Microfutbol" });

  return generarSiguienteRonda(futsal._id, "SEMIS", "FINAL", res);
};
