import { useState, useEffect } from "react";
import AdminInvitePage from "./AdminInvitePage";
import AdminAccordion from "../../components/AdminAccordion";
import UsersManagement from "../../components/UsersManagement";
import { useAuthStore } from "../../store/useAuthStore";

const AdminPanel = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingInvites: 0,
    inactiveUsers: 0,
    adminUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Obter funções do store de autenticação
  const { getAllUsers, toggleUserStatus } = useAuthStore();

  // Carregar dados de usuários e calcular estatísticas
  useEffect(() => {
    const loadUserStats = async () => {
      setIsLoading(true);
      try {
        // Obter todos os usuários
        const users = await getAllUsers();

        if (users && Array.isArray(users)) {
          // Calcular estatísticas baseadas no campo status
          const activeUsers = users.filter((user) => user.status === 1).length;
          const pendingUsers = users.filter((user) => user.status === 2).length;
          const inactiveUsers = users.filter(
            (user) => user.status === 0
          ).length;
          const adminUsers = users.filter(
            (user) => user.role === "admin" && user.status === 1
          ).length;

          setUserStats({
            totalUsers: users.length,
            activeUsers: activeUsers,
            pendingInvites: pendingUsers,
            inactiveUsers: inactiveUsers,
            adminUsers: adminUsers,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar estatísticas de usuários:", error);
        // Definir valores padrão em caso de erro
        setUserStats({
          totalUsers: 0,
          activeUsers: 0,
          pendingInvites: 0,
          inactiveUsers: 0,
          adminUsers: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserStats();
  }, [getAllUsers]);

  const toggleInviteAccordion = () => {
    setIsInviteOpen(!isInviteOpen);
  };

  const toggleManageAccordion = () => {
    setIsManageOpen(!isManageOpen);
  };

  // Função para atualizar as estatísticas após alterações
  const refreshUserStats = async () => {
    setIsLoading(true);
    try {
      const users = await getAllUsers();
      if (users && Array.isArray(users)) {
        const activeUsers = users.filter((user) => user.status === 1).length;
        const inactiveUsers = users.filter((user) => user.status === 0).length;
        const adminUsers = users.filter(
          (user) => user.role === "admin" && user.status === 1
        ).length;

        setUserStats({
          totalUsers: users.length,
          activeUsers: activeUsers,
          pendingInvites: pendingUsers,
          inactiveUsers: inactiveUsers,
          adminUsers: adminUsers,
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar estatísticas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-8xl w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Painel de Administração
      </h1>

      {/* Painel de estatísticas */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Estatísticas de Usuários</h2>
          <button
            onClick={refreshUserStats}
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Atualizar
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <p className="text-gray-500">Carregando estatísticas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total de Usuários</p>
              <p className="text-2xl font-bold text-blue-600">
                {userStats.totalUsers}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Usuários Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {userStats.activeUsers}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Convites Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {userStats.pendingInvites}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Usuários Inativos</p>
              <p className="text-2xl font-bold text-red-600">
                {userStats.inactiveUsers}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Administradores</p>
              <p className="text-2xl font-bold text-purple-600">
                {userStats.adminUsers}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Seção de Convite de Usuários */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Convidar Novos Usuários</h2>
        <div className="mb-4">
          <p className="text-gray-600 mb-4">
            Envie convites para novos usuários se juntarem à plataforma. Você
            pode definir suas permissões e departamentos.
          </p>
          <AdminInvitePage onUserInvited={refreshUserStats} />
        </div>
      </div>

      {/* Seção de Gerenciamento de Usuários */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Gerenciamento de Usuários
        </h2>
        <div className="mb-4">
          <p className="text-gray-600 mb-4">
            Gerencie usuários existentes, altere permissões, desative contas ou
            redefina senhas.
          </p>
          <UsersManagement onUserStatusChanged={refreshUserStats} />
        </div>
      </div>

      {/* Dicas e Melhores Práticas */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Dicas e Melhores Práticas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="font-medium text-gray-900 mb-1">Segurança</h3>
            <p className="text-sm text-gray-600">
              Revise regularmente as permissões de usuários e garanta que apenas
              pessoas autorizadas tenham acesso administrativo.
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h3 className="font-medium text-gray-900 mb-1">Convites</h3>
            <p className="text-sm text-gray-600">
              Ao convidar novos usuários, forneça informações claras sobre a
              plataforma e suas responsabilidades.
            </p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <h3 className="font-medium text-gray-900 mb-1">Auditoria</h3>
            <p className="text-sm text-gray-600">
              Monitore regularmente as atividades dos usuários para identificar
              comportamentos incomuns ou potenciais riscos.
            </p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <h3 className="font-medium text-gray-900 mb-1">Onboarding</h3>
            <p className="text-sm text-gray-600">
              Ofereça treinamento adequado para novos usuários para garantir que
              eles utilizem a plataforma corretamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
