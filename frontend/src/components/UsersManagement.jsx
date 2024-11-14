import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const { getAllUsers, toggleUserStatus } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

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

  const handleToggleStatus = async (userId) => {
    try {
      console.log("User ID being passed:", userId);
      const updatedUser = await toggleUserStatus(userId);
      
      // Update only the specific user's status
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, active: !user.active } : user
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status do usuário:", error);
    }
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
          <input
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
                      className={`px-2 py-1 rounded ${
                        user.active
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {user.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b">
                    <button
                      onClick={() => {
                        console.log("Current user object:", user); // This will show the specific user being clicked
                        handleToggleStatus(user.id);
                      }}
                      className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      {user.active ? "Tornar Inativo" : "Tornar Ativo"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
