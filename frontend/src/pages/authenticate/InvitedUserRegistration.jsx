import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import userIcon from "../../assets/user-icon.png";
import emailIcon from "../../assets/email-icon.png";
import passwordIcon from "../../assets/password-icon.png";
import roleIcon from "../../assets/role-icon.png";
import logoImage from "../../assets/logo-tropicalize-black.png";
import registerImage from "../../assets/register-image.png";

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

  // Modify the handleSubmit function in the existing component
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não conferem!");
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    try {
      const result = await registerInvitedUser({
        token,
        password: formData.password,
      });

      if (result.success) {
        alert("Registro realizado com sucesso!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error details:", error);
      alert(error.message || "Erro ao registrar usuário");
    }
  };

  return (
    <>
      {/* Desktop View */}
      <div className="w-full max-w-7xl font-roboto md:flex overflow-hidden bg-white shadow-md rounded-[75px] mx-10 hidden">
        <div className="flex flex-col flex-1 justify-start pt-24 gap-12">
          <h3 className="text-secondary font-roboto text-3xl font-medium text-center">
            Faça seu cadastro!
          </h3>
          <div className="flex flex-col gap-6">
            <div className="mx-14 flex relative">
              <input
                className="w-full px-12 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-100"
                type="text"
                value={formData.name}
                disabled
              />
              <img
                src={userIcon}
                alt="emailImage"
                className="absolute top-4 left-3"
              />
            </div>
            <div className="mx-14 flex relative">
              <input
                className="w-full px-12 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-100"
                type="text"
                value={formData.email}
                disabled
              />
              <img
                src={emailIcon}
                alt="emailImage"
                className="absolute top-4 left-3"
              />
            </div>
            <div className="mx-14 flex relative">
              <input
                className="w-full px-12 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-100"
                type="text"
                value={formData.role}
                disabled
              />
              <img
                src={roleIcon}
                alt="emailImage"
                className="absolute top-2 left-3"
              />
            </div>
            <div className="mx-14 flex relative">
              <input
                type="password"
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-12 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <img
                src={passwordIcon}
                alt="emailImage"
                className="absolute top-3 left-3"
              />
            </div>
            <div className="mx-14 flex relative">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirme sua Senha"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-12 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                Registrar
              </button>
            </div>
          </div>
          <div className="flex justify-center text-sm cursor-pointer justify-self-end mt-10 mb-10">
            <img src={logoImage} alt="logo-tropicalize" className="w-48" />
          </div>
        </div>
        <div className="flex flex-1">
          <img src={registerImage} alt="login-cassino-image" />
        </div>
      </div>
      {/* Mobile View */}
      <div className="w-full font-roboto flex overflow-hidden bg-white rounded-[75px] blur-none mx-10 md:hidden">
        <div className="flex flex-col flex-1 justify-start pt-10 gap-10">
          <h3 className="text-secondary font-roboto text-3xl font-medium text-center">
            Faça seu cadastro!
          </h3>
          <div className="flex flex-col gap-6">
            <div className="mx-14 flex relative">
              <input
                className="w-full px-12 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-100"
                type="text"
                value={formData.name}
                disabled
              />
              <img
                src={userIcon}
                alt="emailImage"
                className="absolute top-4 left-3"
              />
            </div>
            <div className="mx-14 flex relative">
              <input
                className="w-full px-12 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-100"
                type="text"
                value={formData.email}
                disabled
              />
              <img
                src={emailIcon}
                alt="emailImage"
                className="absolute top-4 left-3"
              />
            </div>
            <div className="mx-14 flex relative">
              <input
                className="w-full px-12 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-100"
                type="text"
                value={formData.role}
                disabled
              />
              <img
                src={roleIcon}
                alt="emailImage"
                className="absolute top-2 left-3"
              />
            </div>
            <div className="mx-14 flex relative">
              <input
                type="password"
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-12 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <img
                src={passwordIcon}
                alt="emailImage"
                className="absolute top-3 left-3"
              />
            </div>
            <div className="mx-14 flex relative">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirme sua Senha"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-12 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                Registrar
              </button>
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

export default InvitedUserRegistration;
