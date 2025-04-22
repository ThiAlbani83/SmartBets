import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const AdminInvitePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    selectedModules: [],
    department: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: null,
    message: null,
  });
  const { inviteUser } = useAuthStore();

  const modules = [
    {
      id: "1",
      name: "SIGAP",
      description: "Sistema Integrado de Gestão de Apostas",
    },
    { id: "2", name: "KYC", description: "Know Your Customer" },
    { id: "3", name: "SAC", description: "Serviço de Atendimento ao Cliente" },
    {
      id: "4",
      name: "Deepscan",
      description: "Monitoramento avançado de redes sociais",
    },
    {
      id: "5",
      name: "Responsible Gaming",
      description: "Ferramentas de jogo responsável",
    },
    {
      id: "6",
      name: "Administrativo",
      description: "Gestão de usuários e configurações",
    },
  ];

  const departments = ["Admin", "BetX", "BetY", "BetZ"];

  const roles = [
    { value: "admin", label: "Admin" },
    { value: "sac", label: "SAC" },
    { value: "sigap", label: "SIGAP" },
    { value: "analyst", label: "Analista" },
    { value: "viewer", label: "Visualizador" },
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
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: null });

    try {
      await inviteUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        modules: formData.selectedModules,
        department: formData.department,
        message: formData.message,
      });

      setSubmitStatus({
        type: "success",
        message:
          "Convite enviado com sucesso! Um email foi enviado para o usuário com instruções para acesso.",
      });

      // Limpar formulário
      setFormData({
        name: "",
        email: "",
        role: "",
        selectedModules: [],
        department: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          "Erro ao enviar convite. Verifique os dados e tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {submitStatus.message && (
        <div
          className={`mb-6 p-4 rounded-md ${
            submitStatus.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Informações Básicas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome Completo
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite o nome completo"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@exemplo.com"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Função
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma função</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Departamento
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um departamento</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Acesso aos Módulos
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Selecione os módulos que o usuário terá acesso. As permissões
            específicas serão baseadas na função selecionada.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`p-3 rounded-md border ${
                  formData.selectedModules.includes(module.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.selectedModules.includes(module.id)}
                    onChange={() => handleModuleChange(module.id)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <span className="block font-medium text-gray-900">
                      {module.name}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {module.description}
                    </span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Mensagem Personalizada
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Adicione uma mensagem personalizada que será incluída no email de
            convite (opcional).
          </p>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="3"
            placeholder="Ex: Olá! Estamos te convidando para fazer parte da nossa plataforma..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-sm text-gray-600">
            <span className="text-red-500">*</span> Todos os campos são
            obrigatórios, exceto a mensagem personalizada.
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  name: "",
                  email: "",
                  role: "",
                  selectedModules: [],
                  department: "",
                  message: "",
                })
              }
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Limpar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Enviando..." : "Enviar Convite"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminInvitePage;
