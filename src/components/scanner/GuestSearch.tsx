import { useState } from 'react';
import { Search, User, Baby, Loader2, CheckCircle, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCheckIn } from '../../hooks/useCheckIn';
import type { Guest, ChildCompanion } from '../../types';
import { format } from 'date-fns';

interface GuestSearchProps {
  eventId: string;
}

type SearchResult = {
  type: 'adult' | 'child';
  data: Guest | ChildCompanion;
};

export const GuestSearch = ({ eventId }: GuestSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  const { searchGuest, searchChild, checkInByCode, checkInChild, isCheckingIn } = useCheckIn(eventId);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const [adults, children] = await Promise.all([
        searchGuest({ eventId, name: searchTerm }),
        searchChild({ eventId, name: searchTerm }),
      ]);

      const combinedResults: SearchResult[] = [
        ...adults.map(adult => ({ type: 'adult' as const, data: adult })),
        ...children.map(child => ({ type: 'child' as const, data: child })),
      ];

      setResults(combinedResults);
    } catch (error) {
      console.error('Erro ao buscar:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCheckIn = async (result: SearchResult) => {
    try {
      if (result.type === 'adult') {
        const guest = result.data as Guest;
        await checkInByCode(guest.code);
        const [adults, children] = await Promise.all([
          searchGuest({ eventId, name: searchTerm }),
          searchChild({ eventId, name: searchTerm }),
        ]);
        const combinedResults: SearchResult[] = [
          ...adults.map(adult => ({ type: 'adult' as const, data: adult })),
          ...children.map(child => ({ type: 'child' as const, data: child })),
        ];
        setResults(combinedResults);
      } else {
        const child = result.data as ChildCompanion;
        await checkInChild(child.id);
        const [adults, children] = await Promise.all([
          searchGuest({ eventId, name: searchTerm }),
          searchChild({ eventId, name: searchTerm }),
        ]);
        const combinedResults: SearchResult[] = [
          ...adults.map(adult => ({ type: 'adult' as const, data: adult })),
          ...children.map(child => ({ type: 'child' as const, data: child })),
        ];
        setResults(combinedResults);
      }
    } catch (error) {
      console.error('Erro ao fazer check-in:', error);
    }
  };

  const canCheckIn = (result: SearchResult): boolean => {
    if (result.type === 'adult') {
      const guest = result.data as Guest;
      return !guest.checkedInAt && guest.status === 'CONFIRMED';
    } else {
      const child = result.data as ChildCompanion;
      return !child.checkedInAt;
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">
          Buscar Convidado
        </h2>
        {results.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Visualização em Tabela"
            >
              <TableIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'cards'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Visualização em Cards"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome (adultos e crianças)..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSearching}
          >
            Buscar
          </Button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold text-gray-900 mb-4">Resultados ({results.length})</h3>
          
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">Nome</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">Tipo</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">Código/Idade</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-700 border-b">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => {
                    const isAdult = result.type === 'adult';
                    const guest = result.data as Guest;
                    const child = result.data as ChildCompanion;
                    const hasCheckedIn = isAdult ? guest.checkedInAt : child.checkedInAt;

                    return (
                      <tr 
                        key={`${result.type}-${result.data.id}`}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${hasCheckedIn ? 'bg-green-50' : ''} hover:bg-gray-100 transition-colors`}
                      >
                        <td className="px-4 py-3 border-b">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{result.data.name}</span>
                            {hasCheckedIn && <CheckCircle className="h-5 w-5 text-green-600" />}
                          </div>
                        </td>
                        <td className="px-4 py-3 border-b">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            isAdult ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {isAdult ? <User className="h-3 w-3" /> : <Baby className="h-3 w-3" />}
                            {isAdult ? 'Adulto' : 'Criança'}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b text-sm text-gray-600">
                          {isAdult ? guest.code : `${child.age} anos`}
                        </td>
                        <td className="px-4 py-3 border-b">
                          {hasCheckedIn ? (
                            <span className="text-xs text-green-600 font-medium">
                              Check-in: {format(new Date(hasCheckedIn), 'dd/MM HH:mm')}
                            </span>
                          ) : isAdult ? (
                            guest.status === 'CONFIRMED' ? (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                                Aguardando
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                {guest.status === 'PENDING' ? 'Pendente' : 'Recusou'}
                              </span>
                            )
                          ) : (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                              Aguardando
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 border-b text-center">
                          {canCheckIn(result) && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleCheckIn(result)}
                              isLoading={isCheckingIn}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Check-in
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result) => {
                const isAdult = result.type === 'adult';
                const guest = result.data as Guest;
                const child = result.data as ChildCompanion;
                const hasCheckedIn = isAdult ? guest.checkedInAt : child.checkedInAt;

                return (
                  <div
                    key={`${result.type}-${result.data.id}`}
                    className={`p-4 rounded-lg border-2 ${
                      hasCheckedIn 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {isAdult ? (
                            <User className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Baby className="h-4 w-4 text-purple-600" />
                          )}
                          <h4 className="font-bold text-gray-900">{result.data.name}</h4>
                          {hasCheckedIn && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">Tipo:</span>{' '}
                            {isAdult ? 'Adulto' : 'Criança'}
                          </p>
                          {isAdult ? (
                            <>
                              <p><span className="font-medium">Código:</span> {guest.code}</p>
                              {guest.email && <p>{guest.email}</p>}
                              {guest.phone && <p>{guest.phone}</p>}
                            </>
                          ) : (
                            <p><span className="font-medium">Idade:</span> {child.age} anos</p>
                          )}
                          {hasCheckedIn && (
                            <p className="text-xs text-green-600 mt-1">
                              Check-in: {format(new Date(hasCheckedIn), "dd/MM/yyyy 'às' HH:mm")}
                            </p>
                          )}
                        </div>
                      </div>

                      {canCheckIn(result) && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleCheckIn(result)}
                          isLoading={isCheckingIn}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Check-in
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!isSearching && searchTerm && results.length === 0 && (
        <div className="mt-6 text-center py-8">
          <p className="text-gray-600">
            Nenhum convidado encontrado com esse nome
          </p>
        </div>
      )}
    </div>
  );
};
