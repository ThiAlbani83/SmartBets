import { Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/authenticate/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import RedirectAuthenticatedUser from "./components/RedirectAuthenticatedUser";
import HomePage from "./pages/HomePage";
import InvitedUserRegistration from "./pages/authenticate/InvitedUserRegistration";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


function App() {
  const { checkAuth, isAuthenticated, refreshToken } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();  // O hook useNavigate deve ser chamado aqui no corpo do componente

useEffect(() => {
  checkAuth(); // Verifica a autenticação

  if (isAuthenticated) {
  } else {
    if (location.pathname !== "/login") {
      navigate("/login");  // Redireciona para login se não autenticado
    }
  }
}, [isAuthenticated, location, navigate, checkAuth]);  // Dependências corretas

useEffect(() => {
  // Recarregar o estado de autenticação quando o localStorage for alterado
  const interval = setInterval(() => {
    checkAuth();  // Verifica autenticação novamente a cada intervalo
  }, 60000); // 1 minuto

  return () => clearInterval(interval);  // Limpar o intervalo quando o componente for desmontado
}, [checkAuth]);


  const getBackgroundClass = () => {
    if (location.pathname.includes("/register/") && window.innerWidth < 768) {
      return 'before:content-[""] before:fixed before:top-[-10%] before:left-[-10%] before:right-[-10%] before:bottom-[-10%] before:bg-[url("/register-image.png")] before:bg-cover before:bg-center before:blur-md before:-z-10 md:bg-background';
    } else if (
      location.pathname.includes("/login") &&
      window.innerWidth < 768
    ) {
      return 'before:content-[""] before:fixed before:top-[-10%] before:left-[-10%] before:right-[-10%] before:bottom-[-10%] before:bg-[url("/login-image.png")] before:bg-cover before:bg-center before:blur-md before:-z-10 md:bg-background';
    }
    return "bg-background";
  };

  return (
    <div
      className={`relative flex items-center justify-center h-screen min-h-screen overflow-hidden ${getBackgroundClass()}`}
    >
      <Toaster position="top-center" />
      <Routes>
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/register/:token" element={<InvitedUserRegistration />} />
      </Routes>
    </div>
  );
}

export default App;
