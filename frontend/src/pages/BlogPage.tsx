import { useEffect, useState } from "react";
import Button from "../components/Button";
import PublicationItem from "../components/PublicationItem";

export interface Publication {
  id: number;
  title: string;
  abstract: string;
  content: string;
  authorName: string;
  likes: number;
  dislikes: number;
  image: string;
  createdAt: Date;
}

const BlogPage = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("/api/publications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data: Publication[] = await response.json();
          setPublications(data);
          setHasMore(data.length > visibleCount);
        } else {
          console.error("Failed to fetch publications");
        }
      } catch (error) {
        console.error("Error fetching publications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  const loadMore = () => {
    if (visibleCount < publications.length) {
      setVisibleCount((prevCount) => prevCount + 5);
      setHasMore(visibleCount + 5 < publications.length);
    }
  };

  return (
    <div className="flex w-full h-full p-10 justify-center">
      <div className="flex flex-col justify-center items-center w-full max-w-[1840px] gap-8">
        <h1 className="text-3xl">Blog</h1>
        {loading ? (
          <p>Loading publications...</p>
        ) : publications.length > 0 ? (
          <ul className="w-1/2 min-w-[300px]">
            {publications.slice(0, visibleCount).map((publication) => (
              <li
                key={publication.id}
                className="border-b p-4 mb-5 border-sky-500 shadow-md shadow-black relative group"
              >
                <div className="absolute inset-0 border border-transparent group-hover:border-sky-500 pointer-events-none duration-300"></div>
                <PublicationItem publication={publication} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No publications found.</p>
        )}
        {hasMore && <Button onClick={loadMore}>Load More</Button>}
      </div>
    </div>
  );
};

export default BlogPage;
