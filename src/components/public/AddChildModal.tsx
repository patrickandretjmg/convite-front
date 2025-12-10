import { useState } from 'react';
import { Baby, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, age: number) => void;
  isLoading: boolean;
  ageLimit: number;
}

export const AddChildModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  ageLimit,
}: AddChildModalProps) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const validateAge = (ageValue: number): string | null => {
    if (!ageValue || ageValue < 0) {
      return 'Idade deve ser maior ou igual a 0';
    }

    if (ageValue > 18) {
      return 'Idade deve ser menor ou igual a 18 anos';
    }

    if (ageValue > ageLimit) {
      return `Crianças com mais de ${ageLimit} anos precisam de código de convidado próprio. Por favor, cadastre como convidado adulto.`;
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const ageNumber = parseInt(age, 10);
    const validationError = validateAge(ageNumber);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!name.trim() || name.trim().length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres');
      return;
    }

    onSubmit(name.trim(), ageNumber);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setAge('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Baby className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-bold text-purple-800">
              Adicionar Criança
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da Criança"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome completo"
            required
            minLength={2}
            disabled={isLoading}
          />

          <Input
            label="Idade"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="0"
            min={0}
            max={18}
            required
            disabled={isLoading}
          />

          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              ℹ️ Crianças até {ageLimit} anos não precisam de código
            </p>
            <p className="text-xs text-blue-600 mt-1">
              A criança ficará vinculada à sua confirmação de presença
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              isLoading={isLoading}
              disabled={!name.trim() || !age}
            >
              Adicionar Criança
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
