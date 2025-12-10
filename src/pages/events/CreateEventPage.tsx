import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Link2, AlertCircle, Baby } from 'lucide-react';
import { createEventSchema, type CreateEventInput } from '../../schemas/eventSchemas';
import { useEvents } from '../../hooks/useEvents';
import { Button } from '../../components/ui/Button';
import { slugify } from '../../utils/slugify';
import { useState, useEffect } from 'react';

export const CreateEventPage = () => {
  const { createEvent, isCreating } = useEvents();
  const [slugPreview, setSlugPreview] = useState('');
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
  });

  // Watch name para gerar slug automaticamente
  const watchName = watch('name');
  const watchSlug = watch('slug');

  // Gerar slug automaticamente ao digitar nome
  useEffect(() => {
    if (watchName && !watchSlug) {
      const generatedSlug = slugify(watchName);
      setValue('slug', generatedSlug);
      setSlugPreview(generatedSlug);
    }
  }, [watchName, watchSlug, setValue]);

  // Atualizar preview ao digitar slug manualmente
  useEffect(() => {
    if (watchSlug) {
      setSlugPreview(watchSlug);
    }
  }, [watchSlug]);

  const onSubmit = (data: CreateEventInput) => {
    createEvent(data);
  };

  return (
    <div className="min-h-screen bg-secondary-light">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para eventos
          </Link>
          <h1 className="text-2xl font-bold text-primary">
            Criar Novo Evento
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="card">
          <div className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Evento *
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="Ex: Aniversário do João"
                className={`
                  w-full px-4 py-2 border rounded-lg
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.name ? 'border-error' : 'border-gray-300'}
                `}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error">{errors.name.message}</p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição (opcional)
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Ex: Festa de aniversário de 30 anos com churrasco"
                className={`
                  w-full px-4 py-2 border rounded-lg
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.description ? 'border-error' : 'border-gray-300'}
                `}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error">{errors.description.message}</p>
              )}
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('date')}
                    type="date"
                    className={`
                      w-full pl-10 pr-4 py-2 border rounded-lg
                      focus:ring-2 focus:ring-primary focus:border-transparent
                      ${errors.date ? 'border-error' : 'border-gray-300'}
                    `}
                  />
                </div>
                {errors.date && (
                  <p className="mt-1 text-sm text-error">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('time')}
                    type="time"
                    className={`
                      w-full pl-10 pr-4 py-2 border rounded-lg
                      focus:ring-2 focus:ring-primary focus:border-transparent
                      ${errors.time ? 'border-error' : 'border-gray-300'}
                    `}
                  />
                </div>
                {errors.time && (
                  <p className="mt-1 text-sm text-error">{errors.time.message}</p>
                )}
              </div>
            </div>

            {/* Local */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('location')}
                  type="text"
                  placeholder="Ex: Salão de Festas XYZ - Rua ABC, 123"
                  className={`
                    w-full pl-10 pr-4 py-2 border rounded-lg
                    focus:ring-2 focus:ring-primary focus:border-transparent
                    ${errors.location ? 'border-error' : 'border-gray-300'}
                  `}
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-error">{errors.location.message}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL amigável) *
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('slug')}
                  type="text"
                  placeholder="aniversario-joao-2025"
                  className={`
                    w-full pl-10 pr-4 py-2 border rounded-lg font-mono text-sm
                    focus:ring-2 focus:ring-primary focus:border-transparent
                    ${errors.slug ? 'border-error' : 'border-gray-300'}
                  `}
                />
              </div>
              {errors.slug && (
                <p className="mt-1 text-sm text-error">{errors.slug.message}</p>
              )}
              {slugPreview && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Preview do link público:</strong>
                    <br />
                    <span className="font-mono">
                      {window.location.origin}/{slugPreview}/confirmar
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Prazo de Confirmação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prazo para Confirmação (opcional)
              </label>
              <input
                {...register('confirmationDeadline')}
                type="datetime-local"
                className={`
                  w-full px-4 py-2 border rounded-lg
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.confirmationDeadline ? 'border-error' : 'border-gray-300'}
                `}
              />
              {errors.confirmationDeadline && (
                <p className="mt-1 text-sm text-error">{errors.confirmationDeadline.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Após essa data, convidados não poderão mais confirmar presença
              </p>
            </div>

            {/* Idade Limite para Criança Sem Código */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idade Limite para Criança Sem Código (opcional)
              </label>
              <div className="relative">
                <Baby className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('idadeLimiteCriancaSemCodigo', {
                    setValueAs: (v) => v === '' || v === null ? null : parseInt(v, 10),
                  })}
                  type="number"
                  min={0}
                  max={18}
                  placeholder="Ex: 8"
                  className={`
                    w-full pl-10 pr-4 py-2 border rounded-lg
                    focus:ring-2 focus:ring-primary focus:border-transparent
                    ${errors.idadeLimiteCriancaSemCodigo ? 'border-error' : 'border-gray-300'}
                  `}
                />
              </div>
              {errors.idadeLimiteCriancaSemCodigo && (
                <p className="mt-1 text-sm text-error">{errors.idadeLimiteCriancaSemCodigo.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Crianças com idade menor ou igual a este valor não precisarão de código de convidado. 
                Deixe em branco se todas as crianças precisarem de código.
              </p>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <strong>Dica:</strong> O slug será usado no link público do evento. 
                Escolha algo fácil de lembrar e compartilhar!
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t">
            <Link to="/events" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isCreating}
            >
              Criar Evento
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};