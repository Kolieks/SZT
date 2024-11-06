// src/routes/game.ts
import { Router, Request } from "express";
import dotenv from "dotenv";
import { extractToken } from "./auth";
import sequelize from "../config/database";

import { Game, Rating } from "../models";
dotenv.config();

const router = Router();

export interface UserRequest extends Request {
  userId: number;
}

// Fetch all games
router.get("/games", async (req, res) => {
  try {
    const games = await Game.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "criticsRate",
        "averageUserRate",
      ],
      order: [["criticsRate", "DESC"]],
    });
    res.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ message: "Failed to fetch games" });
  }
});

router.get("/games/:id/rate", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const { id: gameId } = req.params;
  const userId = req.userId;

  try {
    const rating = await Rating.findOne({
      where: { user_id: userId, game_id: gameId },
    });

    if (!rating) {
      return res.status(200).json({ rating: null });
    }

    res.status(200).json({ rating: rating.rating });
  } catch (error) {
    console.error("Error fetching rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/games/:id/rate", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const { id: gameId } = req.params;
  const { rating } = req.body;
  const userId = req.userId;

  try {
    const [ratingInstance, created] = await Rating.upsert({
      userId,
      gameId: parseInt(gameId, 10),
      rating: rating,
    });

    const ratings = await Rating.findAll({ where: { game_id: gameId } });
    const sum = ratings.reduce((sum, r) => sum + Number(r.rating), 0);
    const averageUserRate = ratings.length > 0 ? sum / ratings.length : 0;

    await Game.update({ averageUserRate }, { where: { id: gameId } });

    res
      .status(created ? 201 : 200)
      .json({ message: "Rating submitted successfully", averageUserRate });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/games/:id/rate", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const { id: gameId } = req.params;
  const userId = req.userId;

  try {
    const rating = await Rating.findOne({
      where: { user_id: userId, game_id: gameId },
    });

    if (!rating) {
      return res
        .status(400)
        .json({ message: "No rating found for this game by this user" });
    }

    await rating.destroy();
    const ratings = await Rating.findAll({ where: { game_id: gameId } });
    const sum = ratings.reduce((sum, r) => sum + Number(r.rating), 0);
    const averageUserRate = ratings.length > 0 ? sum / ratings.length : 0;

    await Game.update({ averageUserRate }, { where: { id: gameId } });

    res
      .status(200)
      .json({ message: "Rating removed successfully", averageUserRate });
  } catch (error) {
    console.error("Error removing rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a specific game by ID
router.get("/games/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const game = await Game.findOne({
      where: { id },
      attributes: ["id", "title", "description", "producer", "createdAt"],
    });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json(game);
  } catch (error) {
    console.error("Error fetching game:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
