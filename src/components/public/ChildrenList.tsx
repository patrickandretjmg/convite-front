import { Baby, CheckCircle2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ChildCompanion } from '../../types';

interface ChildrenListProps {
  children: ChildCompanion[];
  isLoading: boolean;
  onRemoveChild?: (childId: string) => void;
  isRemoving?: boolean;
}

export const ChildrenList = ({ children, isLoading, onRemoveChild, isRemoving }: ChildrenListProps) => {
  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Baby className="h-6 w-6 text-purple-600" />
          <h3 className="text-xl font-bold text-purple-800">Crianças Cadastradas</h3>
        </div>
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Baby className="h-6 w-6 text-purple-600" />
        <h3 className="text-xl font-bold text-purple-800">
          Crianças Cadastradas ({children.length})
        </h3>
      </div>

      {children.length === 0 ? (
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <Baby className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Nenhuma criança cadastrada ainda</p>
          <p className="text-xs text-gray-400 mt-1">Use o botão acima para adicionar crianças</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {children.map((child) => (
              <li key={child.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800">{child.name}</p>
                      {child.checkedInAt && (
                        <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Check-in
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Idade: {child.age} {child.age === 1 ? 'ano' : 'anos'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Confirmado em: {format(new Date(child.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  {onRemoveChild && !child.checkedInAt && (
                    <button
                      onClick={() => onRemoveChild(child.id)}
                      disabled={isRemoving}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors ml-2"
                      title="Excluir criança"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
