import { Download } from 'lucide-react';
import { Button } from '../ui/Button';

interface QRCodeDisplayProps {
  qrCode: string;
  guestName: string;
  guestCode: string;
}

export const QRCodeDisplay = ({ qrCode, guestName, guestCode }: QRCodeDisplayProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qrcode-${guestCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card text-center">
      <h3 className="text-xl font-bold text-primary mb-4">
        Seu QR Code de Entrada
      </h3>
      
      {/* QR Code */}
      <div className="inline-block p-6 bg-white rounded-lg shadow-lg mb-4">
        <img
          src={qrCode}
          alt={`QR Code - ${guestName}`}
          className="w-64 h-64"
        />
      </div>

      {/* Info */}
      <div className="mb-4">
        <p className="text-gray-700 font-medium mb-1">{guestName}</p>
        <p className="text-sm text-gray-500 font-mono">Código: {guestCode}</p>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
        <p className="text-sm text-blue-800">
          <strong>📱 Importante:</strong> Apresente este QR Code na entrada do evento. 
          Você pode baixá-lo ou salvá-lo como captura de tela.
        </p>
      </div>

      {/* Download Button */}
      <Button variant="primary" onClick={handleDownload} className="w-full">
        <Download className="mr-2 h-5 w-5" />
        Baixar QR Code
      </Button>
    </div>
  );
};