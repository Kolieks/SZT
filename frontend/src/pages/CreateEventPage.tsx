import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const CreateEventPage = () => {
  const { isAdmin } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !date) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, date }),
      });

      if (!response.ok) {
        throw new Error("Failed to create event.");
      }

      setSuccess(true);
      setError(null);
      setTitle("");
      setDescription("");
      setDate("");
    } catch (err) {
      console.error(err);
      setError("Failed to create event.");
      setSuccess(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex w-full h-full p-10 justify-center">
        <div className="flex flex-col justify-center items-center w-full max-w-[1840px]">
          <div className="text-3xl">No permission.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full p-10 justify-center">
      <div className="flex flex-col w-full max-w-[800px] gap-6">
        <h1 className="text-3xl font-bold">Create New Event</h1>

        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-500">Event created successfully!</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            <span className="block font-medium">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-sky-500 px-3 py-2 rounded bg-transparent"
              placeholder="Event Title"
            />
          </label>

          <label>
            <span className="block font-medium">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-sky-500 px-3 py-2 bg-transparent rounded"
              placeholder="Event Description"
            ></textarea>
          </label>

          <label>
            <span className="block font-medium">Date</span>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-sky-500 px-3 py-2 rounded bg-transparent"
            />
          </label>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
