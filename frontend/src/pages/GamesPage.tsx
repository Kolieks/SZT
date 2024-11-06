import { useEffect, useState } from "react";
import Button from "../components/Button";
import GameItem from "../components/GameItem";

export interface Game {
  id: number;
  title: string;
  description: string;
  criticsRate: number;
  averageUserRate: number;
  producer: string;
  createdAt: Date;
}

const GamesPage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("/api/games", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data: Game[] = await response.json();
          setGames(data);
          setHasMore(data.length > visibleCount);
        } else {
          console.error("Failed to fetch games");
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const loadMore = () => {
    if (visibleCount < games.length) {
      setVisibleCount((prevCount) => prevCount + 6);
      setHasMore(visibleCount + 6 < games.length);
    }
  };

  return (
    <div className="flex w-full h-full p-10 justify-center">
      <div className="flex flex-col justify-center items-center w-full max-w-[1840px] gap-8">
        <h1 className="text-3xl">Games</h1>
        {loading ? (
          <p>Loading games...</p>
        ) : games.length > 0 ? (
          <ul className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 w-2/3 min-w-[300px] place-items-center">
            {games.slice(0, visibleCount).map((game) => (
              <li
                key={game.id}
                className="border-b border-r p-4 mb-5 border-sky-500 shadow-md shadow-black h-[200px] w-[300px] relative group"
              >
                <div className="absolute inset-0 border border-transparent group-hover:border-sky-500 pointer-events-none duration-300"></div>
                <GameItem game={game} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No games found.</p>
        )}
        {hasMore && <Button onClick={loadMore}>Load More</Button>}
      </div>
    </div>
  );
};

export default GamesPage;
