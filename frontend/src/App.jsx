import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/authenticate/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect, useState } from "react";
import RedirectAuthenticatedUser from "./components/RedirectAuthenticatedUser";
import HomePage from "./pages/HomePage";
import InvitedUserRegistration from "./pages/authenticate/InvitedUserRegistration";
import { IntercomProvider } from "react-intercom";

function App() {
  const { checkAuth, user } = useAuthStore();

  useEffect(() => {
    console.log("Verificando autenticação...");
    checkAuth();
    if (localStorage.getItem("user")) {
      console.log("Usuário autenticado");
    } else {
      console.log("Usuário não autenticado");
    }
  }, [checkAuth]);


  return (
    <div className="relative flex items-center justify-center h-screen min-h-screen overflow-hidden bg-gradient-to-br from-background via-background/70 to-primary/80">
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
