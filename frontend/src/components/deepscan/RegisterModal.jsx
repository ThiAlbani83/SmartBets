import React, { useState } from "react";

const RegisterModal = ({ onClose, onSave, initialData, isEditing }) => {
  const [step, setStep] = useState(1);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [formData, setFormData] = useState(initialData || {
    companyName: "",
    email: "",
    responsible: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    twitter: "",
    google: "",
    youtube: "",
    discord: "",
    telegram: "",
    deepweb: "",
    tiktok: "",
    reddit: "",
    keywords: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const renderStep1 = () => (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-medium text-mainText">Dados da Empresa</h2>
      <input
        type="text"
        name="companyName"
        placeholder="Nome da Empresa"
        value={formData.companyName}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-lg max-w-[95%]"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-lg max-w-[95%]"
      />
      <input
        type="text"
        name="responsible"
        placeholder="Nome do Responsável"
        value={formData.responsible}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-lg max-w-[95%]"
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 overflow-hidden overflow-y-auto max-h-72">
      <h2 className="text-xl font-medium text-mainText">Redes Sociais</h2>
      <input
        type="text"
        name="instagram"
        placeholder="Instagram"
        value={formData.instagram}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-lg max-w-[95%]"
      />
      <input
        type="text"
        name="facebook"
        placeholder="Facebook"
        value={formData.facebook}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-lg max-w-[95%]"
      />
      <input
        type="text"
        name="linkedin"
        placeholder="LinkedIn"
        value={formData.linkedin}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-lg max-w-[95%]"
      />
      <input
        type="text"
        name="twitter"
        placeholder="X"
        value={formData.twitter}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-lg max-w-[95%]"
      />
      <input
        type="text"
        name="google"
        placeholder="Google"
        value={formData.google}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-lg max-w-[95%]"
      />
      <input
        type="text"
        name="youtube"
        placeholder="Youtube"
        value={formData.youtube}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-lg max-w-[95%]"
      />
      <input
        type="text"
        name="discord"
        placeholder="Discord"
        value={formData.discord}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-lg max-w-[95%]"
      />
      <input
        type="text"
        name="telegram"
        placeholder="Telegram"
        value={formData.telegram}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-lg max-w-[95%]"
      />
      <input
        type="text"
        name="deepweb"
        placeholder="Deep / Dark Web"
        value={formData.deepweb}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-lg max-w-[95%]"
      />
      <input
        type="text"
        name="tiktok"
        placeholder="Tiktok"
        value={formData.tiktok}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-lg max-w-[95%]"
      />
      <input
        type="text"
        name="reddit"
        placeholder="Reddit"
        value={formData.reddit}
        onChange={handleInputChange}
        className="w-full p-2 border rounded-lg max-w-[95%]"
      />
    </div>
  );

  const renderStep3 = () => {
    const handleAddKeyword = (e) => {
      e.preventDefault();
      if (currentKeyword.trim()) {
        setFormData((prev) => ({
          ...prev,
          keywords: [...prev.keywords, currentKeyword.trim()],
        }));
        setCurrentKeyword("");
      }
    };

    const handleRemoveKeyword = (indexToRemove) => {
      setFormData((prev) => ({
        ...prev,
        keywords: prev.keywords.filter((_, index) => index !== indexToRemove),
      }));
    };

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-medium text-mainText">Palavras-chave</h2>

        {/* Keyword input form */}
        <form onSubmit={handleAddKeyword} className="flex gap-2">
          <input
            type="text"
            value={currentKeyword}
            onChange={(e) => setCurrentKeyword(e.target.value)}
            placeholder="Adicione palavras-chave"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primaryLight text-white rounded"
          >
            Adicionar
          </button>
        </form>

        {/* Keywords display section */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Palavras-chave cadastradas:
          </h3>
          <div className="flex flex-wrap gap-2">
            {formData.keywords.map((keyword, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-[2px]  text-mainText border border-linesAndBorders rounded-full"
              >
                <span>{keyword}</span>
                <button
                  onClick={() => handleRemoveKeyword(index)}
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-20 w-full py-4 flex items-center justify-center">
      <div className="bg-white px-10 py-4 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-black font-semibold"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-10 mb-10">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= num ? "bg-primaryLight text-white" : "bg-gray-100"
                }`}
              >
                {num}
              </div>
            ))}
          </div>
          

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <div className="flex justify-between">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-primaryLight text-white rounded"
            >
              Voltar
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-primaryLight text-white rounded ml-auto"
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded ml-auto"
            >
              Finalizar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
