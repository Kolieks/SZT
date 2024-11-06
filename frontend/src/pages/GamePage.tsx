import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { Game } from "./GamesPage";
import CommentItem from "../components/CommentItem";

export interface Comment {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
  likes: number;
  dislikes: number;
}

const GamePage = () => {
  const { userName } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/games/${id}`);
        if (response.ok) {
          const data = await response.json();
          setGame(data);
        } else {
          setError("Failed to fetch game");
        }
      } catch (error) {
        setError("An error occurred while fetching the game");
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/games/${id}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchGame();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/games/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments((prevComments) => [data, ...prevComments]);
        setNewComment("");
      } else {
        console.error("Failed to create comment");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!game) {
    return;
  }

  console.log(game);

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col justify-center items-center mt-10 w-2/3 min-w-[300px]">
        <h1 className="text-3xl relative mb-8">
          {game.title}
          <p className="text-gray-500 absolute text-base right-0 bottom-[-30px]">
            {game.producer}
          </p>
          <p className="text-gray-500 absolute text-base left-0 bottom-[-30px]">
            {new Date(game.createdAt).toLocaleDateString()}
          </p>
        </h1>

        <div className="mt-4 text-lg">{game.description}</div>
        <div className="mt-8 w-1/2 min-w-[300px]">
          <h2 className="text-2xl">Comments</h2>
          {userName && (
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full border p-2 rounded bg-slate-900 border-sky-500"
                rows={4}
              />
              <Button type="submit">Comment</Button>
            </form>
          )}
          {comments.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
