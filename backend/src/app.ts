import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { sequelize } from "./models";
import authRoutes from "./routes/auth";
import commentsRoutes from "./routes/comments";
import gameRoutes from "./routes/game";
import publicationRoutes from "./routes/publication";
import favouritesRouter from "./routes/favourites";
import adminRouter from "./routes/admin";
import eventRouter from "./routes/event";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use("/api", authRoutes);
app.use("/api", gameRoutes);
app.use("/api", publicationRoutes);
app.use("/api", commentsRoutes);
app.use("/api", favouritesRouter);
app.use("/api", adminRouter);
app.use("/api", eventRouter);

const uploadsPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));
app.use(express.static(path.join(__dirname, "../../frontend")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend", "index.html"));
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync();
    console.log("Database synchronized.");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
