import { Baby, Trash2, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ChildCompanion } from '../../types';

interface ChildCompanionCardProps {
  child: ChildCompanion;
  guestName?: string;
  guestCode?: string;
  onRemove?: (childId: string) => void;
  isRemoving?: boolean;
}

export const ChildCompanionCard = ({ 
  child, 
  guestName, 
  guestCode,
  onRemove, 
  isRemoving 
}: ChildCompanionCardProps) => {
  return (
    <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Baby className="h-5 w-5 text-purple-600" />
            <p className="text-lg font-bold text-purple-800">
              {child.name}
            </p>
            {child.checkedInAt && (
              <div className="flex items-center gap-1 text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                Check-in
              </div>
            )}
          </div>
          
          <div className="space-y-1 text-sm text-purple-600">
            <p>
              <span className="font-medium">Idade:</span> {child.age} {child.age === 1 ? 'ano' : 'anos'}
            </p>
            
            {guestName && (
              <p>
                <span className="font-medium">Responsável:</span> {guestName}
                {guestCode && <span className="font-mono ml-1">({guestCode})</span>}
              </p>
            )}
            
            <p className="text-xs text-purple-500">
              Confirmado em: {format(new Date(child.confirmedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>
        
        {onRemove && !child.checkedInAt && (
          <button
            onClick={() => onRemove(child.id)}
            disabled={isRemoving}
            className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors ml-2"
            title="Excluir criança"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
