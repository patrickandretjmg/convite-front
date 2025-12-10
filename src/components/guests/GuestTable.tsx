import { Mail, Phone, CheckCircle, Clock, XCircle, Edit, Trash2, QrCode, Copy, Baby, UserCheck } from 'lucide-react';
import type { Guest } from '../../types';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';

interface GuestTableProps {
  guests: Guest[];
  eventSlug: string;
  onEdit: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
}

export const GuestTable = ({ guests, eventSlug, onEdit, onDelete }: GuestTableProps) => {
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

  const handleCopyLink = (guest: Guest) => {
    const confirmationLink = `${window.location.origin}/${eventSlug}/confirmar?code=${guest.code}`;
    navigator.clipboard.writeText(confirmationLink);
    toast.success('Link copiado!');
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {guests.map((guest) => {
              const status = statusConfig[guest.status];
              const StatusIcon = status.icon;

              return (
                <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{guest.name}</span>
                      {guest.companion && (
                        <span className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                          <UserCheck className="h-3 w-3" />
                          Acompanhante: {guest.companion.name}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {guest.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center gap-1 text-sm text-gray-700">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                      Adulto
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                      {guest.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{guest.email}</span>
                        </div>
                      )}
                      {guest.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{guest.phone}</span>
                        </div>
                      )}
                      {!guest.email && !guest.phone && (
                        <span className="text-gray-400 italic text-xs">Sem contato</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(guest)}
                        title="Copiar link de confirmação"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {guest.status === 'CONFIRMED' && (
                        <Button variant="outline" size="sm" title="Ver QR Code">
                          <QrCode className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onEdit(guest)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onDelete(guest)}
                        className="text-error hover:bg-error/10"
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
