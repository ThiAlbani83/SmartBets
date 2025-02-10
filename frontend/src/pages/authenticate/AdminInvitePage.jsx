import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const AdminInvitePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    selectedModules: [],
  });
  const { inviteUser } = useAuthStore();

  const modules = [
    { id: "1", name: "SIGAP" },
    { id: "2", name: "KYC" },
    { id: "3", name: "SAC" },
    { id: "4", name: "Responsible Gaming" },
    { id: "5", name: "Administrativo" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleModuleChange = (moduleId) => {
    setFormData((prev) => ({
      ...prev,
      selectedModules: prev.selectedModules.includes(moduleId)
        ? prev.selectedModules.filter((id) => id !== moduleId)
        : [...prev.selectedModules, moduleId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await inviteUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        modules: formData.selectedModules, // This will now be properly passed through
      });
      alert("Convite enviado com sucesso!");
      setFormData({ name: "", email: "", role: "", selectedModules: [] });
    } catch (error) {
      alert("Erro ao enviar convite");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="border-b-2 focus:outline-none w-80 placeholder:text-gray-600"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border-b-2 focus:outline-none w-80 placeholder:text-gray-600"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="text-gray-600 border-b-2 w-80 focus:outline-none"
        >
          <option value="admin">Admin</option>
          <option value="board">Board</option>
          <option value="director">Diretor</option>
          <option value="marketing">Marketing</option>
          <option value="sac">SAC</option>
          <option value="sigap">SIGAP</option>
        </select>
        <div>
          <p className="mt-6 font-medium">Módulos do Usuário</p>
          <div className="flex flex-wrap gap-4 mt-2">
            {modules.map((module) => (
              <label key={module.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.selectedModules.includes(module.id)}
                  onChange={() => handleModuleChange(module.id)}
                  className="w-4 h-4"
                />
                <span>{module.name}</span>
              </label>
            ))}
          </div>
        </div>
        <button className="px-3 py-1 text-white rounded-md w-fit bg-primaryLight">
          Enviar Convite
        </button>
      </form>
    </div>
  );
};
export default AdminInvitePage;
