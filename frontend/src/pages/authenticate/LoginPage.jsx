import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { CiMail, CiLock } from "react-icons/ci";
import { motion } from "framer-motion";
import Input from "../../components/Input";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, clearError, error } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userResponse = await login(email, password);
      console.log("Usuário após login:", userResponse);
      navigate("/"); // Redireciona para a página inicial após o login
    } catch (err) {
      setIsLoading(false);
        setTimeout(() => {
          clearError();
        }, 3000);
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
          Bem vindos a Tropicalize
        </h2>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
            return false;
          }}
        >
          <Input
            icon={CiMail}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={CiLock}
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="mb-2 font-semibold text-red-500">{error}</p>}

          <motion.button
            className="w-full px-4 py-3 mt-5 font-bold text-white transition duration-200 rounded-lg shadow-lg bg-gradient-to-r from-primary to-primary/50 focus:outline-none focus:ring-2 focus:ring-offset-white"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            disabled={isLoading}
          >
            Login
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginPage;
