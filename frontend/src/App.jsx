import { Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/authenticate/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import RedirectAuthenticatedUser from "./components/RedirectAuthenticatedUser";
import HomePage from "./pages/HomePage";
import InvitedUserRegistration from "./pages/authenticate/InvitedUserRegistration";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    console.log("Verificando autenticação...");
    checkAuth();
    if (localStorage.getItem("user")) {
      console.log("Usuário autenticado");
    } else {
      console.log("Usuário não autenticado");
    }
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
