// models/match.model.js
import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    sport: { type: mongoose.Schema.Types.ObjectId, ref: "Sport", required: true },

    round: {
      type: String,
      enum: ["OCTAVOS", "CUARTOS", "SEMIS", "FINAL"],
      required: true
    },

    teamA: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    teamB: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },

    scoreA: { type: Number, default: 0 },
    scoreB: { type: Number, default: 0 },

    // 1 = equipo1, 2 = equipo2
    pasaSemi: { type: Number, enum: [1, 2, null], default: null },

    playedAt: {
      type: Date,
      default: () => {
        const days = [2, 3, 4, 5, 6];
        const random = days[Math.floor(Math.random() * days.length)];
        return new Date(`2025-12-${String(random).padStart(2, "0")}T19:00:00`);
      }
    }
  },
  { timestamps: true }
);

export const Match = mongoose.model("Match", matchSchema);
