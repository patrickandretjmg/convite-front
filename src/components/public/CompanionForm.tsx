import { useState } from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import type { GuestWithEvent } from '../../types';

interface CompanionFormProps {
  guest: GuestWithEvent; // ✅ Usar tipo correto
  onAddCompanion: (guestCode: string, companionCode: string) => void;
  onRemoveCompanion: (guestCode: string) => void;
  isLoading: boolean;
}

export const CompanionForm = ({
  guest,
  onAddCompanion,
  onRemoveCompanion,
  isLoading,
}: CompanionFormProps) => {
  const [companionCode, setCompanionCode] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companionCode.trim()) {
      onAddCompanion(guest.code, companionCode.trim().toUpperCase());
      setCompanionCode('');
      setShowForm(false);
    }
  };

  const handleRemove = () => {
    onRemoveCompanion(guest.code);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-6 w-6 text-green-600" />
        <h3 className="text-xl font-bold text-green-800">Acompanhante Adulto</h3>
      </div>

      {/* Tem acompanhante */}
      {guest.companion ? (
        <div>
          <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg mb-4">
            <p className="text-sm text-green-600 font-medium mb-2">✅ Acompanhante vinculado:</p>
            <p className="text-lg font-bold text-green-800">{guest.companion.name}</p>
            <p className="text-sm text-green-600 font-mono">Código: {guest.companion.code}</p>
            <p className="text-xs text-green-600 mt-2">
              Status: {guest.companion.status === 'CONFIRMED' ? '✅ Confirmado' : 
                       guest.companion.status === 'PENDING' ? '⏳ Pendente' : '❌ Recusado'}
            </p>
          </div>
          
          <Button
            variant="outline"
            className="w-full text-error hover:bg-error/10"
            onClick={handleRemove}
            isLoading={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remover Acompanhante
          </Button>
        </div>
      ) : (
        /* Não tem acompanhante */
        <div>
          {!showForm ? (
            <>
              <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg mb-4">
                <p className="text-sm text-green-800 font-medium">
                  👥 Acompanhante com código próprio
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Vincule um acompanhante adulto ou adolescente que também recebeu convite com código único
                </p>
              </div>
              <Button
                variant="primary"
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                onClick={() => setShowForm(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Vincular Acompanhante Adulto
              </Button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código do Acompanhante
                </label>
                <input
                  type="text"
                  value={companionCode}
                  onChange={(e) => setCompanionCode(e.target.value.toUpperCase())}
                  placeholder="Ex: AB12"
                  maxLength={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-center text-lg uppercase focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Digite o código único de 4 caracteres do seu acompanhante
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Atenção:</strong> Só é possível adicionar convidados que:
                </p>
                <ul className="text-sm text-yellow-800 mt-2 ml-4 list-disc">
                  <li>Pertencem a este evento</li>
                  <li>Ainda não recusaram o convite</li>
                  <li>Não são você mesmo</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowForm(false);
                    setCompanionCode('');
                  }}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  isLoading={isLoading}
                  disabled={!companionCode.trim() || companionCode.trim().length !== 4}
                >
                  Adicionar
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};