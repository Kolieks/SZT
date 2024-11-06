import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Game } from "../pages/GamesPage";
import { useNavigate } from "react-router-dom";

interface GameItemProps {
  game: Game;
}

const GameItem = ({ game }: GameItemProps) => {
  const [userRate, setUserRate] = useState<number | null>(null);
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

  const handleRating = async (rating: number) => {
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
          onClick={() => {
            if (loggedIn) {
              handleRating(i);
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
      className="flex flex-col items-center cursor-pointer"
    >
      <h2 className="text-xl font-bold text-sky-500 mb-2 line-clamp-1">
        {game.title}
      </h2>
      <p className="line-clamp-3 mb-2">{game.description}</p>
      <div className="flex w-full justify-between">
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
      <div className="flex gap-1 mt-auto justify-center">{renderStars()}</div>
    </div>
  );
};

export default GameItem;
