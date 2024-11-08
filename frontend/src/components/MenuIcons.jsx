// MenuIcon.js
import React from "react";
import { FiUserPlus } from "react-icons/fi";
import {
  LuDollarSign,
  LuHeadphones,
  LuHome,
  LuPlus,
  LuSearch,
  LuSearchCheck,
  LuSearchCode,
  LuShoppingBasket,
  LuShoppingCart,
  LuUploadCloud,
} from "react-icons/lu";
import { BiPurchaseTag } from "react-icons/bi";
import sortteBetLogo from "../assets/logo-sorttebet.png";
import betfiveLogo from "../assets/logo-betfive.png";
import jetbetLogo from "../assets/logo-jetbet.png";
import pinbetLogo from "../assets/logo-pinbet.png";

const MenuIcons = ({ icon }) => {
  switch (icon) {
    /* case 'home':
      return <LuHome size={22} />;
    case 'items':
      return <LuShoppingBasket size={22} />;
    case 'fornecedores':
      return <FiUserPlus size={22} />; */
    case "adicionar":
      return <LuPlus size={18} />;
    case "pesquisar":
      return <LuSearch size={18} />;
    case "historico":
      return <LuSearchCheck size={18} />;
    case "pendentes":
      return <LuSearchCode size={18} />;
    /* case "betfive":
      return <img src={betfiveLogo} alt="Logo betfive" className="w-[22px]" />;
    case "jetbet":
      return <img src={jetbetLogo} alt="Logo jetbet" className="w-[22px]" />;
    case "pinbet":
      return <img src={pinbetLogo} alt="Logo pinbet" className="w-[22px]" />; */
    default:
      return null;
  }
};

export default MenuIcons;
