import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return (
    <div>
      <Navigate to="/" replace />
    </div>
    
  )
  }

  return children;
};

export default RedirectAuthenticatedUser;
