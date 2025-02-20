import { useState, useRef } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import RegisterModal from "../../components/deepscan/RegisterModal";
  const ConfigDeepScan = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const profilesRef = useRef([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    // Add a new state to track editing mode
    const [isEditing, setIsEditing] = useState(false);

    // Modify handleSaveProfile to handle both create and edit
    const handleSaveProfile = (profileData) => {
      if (isEditing) {
        // Update existing profile
        profilesRef.current = profilesRef.current.map(profile => 
          profile.id === selectedProfile.id ? {...profileData, id: profile.id} : profile
        );
        setSelectedProfile({...profileData, id: selectedProfile.id});
      } else {
        // Create new profile
        profilesRef.current.push({
          id: Date.now(),
          ...profileData
        });
      }
      setIsModalOpen(false);
      setIsEditing(false);
    };

    const handleProfileSelect = (e) => {
      const profile = profilesRef.current.find(p => p.id === Number(e.target.value));
      setSelectedProfile(profile);
    };

    return (
      <div className="w-full flex flex-col relative font-roboto gap-10">
        <div className="absolute -top-28 -left-10 px-5 py-2 z-50 border border-linesAndBorders rounded-xl shadow-sm">
          <h2 className="text-mainText font-bold">Configuração - DeepScan360</h2>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="betSelect" className="font-medium text-mainText">
            Selecione um Perfil
          </label>
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
          <div className="flex justify-end mb-4">
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
          <div className="flex gap-10">
            <div className="border-b pb-4 w-full">
              <h3 className="font-medium text-base text-mainText underline mb-4">
                Dados da Empresa
              </h3>
              <div className="space-y-3">
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
              </div>
            </div>

            <div className="border-r pb-4 w-full max-h-[500px] overflow-y-auto">
              <h3 className="font-medium text-base text-mainText underline mb-4">
                Redes Sociais
              </h3>
              <div className="space-y-3 max-w-[96%]">
                <div className="flex flex-col">
                  <label className="font-medium text-mainText text-sm">
                    Instagram
                  </label>
                  <input
                    type="text"
                    disabled
                    className="border text-sm border-linesAndBorders rounded-md px-2 py-1"
                    value={selectedProfile.instagram}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-mainText text-sm">
                    Facebook
                  </label>
                  <input
                    type="text"
                    disabled
                    className="border text-sm border-linesAndBorders rounded-md px-2 py-1"
                    value={selectedProfile.facebook}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-mainText text-sm">
                    X
                  </label>
                  <input
                    type="text"
                    disabled
                    className="border text-sm border-linesAndBorders rounded-md px-2 py-1"
                    value={selectedProfile.twitter}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-mainText text-sm">
                    Google
                  </label>
                  <input
                    type="text"
                    disabled
                    className="border text-sm border-linesAndBorders rounded-md px-2 py-1"
                    value={selectedProfile.google}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-mainText text-sm">
                    Youtube
                  </label>
                  <input
                    type="text"
                    disabled
                    className="border text-sm border-linesAndBorders rounded-md px-2 py-1"
                    value={selectedProfile.youtube}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-mainText text-sm">
                    Discord
                  </label>
                  <input
                    type="text"
                    disabled
                    className="border text-sm border-linesAndBorders rounded-md px-2 py-1"
                    value={selectedProfile.discord}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-mainText text-sm">
                    Telegram
                  </label>
                  <input
                    type="text"
                    disabled
                    className="border text-sm border-linesAndBorders rounded-md px-2 py-1"
                    value={selectedProfile.telegram}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-mainText text-sm">
                    Deep/Dark Web
                  </label>
                  <input
                    type="text"
                    disabled
                    className="border text-sm border-linesAndBorders rounded-md px-2 py-1"
                    value={selectedProfile.deepweb}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-mainText text-sm">
                    Tiktok
                  </label>
                  <input
                    type="text"
                    disabled
                    className="border text-sm border-linesAndBorders rounded-md px-2 py-1"
                    value={selectedProfile.tiktok}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-mainText text-sm">
                    Reddit
                  </label>
                  <input
                    type="text"
                    disabled
                    className="border text-sm border-linesAndBorders rounded-md px-2 py-1"
                    value={selectedProfile.reddit}
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <h3 className="font-medium text-base text-mainText underline mb-4">
                Palavras-chave
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedProfile.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
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