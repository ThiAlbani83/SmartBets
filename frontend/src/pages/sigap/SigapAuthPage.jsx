import { useState, useEffect } from "react";
import axios from "axios";
import { FaCloudUploadAlt, FaFilter, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TypeFilter from "../../components/sigap/TypeFilter";
import SubmitTable from "../../components/sigap/SubmitTable";

const SigapAuthPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("apostador");
  const [selectedCompany, setSelectedCompany] = useState("Empresa");
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = "https://srv654319.hstgr.cloud/api/";

  // Simulated data loading effect
  useEffect(() => {
    setIsLoading(true);
    const loadData = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(loadData);
  }, [selectedCategory, selectedDate]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("company", selectedCompany);
    formData.append("category", selectedCategory);

    setIsUploading(true);
    try {
      const response = await axios.post(API_URL + "upload", formData, {
        params: {
          token: import.meta.env.VITE_TOKEN_SIGAP,
          category: selectedCategory,
          company: selectedCompany,
        },
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      if (response.status === 200) {
        // Handle successful upload
        console.log("File uploaded successfully");
        console.log("Selected Category:", selectedCategory);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  return (
    <div className="p-6 max-w-8xl w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Auditar Arquivo - SIGAP
      </h1>

      {/* Upload and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedCompany}
                onChange={handleCompanyChange}
                className="px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="Empresa">Selecione a Empresa</option>
                <option value="Bet4">Bet4</option>
                <option value="BetWarrior">BetWarrior</option>
                <option value="BetBalanço">BetBalanço</option>
                <option value="ElizaBet">ElizaBet</option>
              </select>
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
                <FaFilter className="text-gray-500" />
              </div>
            </div>

            <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="Filtrar por Data"
                className="px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                dateFormat="dd/MM/yyyy"
              />
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
                <FaCalendarAlt className="text-gray-500" />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-colors px-6 py-2 rounded-lg shadow-sm text-white cursor-pointer">
            <FaCloudUploadAlt className="text-xl" />
            <span>{isUploading ? "Enviando..." : "Enviar para Auditoria"}</span>
            <input
              type="file"
              className="hidden"
              accept=".xml"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Status Indicator */}
        {isUploading && (
          <div className="w-full bg-green-50 text-green-700 p-3 rounded-lg mb-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-700 mr-3"></div>
            <span>Enviando arquivo para auditoria, por favor aguarde...</span>
          </div>
        )}
      </div>

      {/* Files Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Arquivos para Auditoria
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <TypeFilter onFilterChange={handleFilterChange} />
          </div>

          <div className="md:w-3/4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
              </div>
            ) : (
              <SubmitTable
                selectedCategory={selectedCategory}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigapAuthPage;
