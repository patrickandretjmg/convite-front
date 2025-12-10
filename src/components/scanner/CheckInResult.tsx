import { CheckCircle, XCircle, AlertCircle, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { GuestWithEvent } from '../../types';
import { Button } from '../ui/Button';

interface CheckInResultProps {
  guest: GuestWithEvent | null;
  isValid: boolean;
  message: string;
  onClose: () => void;
}

export const CheckInResult = ({ guest, isValid, message, onClose }: CheckInResultProps) => {
  if (!guest) {
    return (
      <div className="card text-center">
        <XCircle className="h-16 w-16 text-error mx-auto mb-4" />
        <h3 className="text-xl font-bold text-error mb-2">QR Code Inválido</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <Button variant="primary" onClick={onClose} className="w-full">
          Escanear Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header com status */}
      <div className="text-center mb-6">
        {isValid ? (
          <>
            <CheckCircle className="h-20 w-20 text-success mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-success mb-2">Check-in Realizado! ✅</h3>
          </>
        ) : guest.checkedInAt ? (
          <>
            <AlertCircle className="h-20 w-20 text-warning mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-warning mb-2">Já Fez Check-in</h3>
          </>
        ) : (
          <>
            <XCircle className="h-20 w-20 text-error mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-error mb-2">Acesso Negado</h3>
          </>
        )}
        <p className="text-gray-600">{message}</p>
      </div>

      {/* Informações do Convidado */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <User className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-gray-600">Convidado</p>
            <p className="font-bold text-gray-900">{guest.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-gray-600">Código</p>
            <p className="font-mono font-bold text-gray-900">{guest.code}</p>
          </div>
        </div>
      </div>

      {/* Status do Convite */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${
            guest.status === 'CONFIRMED' ? 'text-success' :
            guest.status === 'PENDING' ? 'text-warning' : 'text-error'
          }`}>
            {guest.status === 'CONFIRMED' ? '✅ Confirmado' :
             guest.status === 'PENDING' ? '⏳ Pendente' : '❌ Recusado'}
          </span>
        </div>

        {guest.confirmedAt && (
          <div className="flex justify-between">
            <span className="text-gray-600">Confirmado em:</span>
            <span className="text-gray-900">
              {format(new Date(guest.confirmedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </span>
          </div>
        )}

        {guest.checkedInAt && (
          <div className="flex justify-between">
            <span className="text-gray-600">Check-in em:</span>
            <span className="text-gray-900">
              {format(new Date(guest.checkedInAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </span>
          </div>
        )}
      </div>

      {/* Acompanhante */}
      {guest.companion && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
          <p className="text-sm text-blue-600 font-medium mb-1">Acompanhante:</p>
          <p className="text-blue-800 font-bold">{guest.companion.name}</p>
          <p className="text-sm text-blue-600 font-mono">Código: {guest.companion.code}</p>
        </div>
      )}

      {/* Actions */}
      <Button variant="primary" onClick={onClose} className="w-full">
        Escanear Próximo
      </Button>
    </div>
  );
};