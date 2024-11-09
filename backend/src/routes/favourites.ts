// src/routes/favourites.ts
import { Router, Request } from "express";
import { extractToken } from "./auth";
import { Favourites, Game, User } from "../models";

const router = Router();

export interface UserRequest extends Request {
  userId: number;
}

// Get all favourites for a user
router.get("/users/:id/favourites", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const userId = parseInt(req.params.id, 10);

  try {
    const favourites = await Favourites.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Game,
          attributes: ["title", "description", "producer", "critics_rate"],
          as: "gameDetails",
        },
      ],
      attributes: ["id", "game_id"],
    });

    res.status(200).json(favourites);
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add a game to favourites
router.post("/games/:id/favourite", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const userId = req.userId;
  const gameId = parseInt(req.params.id, 10);

  try {
    // Check if already in favourites
    const existingFavourite = await Favourites.findOne({
      where: { user_id: userId, game_id: gameId },
    });
    if (existingFavourite) {
      return res.status(400).json({ message: "Game is already in favourites" });
    }

    const favourite = await Favourites.create({
      user_id: userId,
      game_id: gameId,
    });
    res.status(201).json(favourite);
  } catch (error) {
    console.error("Error adding to favourites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Remove a game from favourites
router.delete("/games/:id/favourite", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const userId = req.userId;
  const gameId = parseInt(req.params.id, 10);

  try {
    const favourite = await Favourites.findOne({
      where: { user_id: userId, game_id: gameId },
    });
    if (!favourite) {
      return res.status(404).json({ message: "Favourite not found" });
    }

    await favourite.destroy();
    res.status(200).json({ message: "Favourite removed successfully" });
  } catch (error) {
    console.error("Error removing favourite:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
