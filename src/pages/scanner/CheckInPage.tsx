import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, QrCode, Keyboard, BarChart3, Search, Users } from 'lucide-react';
import { useEventDetails } from '../../hooks/useEventDetails';
import { useCheckIn } from '../../hooks/useCheckIn';
import { QRCodeScanner } from '../../components/scanner/QRCodeScanner';
import { ManualCheckIn } from '../../components/scanner/ManualCheckIn';
import { CheckInResult } from '../../components/scanner/CheckInResult';
import { GuestSearch } from '../../components/scanner/GuestSearch';
import { Button } from '../../components/ui/Button';
import type { Guest, ChildCompanion } from '../../types';

export const CheckInPage = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const { event, isLoading: isLoadingEvent } = useEventDetails(eventId!);
  const { checkInByCode, stats, isCheckingIn, refetchStats } = useCheckIn(eventId);
  
  console.log('🎯 CheckIn Stats:', stats); // Debug
  
  const [result, setResult] = useState<{
    guest?: Guest;
    child?: ChildCompanion;
    message: string;
    isValid: boolean;
  } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [mode, setMode] = useState<'scanner' | 'manual' | 'search'>('scanner');

  const handleScan = async (qrData: string): Promise<void> => {
    try {
      const parts = qrData.split('|');
      
      if (parts.length !== 3) {
        throw new Error('QR Code inválido');
      }

      const [, code] = parts;
      await performCheckIn(code);
      
    } catch (error) {
      const err = error as Error;
      setResult({
        message: err.message || 'QR Code inválido',
        isValid: false,
      });
      setShowResult(true);
    }
  };

  const performCheckIn = async (code: string): Promise<void> => {
    try {
      const response = await checkInByCode(code);
      
      setResult({
        guest: response.data?.guest,
        child: response.data?.child,
        message: response.message,
        isValid: response.success,
      });
      setShowResult(true);
      
      if (response.success) {
        refetchStats();
      }
    } catch (error) {
      const err = error as Error;
      setResult({
        message: err.message || 'Erro ao realizar check-in',
        isValid: false,
      });
      setShowResult(true);
    }
  };

  const handleManualCheckIn = async (code: string): Promise<void> => {
    await performCheckIn(code);
  };

  const handleCloseResult = (): void => {
    setShowResult(false);
    setResult(null);
  };

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-secondary-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            to={`/events/${eventId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para detalhes
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QrCode className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Check-in</h1>
                <p className="text-gray-600">{event.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-xs text-blue-600 font-medium">Total Convidados</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.overall?.total || 0}</p>
                </div>
              </div>
            </div>

            <div className="card bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-xs text-green-600 font-medium">Check-in Feitos</p>
                  <p className="text-2xl font-bold text-green-700">{stats.overall?.checkedIn || 0}</p>
                </div>
              </div>
            </div>

            <div className="card bg-orange-50 border-orange-200">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="text-xs text-orange-600 font-medium">Faltam</p>
                  <p className="text-2xl font-bold text-orange-700">{stats.overall?.pending || 0}</p>
                </div>
              </div>
            </div>

            <div className="card bg-purple-50 border-purple-200">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-xs text-purple-600 font-medium">Crianças</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {stats.children?.checkedIn || 0}/{stats.children?.total || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!showResult ? (
          <>
            <div className="flex gap-2 mb-6">
              <Button
                variant={mode === 'scanner' ? 'primary' : 'outline'}
                onClick={() => setMode('scanner')}
                className="flex-1"
              >
                <QrCode className="mr-2 h-5 w-5" />
                Scanner QR Code
              </Button>
              <Button
                variant={mode === 'manual' ? 'primary' : 'outline'}
                onClick={() => setMode('manual')}
                className="flex-1"
              >
                <Keyboard className="mr-2 h-5 w-5" />
                Código Manual
              </Button>
              <Button
                variant={mode === 'search' ? 'primary' : 'outline'}
                onClick={() => setMode('search')}
                className="flex-1"
              >
                <Search className="mr-2 h-5 w-5" />
                Buscar Nome
              </Button>
            </div>

            <div className="mb-6">
              <Link to={`/events/${eventId}/check-in/list`}>
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-5 w-5" />
                  Ver Lista de Check-in
                </Button>
              </Link>
            </div>

            {mode === 'scanner' ? (
              <div className="card">
                <h2 className="text-xl font-bold text-primary mb-6">
                  Escaneie o QR Code do Convidado
                </h2>
                <QRCodeScanner
                  onScan={handleScan}
                  onError={(error: string) => console.error('Scanner error:', error)}
                />
              </div>
            ) : mode === 'manual' ? (
              <ManualCheckIn
                onSubmit={handleManualCheckIn}
                isLoading={isCheckingIn}
              />
            ) : (
              <GuestSearch eventId={eventId!} />
            )}
          </>
        ) : (
          <CheckInResult
            guest={result?.guest || null}
            isValid={result?.isValid || false}
            message={result?.message || ''}
            onClose={handleCloseResult}
          />
        )}

        {isCheckingIn && (
          <div className="card mt-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-600">Realizando check-in...</p>
          </div>
        )}
      </main>
    </div>
  );
};