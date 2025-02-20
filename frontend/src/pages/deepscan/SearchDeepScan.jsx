import React, { useEffect, useState } from "react";
import deleteIcon from "../../assets/delete.png";
import { FaCirclePlus } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";
import { deepScanResults } from "../../utils/fakeData";
import WordCloud from "react-wordcloud";
import PizzaGraphs from "../../components/deepscan/PizzaGraphs";

const SearchDeepScan = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [progress, setProgress] = useState(0);
  const [profileInputFields, setProfileInputFields] = useState([
    { id: 1, name: "" },
  ]);
  const [keyWordsInputFields, setKeyWordsInputFields] = useState([
    { id: 1, name: "" },
  ]);
  const [checkboxes, setCheckboxes] = useState({
    todas: false,
    instagram: false,
    facebook: false,
    x: false,
    linkedin: false,
  });

  const data = {
    labels: ["Positivo", "Negativo", "Neutro"],
    datasets: [
      {
        label: "# incidências",
        data: [getRandomNumber(), getRandomNumber(), getRandomNumber()],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const data2 = {
    labels: ["Positivo", "Negativo", "Neutro"],
    datasets: [
      {
        label: "# incidências",
        data: [getRandomNumber(), getRandomNumber(), getRandomNumber()],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  const words = [
    { text: "Aposta", value: getRandomNumber() },
    { text: "Ganho", value: getRandomNumber() },
    { text: "Garantido", value: getRandomNumber() },
    { text: "Renda", value: getRandomNumber() },
    { text: "Extra", value: getRandomNumber() },
    { text: "Renda Extra", value: getRandomNumber() },
    { text: "Giros", value: getRandomNumber() },
    { text: "Grátis", value: getRandomNumber() },
    { text: "Bônus", value: getRandomNumber() },
  ];

  const options = {
    fontSizes: [30, 100], // Minimum and maximum font sizes
    colors: ["#000000", "#3B70A2", "#5BB9D3", "#101A5A", "#171717", "#303030"], // Array of colors
    fontStyle: "normal", // Font style
    rotations: 3, // Number of rotations
    rotationAngles: [0, 90], // Array of rotation angles
    enableTooltip: true, // Enable tooltip on hover
    deterministic: false, // Enable deterministic layout
    fontFamily: "Roboto", // Font family
    padding: 1, // Padding between words
    maxSpeed: "fast", // Speed of the animation
    spiral: "archimedean", // Type of spiral
    fontWeight: "bold", // Font weight
    spiralFromCenter: true, // Start spiral from center
  };

  const handleAddProfileInput = () => {
    setProfileInputFields([
      ...profileInputFields,
      { id: profileInputFields.length + 1 },
    ]);
  };

  const handleDeleteProfileInput = (id) => {
    setProfileInputFields(
      profileInputFields.filter((field) => field.id !== id)
    );
  };

  const handleAddKeyWordsInput = () => {
    setKeyWordsInputFields([
      ...keyWordsInputFields,
      { id: keyWordsInputFields.length + 1 },
    ]);
  };

  const handleDeleteKeyWordsInput = (id) => {
    setKeyWordsInputFields(
      keyWordsInputFields.filter((field) => field.id !== id)
    );
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    if (name === "todas") {
      setCheckboxes({
        todas: checked,
        instagram: checked,
        facebook: checked,
        x: checked,
        linkedin: checked,
      });
    } else {
      setCheckboxes({
        ...checkboxes,
        [name]: checked,
      });
    }
  };

  const validateDateRange = (date) => {
    if (startDate) {
      const diffTime = Math.abs(date - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    return true;
  };

  // Example function to simulate progress
  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 3;
      });
    }, 100);
  };

  // Function to format the date range
  const formatDateRange = () => {
    if (startDate && endDate) {
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      const start = startDate.toLocaleDateString("pt-BR", options);
      const end = endDate.toLocaleDateString("pt-BR", options);
      return `${start} - ${end}`;
    }
    return "Nenhum período selecionado";
  };

  return (
    <div className="w-full h-full flex relative font-roboto gap-10">
      <div className="flex flex-col gap-10 border-r border-r-linesAndBorders">
        <div className="flex gap-20 pr-10">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <h1 className="text-base text-mainText font-medium underline">
                Perfis a serem verificados
              </h1>
            </div>
            {/* Inputs Section */}
            <div className="flex flex-col gap-4 ml">
              {profileInputFields.map((field) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    name=""
                    id={`perfil-${field.id}`}
                    placeholder="Nome do perfil"
                    className="border-b border-b-linesAndBorders bg-transparent select-none focus:outline-none"
                  />
                  <img
                    src={deleteIcon}
                    alt="delete"
                    onClick={() => handleDeleteProfileInput(field.id)}
                    className="cursor-pointer"
                  />
                </div>
              ))}
              <div>
                <FaCirclePlus
                  className={`text-xl text-primaryLight cursor-pointer active:scale-95 duration-300 ${
                    profileInputFields.length > 2 ? "hidden" : ""
                  }`}
                  onClick={handleAddProfileInput}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <h1 className="text-base text-mainText font-medium underline">
                Palavras chave
              </h1>
            </div>
            {/* Inputs Section */}
            <div className="inputs flex flex-col gap-4">
              {keyWordsInputFields.map((field) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    name=""
                    id={`perfil-${field.id}`}
                    placeholder="Palavra chave"
                    className="border-b border-b-linesAndBorders bg-transparent select-none focus:outline-none"
                  />
                  <img
                    src={deleteIcon}
                    alt="delete"
                    onClick={() => handleDeleteKeyWordsInput(field.id)}
                    className="cursor-pointer"
                  />
                </div>
              ))}
              <div>
                <FaCirclePlus
                  className={`text-xl text-primaryLight cursor-pointer active:scale-95 duration-300 ${
                    keyWordsInputFields.length > 4 ? "hidden" : ""
                  }`}
                  onClick={handleAddKeyWordsInput}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Social Media Section */}
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <h1 className="text-base text-mainText font-medium underline">
              Redes Sociais
            </h1>
          </div>
          {/* Checkbox Section */}
          <div className="grid grid-cols-3 gap-4 pr-10">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="todas"
                id="todas"
                className="w-4 h-4"
                checked={checkboxes.todas}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="todas">Todas</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="instagram"
                id="instagram"
                className="w-4 h-4"
                checked={checkboxes.instagram}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="instagram">Instagram</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="facebook"
                id="facebook"
                className="w-4 h-4"
                checked={checkboxes.facebook}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="facebook">Facebook</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="x"
                id="x"
                className="w-4 h-4"
                checked={checkboxes.x}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="x">X (Twitter)</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="linkedin"
                id="linkedin"
                className="w-4 h-4"
                checked={checkboxes.linkedin}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="linkedin">Linkedin</label>
            </div>
          </div>
        </div>
        <div className="w-[95%] h-[1px] bg-linesAndBorders" />
        {/* Time set Section */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-base text-mainText font-medium underline">
              Varredura Automática
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                isClearable={true}
                placeholderText="Selecione o período"
                maxDate={new Date()}
                filterDate={validateDateRange}
                className="pl-2 pr-8 py-1 border rounded-lg focus:outline-none text-mainText placeholder:text-mainText"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              disabled={startDate === null && endDate === null}
              onClick={simulateProgress}
              className="bg-primaryLight px-6 disabled:text-white disabled:opacity-60"
            >
              Buscar
            </Button>
            {progress !== 0 && (
              <div className="flex items-center gap-2">
                <ProgressBar progress={progress} />
                <span>{progress} %</span>
              </div>
            )}
          </div>
        </div>
        {progress === 100 && (
          <div className="flex flex-col gap-4">
            <h3>
              Resultados da varredura: <span>{formatDateRange()}</span>
            </h3>
            <div className="overflow-y-auto h-[150px] overflow-hidden flex flex-col gap-1">
              {deepScanResults.map((result, index) => (
                <div key={index} className="">
                  <a
                    href={result.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-800 underline text-sm"
                  >
                    {result.name} - {result.link}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="underline text-mainText font-medium">
            Núvem de Palavras
          </h3>
        </div>
        {progress === 100 && (
          <div className="flex w-full max-w-[500px] h-[250px] border border-linesAndBorders rounded-lg shadow-sm p-4">
            <WordCloud words={words} options={options} />
          </div>
        )}
        <div className="mt-10">
          <h3 className="underline text-mainText font-medium">
            Análise de Sentimento
          </h3>
        </div>
        {progress === 100 && (
          <div className="flex items-center gap-10">
            <div>
              <PizzaGraphs bet_name={"jetbet_oficial"} data={data} />
            </div>
            <div>
              <PizzaGraphs bet_name={"bet4"} data={data2} />
            </div>
          </div>
        )}
      </div>

      <div className="absolute -top-28 -left-10 px-5 py-2 z-50 border border-linesAndBorders rounded-xl shadow-sm">
        <h2 className="text-mainText font-bold">Varredura - DeepScan360</h2>
      </div>
    </div>
  );
};

export default SearchDeepScan;
