import { useState, useRef } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import RegisterModal from "../../components/deepscan/RegisterModal";
const ConfigDeepScan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profilesRef = useRef([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  // Add a new state to track editing mode
  const [isEditing, setIsEditing] = useState(false);

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

  // Modify handleSaveProfile to handle both create and edit
  const handleSaveProfile = (profileData) => {
    if (isEditing) {
      // Update existing profile
      profilesRef.current = profilesRef.current.map((profile) =>
        profile.id === selectedProfile.id
          ? { ...profileData, id: profile.id }
          : profile
      );
      setSelectedProfile({ ...profileData, id: selectedProfile.id });
    } else {
      // Create new profile
      profilesRef.current.push({
        id: Date.now(),
        ...profileData,
      });
    }
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleProfileSelect = (e) => {
    const profile = profilesRef.current.find(
      (p) => p.id === Number(e.target.value)
    );
    setSelectedProfile(profile);
  };

  return (
    <div className="w-full flex flex-col relative font-roboto gap-4 h-full">
      <div className="absolute -top-28 -left-10 px-5 py-2 z-50 border border-linesAndBorders rounded-xl shadow-sm">
        <h2 className="text-mainText font-bold">Configuração - DeepScan360</h2>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div>
          <label htmlFor="betSelect" className="font-medium text-mainText">
            Selecione um Perfil
          </label>
        </div>

        <div className="flex items-center gap-2">
          <div className="">
            <select
              name="betSelect"
              id="betSelect"
              onChange={handleProfileSelect}
              className="border min-w-[150px] border-linesAndBorders outline-none rounded-md px-2 py-1 text-mainText"
            >
              <option value="">Selecione um perfil</option>
              {profilesRef.current.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.companyName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FaCirclePlus
              className="text-2xl text-primaryLight cursor-pointer active:scale-95 duration-300"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {selectedProfile && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              setIsEditing(true);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-primaryLight text-white rounded-md hover:bg-primary duration-300"
          >
            Editar Perfil
          </button>
        </div>
      )}
      {selectedProfile && (
        <div className="flex gap-5 h-full">
          <div className="border-r pb-4 w-full">
            <h3 className="font-medium text-base text-mainText underline mb-4">
              Dados da Empresa
            </h3>
            <div className="space-y-3 max-w-[96%] overflow-y-auto h-[75%]">
              <div className="flex flex-col">
                <label className="font-medium text-mainText text-sm">
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  disabled
                  className="border text-sm border-linesAndBorders rounded-md px-2 py-1"
                  value={selectedProfile.companyName}
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-mainText text-sm">
                  Email
                </label>
                <input
                  type="text"
                  disabled
                  className="border text-sm border-linesAndBorders rounded-md px-2 py-1"
                  value={selectedProfile.email}
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-mainText text-sm">
                  Responsável
                </label>
                <input
                  type="text"
                  disabled
                  className="border text-sm border-linesAndBorders rounded-md px-2 py-1"
                  value={selectedProfile.responsible}
                />
              </div>

              {/* Add scheduling information */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium text-mainText text-sm mb-2">
                  Frequência de Monitoramento
                </h4>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <label className="font-medium text-mainText text-sm">
                      Intervalo
                    </label>
                    <input
                      type="text"
                      disabled
                      className="border text-sm border-linesAndBorders rounded-md px-2 py-1"
                      value={
                        selectedProfile.scrapingFrequency.interval === "hourly"
                          ? "A cada hora"
                          : selectedProfile.scrapingFrequency.interval ===
                            "daily"
                          ? "Diariamente"
                          : selectedProfile.scrapingFrequency.interval ===
                            "weekly"
                          ? "Semanalmente"
                          : "Mensalmente"
                      }
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-medium text-mainText text-sm">
                      Horários Agendados
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedProfile.scrapingFrequency.times.map(
                        (time, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-sm px-3 py-1 rounded-full"
                          >
                            {time}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-r pb-4 w-full">
            <h3 className="font-medium text-base text-mainText underline mb-4">
              Redes Sociais
            </h3>
            <div className="space-y-3 max-w-[96%] overflow-y-auto h-[75%]">
              {selectedProfile.socialProfiles.map((profile, index) => (
                <div key={index} className="flex flex-col">
                  <label className="font-medium text-mainText text-sm">
                    {socialNetworks[profile.network]}
                  </label>
                  <input
                    type="text"
                    disabled
                    className="border text-sm border-linesAndBorders rounded-md px-2 py-1"
                    value={profile.profile}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full">
            <h3 className="font-medium text-base text-mainText underline mb-4">
              Palavras-chave por Rede Social
            </h3>
            <div className="space-y-4 overflow-y-auto h-[75%]">
              {selectedProfile.keywordSets.map((set, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="mb-3 ">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Redes vinculadas:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {set.networks.map((network) => (
                        <span
                          key={network}
                          className="px-3 py-1 bg-primaryLight text-white rounded-full text-sm"
                        >
                          {socialNetworks[network]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Palavras-chave:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {set.keywords.map((keyword, kidx) => (
                        <span
                          key={kidx}
                          className="px-3 py-1 bg-blue-100 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <RegisterModal
          onClose={() => {
            setIsModalOpen(false);
            setIsEditing(false);
          }}
          onSave={handleSaveProfile}
          initialData={isEditing ? selectedProfile : null}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};
export default ConfigDeepScan;
