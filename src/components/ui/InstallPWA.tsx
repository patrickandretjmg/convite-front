import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from './Button';
import type { BeforeInstallPromptEvent } from '../../types/camera';

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async (): Promise<void> => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white shadow-2xl rounded-lg border border-gray-200 p-4 z-50 animate-slide-up">
      <button
        onClick={() => setShowInstall(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>
      
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Download className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Instalar App</h3>
          <p className="text-sm text-gray-600 mt-1">
            Adicione o Event Invitation à tela inicial para acesso rápido
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowInstall(false)}
          className="flex-1"
        >
          Agora não
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleInstall}
          className="flex-1"
        >
          Instalar
        </Button>
      </div>
    </div>
  );
};