// src/components/CommentItem.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Comment } from "../pages/PublicationPage";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import { FaceFrownIcon as FaceFrownIconSolid } from "@heroicons/react/24/solid";

interface CommentItemProps {
  comment: Comment;
  entityId: number;
  entityType: number;
}

const CommentItem = ({ comment, entityId, entityType }: CommentItemProps) => {
  const [userVote, setUserVote] = useState<null | boolean>(null);
  const [likes, setLikes] = useState<number>(comment.likes);
  const [dislikes, setDislikes] = useState<number>(comment.dislikes);
  const [authorVisible, setAuthorVisible] = useState<boolean | null>(null);
  const [deleted, setDeleted] = useState<boolean>(false);
  const { userName, isAdmin } = useAuth();
  const loggedIn = userName !== "";

  useEffect(() => {
    const fetchAuthorVisibility = async () => {
      try {
        const response = await fetch(`/api/user/${comment.userId}`);
        if (response.ok) {
          const data = await response.json();
          setAuthorVisible(data.isVisible);
        } else {
          console.error("Failed to fetch author visibility.");
        }
      } catch (error) {
        console.error("Error fetching author visibility:", error);
      }
    };

    fetchAuthorVisibility();
  }, [comment.userId]);

  useEffect(() => {
    const fetchVoteStatus = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`/api/comments/${comment.id}/vote`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUserVote(data.liked);
        }
      } catch (error) {
        console.error("Error fetching vote status:", error);
      }
    };

    if (loggedIn) {
      fetchVoteStatus();
    }
  }, [comment.id, loggedIn]);

  const handleVote = async (liked: boolean, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!loggedIn) {
      alert("You need to log in to vote.");
      return;
    }
    const token = localStorage.getItem("token");
    if (userVote != null) {
      // Remove existing vote
      try {
        await fetch(`/api/comments/${comment.id}/vote`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (userVote) {
          setLikes((prev) => prev - 1);
        } else {
          setDislikes((prev) => prev - 1);
        }
        setUserVote(null);
      } catch (error) {
        console.error("Error removing vote:", error);
      }
    }
    if (userVote == null || liked !== userVote) {
      // Add new vote
      try {
        await fetch(`/api/comments/${comment.id}/vote`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ liked }),
        });
        if (liked) {
          setLikes((prev) => prev + 1);
        } else {
          setDislikes((prev) => prev + 1);
        }
        setUserVote(liked);
      } catch (error) {
        console.error("Error voting:", error);
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const token = localStorage.getItem("token");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `/api/${
          entityType == 0 ? "publications" : "games"
        }/${entityId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the comment. Please try again.");
      }
      setDeleted(true);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("An error occurred while deleting the comment.");
    }
  };

  if (deleted) {
    return (
      <li className="flex flex-col gap-1 border border-sky-500 p-4 rounded shadow-sm">
        <p className="text-gray-500">Comment has been deleted.</p>
      </li>
    );
  }

  if (!authorVisible) {
    return (
      <li className="flex flex-col gap-1 border border-sky-500 p-4 rounded shadow-sm">
        <p className="text-gray-500">User has been blocked</p>
        {isAdmin && (
          <button
            className="text-red-600 hover:text-red-800 duration-300 flex items-center ml-auto"
            onClick={() => handleDeleteComment(comment.id)}
            title="Delete Comment"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-1 border border-sky-500 p-4 rounded shadow-sm">
      <div className="break-words">{comment.content}</div>
      <p className="text-sm text-gray-500">
        By {comment.authorName} -{" "}
        {new Date(comment.createdAt).toLocaleDateString()}
      </p>
      <div className="flex gap-4 mt-2">
        {/* Like Button */}
        <button
          className={`duration-300 flex items-center ${
            userVote === true
              ? "text-red-500"
              : loggedIn
              ? "hover:text-red-500 text-gray-500"
              : "text-gray-500 cursor-default"
          }`}
          onClick={(event) => handleVote(true, event)}
          disabled={!loggedIn}
        >
          {userVote === true ? (
            <HeartIconSolid className="h-5 w-5" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
          <span className="ml-1">{likes}</span>
        </button>

        {/* Dislike Button */}
        <button
          className={`duration-300 flex items-center ${
            userVote === false
              ? "text-amber-600"
              : loggedIn
              ? "hover:text-amber-600 text-gray-500"
              : "text-gray-500 cursor-default"
          }`}
          onClick={(event) => handleVote(false, event)}
          disabled={!loggedIn}
        >
          {userVote === false ? (
            <FaceFrownIconSolid className="h-5 w-5" />
          ) : (
            <FaceFrownIcon className="h-5 w-5" />
          )}
          <span className="ml-1">{dislikes}</span>
        </button>
        {isAdmin && (
          <button
            className="text-red-600 hover:text-red-800 duration-300 flex items-center ml-auto"
            onClick={() => handleDeleteComment(comment.id)}
            title="Delete Comment"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </li>
  );
};

export default CommentItem;
