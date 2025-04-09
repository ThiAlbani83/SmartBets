import React, { useState, useEffect } from "react";
import { useDeepScanStore } from "../../store/useDeepscanStore";

const SearchDeepScan = () => {
  const {
    scheduleScraping,
    getScheduledTasks,
    scheduledTasks,
    isLoading,
    error,
    schedulingStatus,
  } = useDeepScanStore();

  // State for form fields
  const [profiles, setProfiles] = useState([]);
  const [searchPhrases, setSearchPhrases] = useState([]);
  const [format, setFormat] = useState("CSV");
  const [platforms, setPlatforms] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [startHour, setStartHour] = useState("10:00");

  // Input states
  const [profile, setProfile] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [platform, setPlatform] = useState("");
  const [day, setDay] = useState("");

  // Fetch scheduled tasks on component mount
  /* useEffect(() => {
    getScheduledTasks();
  }, [getScheduledTasks]); */

  // Handle adding/removing items from arrays
  const handleAddProfile = () => {
    if (profile.trim()) {
      setProfiles([...profiles, profile.trim()]);
      setProfile("");
    }
  };

  const handleAddSearchPhrase = () => {
    if (searchPhrase.trim()) {
      setSearchPhrases([...searchPhrases, searchPhrase.trim()]);
      setSearchPhrase("");
    }
  };

  const handleAddPlatform = () => {
    if (platform.trim()) {
      setPlatforms([...platforms, platform.trim()]);
      setPlatform("");
    }
  };

  const handleAddDay = () => {
    if (day) {
      const dayNumber = parseInt(day, 10);
      if (!selectedDays.includes(dayNumber)) {
        setSelectedDays([...selectedDays, dayNumber]);
      }
      setDay("");
    }
  };

  const handleRemoveItem = (array, setArray, index) => {
    setArray(array.filter((_, i) => i !== index));
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profiles.length === 0) {
      alert("Adicione pelo menos um perfil");
      return;
    }

    if (platforms.length === 0) {
      alert("Adicione pelo menos uma plataforma");
      return;
    }

    if (selectedDays.length === 0) {
      alert("Selecione pelo menos um dia para agendamento");
      return;
    }

    // Format the time properly
    // Make sure startHour is in the correct format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startHour)) {
      alert("Formato de hora inválido. Use o formato HH:MM (ex: 14:30)");
      return;
    }

    // Send the original format that the API expects
    const result = await scheduleScraping({
      profiles,
      searchPhrases,
      format,
      platforms,
      selectedDays, // Keep the original selectedDays array
      startHour, // Keep the original startHour string
    });

    console.log("Resultado do agendamento:", result);
  };
  // Generate days for dropdown (1-31)
  const daysOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div
      className="container mx-auto p-4 overflow-auto"
      style={{ maxHeight: "100vh" }}
    >
      <h1 className="text-2xl font-bold mb-4">Agendar Deep Scan</h1>

      <div className="bg-white shadow-md rounded p-6 mb-6">
        <form onSubmit={handleSubmit}>
          {/* Profiles Section */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Perfis</h2>
            <div className="flex mb-2">
              <input
                type="text"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="flex-1 border rounded-l p-2"
                placeholder="Adicionar perfil"
              />
              <button
                type="button"
                onClick={handleAddProfile}
                className="bg-blue-500 text-white px-4 py-2 rounded-r"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
              {profiles.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem(profiles, setProfiles, index)
                    }
                    className="ml-2 text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Search Phrases Section */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Frases de Busca</h2>
            <div className="flex mb-2">
              <input
                type="text"
                value={searchPhrase}
                onChange={(e) => setSearchPhrase(e.target.value)}
                className="flex-1 border rounded-l p-2"
                placeholder="Adicionar frase de busca"
              />
              <button
                type="button"
                onClick={handleAddSearchPhrase}
                className="bg-blue-500 text-white px-4 py-2 rounded-r"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
              {searchPhrases.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem(searchPhrases, setSearchPhrases, index)
                    }
                    className="ml-2 text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Formato</h2>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="CSV">CSV</option>
              <option value="JSON">JSON</option>
              <option value="EXCEL">EXCEL</option>
            </select>
          </div>

          {/* Platforms Section */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Plataformas</h2>
            <div className="flex mb-2">
              <input
                type="text"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="flex-1 border rounded-l p-2"
                placeholder="Adicionar plataforma"
              />
              <button
                type="button"
                onClick={handleAddPlatform}
                className="bg-blue-500 text-white px-4 py-2 rounded-r"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
              {platforms.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem(platforms, setPlatforms, index)
                    }
                    className="ml-2 text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Days Section */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Dias de Execução</h2>
            <div className="flex mb-2">
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="flex-1 border rounded-l p-2"
              >
                <option value="">Selecione um dia</option>
                {daysOptions.map((dayNum) => (
                  <option key={dayNum} value={dayNum}>
                    Dia {dayNum}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddDay}
                className="bg-blue-500 text-white px-4 py-2 rounded-r"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
              {selectedDays.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                >
                  <span>Dia {item}</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem(selectedDays, setSelectedDays, index)
                    }
                    className="ml-2 text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Start Hour */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Horário de Início</h2>
            <input
              type="time"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded w-full"
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : "Agendar Deep Scan"}
          </button>
        </form>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Processando, por favor aguarde...</p>
        </div>
      )}

      {/* Scheduling Status */}
      {schedulingStatus && !isLoading && (
        <div
          className={`p-4 mb-4 rounded ${
            schedulingStatus === "completed"
              ? "bg-green-100 border-l-4 border-green-500 text-green-700"
              : schedulingStatus === "failed"
              ? "bg-red-100 border-l-4 border-red-500 text-red-700"
              : "bg-blue-100 border-l-4 border-blue-500 text-blue-700"
          }`}
        >
          <p>
            {schedulingStatus === "completed"
              ? "Agendamento realizado com sucesso!"
              : schedulingStatus === "failed"
              ? "Falha ao realizar agendamento"
              : "Agendamento em processamento..."}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Scheduled Tasks List */}
      {scheduledTasks && scheduledTasks.length > 0 && (
        <div className="bg-white shadow-md rounded p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Tarefas Agendadas</h2>
          <div className="overflow-x-auto" style={{ maxHeight: "400px" }}>
            <table className="min-w-full bg-white border">
              <thead className="sticky top-0 bg-white">
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Perfis</th>
                  <th className="py-2 px-4 border-b">Plataformas</th>
                  <th className="py-2 px-4 border-b">Dias</th>
                  <th className="py-2 px-4 border-b">Horário</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {scheduledTasks.map((task, index) => (
                  <tr key={task.id || task._id || index}>
                    <td className="py-2 px-4 border-b">
                      {task.id || task._id || `Task ${index + 1}`}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {Array.isArray(task.profiles)
                        ? task.profiles.join(", ")
                        : typeof task.profiles === "string"
                        ? task.profiles
                        : "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {Array.isArray(task.platforms)
                        ? task.platforms.join(", ")
                        : typeof task.platforms === "string"
                        ? task.platforms
                        : "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {Array.isArray(task.selectedDays)
                        ? task.selectedDays
                            .map((day) => `Dia ${day}`)
                            .join(", ")
                        : typeof task.selectedDays === "string"
                        ? task.selectedDays
                        : "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {task.startHour || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : task.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : task.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task.status || "pendente"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {scheduledTasks && scheduledTasks.length === 0 && (
        <div className="bg-white shadow-md rounded p-6">
          <p className="text-center text-gray-500">
            Nenhuma tarefa agendada encontrada.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchDeepScan;
