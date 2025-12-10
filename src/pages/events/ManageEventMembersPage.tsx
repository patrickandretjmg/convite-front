import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Trash2, Shield, Eye, Loader2 } from 'lucide-react';
import { useEventDetails } from '../../hooks/useEventDetails';
import { useEventMembers } from '../../hooks/useEventMembers';
import { Button } from '../../components/ui/Button';
import type { EventMemberRole } from '../../types';

const ROLE_LABELS: Record<EventMemberRole, string> = {
  VIEWER: 'Visualizador',
  CHECKER: 'Recepcionista',
  MANAGER: 'Gerente',
};

const ROLE_DESCRIPTIONS: Record<EventMemberRole, string> = {
  VIEWER: 'Apenas visualiza informações do evento',
  CHECKER: 'Pode fazer check-in de convidados',
  MANAGER: 'Pode gerenciar convidados e fazer check-in',
};

const ROLE_COLORS: Record<EventMemberRole, string> = {
  VIEWER: 'bg-gray-100 text-gray-700',
  CHECKER: 'bg-blue-100 text-blue-700',
  MANAGER: 'bg-purple-100 text-purple-700',
};

export const ManageEventMembersPage = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const { event, isLoading: isLoadingEvent } = useEventDetails(eventId!);
  const { members, isLoading, addMember, updateRole, removeMember, isAdding, isRemoving } = useEventMembers(eventId!);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<EventMemberRole>('CHECKER');

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addMember({ 
        userEmail: newMemberEmail,
        role: newMemberRole 
      });
      setShowAddModal(false);
      setNewMemberEmail('');
      setNewMemberRole('CHECKER');
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-secondary-light flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-secondary-light flex items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Evento Não Encontrado
          </h1>
          <Link to="/events">
            <Button variant="primary" className="mt-4">
              Voltar para Eventos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-light">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to={`/events/${eventId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para detalhes
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Gerenciar Recepcionistas</h1>
              <p className="text-gray-600 mt-1">{event.name}</p>
            </div>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <UserPlus className="mr-2 h-5 w-5" />
              Adicionar Membro
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="card">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-primary mb-2">Membros da Equipe</h2>
            <p className="text-gray-600 text-sm">
              Gerencie quem pode acessar e gerenciar este evento
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-gray-600">Carregando membros...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Nenhum Membro Cadastrado
              </h3>
              <p className="text-gray-600 mb-6">
                Adicione membros para ajudar na gestão do evento
              </p>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <UserPlus className="mr-2 h-5 w-5" />
                Adicionar Primeiro Membro
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900">{member.user?.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[member.role]}`}>
                        {ROLE_LABELS[member.role]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{member.user?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">{ROLE_DESCRIPTIONS[member.role]}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={member.role}
                      onChange={(e) => updateRole({ 
                        memberId: member.id, 
                        role: e.target.value as EventMemberRole 
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="VIEWER">Visualizador</option>
                      <option value="CHECKER">Recepcionista</option>
                      <option value="MANAGER">Gerente</option>
                    </select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeMember(member.id)}
                      className="text-error hover:bg-error/10"
                      isLoading={isRemoving}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card mt-6">
          <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Níveis de Permissão
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${ROLE_COLORS.VIEWER}`}>
                  Visualizador
                </span>
              </div>
              <p className="text-sm text-gray-600">Apenas visualiza informações do evento</p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${ROLE_COLORS.CHECKER}`}>
                  Recepcionista
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Pode fazer check-in de convidados e visualizar estatísticas
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${ROLE_COLORS.MANAGER}`}>
                  Gerente
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Pode gerenciar convidados, fazer check-in e visualizar tudo
              </p>
            </div>
          </div>
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-bold text-primary mb-4">Adicionar Membro</h3>
            
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail do Usuário
                </label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="usuario@exemplo.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  O usuário deve estar cadastrado no sistema
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nível de Permissão
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as EventMemberRole)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="VIEWER">Visualizador</option>
                  <option value="CHECKER">Recepcionista</option>
                  <option value="MANAGER">Gerente</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {ROLE_DESCRIPTIONS[newMemberRole]}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewMemberEmail('');
                    setNewMemberRole('CHECKER');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  isLoading={isAdding}
                >
                  Adicionar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
