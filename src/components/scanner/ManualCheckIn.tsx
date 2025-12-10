import { useState } from 'react';
import { Keyboard, Search } from 'lucide-react';
import { Button } from '../ui/Button';

interface ManualCheckInProps {
  onSubmit: (code: string) => void;
  isLoading: boolean;
}

export const ManualCheckIn = ({ onSubmit, isLoading }: ManualCheckInProps) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onSubmit(code.trim().toUpperCase());
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Keyboard className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold text-primary">Check-in Manual</h3>
      </div>

      <p className="text-gray-600 mb-6">
        Digite o código do convidado para realizar o check-in manualmente.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código do Convidado
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Ex: XLR8"
            maxLength={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-center text-2xl uppercase focus:ring-2 focus:ring-primary focus:border-transparent"
            required
            autoFocus
          />
          <p className="mt-2 text-sm text-gray-500 text-center">
            Digite o código único de 4 caracteres
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          size="lg"
          isLoading={isLoading}
          disabled={!code.trim() || code.trim().length !== 4}
        >
          <Search className="mr-2 h-5 w-5" />
          Buscar e Realizar Check-in
        </Button>
      </form>
    </div>
  );
};