import express from "express";
import {
  generarPartidosFutsal,
  listarPartidosFutsal,
  generarCuartosFutsal,
  generarSemisFutsal,
  generarFinalFutsal
} from "../controllers/tournament.controller.js";

const router = express.Router();

router.post("/generarpartidosfutsal", generarPartidosFutsal);
router.get("/partidosfutsal", listarPartidosFutsal);
router.post("/generarcuartosfutsal", generarCuartosFutsal);
router.post("/generarsemisfutsal", generarSemisFutsal);
router.post("/generarfinalfutsal", generarFinalFutsal);

export default router;
