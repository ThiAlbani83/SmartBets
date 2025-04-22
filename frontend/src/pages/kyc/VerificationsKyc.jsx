import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { FaChevronDown } from "react-icons/fa";
import calendar from "../../assets/calendar.png";
/* import VerificationsTable from "../../components/kyc/VerificationsTable"; */

const VerificationsKyc = () => {
  const [selectedCompany, setSelectedCompany] = useState("Empresa");
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [selectedDate, setSelectedDate] = useState(null);

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  return (
    <div className="w-full h-full flex flex-col relative font-roboto ">
      <div className="absolute -top-28 -left-10 px-5 py-2 z-50 border border-linesAndBorders rounded-xl shadow-sm">
        <h2 className="text-mainText font-bold">Verificações - KYC</h2>
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4 w-full">
          <div className="relative">
            <select
              value={selectedCompany}
              onChange={handleCompanyChange}
              className="px-4 py-1 pr-4 border w-[110px] border-linesAndBorders rounded-lg shadow-sm text-mainText focus:outline-none focus:ring-0 appearance-none cursor-pointer"
            >
              <option value="Empresa">Empresa</option>
              <option value="Bet4">Bet4</option>
              <option value="BetWarrior">BetWarrior</option>
              <option value="BetBalanço">BetBalanço</option>
            </select>
            <div className="absolute top-[12px] right-0 flex items-center px-2 pointer-events-none">
              <FaChevronDown className="text-mainText w-4 h-3" />
            </div>
          </div>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="px-3 py-1 border w-[110px] border-linesAndBorders rounded-lg shadow-sm text-mainText focus:outline-none focus:ring-0 appearance-none cursor-pointer"
            >
              <option value="Empresa">Status</option>
              <option value="Bet4">Aprovado</option>
              <option value="BetWarrior">Reprovado</option>
              <option value="BetBalanço">Análise Manual</option>
            </select>
            <div className="absolute top-[12px] right-0 flex items-center px-2 pointer-events-none">
              <FaChevronDown className="text-mainText w-4 h-3" />
            </div>
          </div>
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText="Hoje"
              className="pl-3 py-1 border w-[120px] border-linesAndBorders rounded-lg shadow-sm text-mainText focus:outline-none focus:ring-0 cursor-pointer"
              dateFormat="dd/MM/yyyy"
            />
            <img
              src={calendar}
              alt="calendar"
              className="absolute right-6 top-[6px]"
            />
          </div>
        </div>
        <button
          onClick={() => handleExportData()}
          className="flex items-center gap-4 bg-primaryLight px-4 py-2 border border-linesAndBorders rounded-lg shadow-sm  cursor-pointer text-white"
        >
          Exportar
        </button>
      </div>
      <div className="overflow-y-auto">
        {/* <VerificationsTable
          selectedCompany={selectedCompany}
          selectedStatus={selectedStatus}
          selectedDate={selectedDate}
        /> */}
      </div>
    </div>
  );
};
export default VerificationsKyc;
