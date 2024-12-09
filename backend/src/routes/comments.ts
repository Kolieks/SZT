// src/routes/comments.ts
import { Router, Request } from "express";
import dotenv from "dotenv";
import sequelize from "../config/database";
import { extractToken } from "./auth";

import { User, Comment, CommentVote } from "../models";
dotenv.config();

const router = Router();

export interface UserRequest extends Request {
  userId: number;
}

// Get all comments for a specific publication
router.get("/publications/:id/comments", async (req, res) => {
  const { id: entityId } = req.params;

  try {
    const comments = await Comment.findAll({
      where: { type: 0, entityId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["name"],
          as: "user",
        },
      ],
      attributes: [
        "id",
        "content",
        "likes",
        "dislikes",
        "createdAt",
        [sequelize.col("user.name"), "authorName"],
      ],
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new comment for a specific publication
router.post(
  "/publications/:id/comments",
  extractToken,
  async (request, res) => {
    const req = request as UserRequest;
    const { id: entityId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    try {
      const newComment = await Comment.create({
        entityId: parseInt(entityId, 10),
        type: 0,
        userId,
        content,
      });

      // Fetch the newly created comment with the author's name
      const commentWithAuthor = await Comment.findOne({
        where: { id: newComment.id },
        include: [
          {
            model: User,
            attributes: ["name"],
            as: "user",
          },
        ],
        attributes: [
          "id",
          "content",
          "createdAt",
          "likes",
          "dislikes",
          [sequelize.col("user.name"), "authorName"],
        ],
      });

      res.status(201).json(commentWithAuthor);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Delete a specific comment for a publication
router.delete(
  "/publications/:publicationId/comments/:commentId",
  extractToken,
  async (request, res) => {
    const req = request as UserRequest;
    const { publicationId, commentId } = req.params;
    const userId = req.userId;

    try {
      const comment = await Comment.findOne({
        where: {
          id: parseInt(commentId, 10),
          entityId: parseInt(publicationId, 10),
          type: 0,
        },
      });

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const user = await User.findOne({
        where: { id: userId },
        attributes: ["is_admin"],
      });

      if (!user || !user.dataValues.is_admin) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this comment" });
      }

      await comment.destroy();

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Get all comments for a specific game
router.get("/games/:id/comments", async (req, res) => {
  const { id: entityId } = req.params;

  try {
    const comments = await Comment.findAll({
      where: { type: 1, entityId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["name"],
          as: "user",
        },
      ],
      attributes: [
        "id",
        "content",
        "likes",
        "dislikes",
        "createdAt",
        [sequelize.col("user.name"), "authorName"],
      ],
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new comment for a specific game
router.post("/games/:id/comments", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const { id: entityId } = req.params;
  const { content } = req.body;
  const userId = req.userId;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Content cannot be empty" });
  }

  try {
    const newComment = await Comment.create({
      entityId: parseInt(entityId, 10),
      type: 1,
      userId,
      content,
    });

    // Fetch the newly created comment with the author's name
    const commentWithAuthor = await Comment.findOne({
      where: { id: newComment.id },
      include: [
        {
          model: User,
          attributes: ["name"],
          as: "user",
        },
      ],
      attributes: [
        "id",
        "content",
        "createdAt",
        "likes",
        "dislikes",
        [sequelize.col("user.name"), "authorName"],
      ],
    });

    res.status(201).json(commentWithAuthor);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a specific comment for a game
router.delete(
  "/games/:gameId/comments/:commentId",
  extractToken,
  async (request, res) => {
    const req = request as UserRequest;
    const { gameId, commentId } = req.params;
    const userId = req.userId;

    try {
      const comment = await Comment.findOne({
        where: {
          id: parseInt(commentId, 10),
          entityId: parseInt(gameId, 10),
          type: 1,
        },
      });

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const user = await User.findOne({
        where: { id: userId },
        attributes: ["is_admin"],
      });

      if (!user || !user.dataValues.is_admin) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this comment" });
      }

      await comment.destroy();

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Get a user's vote on a comment
router.get("/comments/:id/vote", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const { id: commentId } = req.params;
  const userId = req.userId;

  try {
    const vote = await CommentVote.findOne({
      where: { user_id: userId, comment_id: commentId },
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

// Like or Dislike a comment
router.post("/comments/:id/vote", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const { id: commentId } = req.params;
  const { liked } = req.body;
  const userId = req.userId;

  try {
    const existingVote = await CommentVote.findOne({
      where: { user_id: userId, comment_id: commentId },
    });

    if (existingVote) {
      return res
        .status(400)
        .json({ message: "User has already voted on this comment" });
    }

    await CommentVote.create({
      user_id: userId,
      comment_id: commentId,
      liked,
    });

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (liked) {
      comment.likes += 1;
    } else {
      comment.dislikes += 1;
    }
    await comment.save();

    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error voting on comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Remove a vote from a comment
router.delete("/comments/:id/vote", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const { id: commentId } = req.params;
  const userId = req.userId;

  try {
    const vote = await CommentVote.findOne({
      where: { user_id: userId, comment_id: commentId },
    });

    if (!vote) {
      return res
        .status(400)
        .json({ message: "No vote found for this comment by this user" });
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (vote.liked) {
      comment.likes -= 1;
    } else {
      comment.dislikes -= 1;
    }
    await comment.save();
    await vote.destroy();

    res.status(200).json({ message: "Vote removed successfully" });
  } catch (error) {
    console.error("Error removing vote:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
