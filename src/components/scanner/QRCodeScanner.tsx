import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, AlertCircle, Smartphone, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import type { CameraError } from '../../types/camera';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export const QRCodeScanner = ({ onScan, onError }: QRCodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isSecureContext, setIsSecureContext] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const elementId = 'qr-reader';

  useEffect(() => {
    const secure = window.isSecureContext;
    setIsSecureContext(secure);

    if (!secure) {
      setError('Scanner de QR Code requer HTTPS. Use localhost para desenvolvimento ou HTTPS em produção.');
    }

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch((err: Error) => console.error('Erro ao parar scanner:', err));
      }
    };
  }, []);

  const handleCameraError = (err: Error | CameraError): void => {
    const cameraError = err as CameraError;
    
    if (cameraError.name === 'NotAllowedError' || cameraError.name === 'PermissionDeniedError') {
      setPermissionDenied(true);
      setError('Permissão de câmera negada. Verifique as configurações do navegador.');
    } else {
      const errorMessage = cameraError.message || 'Erro ao acessar câmera';
      setError(errorMessage);
    }
    
    onError?.(cameraError.message || 'Erro ao acessar câmera');
    setIsScanning(false);
  };

  const startScanning = async (): Promise<void> => {
    try {
      setError(null);
      setPermissionDenied(false);

      if (!isSecureContext) {
        setError('Scanner requer HTTPS ou localhost');
        return;
      }

      setIsScanning(true);

      const scanner = new Html5Qrcode(elementId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      scannerRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      try {
        const cameras = await Html5Qrcode.getCameras();
        
        if (!cameras || cameras.length === 0) {
          throw new Error('Nenhuma câmera encontrada');
        }

        const backCamera = cameras.find(
          (camera) =>
            camera.label.toLowerCase().includes('back') ||
            camera.label.toLowerCase().includes('traseira') ||
            camera.label.toLowerCase().includes('rear') ||
            camera.label.toLowerCase().includes('environment')
        );
        
        const selectedCamera = backCamera || cameras[0];

        await scanner.start(
          selectedCamera.id,
          config,
          (decodedText: string) => {
            onScan(decodedText);
            stopScanning();
          },
          undefined
        );

      } catch (cameraError) {
        const err = cameraError as CameraError;
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setPermissionDenied(true);
          setError('Permissão de câmera negada. Por favor, permita o acesso à câmera.');
          setIsScanning(false);
        } else {
          try {
            await scanner.start(
              { facingMode: 'environment' },
              config,
              (decodedText: string) => {
                onScan(decodedText);
                stopScanning();
              },
              undefined
            );
          } catch (fallbackError) {
            handleCameraError(fallbackError as Error);
          }
        }
      }

    } catch (err) {
      console.error('Erro ao iniciar scanner:', err);
      handleCameraError(err as Error);
    }
  };

  const stopScanning = async (): Promise<void> => {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
      }
    } catch (err) {
      console.error('Erro ao parar scanner:', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      {!isSecureContext && (
        <div className="flex items-start gap-2 p-4 bg-warning/10 border border-warning rounded-lg">
          <Lock className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-warning mb-1">Contexto Inseguro</p>
            <p className="text-sm text-warning/80">
              O scanner de QR Code requer HTTPS. Use <code className="bg-white px-1 rounded">localhost</code> para desenvolvimento
              ou configure HTTPS em produção.
            </p>
          </div>
        </div>
      )}

      <div className="relative bg-black rounded-lg overflow-hidden">
        <div
          id={elementId}
          className={`w-full ${isScanning ? 'block' : 'hidden'}`}
          style={{ minHeight: '400px' }}
        />
        
        {!isScanning && (
          <div className="flex items-center justify-center h-[400px] bg-gray-100">
            <div className="text-center">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Câmera desativada</p>
              <p className="text-sm text-gray-500 mt-2">
                Clique em "Iniciar Scanner" para começar
              </p>
            </div>
          </div>
        )}
      </div>

      {permissionDenied && (
        <div className="flex items-start gap-2 p-4 bg-error/10 border border-error rounded-lg">
          <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-error mb-2">Permissão de Câmera Negada</p>
            <p className="text-sm text-error/80 mb-3">
              Para usar o scanner de QR Code, você precisa permitir o acesso à câmera.
            </p>
            <div className="space-y-2 text-sm text-error/80">
              <p className="font-medium">Como permitir:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li><strong>Chrome/Edge:</strong> Clique no ícone ao lado da URL → Permissões → Câmera → Permitir</li>
                <li><strong>Safari iOS:</strong> Configurações → Safari → Câmera → Permitir</li>
                <li><strong>Firefox:</strong> Clique no ícone de câmera na barra de endereço</li>
              </ul>
              <p className="mt-3 font-medium">Depois de permitir, recarregue a página.</p>
            </div>
          </div>
        </div>
      )}

      {error && !permissionDenied && !isSecureContext && (
        <div className="flex items-start gap-2 p-4 bg-error/10 border border-error rounded-lg">
          <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-error">Erro</p>
            <p className="text-sm text-error/80 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {!isScanning ? (
          <Button 
            variant="primary" 
            onClick={startScanning} 
            className="flex-1"
            disabled={!isSecureContext}
          >
            <Camera className="mr-2 h-5 w-5" />
            Iniciar Scanner
          </Button>
        ) : (
          <Button variant="outline" onClick={stopScanning} className="flex-1">
            Parar Scanner
          </Button>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Smartphone className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">💡 Instruções:</p>
            <ul className="space-y-1 list-disc ml-4">
              <li>Permita o acesso à câmera quando solicitado</li>
              <li>Posicione o QR Code dentro do quadrado</li>
              <li>Mantenha a câmera estável</li>
              <li>O scan é automático quando detectado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};