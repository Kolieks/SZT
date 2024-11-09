import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navigation from "./components/Navbar";
import HomePage from "./pages/HomePage.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import BlogPage from "./pages/BlogPage.tsx";
import GamesPage from "./pages/GamesPage.tsx";
import PublicationPage from "./pages/PublicationPage.tsx";
import GamePage from "./pages/GamePage.tsx";
import FavouritesPage from "./pages/FavouritesPage.tsx";

const App = () => {
  const location = useLocation();
  const path = location.pathname;
  if (!path) {
    return <div>Loading...</div>;
  }
  return (
    <AuthProvider>
      <div className="w-full h-full">
        <div className="flex flex-col justify-center w-full max-w-[1920px] mx-auto">
          <div className="">
            <Navigation />
          </div>
          <div className="flex-grow pt-[100px]">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/publication/:id" element={<PublicationPage />} />
              <Route path="/game/:id" element={<GamePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/favourites" element={<FavouritesPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;
