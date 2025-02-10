import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { MdAdminPanelSettings } from "react-icons/md";

const Navbar = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
  };

  return (
    <div className="sticky top-0 flex z-50 items-center justify-end gap-6 px-10 py-4 bg-background">
      <div className="flex items-center gap-2 font-medium text-white font-inter">
        <span>Olá,</span>
        <span>{user.name}</span>
      </div>
      <div className="w-0.5 h-8 bg-white" />
      <div className="flex items-center gap-2 font-medium text-white font-inter">
        <button
          onClick={handleLogout}
          className="px-4 py-1 font-medium text-white rounded-lg font-inter bg-primaryLight"
        >
          Log Out
        </button>
        {user.role === "admin" && (
            <Link to="/admin" className="text-3xl text-white">
              <MdAdminPanelSettings />
            </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
