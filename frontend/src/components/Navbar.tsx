import { NavLink } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/logo.png";
import Logout from "../assets/logout.svg";
import { useAuth } from "../context/AuthContext";

const Navigation = () => {
  const { userName } = useAuth();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const loggedIn = userName != "";
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-slate-800 h-[100px] border-b border-sky-500 fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between px-10 w-full max-w-[1920px] mx-auto h-[100px]">
        {/* Left Section */}
        <div className="flex items-center gap-10">
          <button
            className="block lg:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {/* Hamburger Icon */}
            <div className="space-y-2">
              <span className="block w-8 h-0.5 bg-sky-500"></span>
              <span className="block w-8 h-0.5 bg-sky-500"></span>
              <span className="block w-8 h-0.5 bg-sky-500"></span>
            </div>
          </button>
          <div className="hidden lg:flex items-center gap-10">
            <NavLink
              to="/blog"
              aria-label="Blog"
              className="flex hover:text-sky-500 duration-300 p-2"
            >
              <div>Blog</div>
            </NavLink>
            <NavLink
              to="/games"
              aria-label="Games"
              className="flex hover:text-sky-500 duration-300 p-2"
            >
              <div>Games</div>
            </NavLink>
          </div>
        </div>

        {/* Center Section */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <NavLink to="/" aria-label="Strona Główna" className="flex">
            <img src={Logo} className="max-h-20" alt="logo" />
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex items-center gap-10">
          {loggedIn ? (
            <img
              src={Logout}
              alt="logout"
              className="w-10 cursor-pointer"
              onClick={logout}
            />
          ) : (
            <NavLink
              to="/login"
              aria-label="Log In"
              className="flex hover:text-sky-500 duration-300 p-3 w-full text-center"
              onClick={toggleMobileMenu}
            >
              <div>Log In</div>
            </NavLink>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-1/3 min-w-[200px] bg-slate-800 border-b border-r border-sky-500 flex flex-col items-center px-5 py-2 lg:hidden z-40">
            <NavLink
              to="/blog"
              aria-label="Blog"
              className="flex hover:text-sky-500 duration-300 p-3 w-full text-center"
              onClick={toggleMobileMenu}
            >
              <div>Blog</div>
            </NavLink>
            <NavLink
              to="/games"
              aria-label="Games"
              className="flex hover:text-sky-500 duration-300 p-3 w-full text-center"
              onClick={toggleMobileMenu}
            >
              <div>Games</div>
            </NavLink>

            {loggedIn ? (
              <div
                className="flex hover:text-sky-500 duration-300 p-3 w-full text-center cursor-pointer"
                onClick={() => {
                  toggleMobileMenu();
                  logout();
                }}
              >
                Log Out
              </div>
            ) : (
              <NavLink
                to="/login"
                aria-label="Log In"
                className="flex hover:text-sky-500 duration-300 p-3 w-full text-center"
                onClick={toggleMobileMenu}
              >
                <div>Log In</div>
              </NavLink>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
