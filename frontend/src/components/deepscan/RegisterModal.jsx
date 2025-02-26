import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaTrash, FaSpinner } from "react-icons/fa";

const RegisterModal = ({ onClose, onSave, initialData, isEditing }) => {
  const [step, setStep] = useState(1);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [newTime, setNewTime] = useState("12:00");
  const socialNetworks = {
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    twitter: "X/Twitter",
    google: "Google",
    youtube: "YouTube",
    discord: "Discord",
    telegram: "Telegram",
    deepweb: "Deep/Dark Web",
    tiktok: "TikTok",
    reddit: "Reddit",
  };
  const [formData, setFormData] = useState(
    initialData || {
      companyName: "",
      email: "",
      responsible: "",
      socialProfiles: [],
      keywordSets: [],
      scrapingFrequency: {
        interval: "daily",
        times: [], // Explicitly initialize as empty array
      },
    }
  );

  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [profileName, setProfileName] = useState("");
  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const [currentKeywords, setCurrentKeywords] = useState([]);

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

  const renderStep2 = () => {
    const handleAddProfile = (e) => {
      e.preventDefault();
      if (selectedNetwork && profileName.trim()) {
        // Adiciona perfil com estado de verificação
        const newProfile = {
          network: selectedNetwork,
          profile: profileName.trim(),
          loading: true,
          verified: null,
        };

        setFormData((prev) => ({
          ...prev,
          socialProfiles: [...prev.socialProfiles, newProfile],
        }));

        // Simula verificação após 5 segundos
        setTimeout(() => {
          setFormData((prev) => ({
            ...prev,
            socialProfiles: prev.socialProfiles.map((profile) => {
              if (
                profile.network === newProfile.network &&
                profile.profile === newProfile.profile &&
                profile.loading
              ) {
                // Simula uma verificação aleatória (70% de chance de sucesso)
                const isVerified = Math.random() > 0.3;
                return { ...profile, loading: false, verified: isVerified };
              }
              return profile;
            }),
          }));
        }, 5000);

        setProfileName("");
      }
    };

    const handleRemoveProfile = (index) => {
      setFormData((prev) => ({
        ...prev,
        socialProfiles: prev.socialProfiles.filter((_, i) => i !== index),
      }));
    };

    return (
      <div className="space-y-4 overflow-hidden overflow-y-auto max-h-72">
        <h2 className="text-xl font-medium text-mainText">Redes Sociais</h2>

        <form onSubmit={handleAddProfile} className="flex gap-2">
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="w-1/2 p-2 border rounded-lg"
          >
            <option value="">Selecione uma rede</option>
            {Object.entries(socialNetworks).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Nome do perfil"
            className="w-1/2 p-2 border rounded-lg"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-primaryLight text-white rounded"
          >
            Adicionar
          </button>
        </form>

        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Perfis cadastrados:
          </h3>
          <div className="flex flex-col gap-2">
            {formData.socialProfiles.map((profile, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <span>
                  {socialNetworks[profile.network]}: {profile.profile}
                </span>
                <div className="flex items-center">
                  {/* Status de verificação */}
                  <div className="mr-3">
                    {profile.loading ? (
                      <FaSpinner className="animate-spin text-blue-500" />
                    ) : profile.verified === true ? (
                      <FaCheck className="text-green-500" />
                    ) : profile.verified === false ? (
                      <FaTimes className="text-red-500" />
                    ) : null}
                  </div>

                  {/* Botão de exclusão */}
                  <button
                    onClick={() => handleRemoveProfile(index)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const handleAddKeyword = (e) => {
      e.preventDefault();
      if (currentKeyword.trim()) {
        // Split the input by semicolons and process each keyword
        const keywordsArray = currentKeyword
          .split(";")
          .map((kw) => kw.trim())
          .filter((kw) => kw !== "");

        // Add all valid keywords to the current keywords array
        setCurrentKeywords((prev) => [...prev, ...keywordsArray]);
        setCurrentKeyword("");
      }
    };

    const handleRemoveKeyword = (indexToRemove) => {
      setCurrentKeywords((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );
    };

    const handleSaveKeywordSet = () => {
      if (selectedNetworks.length > 0 && currentKeywords.length > 0) {
        setFormData((prev) => ({
          ...prev,
          keywordSets: [
            ...prev.keywordSets,
            {
              networks: selectedNetworks,
              keywords: currentKeywords,
              keywordsString: currentKeywords.join(";"),
            },
          ],
        }));
        setSelectedNetworks([]);
        setCurrentKeywords([]);
      }
    };

    const handleRemoveKeywordSet = (index) => {
      setFormData((prev) => ({
        ...prev,
        keywordSets: prev.keywordSets.filter((_, i) => i !== index),
      }));
    };

    return (
      <div className="space-y-6 overflow-hidden overflow-y-auto max-h-96">
        <h2 className="text-xl font-medium text-mainText">Palavras-chave</h2>

        {/* Seleção de redes sociais */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Selecione as redes sociais
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(socialNetworks).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedNetworks((prev) =>
                    prev.includes(key)
                      ? prev.filter((n) => n !== key)
                      : [...prev, key]
                  );
                }}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedNetworks.includes(key)
                    ? "bg-primaryLight text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Formulário de palavras-chave */}
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

        {/* Palavras-chave atuais */}
        {currentKeywords.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {currentKeywords.map((keyword, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 border rounded-full"
                >
                  <span>{keyword}</span>
                  <button
                    onClick={() => handleRemoveKeyword(index)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleSaveKeywordSet}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            >
              Salvar Conjunto
            </button>
          </div>
        )}

        {/* Conjuntos salvos */}
        {formData.keywordSets.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Conjuntos de palavras-chave:
            </h3>
            <div className="space-y-4">
              {formData.keywordSets.map((set, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {set.networks.map((network) => (
                          <span
                            key={network}
                            className="text-sm bg-blue-100 px-2 py-1 rounded"
                          >
                            {socialNetworks[network]}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {set.keywords.map((keyword, kidx) => (
                          <span
                            key={kidx}
                            className="text-sm bg-gray-100 px-2 py-1 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveKeywordSet(index)}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStep4 = () => {
    const addTime = () => {
      if (!formData.scrapingFrequency.times.includes(newTime)) {
        setFormData((prev) => ({
          ...prev,
          scrapingFrequency: {
            ...prev.scrapingFrequency,
            times: [...prev.scrapingFrequency.times, newTime].sort(),
          },
        }));
      }
    };

    const removeTime = (timeToRemove) => {
      setFormData((prev) => ({
        ...prev,
        scrapingFrequency: {
          ...prev.scrapingFrequency,
          times: prev.scrapingFrequency.times.filter(
            (time) => time !== timeToRemove
          ),
        },
      }));
    };

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-medium text-mainText">
          Frequência de Monitoramento
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intervalo de Verificação
            </label>
            <select
              value={formData.scrapingFrequency.interval}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  scrapingFrequency: {
                    ...prev.scrapingFrequency,
                    interval: e.target.value,
                  },
                }))
              }
              className="w-full p-2 border rounded-lg"
            >
              <option value="hourly">A cada hora</option>
              <option value="daily">Diariamente</option>
              <option value="weekly">Semanalmente</option>
              <option value="monthly">Mensalmente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horários de Verificação
            </label>

            <div className="flex gap-2 mb-4">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <button
                onClick={addTime}
                type="button"
                className="px-4 py-2 bg-primaryLight text-white rounded"
              >
                Adicionar
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.scrapingFrequency.times.map((time) => (
                <div
                  key={time}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                >
                  <span>{time}</span>
                  <button
                    onClick={() => removeTime(time)}
                    className="text-red-500 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-20 w-full py-4 flex items-center justify-center">
      <div className="bg-white px-10 py-4 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-black font-semibold">
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-10 mb-10">
            {[1, 2, 3, 4].map((num) => (
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
          {step === 4 && renderStep4()}
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
          {step < 4 ? (
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
