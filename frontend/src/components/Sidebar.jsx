import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogoTropicalize from "../assets/logo-tropicalize.png";
import { useAuthStore } from "../store/useAuthStore";
import Menu from "./Menu";

const Sidebar = () => {
  const [adminMenu, setAdminMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  

  const handleAdminButton = () => {
    setAdminMenu(!adminMenu);
  };

  
  return (
    <div
      style={{ userSelect: "none" }}
      className="flex flex-col max-w-[350px] w-[300px] h-full gap-10 py-10 overflow-hidden shadow-lg sidebar bg-background"
    >
      <div className="px-3">
        <img
          src={LogoTropicalize}
          alt="logo-tropicalize"
          className="p-3 mx-auto border rounded-md"
        />
      </div>
      <div className="flex flex-col h-[90%] justify-between gap-0">
        <div className="px-4 mt-2">
          <Menu />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
