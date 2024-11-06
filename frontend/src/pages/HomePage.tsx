import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { userName } = useAuth();
  return (
    <div className="flex w-full h-full p-10 justify-center">
      <div className="flex flex-col justify-center items-center w-full max-w-[1840px] gap-8">
        <h1 className="text-3xl">Cześć {userName}!</h1>
        <div className="flex flex-col gap-2">Pustka</div>
      </div>
    </div>
  );
};

export default HomePage;
