// src/routes/admin.ts
import { Router, Request } from "express";
import dotenv from "dotenv";
import { extractToken } from "./auth";
import { User } from "../models";

dotenv.config();

const router = Router();

export interface UserRequest extends Request {
  userId: number;
}

// Get all users (Admin only)
router.get("/admin/users", extractToken, async (request, res) => {
  const req = request as UserRequest;
  try {
    const user = await User.findByPk(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.findAll({
      attributes: ["id", "email", "name", "isAdmin", "isVisible"],
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Update user permissions (Admin only)
router.put("/admin/users/:id", extractToken, async (request, res) => {
  const req = request as UserRequest;
  const { id } = req.params;
  const { isAdmin, isVisible } = req.body;

  try {
    const user = await User.findByPk(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const userToUpdate = await User.findByPk(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    userToUpdate.isAdmin =
      isAdmin !== undefined ? isAdmin : userToUpdate.isAdmin;
    userToUpdate.isVisible =
      isVisible !== undefined ? isVisible : userToUpdate.isVisible;
    await userToUpdate.save();

    res.status(200).json({ message: "User permissions updated successfully" });
  } catch (error) {
    console.error("Error updating user permissions:", error);
    res.status(500).json({ message: "Failed to update user permissions" });
  }
});

// Get user info
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: ["id", "email", "name", "isAdmin", "isVisible"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Failed to fetch user info" });
  }
});

export default router;
