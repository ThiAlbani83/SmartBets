import React, { useState } from "react";
import deleteIcon from "../../assets/delete.png";
import { FaCirclePlus } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/Button";

const SearchDeepScan = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
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
          <div className="flex flex-1 flex-col gap-4">
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

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-base text-mainText font-medium underline">
              Raspagem Automática
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <select
              name="raspagem_select"
              id="raspagem"
              className="w-full max-w-[200px] px-2 py-1 focus:outline-none border rounded-lg text-mainText"
            >
              <option value="" className="">
                Selecione uma opção
              </option>
              <option value="">Hoje</option>
              <option value="">Últimos 3 dias</option>
              <option value="">Últimos 7 dias</option>
            </select>
            <span>ou</span>
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
          <div>
            <Button className="bg-primaryLight px-6">Buscar</Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1">Right Side</div>
      <div className="absolute -top-28 -left-10 px-5 py-2 z-50 border border-linesAndBorders rounded-xl shadow-sm">
        <h2 className="text-mainText font-bold">Varredura - DeepScan360</h2>
      </div>
    </div>
  );
};

export default SearchDeepScan;
