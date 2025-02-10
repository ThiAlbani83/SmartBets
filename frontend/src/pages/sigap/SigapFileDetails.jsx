import { useState } from "react";
import DetailsTable from "../sigap/DetailsApostador";
import { useLocation } from "react-router-dom";

const SigapFileDetails = () => {
  const location = useLocation();
  const fileData = location.state?.fileData;
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="w-full h-full flex flex-col gap-10 relative font-roboto">
      <div className="flex items-center justify-between w-full h-fit"></div>
      <div className="absolute -top-28 -left-10 px-5 py-2 z-50 border border-linesAndBorders rounded-xl shadow-sm">
        <h2 className="text-mainText font-bold">Detalhes do Arquivo - SIGAP</h2>
        <p>Arquivo: {fileData?.fileName}</p>
      </div>
      <div className="flex items-center gap-20">
        <span className="text-mainText font-medium text-xl">
          Dados dos Apostadores{" "}
        </span>
      </div>
      <DetailsTable currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default SigapFileDetails;
