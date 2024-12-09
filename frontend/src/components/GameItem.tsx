import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Game } from "../pages/GamesPage";
import { useNavigate } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

interface GameItemProps {
  game: Game;
}

const GameItem = ({ game }: GameItemProps) => {
  const [userRate, setUserRate] = useState<number | null>(null);
  const [isFavourite, setIsFavourite] = useState<boolean>(false);

  const { userName } = useAuth();
  const navigate = useNavigate();
  const loggedIn = userName !== "";

  useEffect(() => {
    const fetchRateStatus = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`/api/games/${game.id}/rate`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUserRate(data.rating);
        }
      } catch (error) {
        console.error("Error fetching rate status:", error);
      }
    };

    if (loggedIn) {
      fetchRateStatus();
    }
  }, [game.id, loggedIn]);

  useEffect(() => {
    const fetchFavouriteStatus = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`/api/games/${game.id}/favourite`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setIsFavourite(data.isFavourite);
        }
      } catch {
        setIsFavourite(false);
      }
    };

    if (loggedIn) {
      fetchFavouriteStatus();
    }
  }, [game.id, loggedIn]);

  const handleFavourite = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const token = localStorage.getItem("token");
    try {
      if (isFavourite) {
        await fetch(`/api/games/${game.id}/favourite`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await fetch(`/api/games/${game.id}/favourite`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
      setIsFavourite(!isFavourite);
    } catch (error) {
      console.error("Error updating favourite status:", error);
    }
  };

  const handleRating = async (rating: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const token = localStorage.getItem("token");
    if (userRate != null) {
      try {
        await fetch(`/api/games/${game.id}/rate`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserRate(null);
      } catch (error) {
        console.error("Error removing vote:", error);
      }
    }
    if (userRate == null || rating != userRate) {
      try {
        await fetch(`/api/games/${game.id}/rate`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating }),
        });
        setUserRate(rating);
      } catch (error) {
        console.error("Error voting:", error);
      }
    }
  };

  const handleClick = () => {
    navigate(`/game/${game.id}`);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`${
            userRate !== null && userRate >= i
              ? "text-yellow-400"
              : "text-gray-300"
          } ${loggedIn ? "cursor-pointer" : "cursor-default"}`}
          onClick={(event) => {
            if (loggedIn) {
              handleRating(i, event);
            }
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center cursor-pointer h-full px-4 pt-2 group"
    >
      <div className="h-3/5 absolute inset-[1px] overflow-hidden -z-10">
        <img
          src={`${game.image}`}
          className="group-hover:scale-150 duration-300"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      <button
        disabled={!loggedIn}
        onClick={handleFavourite}
        className="absolute top-2 right-2"
      >
        {isFavourite ? (
          <HeartIconSolid className="h-5 w-5 text-red-500" />
        ) : (
          <HeartIcon className="h-5 w-5 text-gray-300" />
        )}
      </button>
      <h2 className="text-xl font-bold text-sky-500 mb-2 line-clamp-1">
        {game.title}
      </h2>
      <p className="line-clamp-3 mb-2">{game.description}</p>
      <div className="flex w-full justify-between mt-auto">
        <p className="text-sm font-medium text-gray-700">
          Critics':
          <span
            className={`ml-1 ${
              game.criticsRate > 4.9
                ? "text-sky-500"
                : game.criticsRate >= 4.0
                ? "text-green-500 "
                : game.criticsRate > 2.5
                ? "text-amber-500 "
                : "text-red-500 "
            }`}
          >
            {game.criticsRate} <span className="text-yellow-400">★</span>
          </span>
        </p>
        <p className="text-sm font-medium text-gray-700">
          Users':
          <span
            className={`ml-1 ${
              game.averageUserRate > 4.9
                ? "text-sky-500"
                : game.averageUserRate >= 4.0
                ? "text-green-500 "
                : game.averageUserRate > 2.5
                ? "text-amber-500 "
                : "text-red-500 "
            }`}
          >
            {game.averageUserRate} <span className="text-yellow-400">★</span>
          </span>
        </p>
      </div>
      <div className="flex gap-1 justify-center">{renderStars()}</div>
    </div>
  );
};

export default GameItem;
