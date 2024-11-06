// src/routes/publication.ts
import { Router, Request } from "express";
import dotenv from "dotenv";
import sequelize from "../config/database";
import { extractToken } from "./auth";

import { Publication, User, PublicationVote } from "../models";
dotenv.config();

const router = Router();

export interface UserRequest extends Request {
  userId: number;
}

// Get all publications
router.get("/publications", async (req, res) => {
  try {
    const publications = await Publication.findAll({
      order: [["created_at", "DESC"]],
      attributes: [
        "id",
        "title",
        "abstract",
        "content",
        "likes",
        "dislikes",
        "createdAt",
        "updatedAt",
        [sequelize.col("authorDetails.name"), "authorName"],
      ],
      include: [
        {
          model: User,
          as: "authorDetails",
          attributes: [],
        },
      ],
    });
    res.json(publications);
  } catch (error) {
    console.error("Error fetching publications:", error);
    res.status(500).json({ message: "Failed to fetch publications" });
  }
});

// Get votes
router.get("/publications/:id/vote", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const { id: publicationId } = req.params;
  const userId = req.userId;

  try {
    const vote = await PublicationVote.findOne({
      where: { user_id: userId, publication_id: publicationId },
    });

    if (!vote) {
      return res.status(200).json({ liked: null });
    }

    res.status(200).json({ liked: vote.liked });
  } catch (error) {
    console.error("Error fetching vote:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Like or Dislike a publication
router.post("/publications/:id/vote", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const { id: publicationId } = req.params;
  const { liked } = req.body;
  const userId = req.userId;

  try {
    const existingVote = await PublicationVote.findOne({
      where: { user_id: userId, publication_id: publicationId },
    });

    if (existingVote) {
      return res
        .status(400)
        .json({ message: "User has already voted on this publication" });
    }
    await PublicationVote.create({
      user_id: userId,
      publication_id: publicationId,
      liked: liked,
    });
    const publication = await Publication.findByPk(publicationId);
    if (!publication) {
      return res.status(404).json({ message: "Publication not found" });
    }
    if (liked) {
      publication.likes += 1;
    } else {
      publication.dislikes += 1;
    }
    await publication.save();
    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error voting on publication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/publications/:id/vote", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const { id: publicationId } = req.params;
  const userId = req.userId;

  try {
    const vote = await PublicationVote.findOne({
      where: { user_id: userId, publication_id: publicationId },
    });

    if (!vote) {
      return res
        .status(400)
        .json({ message: "No vote found for this publication by this user" });
    }

    const publication = await Publication.findByPk(publicationId);
    if (!publication) {
      return res.status(404).json({ message: "Publication not found" });
    }

    if (vote.liked) {
      publication.likes -= 1;
    } else {
      publication.dislikes -= 1;
    }

    await publication.save();
    await vote.destroy();

    res.status(200).json({ message: "Vote removed successfully" });
  } catch (error) {
    console.error("Error removing vote:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a specific publication by ID
router.get("/publications/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const publication = await Publication.findOne({
      where: { id },
      attributes: [
        "id",
        "title",
        "abstract",
        "content",
        "likes",
        "dislikes",
        "createdAt",
        "updatedAt",
        [sequelize.col("authorDetails.name"), "authorName"],
      ],
      include: [
        {
          model: User,
          as: "authorDetails",
          attributes: [],
        },
      ],
    });

    if (!publication) {
      return res.status(404).json({ message: "Publication not found" });
    }

    res.status(200).json(publication);
  } catch (error) {
    console.error("Error fetching publication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
