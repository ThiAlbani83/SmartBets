import { useState } from "react";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa";
import upload from "../../assets/upload.png";
import calendar from "../../assets/calendar.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TypeFilter from "../../components/sigap/TypeFilter";
import SubmitTable from "../../components/sigap/SubmitTable";

const SigapUploadFile = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("apostador");
  const [selectedCompany, setSelectedCompany] = useState("Empresa");
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const API_URL = "https://srv654319.hstgr.cloud/api/";

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("company", "-");
    formData.append("category", selectedCategory);

    setIsUploading(true);
    try {
      const response = await axios.post(API_URL + "upload", formData, {
        params: {
          token: import.meta.env.VITE_TOKEN_SIGAP,
          category: selectedCategory,
          company: "-",
        },
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      if (response.status === 200) {
        // Get XML content
        const reader = new FileReader();
        reader.onload = async (e) => {
          const xmlContent = e.target.result;

          // Convert XML to JSON using DOMParser
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

          // Convert XML document to JSON
          const jsonData = xmlToJson(xmlDoc);

          // Display in console
          console.log("XML converted to JSON:", jsonData);
        };
        reader.readAsText(file);

        console.log("File uploaded successfully");
        console.log("Selected Category:", selectedCategory);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Helper function to convert XML to JSON
  function xmlToJson(xml) {
    const obj = {};

    if (xml.nodeType === 1) {
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < xml.attributes.length; j++) {
          const attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) {
      return xml.nodeValue;
    }

    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;

        if (typeof obj[nodeName] === "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push === "undefined") {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  }
  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  return (
    <div className="w-full h-full flex flex-col gap-10 relative font-roboto">
      <div className="absolute -top-28 -left-10 px-5 py-2 z-50 border border-linesAndBorders rounded-xl shadow-sm">
        <h2 className="text-mainText font-bold">Submeter Arquivo - SIGAP</h2>
      </div>
      <div className="flex items-center justify-between w-full h-fit">
        <div className="relative">
          <select
            value={selectedCompany}
            onChange={handleCompanyChange}
            className="px-4 py-2 pr-8 border border-linesAndBorders rounded-lg shadow-sm text-mainText focus:outline-none focus:ring-0 appearance-none cursor-pointer"
          >
            <option value="Empresa">Empresa</option>
            <option value="Bet4">Bet4</option>
            <option value="BetWarrior">BetWarrior</option>
            <option value="BetBalanço">BetBalanço</option>
            <option value="ElizaBet">ElizaBet</option>
          </select>
          <div className="absolute top-[14px] right-0 flex items-center px-2 pointer-events-none">
            <FaChevronDown className="text-mainText w-4 h-3" />
          </div>
        </div>
        <div>
          <label className="flex items-center gap-4 bg-primaryLight px-4 py-2 border border-linesAndBorders rounded-lg shadow-sm text-mainText cursor-pointer">
            <img src={upload} alt="upload" />
            <span className="text-white">
              {isUploading ? "Uploading..." : "Upload"}
            </span>
            <input
              type="file"
              className="hidden"
              accept=".xml"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-20">
          <span className="text-mainText font-medium">Arquivos Salvos</span>
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText="Busca por Data"
              className="pl-3 py-2 border border-linesAndBorders rounded-lg shadow-sm text-mainText focus:outline-none focus:ring-0 cursor-pointer"
              dateFormat="dd/MM/yyyy"
            />
            <img
              src={calendar}
              alt="calendar"
              className="absolute right-6 top-[10px]"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <TypeFilter onFilterChange={handleFilterChange} />
        <SubmitTable
          selectedCategory={selectedCategory}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};
export default SigapUploadFile;
