import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import ConfirmationModal from "./ConfirmationModal";
import Button from "./Button";
import Input from "./Input";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const { getAllUsers, toggleUserStatus } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
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

  const handleToggleStatus = async () => {
    if (!selectedUser) return;

    try {
      const updatedUser = await toggleUserStatus(selectedUser.id);
      setUsers(prevUsers =>
        prevUsers.map(user => 
          user.id === selectedUser.id ? { ...user, active: !user.active } : user
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status do usuário:", error.message);
      // Add user feedback here (e.g., toast notification)
    } finally {
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  };

  const openConfirmationModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="container p-4 mx-auto">
      <div className="overflow-x-auto">
        <div className="overflow-y-auto max-h-96">
          <Input
            type="text"
            placeholder="Buscar por nome do usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 mb-4 bg-transparent border-b placeholder:text-gray-600 border-b-primary focus:outline-none focus:border-b-2"
          />
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="px-6 py-3 border-b">Nome</th>
                <th className="px-6 py-3 border-b">Email</th>
                <th className="px-6 py-3 border-b">Função</th>
                <th className="px-6 py-3 border-b">Status</th>
                <th className="px-6 py-3 border-b">Ativar/Desativar</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{user.name}</td>
                  <td className="px-6 py-4 border-b">{user.email}</td>
                  <td className="px-6 py-4 border-b">{user.role}</td>
                  <td className="px-6 py-4 border-b">
                    <span
                      className={`py-1 rounded ${
                        user.active
                          ? "bg-green-200 px-8 text-green-800"
                          : "bg-red-200 px-6 text-red-800"
                      }`}
                    >
                      {user.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b">
                    <Button
                      onClick={() => openConfirmationModal(user)}
                      className="px-4 py-2 text-white rounded w-36 bg-primary hover:bg-primaryLight"
                    >
                      {user.active ? "Tornar Inativo" : "Tornar Ativo"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleToggleStatus}
        message={`Você tem certeza que deseja ${selectedUser?.active ? "inativar" : "ativar"} o usuário ${selectedUser?.name}?`}
      />
    </div>
  );
};

export default UsersManagement;