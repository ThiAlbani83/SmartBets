import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const AdminInvitePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: ""
  });
  const { inviteUser } = useAuthStore();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await inviteUser(formData);
      alert("Invitation sent successfully!");
      setFormData({ name: "", email: "", role: "admin" });
    } catch (error) {
      alert("Error sending invitation");
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
          <option value="sac">SIGAP</option>
        </select>
        <button className="px-3 py-1 text-white rounded-md w-fit bg-primaryLight">
          Enviar Convite
        </button>
      </form>
    </div>
  );
};

export default AdminInvitePage;