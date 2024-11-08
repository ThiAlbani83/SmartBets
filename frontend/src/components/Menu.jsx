import { useState } from "react";
import { Link } from "react-router-dom";
import {
  fullMenu,
  menuSac,
  menuMarketingBetfive,
  menuMarketingPinbet,
} from "../utils/menuData";
import MenuIcon from "./MenuIcons";
import { useAuthStore } from "../store/useAuthStore";

const Menu = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeSubIndices, setActiveSubIndices] = useState({});
  const [activeSubSubIndices, setActiveSubSubIndices] = useState({});
  const { user } = useAuthStore();

  // Determine which menu to display based on the user role
  const getMenuItems = () => {
    switch (user.role) {
      case "sac":
        return menuSac;
      case "admin":
        return fullMenu;
      case "mktB5":
        return menuMarketingBetfive;
      case "mktPin":
        return menuMarketingPinbet;
      default:
        return fullMenu;
      }
  };

  // Toggle the active state of the menu item and its submenu
  const toggleMenu = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
    setActiveSubIndices({});
    setActiveSubSubIndices({});
  };

  // Toggle the active state of the submenu item and its subsubmenu
  const toggleSubmenu = (menuIndex, subIndex) => {
    setActiveSubIndices((prevState) => ({
      ...prevState,
      [menuIndex]: prevState[menuIndex] === subIndex ? null : subIndex,
    }));
    setActiveSubSubIndices({});
  };

  /// Toggle the active state of the subsubmenu item
  const toggleSubSubmenu = (menuIndex, subIndex, subSubIndex) => {
    setActiveSubSubIndices((prevState) => ({
      ...prevState,
      [`${menuIndex}-${subIndex}`]:
        prevState[`${menuIndex}-${subIndex}`] === subSubIndex
          ? null
          : subSubIndex,
    }));
  };

  // Get the menu items based on the user role
  const menuItems = getMenuItems();

  return (
    <div className="flex flex-col gap-8">
      <Link
        to="/"
        onClick={() => setActiveIndex(null)}
        className="px-4 text-[16px] tracking-wider text-gray-200 cursor-pointer font-inter flex items-center gap-4"
      >
        <MenuIcon icon="home" />
        <span>Início</span>
      </Link>
      <ul className="flex flex-col gap-4 px-4 my-4">
        {menuItems.map((item, index) => (
          <li key={index} className="space-y-6">
            <div
              onClick={() => toggleMenu(index)}
              className="flex items-center gap-4 text-[16px] tracking-wider text-gray-200 cursor-pointer font-inter"
            >
              <MenuIcon icon={item.icon} />
              {item.title}
            </div>
            {activeIndex === index && item.subItems && (
              <ul className="px-4 space-y-4 transition-all duration-500">
                {item.subItems.map((subItem, subIndex) => (
                  <li key={subIndex} className="flex flex-col gap-2">
                    <div
                      onClick={() => toggleSubmenu(index, subIndex)}
                      className="flex items-center gap-4 text-[15px] tracking-wider text-gray-200 cursor-pointer font-inter"
                    >
                      <MenuIcon icon={subItem.icon} />
                      {subItem.title}
                    </div>
                    {activeSubIndices[index] === subIndex &&
                      subItem.subItems && (
                        <ul className="px-2 space-y-4 text-sm">
                          {subItem.subItems.map((subSubItem, subSubIndex) => (
                            <li
                              onClick={() =>
                                toggleSubSubmenu(index, subIndex, subSubIndex)
                              }
                              key={subSubIndex}
                              className={
                                activeSubSubIndices[`${index}-${subIndex}`] ===
                                subSubIndex
                                  ? "text-primaryLight"
                                  : "text-gray-300" 
                              }
                            >
                              <Link to={subSubItem.link} className="flex items-center gap-2">
                                <MenuIcon icon={subSubItem.icon} />
                                {subSubItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
