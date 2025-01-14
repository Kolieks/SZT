// src/routes/auth.ts
import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { User } from "../models";
dotenv.config();

const router = Router();
const SECRET_KEY = process.env.SECRET_KEY!;

export interface UserRequest extends Request {
  userId: number;
}

// Register
router.post("/register", async (req, res) => {
  let { email, name, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "No email or password" });
  }
  email = email.toLowerCase();
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      name,
      password: hashedPassword,
      isAdmin: false,
      isVisible: true,
      lastLogin: new Date(),
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "No email or password" });
  }
  email = email.toLowerCase();
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    await user.update({ lastLogin: new Date() });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "30d" });
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export function extractToken(
  request: Request,
  res: Response,
  next: NextFunction
) {
  const req = request as UserRequest;
  const header = req.headers["authorization"];

  if (!header) {
    return res.sendStatus(401);
  }

  const bearer = header.split(" ");
  const token = bearer[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY!, (err, data: any) => {
    if (err) {
      console.log(err);
      return res.sendStatus(401);
    }

    if (!data.id) {
      return res.sendStatus(401);
    }

    req.userId = data.id;
    return next();
  });
}

router.get("/info", extractToken, async (request, res) => {
  const req = request as UserRequest;
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isVisible: user.isVisible,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Failed to fetch user info" });
  }
});

export default router;
