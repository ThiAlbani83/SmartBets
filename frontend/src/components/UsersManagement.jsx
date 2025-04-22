import { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import ConfirmationModal from "./ConfirmationModal";
import Button from "./Button";
import Input from "./Input";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAllUsers, toggleUserStatus } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
        setError(null);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Falha ao carregar usuários. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [getAllUsers]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName)
      return <FaSort className="inline ml-1 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="inline ml-1 text-primary" />
    ) : (
      <FaSortDown className="inline ml-1 text-primary" />
    );
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;

    try {
      await toggleUserStatus(selectedUser.id);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, active: !user.active } : user
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status do usuário:", error.message);
      setError(
        "Falha ao atualizar o status do usuário. Por favor, tente novamente."
      );
    } finally {
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  };

  const openConfirmationModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;

      const aValue =
        typeof a[sortConfig.key] === "string"
          ? a[sortConfig.key].toLowerCase()
          : a[sortConfig.key];
      const bValue =
        typeof b[sortConfig.key] === "string"
          ? b[sortConfig.key].toLowerCase()
          : b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full border-t-primary animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Gerenciamento de Usuários
        </h2>
        <div className="relative">
          <FaSearch className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
          <Input
            type="text"
            placeholder="Buscar por nome, email ou função..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 mb-4 bg-white border rounded-lg shadow-sm placeholder:text-gray-500 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded-md">
          {error}
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  Nome {getSortIcon("name")}
                </th>
                <th
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => requestSort("email")}
                >
                  Email {getSortIcon("email")}
                </th>
                <th
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => requestSort("role")}
                >
                  Função {getSortIcon("role")}
                </th>
                <th
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                  onClick={() => requestSort("active")}
                >
                  Status {getSortIcon("active")}
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.length > 0 ? (
                sortedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                          user.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.active ? (
                          <>
                            <FaUserCheck className="mr-1 mt-0.5" /> Ativo
                          </>
                        ) : (
                          <>
                            <FaUserTimes className="mr-1 mt-0.5" /> Inativo
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <Button
                        onClick={() => openConfirmationModal(user)}
                        className={`px-4 py-2 text-white rounded-md transition-colors ${
                          user.active
                            ? "bg-amber-500 hover:bg-amber-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {user.active ? "Desativar" : "Ativar"}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "Nenhum usuário encontrado com os critérios de busca."
                      : "Nenhum usuário cadastrado."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Total de usuários: {sortedUsers.length}{" "}
        {searchTerm && `(filtrados de ${users.length})`}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleToggleStatus}
        title={`${selectedUser?.active ? "Desativar" : "Ativar"} Usuário`}
        message={`Você tem certeza que deseja ${
          selectedUser?.active ? "desativar" : "ativar"
        } o usuário ${selectedUser?.name}?`}
        confirmButtonText={selectedUser?.active ? "Desativar" : "Ativar"}
        confirmButtonClass={
          selectedUser?.active
            ? "bg-amber-500 hover:bg-amber-600"
            : "bg-green-500 hover:bg-green-600"
        }
      />
    </div>
  );
};

export default UsersManagement;
