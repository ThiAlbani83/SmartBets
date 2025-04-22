import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import loginImage from "../../assets/login-image.png";
import logoImage from "../../assets/logo-tropicalize-black.png";
import { FiMail, FiLock, FiAlertCircle, FiHelpCircle } from "react-icons/fi";
import { AiOutlineLoading } from "react-icons/ai";
import { BiCheckCircle } from "react-icons/bi";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, clearError, error, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userResponse = await login(email, password);
      if (!userResponse.active) {
        alert("Usuário Inativo. Contate a administração.");
        localStorage.removeItem("user");
        logout();
      } else {
        navigate("/");
      }
    } catch (err) {
      setIsLoading(false);
      setTimeout(() => {
        clearError();
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Bem-vindo ao <span>Smart</span>
            <span className="text-blue-600">Bets</span>
          </h2>

          <div className="mb-6">
            <p className="text-gray-600 text-center mb-8">
              Faça login para acessar o sistema de monitoramento
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative flex items-center">
                <FiAlertCircle className="mr-2" />
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <AiOutlineLoading className="animate-spin mr-2 h-5 w-5" />
                      Entrando...
                    </div>
                  ) : (
                    "Entrar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2">
          <div className="h-full flex items-center justify-center p-12">
            <img
              src={loginImage}
              alt="Login"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
