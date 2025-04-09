import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { MdAdminPanelSettings } from "react-icons/md";
import messages from "../assets/messages.png";
import notification from "../assets/notification.png";
import person from "../assets/person.png";
import { FaChevronDown } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";

const NavbarV2 = () => {
  const { user, logout } = useAuthStore();
  const [isOpenDropDown, setIssOpenDropDown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Tem certeza que quer sair?");
    if (confirmLogout) {
      logout();
      localStorage.removeItem("user");
    }
  };

  const handleOpenDropDown = () => {
    setIssOpenDropDown(!isOpenDropDown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIssOpenDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="sticky top-0 flex z-40 items-start justify-end gap-12 px-10 pt-9 bg-[#FAFBFC] font-roboto">
      <div className="flex items-center gap-10">
        <img src={messages} alt="messages" />
        <img src={notification} alt="notification" />
      </div>
      <div
        onClick={handleOpenDropDown}
        className="flex items-start gap-4 relative cursor-pointer pr-10"
        ref={dropdownRef}
      >
        <div>
          <img
            src={person}
            alt="person"
            className="w-[52px] h-[52px] rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-black font-bold text-base">{user.name}</p>
          <p className="text-[#737791] font-light text-sm text-right">
            {user.role}
          </p>
        </div>

        {user.role === "admin" && isOpenDropDown && (
          <div className="w-[200px] py-4 bg-white rounded-lg absolute top-16 right-0 duration-700 border border-gray-300">
            <div className="flex items-center gap-2 hover:bg-gray-100 px-1 cursor-pointer">
              <Link
                to="/admin"
                className="flex items-center gap-2 hover:bg-gray-100 p-2"
                onClick={handleOpenDropDown}
              >
                <MdAdminPanelSettings className="text-xl text-gray-700" />
                <p className="text-black">Painel Admin</p>
              </Link>
            </div>
            <div
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-gray-100 py-2 px-4 cursor-pointer"
            >
              <FaSignOutAlt className="text-lg text-gray-700" />
              <p>Logout</p>
            </div>
          </div>
        )}
        {user.role !== "admin" && isOpenDropDown && (
          <div className="w-[200px] py-4 bg-white rounded-lg absolute top-16 right-0 duration-700 border border-gray-300">
            <div
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-gray-100 py-2 px-4 cursor-pointer"
            >
              <FaSignOutAlt className="text-lg text-gray-700" />
              <p>Logout</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarV2;
