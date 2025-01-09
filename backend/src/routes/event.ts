import { Router } from "express";
import Event from "../models/Event";

const router = Router();

// Fetch all events
router.get("/events", async (req, res) => {
  try {
    const events = await Event.findAll({ order: [["date", "ASC"]] });
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// Create a new event
router.post("/events", async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const event = await Event.create({ title, description, date });
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Failed to create event." });
  }
});

// Delete an event by ID
router.delete("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Event.destroy({ where: { id } });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
});

export default router;
