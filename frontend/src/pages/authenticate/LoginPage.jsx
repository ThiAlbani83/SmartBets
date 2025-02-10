import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import loginImage from "../../assets/login-image.png";
import emailIcon from "../../assets/email-icon.png";
import passwordIcon from "../../assets/password-icon.png";
import logoImage from "../../assets/logo-tropicalize-black.png";

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
        alert("Login bem-sucedido!");
        console.log(userResponse);
        navigate("/");
      }
      // Redireciona para a página inicial após o login
    } catch (err) {
      setIsLoading(false);
      setTimeout(() => {
        clearError();
      }, 3000);
    }
  };

  return (
    <>
      {/* Desktop View */}
      <div className="w-full max-w-7xl font-roboto md:flex overflow-hidden bg-white shadow-md rounded-[75px] mx-10 hidden">
        <div className="flex flex-col flex-1 justify-start pt-24 gap-12">
          <h3 className="text-secondary font-roboto text-3xl font-medium text-center">
            Bem vindo ao <span className="font-bold">Smart</span>
            <span className="text-primaryLight font-bold">Bets</span>!
          </h3>
          <div className="flex flex-col gap-6">
            <div className="mx-14 flex relative">
              <input
                className="w-full px-12 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <img
                src={emailIcon}
                alt="emailImage"
                className="absolute top-4 left-3"
              />
            </div>
            <div className="mx-14 flex flex-col gap-6 relative">
              <input
                className="w-full px-12 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src={passwordIcon}
                alt="emailImage"
                className="absolute top-3 left-3"
              />
            </div>
            <div className="w-full mx-auto px-14 mt-6">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
                className="py-5 text-white rounded-xl w-full bg-primaryLight shadow-md"
              >
                Login
              </button>
            </div>
            <div className="flex justify-center text-sm cursor-pointer">
              <span>Esqueceu a senha?</span>
            </div>
          </div>
          <div className="flex justify-center text-sm cursor-pointer justify-self-end mt-24 mb-10">
            <img src={logoImage} alt="logo-tropicalize" className="w-48" />
          </div>
        </div>
        <div className="flex flex-1">
          <img src={loginImage} alt="login-cassino-image" />
        </div>
      </div>
      {/* Mobile View */}
      <div className="w-full font-roboto flex overflow-hidden bg-white rounded-[75px] mx-6 sm:mx-32 md:hidden">
        <div className="flex flex-col flex-1 justify-center pt-24 px-6 gap-16">
          <h3 className="text-secondary font-roboto text-2xl md:text-3xl font-medium text-center">
            Bem vindo ao <span className="font-bold">Smart</span>
            <span className="text-primaryLight font-bold">Bets</span>!
          </h3>
          <div className="flex flex-col gap-6">
            <div className=" flex relative">
              <input
                className="w-full px-12 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <img
                src={emailIcon}
                alt="emailImage"
                className="absolute top-4 left-3"
              />
            </div>
            <div className="flex flex-col gap-6 relative">
              <input
                className="w-full px-12 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src={passwordIcon}
                alt="emailImage"
                className="absolute top-3 left-3"
              />
            </div>
            <div className="w-full mx-auto mt-6">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
                className="py-5 text-white rounded-xl w-full bg-primaryLight shadow-md"
              >
                Login
              </button>
            </div>
            <div className="flex justify-center text-sm cursor-pointer">
              <span>Esqueceu a senha?</span>
            </div>
          </div>
          <div className="flex justify-center text-sm cursor-pointer justify-self-end mt-10 mb-10">
            <img src={logoImage} alt="logo-tropicalize" className="w-48" />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
