import { useState, useEffect } from "react";
import { XMLParser } from "fast-xml-parser";
import graph1 from "../../assets/graph1.png";
import graph2 from "../../assets/graph2.png";
import graph3 from "../../assets/graph3.png";
import graph4 from "../../assets/graph4.png";
import graph5 from "../../assets/graph5.png";
import graph6 from "../../assets/graph6.png";
import graph7 from "../../assets/graph7.png";
import graph8 from "../../assets/graph8.png";
import graph9 from "../../assets/graph9.png";
import BarGraphs from "../../components/sigap/BarGraphs";
import LineGraphWinLoose from "../../components/sigap/LineGraphWinLoose";
import BarGraphsBetTypes from "../../components/sigap/BarGraphsBetTypes";
import BarGraphsGenero from "../../components/sigap/BarGraphsGenero";
import BarGraphsStatusBet from "../../components/sigap/BarGraphsStatusBet";
import BarGraphsTopSports from "../../components/sigap/BarGraphsTopSports";
import LineGraphsDailyBets from "../../components/sigap/LineGraphsDailyBets";

const HomeSigap = () => {

  return (
    <div className="w-full h-full flex relative font-roboto">
      <div className="flex w-full flex-wrap gap-10 overflow-y-scroll overflow-hidden">
        <BarGraphs />
        <LineGraphWinLoose />
        <BarGraphsBetTypes />
        <BarGraphsGenero />
        <BarGraphsStatusBet />
        <BarGraphsTopSports />
        <LineGraphsDailyBets />
      </div>
      <div className="absolute -top-28 -left-10 px-5 py-2 z-50 border border-linesAndBorders rounded-xl shadow-sm">
        <h2 className="text-mainText font-bold">Visão Geral - SIGAP</h2>
      </div>
    </div>
  );
};

export default HomeSigap;
