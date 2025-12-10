import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';

export const LandingPage = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark text-white">
      <nav className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🎉 Event Invitation</h1>
        <div className="flex gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="secondary">Ir para Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary">Criar Conta</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Convites Digitais Inteligentes
        </h2>
        <p className="text-xl mb-8 text-white/90">
          Gerencie seus eventos, envie convites e controle presenças com QR Code
        </p>
        <Link to={isAuthenticated ? '/dashboard' : '/register'}>
          <Button variant="secondary" size="lg">
            Começar Agora
          </Button>
        </Link>
      </main>
    </div>
  );
};