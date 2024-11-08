import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/authenticate/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect, useState } from "react";
import RedirectAuthenticatedUser from "./components/RedirectAuthenticatedUser";
import HomePage from "./pages/HomePage";

function App() {
  const { checkAuth } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("Verificando autenticação...");
    if(checkAuth()){
      setIsAuthenticated(true);
      console.log("Usuário autenticado!");
    } else {
      setIsAuthenticated(false);
      console.log("Usuário não autenticado!");
    } // Verifica a autenticação ao carregar o app

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
      </Routes>
    </div>
  );
}

export default App;
