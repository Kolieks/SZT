import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Publication } from "../pages/BlogPage";
import { useNavigate } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import { FaceFrownIcon as FaceFrownIconSolid } from "@heroicons/react/24/solid";

interface PublicationItemProps {
  publication: Publication;
}

const PublicationItem = ({ publication }: PublicationItemProps) => {
  const [userVote, setUserVote] = useState<null | boolean>(null);
  const [likes, setLikes] = useState<number>(publication.likes);
  const [dislikes, setDislikes] = useState<number>(publication.dislikes);
  const { userName } = useAuth();
  const navigate = useNavigate();
  const loggedIn = userName != "";
  useEffect(() => {
    const fetchVoteStatus = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `/api/publications/${publication.id}/vote`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserVote(data.liked);
        }
      } catch (error) {
        console.error("Error fetching vote status:", error);
      }
    };

    fetchVoteStatus();
  }, [publication.id]);

  const handleVote = async (liked: boolean, event: React.MouseEvent) => {
    event.stopPropagation();
    const token = localStorage.getItem("token");
    if (userVote != null) {
      try {
        await fetch(`/api/publications/${publication.id}/vote`, {
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
    if (userVote == null || liked != userVote) {
      try {
        await fetch(`/api/publications/${publication.id}/vote`, {
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

  const handleClick = () => {
    navigate(`/publication/${publication.id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <div className="h-full absolute inset-0 overflow-hidden -z-10">
        <img
          src={`${publication.image}`}
          className="w-full h-full object-cover object-center group-hover:scale-150 duration-300"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      <h2 className="flex items-center justify-between gap-3 text-xl font-bold text-sky-500">
        {publication.title}
        <p className="text-gray-500 font-normal text-base">
          {new Date(publication.createdAt).toLocaleDateString()}
        </p>
      </h2>
      <p className="line-clamp-3">{publication.abstract}</p>
      <div className="flex gap-2 mt-2">
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
        <p className="flex items-center ml-auto text-gray-500">
          By {publication.authorName}
        </p>
      </div>
    </div>
  );
};

export default PublicationItem;
