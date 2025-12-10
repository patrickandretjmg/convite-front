import { Baby, Trash2, User } from 'lucide-react';
import type { ChildCompanion } from '../../types';
import { Button } from '../ui/Button';

interface ChildrenTableProps {
  children: ChildCompanion[];
  getGuestName: (guestCode: string) => string | undefined;
  onRemove: (childId: string) => void;
  isRemoving: boolean;
}

export const ChildrenTable = ({ children, getGuestName, onRemove, isRemoving }: ChildrenTableProps) => {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 mb-4 px-6 pt-6">
        <Baby className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-purple-800">
          Crianças Cadastradas ({children.length})
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-purple-50 border-b border-purple-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                Idade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                Responsável
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-purple-700 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {children.map((child) => (
              <tr key={child.id} className="hover:bg-purple-50/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{child.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {child.age} {child.age === 1 ? 'ano' : 'anos'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center gap-1 text-sm text-purple-700">
                    <Baby className="h-4 w-4" />
                    Criança
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {getGuestName(child.guestCode) || 'Convidado não encontrado'}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{child.guestCode}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onRemove(child.id)}
                    className="text-error hover:bg-error/10"
                    disabled={isRemoving}
                    title="Remover criança"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
