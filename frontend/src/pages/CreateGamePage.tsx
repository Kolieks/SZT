import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const CreateGamePage = () => {
  const [title, setTitle] = useState("");
  const [producer, setProducer] = useState("");
  const [description, setDescription] = useState("");
  const [criticsRate, setCriticsRate] = useState(0);
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !producer || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in to create a game.");
      return;
    }

    try {
      const response = await fetch("/api/games/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          producer: producer,
          image: image,
          criticsRate: criticsRate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create game. Please try again.");
      }

      alert("Game created successfully!");
      navigate(`/games`);
    } catch (error) {
      console.error("Error creating game:", error);
      alert("An error occurred while creating the game.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="w-full h-full text-4xl justify-center flex">
        You have no permission to be here.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Game</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded bg-transparent border-sky-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Producer <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded bg-transparent border-sky-500"
            rows={6}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="producer" className="block text-sm font-medium">
            Producer <span className="text-red-500">*</span>
          </label>
          <textarea
            id="producer"
            value={producer}
            onChange={(e) => setProducer(e.target.value)}
            className="w-full border p-2 rounded bg-transparent border-sky-500"
            rows={1}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="criticsRate" className="block text-sm font-medium">
            Producer Rating (1-5) <span className="text-red-500">*</span>
          </label>
          <input
            id="criticsRate"
            type="number"
            value={criticsRate}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value >= 1 && value <= 5) {
                setCriticsRate(value);
              } else if (e.target.value === "") {
                setCriticsRate(0);
              }
            }}
            className="w-full border p-2 rounded bg-transparent border-sky-500"
            min="1"
            max="5"
            step="0.1"
            required
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium">
            Image
          </label>
          <textarea
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border p-2 rounded bg-transparent border-sky-500"
            rows={1}
          ></textarea>
        </div>
        <Button type="submit">Publish</Button>
      </form>
    </div>
  );
};

export default CreateGamePage;
