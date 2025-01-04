import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const EditPublicationPage = () => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPublication = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in to edit a publication.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`/api/publications/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setAbstract(data.abstract);
          setContent(data.content);
          setImage(data.image);
        } else {
          alert("Failed to load publication data.");
          navigate("/blog");
        }
      } catch (error) {
        console.error("Error fetching publication:", error);
        alert("An error occurred while loading the publication.");
        navigate("/blog");
      }
    };

    fetchPublication();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !abstract || !content) {
      alert("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/publications/${id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          abstract,
          content,
          image,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the publication.");
      }

      alert("Publication updated successfully!");
      navigate("/blog");
    } catch (error) {
      console.error("Error updating publication:", error);
      alert("An error occurred while updating the publication.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="w-full h-full text-4xl flex justify-center items-center">
        You have no permission to be here.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Publication</h1>
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
        <Button type="submit">Save Changes</Button>
        <Button type="button" onClick={() => navigate("/blog")}>
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default EditPublicationPage;
