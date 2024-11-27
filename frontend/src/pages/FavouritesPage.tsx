import { useEffect, useState } from "react";
import Button from "../components/Button";
import GameItem from "../components/GameItem";
import { useAuth } from "../context/AuthContext";
import { Game } from "./GamesPage";

interface Favourite {
  id: number;
  game: Game;
}

const FavouritesPage = () => {
  const { userId } = useAuth();
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/users/${userId}/favourites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data: Favourite[] = await response.json();
          setFavourites(data);
          setHasMore(data.length > visibleCount);
        } else {
          console.error("Failed to fetch favourites");
        }
      } catch (error) {
        console.error("Error fetching favourites:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && !favourites.length) {
      fetchFavourites();
    }
  }, [userId]); // removed visibleCount from dependencies

  const loadMore = () => {
    if (visibleCount < favourites.length) {
      setVisibleCount((prevCount) => prevCount + 6);
      setHasMore(visibleCount + 6 < favourites.length);
    }
  };
  return (
    <div className="flex w-full h-full p-10 justify-center">
      <div className="flex flex-col justify-center items-center w-full max-w-[1840px] gap-8">
        <h1 className="text-3xl">Favourites</h1>
        {loading ? (
          <p>Loading favourites...</p>
        ) : favourites.length > 0 ? (
          <ul className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 w-2/3 min-w-[300px] place-items-center">
            {favourites.slice(0, visibleCount).map((game) => (
              <li
                key={game.id}
                className="border-b border-r p-4 mb-5 border-sky-500 shadow-md shadow-black h-[200px] w-[300px] relative group"
              >
                <div className="absolute inset-0 border border-transparent group-hover:border-sky-500 pointer-events-none duration-300"></div>
                <GameItem game={game.game} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No favourites found.</p>
        )}
        {hasMore && <Button onClick={loadMore}>Load More</Button>}
      </div>
    </div>
  );
};

export default FavouritesPage;
