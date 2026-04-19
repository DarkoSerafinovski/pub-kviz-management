import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const { role } = user;

  if (role === "team") {
  }

  const naziv = role === "team" ? user.team.naziv : user.user_metadata.naziv;

  const navigationConfig = {
    moderator: [{ name: "Sve Sezone", path: "/sezone" }],

    team: [
      { name: "Sve Sezone", path: "/sezone" },
      { name: "Statistika Tima", path: "/statistika" },
      { name: "Lokacija", path: "/lokacija" },
    ],

    guest: [{ name: "Sve Sezone", path: "/sezone" }],
  };

  const currentLinks = navigationConfig[role] || navigationConfig["guest"];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-8">
          {currentLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          {!role || role === "guest" ? (
            <div className="flex items-center gap-4">
              <Link
                className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              >
                Prijava
              </Link>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
                to="/register"
                className="bg-gray-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md shadow-gray-200"
              >
                Registruj Tim
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-5 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-gray-400 leading-none">
                  Dobrodošli,
                </p>
                <p className="text-sm font-black text-gray-900 tracking-tighter capitalize">
                  {naziv}
                </p>
              </div>
              <Button
                variant="danger"
                className="h-10 px-4 text-[10px] font-black uppercase tracking-widest"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
