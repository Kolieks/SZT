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
      attributes: ["id", "email", "name", "isAdmin"],
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
  const { isAdmin } = req.body;

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

    await userToUpdate.save();

    res.status(200).json({ message: "User permissions updated successfully" });
  } catch (error) {
    console.error("Error updating user permissions:", error);
    res.status(500).json({ message: "Failed to update user permissions" });
  }
});

export default router;
