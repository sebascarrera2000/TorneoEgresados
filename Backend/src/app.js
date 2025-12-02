// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

// Rutas
import sportRoutes from "./routes/sport.routes.js";
import teamRoutes from "./routes/team.routes.js";
import matchRoutes from "./routes/match.routes.js";
import tournamentRoutes from "./routes/tournament.routes.js";

export const app = express();

// --------------------------
// Middlewares de seguridad
// --------------------------
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

// --------------------------
// Swagger
// --------------------------
const swaggerDocPath = path.resolve("src/docs/swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerDocPath, "utf-8"));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --------------------------
// Rutas principales
// --------------------------
app.use("/api/sports", sportRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/tournament", tournamentRoutes);

// --------------------------
// Healthcheck
// --------------------------
app.get("/", (_req, res) => {
  res.send("🏅 API de Deportes funcionando correctamente");
});

export default app;
