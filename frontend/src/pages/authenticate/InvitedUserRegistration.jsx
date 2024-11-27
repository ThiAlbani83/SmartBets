import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { CiMail } from "react-icons/ci";
import { MdOutlinePerson2 } from "react-icons/md";
import { MdAssignmentInd } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

import Input from "../../components/Input";

const InvitedUserRegistration = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { registerInvitedUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setFormData((prev) => ({
        ...prev,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      }));
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    try {
      await registerInvitedUser({
        token,
        password: formData.password,
      });
      navigate("/login");
    } catch (error) {
      console.error(error); // Add this to see the specific error
      alert("Error registering user");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md overflow-hidden shadow-xl bg-opacity-80 bg-background backdrop-filter backdrop-blur-xl rounded-2xl"
    >
      <div className="flex flex-col gap-4 p-8">
        <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-primary to-white bg-clip-text">
          Registro de Usuário
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <Input
            icon={MdOutlinePerson2}
            type="text"
            value={formData.name}
            disabled
            className="border-b-2 w-80"
          />
          <Input
            icon={CiMail}
            type="email"
            value={formData.email}
            disabled
            className="border-b-2 w-80"
          />
          <Input
            icon={MdAssignmentInd}
            type="text"
            value={formData.role}
            disabled
            className="border-b-2 w-80"
          />
          <Input
            icon={RiLockPasswordLine}
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="border-b-2 focus:outline-none w-80"
          />
          <Input
            icon={RiLockPasswordLine}
            type="password"
            name="confirmPassword"
            placeholder="Confirme sua Senha"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="border-b-2 focus:outline-none w-80"
          />
          <motion.button className="w-full px-4 py-3 mt-5 font-bold text-white transition duration-200 rounded-lg shadow-lg bg-gradient-to-r from-primary to-primary/50 focus:outline-none focus:ring-2 focus:ring-offset-white">
            Registrar
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default InvitedUserRegistration;
