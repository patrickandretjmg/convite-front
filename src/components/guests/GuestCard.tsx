import { Mail, Phone, CheckCircle, Clock, XCircle, Edit, Trash2, QrCode, Link2, Copy, Baby } from 'lucide-react';
import type { Guest, ChildCompanion } from '../../types';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { childCompanionService } from '../../services/childCompanionService';

interface GuestCardProps {
  guest: Guest;
  eventSlug: string;
  onEdit: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
}

export const GuestCard = ({ guest, eventSlug, onEdit, onDelete }: GuestCardProps) => {
  const [children, setChildren] = useState<ChildCompanion[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);

  useEffect(() => {
    const loadChildren = async () => {
      if (guest.status !== 'CONFIRMED') {
        setChildren([]);
        return;
      }

      setIsLoadingChildren(true);
      try {
        const data = await childCompanionService.getGuestChildren(guest.code);
        setChildren(data);
      } catch (error) {
        console.error('Erro ao carregar crianças:', error);
      } finally {
        setIsLoadingChildren(false);
      }
    };

    loadChildren();
  }, [guest.code, guest.status]);
  const statusConfig = {
    PENDING: {
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10',
      label: 'Pendente',
    },
    CONFIRMED: {
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
      label: 'Confirmado',
    },
    DECLINED: {
      icon: XCircle,
      color: 'text-error',
      bg: 'bg-error/10',
      label: 'Recusado',
    },
  };

  const status = statusConfig[guest.status];
  const StatusIcon = status.icon;

  // ✅ Link direto de confirmação
  const confirmationLink = `${window.location.origin}/${eventSlug}/confirmar?code=${guest.code}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(confirmationLink);
    toast.success('Link copiado! 📋');
  };

  const handleCopyWhatsAppMessage = () => {
    const message = `Olá ${guest.name}! 🎉\n\nVocê está convidado(a) para nosso evento!\n\nPara confirmar sua presença, acesse:\n${confirmationLink}\n\nSeu código de acesso: ${guest.code}`;
    navigator.clipboard.writeText(message);
    toast.success('Mensagem copiada! Envie pelo WhatsApp 📱');
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-primary mb-1">
            {guest.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {guest.code}
            </span>
            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {guest.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span className="truncate">{guest.email}</span>
          </div>
        )}
        {guest.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{guest.phone}</span>
          </div>
        )}
        {!guest.email && !guest.phone && (
          <p className="text-sm text-gray-400 italic">Sem informações de contato</p>
        )}
      </div>

      {/* Companion */}
      {guest.companion && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-600 font-medium mb-1">Acompanhante</p>
          <p className="text-sm text-blue-800 font-bold">{guest.companion.name}</p>
          <p className="text-xs text-blue-600 font-mono mb-2">{guest.companion.code}</p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-blue-700">Status:</span>
            {guest.companion.status === 'CONFIRMED' && (
              <span className="flex items-center gap-1 text-xs font-medium text-green-700">
                <CheckCircle className="h-3 w-3" />
                Confirmado
              </span>
            )}
            {guest.companion.status === 'PENDING' && (
              <span className="flex items-center gap-1 text-xs font-medium text-yellow-700">
                <Clock className="h-3 w-3" />
                Pendente
              </span>
            )}
            {guest.companion.status === 'DECLINED' && (
              <span className="flex items-center gap-1 text-xs font-medium text-red-700">
                <XCircle className="h-3 w-3" />
                Recusado
              </span>
            )}
          </div>
        </div>
      )}

      {/* Children */}
      {children.length > 0 && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-xs text-purple-600 font-medium mb-2 flex items-center gap-1">
            <Baby className="h-3 w-3" />
            Crianças Cadastradas ({children.length})
          </p>
          <div className="space-y-2">
            {children.map((child) => (
              <div key={child.id} className="flex items-center justify-between text-sm">
                <span className="text-purple-800 font-medium">{child.name}</span>
                <span className="text-xs text-purple-600">{child.age} {child.age === 1 ? 'ano' : 'anos'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Link de Confirmação */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 font-medium mb-2 flex items-center gap-1">
          <Link2 className="h-3 w-3" />
          Link de Confirmação
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={confirmationLink}
            readOnly
            className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded bg-white font-mono"
          />
          <Button variant="outline" size="sm" onClick={handleCopyLink} title="Copiar link">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 text-xs"
          onClick={handleCopyWhatsAppMessage}
        >
          <Phone className="mr-1 h-3 w-3" />
          Copiar Mensagem WhatsApp
        </Button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        {guest.status === 'CONFIRMED' && (
          <Button variant="outline" size="sm" className="flex-1">
            <QrCode className="mr-2 h-4 w-4" />
            Ver QR Code
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(guest)}
          className="flex-1"
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(guest)}
          className="text-error hover:bg-error/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};