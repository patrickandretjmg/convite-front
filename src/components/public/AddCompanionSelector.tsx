import { useState } from 'react';
import { Users, Baby, Plus, X, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AddCompanionSelectorProps {
  ageLimit: number | null;
  onAddChild: (name: string, age: number) => void;
  onAddAdult: (code: string) => void;
  isLoading: boolean;
}

type CompanionType = 'child' | 'adult' | null;

export const AddCompanionSelector = ({
  ageLimit,
  onAddChild,
  onAddAdult,
  isLoading,
}: AddCompanionSelectorProps) => {
  const [showForm, setShowForm] = useState(false);
  const [companionType, setCompanionType] = useState<CompanionType>(null);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [adultCode, setAdultCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmitChild = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const age = parseInt(childAge, 10);

    if (!childName.trim() || childName.trim().length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres');
      return;
    }

    if (!age || age < 0) {
      setError('Idade deve ser maior ou igual a 0');
      return;
    }

    if (ageLimit !== null && age > ageLimit) {
      setError(`Crianças com mais de ${ageLimit} anos precisam de código próprio. Selecione "Adulto/Adolescente" e use o código.`);
      return;
    }

    onAddChild(childName.trim(), age);
    handleReset();
  };

  const handleSubmitAdult = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adultCode.trim() || adultCode.trim().length !== 4) {
      setError('Código deve ter 4 caracteres');
      return;
    }

    onAddAdult(adultCode.trim().toUpperCase());
    handleReset();
  };

  const handleReset = () => {
    setShowForm(false);
    setCompanionType(null);
    setChildName('');
    setChildAge('');
    setAdultCode('');
    setError('');
  };

  if (!showForm) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold text-primary">Adicionar Acompanhante</h3>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          Você pode adicionar acompanhantes ao seu convite
        </p>

        <Button
          variant="primary"
          className="w-full"
          onClick={() => setShowForm(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Adicionar Acompanhante
        </Button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-bold text-primary">Adicionar Acompanhante</h3>
        </div>
        <button
          onClick={handleReset}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isLoading}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {companionType === null ? (
        <div className="space-y-4">
          <p className="text-gray-600 mb-4">
            Selecione o tipo de acompanhante que deseja adicionar:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setCompanionType('child')}
              className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Baby className="h-6 w-6 text-blue-600" />
                <h4 className="font-bold text-blue-800">Criança</h4>
              </div>
              <p className="text-sm text-blue-600">
                {ageLimit !== null
                  ? `Até ${ageLimit} anos (sem código)`
                  : 'Não precisa de código'}
              </p>
            </button>

            <button
              onClick={() => setCompanionType('adult')}
              className="p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-green-600" />
                <h4 className="font-bold text-green-800">Adulto/Adolescente</h4>
              </div>
              <p className="text-sm text-green-600">
                {ageLimit !== null
                  ? `Maior que ${ageLimit} anos (precisa código)`
                  : 'Precisa de código próprio'}
              </p>
            </button>
          </div>
        </div>
      ) : companionType === 'child' ? (
        <form onSubmit={handleSubmitChild} className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg mb-4">
            <p className="text-sm text-blue-800 font-medium">
              👶 Criança até {ageLimit} anos
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Não precisa de código de convite
            </p>
          </div>

          <Input
            label="Nome da Criança"
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Digite o nome completo"
            required
            minLength={2}
            disabled={isLoading}
          />

          <Input
            label="Idade"
            type="number"
            value={childAge}
            onChange={(e) => setChildAge(e.target.value)}
            placeholder="0"
            min={0}
            max={ageLimit || 18}
            required
            disabled={isLoading}
          />

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setCompanionType(null)}
              disabled={isLoading}
            >
              Voltar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              isLoading={isLoading}
              disabled={!childName.trim() || !childAge}
            >
              Confirmar Criança
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmitAdult} className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg mb-4">
            <p className="text-sm text-green-800 font-medium">
              👥 Acompanhante com código próprio
            </p>
            <p className="text-xs text-green-600 mt-1">
              {ageLimit !== null
                ? `Maior que ${ageLimit} anos ou já possui convite`
                : 'Já possui código de convite'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código do Acompanhante
            </label>
            <input
              type="text"
              value={adultCode}
              onChange={(e) => setAdultCode(e.target.value.toUpperCase())}
              placeholder="Ex: AB12"
              maxLength={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-center text-lg uppercase focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Digite o código único de 4 caracteres do acompanhante
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

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setCompanionType(null)}
              disabled={isLoading}
            >
              Voltar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              isLoading={isLoading}
              disabled={!adultCode.trim() || adultCode.trim().length !== 4}
            >
              Confirmar Acompanhante
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
