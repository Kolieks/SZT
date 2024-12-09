import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const CreatePublicationPage = () => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !abstract || !content) {
      alert("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in to create a publication.");
      return;
    }

    try {
      const response = await fetch("/api/publications/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          abstract: abstract,
          content: content,
          image: image,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create publication. Please try again.");
      }

      alert("Publication created successfully!");
      navigate(`/blog`);
    } catch (error) {
      console.error("Error creating publication:", error);
      alert("An error occurred while creating the publication.");
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
      <h1 className="text-2xl font-bold mb-4">Create a New Publication</h1>
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
          <label htmlFor="abstract" className="block text-sm font-medium">
            Abstract <span className="text-red-500">*</span>
          </label>
          <textarea
            id="abstract"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            className="w-full border p-2 rounded bg-transparent border-sky-500"
            rows={3}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded bg-transparent border-sky-500"
            rows={6}
            required
          ></textarea>
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

export default CreatePublicationPage;
