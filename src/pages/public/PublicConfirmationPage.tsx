import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Phone,
  Baby,
  Users,
  Trash2,
} from 'lucide-react';
import { usePublicGuest } from '../../hooks/usePublicGuest';
import { Button } from '../../components/ui/Button';
import { QRCodeDisplay } from '../../components/public/QRCodeDisplay';
import { AddCompanionSelector } from '../../components/public/AddCompanionSelector';
import { ChildrenList } from '../../components/public/ChildrenList';
import { childCompanionService } from '../../services/childCompanionService';
import { publicService } from '../../services/publicService';
import type { ChildCompanion } from '../../types';
import toast from 'react-hot-toast';

export const PublicConfirmationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const codeFromUrl = searchParams.get('code') || '';
  const shouldAddChild = searchParams.get('addChild') === 'true';
  const childNameFromUrl = searchParams.get('childName') || '';
  const childAgeFromUrl = searchParams.get('childAge') || '';
  
  const [enteredCode, setEnteredCode] = useState(codeFromUrl);
  const [codeSubmitted, setCodeSubmitted] = useState(!!codeFromUrl);
  const [children, setChildren] = useState<ChildCompanion[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [isRemovingChild, setIsRemovingChild] = useState(false);

  const {
    guest,
    qrCode,
    isLoading,
    confirmPresence,
    declinePresence,
    addCompanion,
    removeCompanion,
    isConfirming,
    isDeclining,
    isAddingCompanion,
    isRemovingCompanion,
  } = usePublicGuest(codeSubmitted ? enteredCode : undefined);

  const [companionQrCode, setCompanionQrCode] = useState<string | null>(null);
  const [isLoadingCompanionQr, setIsLoadingCompanionQr] = useState(false);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode.trim()) {
      setCodeSubmitted(true);
    }
  };

  const handleConfirm = () => {
    confirmPresence(enteredCode);
  };

  const handleDecline = () => {
    declinePresence(enteredCode);
  };

  const loadChildren = async () => {
    if (!guest?.code || guest.status === 'PENDING') return;

    setIsLoadingChildren(true);
    try {
      const data = await childCompanionService.getGuestChildren(guest.code);
      setChildren(data);
    } catch (error) {
      console.error('Erro ao carregar crianças:', error);
    } finally {
      setIsLoadingChildren(false);
    }
  };

  const loadCompanionQrCode = async () => {
    if (!guest?.companion?.code || guest.companion.status !== 'CONFIRMED') {
      setCompanionQrCode(null);
      return;
    }

    setIsLoadingCompanionQr(true);
    try {
      const data = await publicService.getQRCode(guest.companion.code);
      setCompanionQrCode(data.qrCode);
    } catch (error) {
      console.error('Erro ao carregar QR Code do acompanhante:', error);
      setCompanionQrCode(null);
    } finally {
      setIsLoadingCompanionQr(false);
    }
  };

  const handleAddChild = async (name: string, age: number) => {
    if (!guest?.code) return;

    setIsAddingChild(true);
    try {
      await childCompanionService.addChildCompanion({
        name,
        age,
        guestCode: guest.code,
      });
      toast.success('Criança adicionada com sucesso!');
      loadChildren();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao adicionar criança');
    } finally {
      setIsAddingChild(false);
    }
  };

  const handleAddAdult = (companionCode: string) => {
    if (!guest?.code) return;
    addCompanion(guest.code, companionCode);
  };

  const handleRemoveChild = async (childId: string) => {
    setIsRemovingChild(true);
    try {
      await childCompanionService.removeChildCompanion(childId);
      toast.success('Criança removida com sucesso');
      loadChildren();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao remover criança');
    } finally {
      setIsRemovingChild(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, [guest?.code, guest?.status]);

  useEffect(() => {
    loadCompanionQrCode();
  }, [guest?.companion?.code, guest?.companion?.status]);

  useEffect(() => {
    if (shouldAddChild && guest?.code && childNameFromUrl && childAgeFromUrl) {
      const age = parseInt(childAgeFromUrl, 10);
      if (!isNaN(age)) {
        handleAddChild(childNameFromUrl, age);
        window.history.replaceState({}, '', `/${slug}/confirmar?code=${guest.code}`);
      }
    }
  }, [shouldAddChild, guest?.code, childNameFromUrl, childAgeFromUrl]);

  // Redirect se não tem slug
  if (!slug) {
    return <Navigate to="/login" replace />;
  }

  // Form para inserir código
  if (!codeSubmitted) {
    return (
      <div className="min-h-screen flex md:items-center items-start justify-center p-4 md:pt-4 pt-8 relative overflow-hidden">
        {/* Gradiente de fallback sempre presente */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #7dd3fc 0%, #bae6fd 40%, #86efac 60%, #22c55e 100%)',
            zIndex: 0,
          }}
        />

        {/* Imagem Safari - Desktop (100% da tela) */}
        <picture className="hidden md:block absolute inset-0" style={{ zIndex: 1 }}>
          <source srcSet="/safari-background-desktop.webp" type="image/webp" />
          <source srcSet="/safari-background.svg" type="image/svg+xml" />
          <img 
            src="/safari-background.svg" 
            alt="Safari"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </picture>

        {/* Imagem Safari - Mobile (fixa no fundo) */}
        <picture className="md:hidden absolute inset-0" style={{ zIndex: 1 }}>
          <source srcSet="/safari-background-mobile.webp" type="image/webp" />
          <source srcSet="/safari-background.svg" type="image/svg+xml" />
          <img 
            src="/safari-background.svg" 
            alt="Safari"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </picture>

        {/* Card Principal - menor no mobile */}
        <div className="relative card w-full md:max-w-md max-w-sm bg-white/95 backdrop-blur-sm shadow-2xl border-4 border-amber-400" style={{ zIndex: 10 }}>
          <div className="text-center mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-amber-600 mb-2">
              🎉 Confirmar Presença
            </h1>
            <p className="text-sm md:text-base text-green-800 font-medium">Digite seu código de convite</p>
          </div>

          <form onSubmit={handleCodeSubmit} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-green-900 mb-1">
                Código do Convite
              </label>
              <input
                type="text"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value.toUpperCase())}
                placeholder="Ex: XLR8"
                maxLength={4}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-4 border-amber-400 rounded-lg font-mono text-center text-xl md:text-2xl uppercase focus:ring-4 focus:ring-amber-300 focus:border-amber-500 bg-yellow-50 text-green-900 font-bold"
                required
              />
              <p className="mt-2 text-xs md:text-sm text-green-700 text-center font-medium">
                Código único de 4 caracteres
              </p>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-base md:text-lg shadow-lg border-2 border-amber-600" 
              size="lg"
            >
              Continuar
            </Button>
          </form>

          <div className="mt-4 md:mt-6 text-center bg-green-50 p-3 md:p-4 rounded-lg border-2 border-green-300">
            <p className="text-xs md:text-sm text-green-800 font-semibold mb-2">Quer confirmar uma criança sem código?</p>
            <a 
              href={`/${slug}/confirmar-crianca`}
              className="text-amber-600 hover:text-amber-700 font-bold text-xs md:text-sm underline"
            >
              Clique aqui para confirmar criança acompanhante
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Código inválido
  if (!guest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Código Inválido
          </h1>
          <p className="text-gray-600 mb-6">
            O código <span className="font-mono font-bold">{enteredCode}</span> não foi encontrado.
          </p>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              setCodeSubmitted(false);
              setEnteredCode('');
            }}
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  const event = guest.event;
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const isCancelled = event.status === 'CANCELLED';
  const isPending = guest.status === 'PENDING';
  const isConfirmed = guest.status === 'CONFIRMED';
  const isDeclined = guest.status === 'DECLINED';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorativo em camadas */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-green-50 via-amber-50 to-stone-50"
        style={{ zIndex: 0 }}
      />
      <div 
        className="fixed inset-0"
        style={{
          backgroundImage: 'url(/safari-background.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15,
          zIndex: 1,
        }}
      />
      <div 
        className="fixed inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/50"
        style={{ zIndex: 2 }}
      />

      {/* Conteúdo */}
      <div className="relative" style={{ zIndex: 10 }}>
        {/* Header */}
        <header className="bg-gradient-to-r from-green-500 to-amber-500 text-white shadow-xl">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-3">
              <span className="text-3xl">🎉</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
            {event.description && (
              <p className="text-white/90 text-lg">{event.description}</p>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Evento Cancelado */}
        {isCancelled && (
          <div className="card mb-6 bg-white/90 backdrop-blur-md border-2 border-error shadow-xl">
            <div className="flex items-start gap-3">
              <XCircle className="h-6 w-6 text-error flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-error mb-1">
                  Evento Cancelado
                </h3>
                <p className="text-error/80">
                  Infelizmente este evento foi cancelado pelo organizador.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info do Convidado */}
        <div className="card mb-6 bg-white/90 backdrop-blur-md shadow-xl border border-green-200">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Olá, {guest.name}! 👋
          </h2>
          
          {/* Detalhes do Evento */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Data</p>
                <p className="text-gray-600">
                  {format(eventDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  {isPast && ' (já ocorreu)'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Horário</p>
                <p className="text-gray-600">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Local</p>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>
          </div>

          {/* Status do Convite */}
          {isPending && !isCancelled && !isPast && (
            <div className="space-y-4">
              <p className="text-gray-700 font-medium">
                Você confirmará sua presença?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleConfirm}
                  isLoading={isConfirming}
                  className="bg-success hover:bg-success/90"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Sim, Confirmar Presença
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleDecline}
                  isLoading={isDeclining}
                  className="text-error hover:bg-error/10"
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Não Poderei Comparecer
                </Button>
              </div>
            </div>
          )}

          {isConfirmed && (
            <div className="p-4 bg-success/10 border-2 border-success rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-6 w-6 text-success" />
                <h3 className="text-lg font-bold text-success">
                  Presença Confirmada!
                </h3>
              </div>
              <p className="text-success/80">
                Sua presença foi confirmada em {format(new Date(guest.confirmedAt!), "dd/MM/yyyy 'às' HH:mm")}
              </p>
            </div>
          )}

          {isDeclined && (
            <div className="p-4 bg-gray-100 border-2 border-gray-300 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-6 w-6 text-gray-600" />
                <h3 className="text-lg font-bold text-gray-700">
                  Você não confirmou presença
                </h3>
              </div>
              <p className="text-gray-600 mb-3">
                Para alterar sua resposta, entre em contato com o organizador:
              </p>
              <div className="flex gap-2">
                {guest.email && (
                  <a href={`mailto:${guest.email}`}>
                    <Button variant="outline" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      E-mail
                    </Button>
                  </a>
                )}
                {guest.phone && (
                  <a href={`https://wa.me/${guest.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Phone className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* QR Code (só para confirmados) */}
        {isConfirmed && qrCode && (
          <QRCodeDisplay
            qrCode={qrCode}
            guestName={guest.name}
            guestCode={guest.code}
          />
        )}

        {/* Seção de Acompanhantes - unificado */}
        {!isCancelled && !guest.companion && !isPending && (
          <div className="mt-6 space-y-4">
            {isDeclined && event.idadeLimiteCriancaSemCodigo !== null && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  💡 Você pode adicionar crianças acompanhantes
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Mesmo que você não possa comparecer, pode adicionar crianças até {event.idadeLimiteCriancaSemCodigo} anos que irão ao evento.
                </p>
              </div>
            )}

            <AddCompanionSelector
              ageLimit={event.idadeLimiteCriancaSemCodigo}
              onAddChild={handleAddChild}
              onAddAdult={handleAddAdult}
              isLoading={isAddingCompanion || isAddingChild}
            />
          </div>
        )}

        {/* Acompanhante Confirmado */}
        {guest.companion && (
          <div className="mt-6 space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold text-green-800">Acompanhante</h3>
                </div>
                <button
                  onClick={() => removeCompanion(guest.code)}
                  disabled={isRemovingCompanion}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                  title="Excluir acompanhante"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              {guest.companion.status === 'CONFIRMED' && (
                <div className="p-4 bg-success/10 border-2 border-success rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-6 w-6 text-success" />
                    <h3 className="text-lg font-bold text-success">
                      Presença Confirmada!
                    </h3>
                  </div>
                  <p className="text-success/80 mb-2">
                    Acompanhante: <span className="font-bold">{guest.companion.name}</span>
                  </p>
                  <p className="text-sm text-success/70">
                    Código: <span className="font-mono">{guest.companion.code}</span>
                  </p>
                </div>
              )}

              {guest.companion.status === 'PENDING' && (
                <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-6 w-6 text-yellow-600" />
                    <h3 className="text-lg font-bold text-yellow-700">
                      Aguardando Confirmação
                    </h3>
                  </div>
                  <p className="text-yellow-700 mb-2">
                    Acompanhante: <span className="font-bold">{guest.companion.name}</span>
                  </p>
                  <p className="text-sm text-yellow-600">
                    Código: <span className="font-mono">{guest.companion.code}</span>
                  </p>
                  <p className="text-xs text-yellow-600 mt-2">
                    O acompanhante ainda não confirmou presença
                  </p>
                </div>
              )}

              {guest.companion.status === 'DECLINED' && (
                <div className="p-4 bg-gray-100 border-2 border-gray-300 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-6 w-6 text-gray-600" />
                    <h3 className="text-lg font-bold text-gray-700">
                      Presença Recusada
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Acompanhante: <span className="font-bold">{guest.companion.name}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Código: <span className="font-mono">{guest.companion.code}</span>
                  </p>
                </div>
              )}
            </div>

            {/* QR Code do Acompanhante */}
            {guest.companion.status === 'CONFIRMED' && companionQrCode && (
              <QRCodeDisplay
                qrCode={companionQrCode}
                guestName={guest.companion.name}
                guestCode={guest.companion.code}
              />
            )}
          </div>
        )}

        {/* Lista de Crianças */}
        {children.length > 0 && (
          <div className="mt-6">
            <ChildrenList 
              children={children} 
              isLoading={isLoadingChildren}
              onRemoveChild={handleRemoveChild}
              isRemoving={isRemovingChild}
            />
          </div>
        )}
      </main>
      </div>
    </div>
  );
};