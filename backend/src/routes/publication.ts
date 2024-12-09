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
        "image",
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
        "image",
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

// Delete a specific publication by ID
router.delete("/publications/:id", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const { id } = req.params;
  const userId = req.userId;

  try {
    const publication = await Publication.findOne({
      where: { id },
      attributes: ["id"],
    });

    if (!publication) {
      return res.status(404).json({ message: "Publication not found" });
    }

    const user = await User.findOne({
      where: { id: userId },
      attributes: ["is_admin"],
    });

    if (!user || !user.dataValues.is_admin) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this publication" });
    }

    await publication.destroy();

    res.status(200).json({ message: "Publication deleted successfully" });
  } catch (error) {
    console.error("Error deleting publication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new publication
router.post("/publications/create", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const { title, abstract, content, image } = req.body;
  const userId = req.userId;
  if (!title || !abstract || !content) {
    return res.status(400).json({
      message: "Title, abstract, and content are required",
    });
  }

  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["is_admin"],
    });

    if (!user || !user.dataValues.is_admin) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this publication" });
    }

    const newPublication = await Publication.create({
      title,
      abstract,
      content,
      image,
      author: userId,
      likes: 0,
      dislikes: 0,
    });

    res.status(201).json({
      message: "Publication created successfully",
      publication: {
        id: newPublication.id,
        title: newPublication.title,
        abstract: newPublication.abstract,
        content: newPublication.content,
        image: newPublication.image,
        author: newPublication.author,
        likes: newPublication.likes,
        dislikes: newPublication.dislikes,
        createdAt: newPublication.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating publication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
