import React, { useState } from "react";
import MenuV2 from "./MenuV2";
import MenuSigap from "../pages/sigap/MenuSigap";
import { useAuthStore } from "../store/useAuthStore.js";
import logotplz from "../assets/logo-tropicalize.png";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuthStore();

  return (
    <div
      style={{ userSelect: "none" }}
      className={`relative flex flex-col h-[96%] m-5 rounded-xl ${
        !expanded ? "max-w-[270px]" : "max-w-[113px] flex-1"
      } min-w-[270px] gap-10 py-10 overflow-hidden sidebar bg-secondary transition-all duration-700`}
    >
      <div className="flex flex-col h-[90%] justify-between gap-0">
        <div className="px-4 mt-2">
            <MenuV2 expanded={expanded} setExpanded={setExpanded} />
        </div>
        <div className="flex flex-col gap-2 absolute bottom-10 w-full">
          <img src={logotplz} alt="logo-tropicalize" className="px-10" />
          <p className="text-[11px] text-center text-white">Transformando o mercado de iGaming no Brasil</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
