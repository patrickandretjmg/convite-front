import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Baby, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ConfirmChildPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [parentCode, setParentCode] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!parentCode.trim() || parentCode.trim().length !== 4) {
      setError('Código do responsável deve ter 4 caracteres');
      return;
    }

    if (!childName.trim() || childName.trim().length < 2) {
      setError('Nome da criança deve ter pelo menos 2 caracteres');
      return;
    }

    const age = parseInt(childAge, 10);
    if (!age || age < 0) {
      setError('Idade inválida');
      return;
    }

    navigate(`/${slug}/confirmar?code=${parentCode.toUpperCase()}&addChild=true&childName=${encodeURIComponent(childName)}&childAge=${age}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <button
          onClick={() => navigate(`/${slug}/confirmar`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
            <Baby className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Confirmar Criança
          </h1>
          <p className="text-gray-600">
            Adicione uma criança acompanhante sem código próprio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <p className="text-sm text-blue-800 font-medium">
              ℹ️ Como funciona
            </p>
            <ul className="text-xs text-blue-600 mt-2 space-y-1">
              <li>• Você precisa do código de um responsável que já respondeu o convite</li>
              <li>• A criança ficará vinculada a esse responsável</li>
              <li>• Mesmo que o responsável tenha recusado, pode adicionar a criança</li>
              <li>• Crianças dentro da idade limite não precisam de código próprio</li>
            </ul>
          </div>

          <Input
            label="Código do Responsável"
            type="text"
            value={parentCode}
            onChange={(e) => setParentCode(e.target.value.toUpperCase())}
            placeholder="Ex: AB12"
            maxLength={4}
            required
            className="font-mono text-center text-lg uppercase"
          />

          <Input
            label="Nome da Criança"
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Digite o nome completo"
            required
            minLength={2}
          />

          <Input
            label="Idade da Criança"
            type="number"
            value={childAge}
            onChange={(e) => setChildAge(e.target.value)}
            placeholder="0"
            min={0}
            max={18}
            required
          />

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
            size="lg"
          >
            Continuar
          </Button>
        </form>
      </div>
    </div>
  );
};
