import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { Publication } from "../pages/BlogPage";
import CommentItem from "../components/CommentItem";

export interface Comment {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
  likes: number;
  dislikes: number;
}

const PublicationPage = () => {
  const { userName, isAdmin } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const response = await fetch(`/api/publications/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPublication(data);
        } else {
          setError("Failed to fetch publication");
        }
      } catch {
        setError("An error occurred while fetching the publication");
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/publications/${id}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchPublication();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/publications/${id}/comments`, {
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

  if (!publication) {
    return;
  }

  const handlePublicationEditButton = () => {
    navigate(`/publication/${id}/edit`);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col justify-center items-center mt-10 w-2/3 min-w-[300px]">
        <div className="fixed inset-0 -z-10">
          <img src={`${publication.image}`} className="w-full h-full" />
          <div className="fixed inset-0 bg-black/80"></div>
        </div>
        {isAdmin && (
          <Button onClick={handlePublicationEditButton}>Edit</Button>
        )}
        <h1 className="text-3xl relative mb-8">
          {publication.title}{" "}
          <p className="text-gray-500 absolute text-base right-0 bottom-[-30px]">
            By {publication.authorName}
          </p>
          <p className="text-gray-500 absolute text-base left-0 bottom-[-30px]">
            {new Date(publication.createdAt).toLocaleDateString()}
          </p>
        </h1>

        <div className="mt-4 text-lg">{publication.content}</div>
        <div className="mt-8 w-1/2 min-w-[300px]">
          <h2 className="text-2xl">Comments</h2>
          {userName && (
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full border p-2 rounded bg-transparent border-sky-500"
                rows={4}
              />
              <Button type="submit">Comment</Button>
            </form>
          )}
          {comments.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  entityId={publication.id}
                  entityType={0}
                />
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

export default PublicationPage;
