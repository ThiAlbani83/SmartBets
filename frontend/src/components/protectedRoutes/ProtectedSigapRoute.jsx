import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedSigapRoute = ({ children }) => {
  const { user } = useAuthStore();
  const [countdown, setCountdown] = useState(3);

  if (user.role !== 'admin' || user.role !== 'SIGAP') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="mb-4 text-3xl font-bold">Não Autorizado!</h1>
        <p className="mb-4">Você será redirecionado em {countdown} segundos...</p>
        {useEffect(() => {
          let count = 5;
          setCountdown(count);
          const timer = setInterval(() => {
            count -= 1;
            setCountdown(count);
            if (count === 0) {
              clearInterval(timer);
              window.location.href = '/';
            }
          }, 1000);
          return () => clearInterval(timer);
        }, [])}
      </div>    );
  }
  return children;
};

export default ProtectedSigapRoute;