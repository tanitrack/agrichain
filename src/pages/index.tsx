import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  // Redirect to dashboard on first load
  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Redirecting...</h1>
        <p className="text-xl text-gray-600">Please wait while we redirect you to the dashboard.</p>
      </div>
    </div>
  );
};

export default Index;
