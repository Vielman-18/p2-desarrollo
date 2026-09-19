// src/pages/CapacitacionesPage.tsx
import { useState, useCallback, useMemo } from 'react';
import type { Training, TrainingStatus } from '../types';
import TrainingCard from '../components/TrainingCard';
import StatsBadge from '../components/StatsBadge';
import FormField from '../components/FormField';
import Modal from '../components/Modal';
import TrainingForm from '../components/TrainingForm';
import { useTrainings, useCreateTraining, useUpdateTraining, useDeleteTraining } from '../hooks/useTrainings';
import type { TrainingFormData } from '../schemas/trainingSchema';

const formFieldClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

function CapacitacionesPage() {
  // Estado LOCAL de los filtros (UI), no del servidor
  const [search, setSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<TrainingStatus | ''>('');

  // Estado del SERVIDOR: TanStack Query pide, cachea y sincroniza la lista filtrada
  const { data, isLoading: loading, isError, error: queryError } = useTrainings({
    search: search || undefined,
    estado: selectedStatus || undefined,
  });
  const trainings = data?.data || [];

  // Segunda query sin filtros — las estadísticas son sobre el TOTAL, no sobre el filtro activo
  const { data: allData } = useTrainings({});
  const allTrainings = useMemo(() => allData?.data ?? [], [allData]);
  const totalTrainings = allTrainings.length;
  const enCursoTrainings = allTrainings.filter(t => t.estado === 'en_curso').length;
  const finalizadasTrainings = allTrainings.filter(t => t.estado === 'finalizada').length;

  const createTraining = useCreateTraining();
  const updateTraining = useUpdateTraining();
  const deleteTraining = useDeleteTraining();

  // Estado del modal de creación/edición
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingTraining, setEditingTraining] = useState<Training | undefined>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSelectTraining = useCallback((training: Training) => {
    alert(`Capacitación: ${training.nombre}\nInstructor: ${training.instructor}\nCategoría: ${training.categoria}`);
  }, []);

  const handleDeleteTraining = useCallback((id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta capacitación?')) return;
    deleteTraining.mutate(id);
  }, [deleteTraining]);

  const handleOpenCreate = useCallback(() => {
    setEditingTraining(undefined);
    setSubmitError(null);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((training: Training) => {
    setEditingTraining(training);
    setSubmitError(null);
    setModalOpen(true);
  }, []);

  // React Hook Form ya validó con Zod antes de llegar acá —
  // esta función solo decide crear vs. actualizar y llama a la mutación correcta.
  const handleSubmit = useCallback(async (formData: TrainingFormData) => {
    setSubmitError(null);
    try {
      if (editingTraining) {
        await updateTraining.mutateAsync({ id: editingTraining.id, data: formData });
      } else {
        await createTraining.mutateAsync(formData);
      }
      setModalOpen(false);
    } catch {
      setSubmitError('No se pudo guardar la capacitación. Intenta de nuevo.');
    }
  }, [editingTraining, createTraining, updateTraining]);

  const statuses: TrainingStatus[] = ['programada', 'en_curso', 'finalizada', 'cancelada'];
  const statusLabels: Record<TrainingStatus, string> = {
    programada: 'Programada',
    en_curso: 'En curso',
    finalizada: 'Finalizada',
    cancelada: 'Cancelada',
  };

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Capacitaciones</h2>
          <p className="text-slate-500 mt-1">
            {loading ? 'Cargando...' : `${trainings.length} de ${totalTrainings} capacitaciones`}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-brand-800 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Nueva capacitación
        </button>
      </div>

      {/* Estadísticas */}
      <div className="flex flex-wrap gap-4 mb-6">
        <StatsBadge label="Total de capacitaciones" value={totalTrainings} variant="blue" />
        <StatsBadge label="En curso" value={enCursoTrainings} variant="green" />
        <StatsBadge label="Finalizadas" value={finalizadasTrainings} variant="yellow" />
      </div>

      {/* Barra de filtros */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap items-end gap-3">
        <FormField label="Buscar" className="flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={formFieldClass}
          />
        </FormField>

        <FormField label="Estado" className="min-w-[180px]">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as TrainingStatus | '')}
            className={formFieldClass}
          >
            <option value="">Todos los estados</option>
            {statuses.map(status => (
              <option key={status} value={status}>{statusLabels[status]}</option>
            ))}
          </select>
        </FormField>

        {(search || selectedStatus) && (
          <button
            onClick={() => { setSearch(''); setSelectedStatus(''); }}
            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mr-3" />
          <span>Cargando capacitaciones...</span>
        </div>
      )}

      {/* Estado de error */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">Error al cargar las capacitaciones</p>
          <p className="text-red-500 text-sm mt-1">
            {(queryError as Error)?.message || 'Error desconocido'}
          </p>
        </div>
      )}

      {/* Sin resultados */}
      {!loading && !isError && trainings.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No se encontraron capacitaciones con los filtros aplicados.</p>
        </div>
      )}

      {/* Lista de capacitaciones */}
      {!loading && !isError && trainings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trainings.map(training => (
            <div key={training.id} className="relative">
              <div className="absolute -top-2.5 -right-2.5 z-10 flex gap-1">
                <button
                  onClick={() => handleOpenEdit(training)}
                  aria-label="Editar capacitación"
                  title="Editar capacitación"
                  className="w-6 h-6 rounded-full border-2 border-white bg-brand-600 text-white cursor-pointer text-xs leading-5 shadow-md"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDeleteTraining(training.id)}
                  aria-label="Eliminar capacitación"
                  title="Eliminar capacitación"
                  className="w-6 h-6 rounded-full border-2 border-white bg-red-500 text-white cursor-pointer text-sm leading-5 shadow-md"
                >
                  ×
                </button>
              </div>
              <TrainingCard training={training} onSelect={handleSelectTraining} />
            </div>
          ))}
        </div>
      )}

      {/* Modal de creación/edición — React Hook Form + Zod */}
      <Modal
        isOpen={modalOpen}
        title={editingTraining ? `Editar: ${editingTraining.nombre}` : 'Nueva capacitación'}
        onClose={() => setModalOpen(false)}
      >
        <TrainingForm
          training={editingTraining}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          isLoading={createTraining.isPending || updateTraining.isPending}
          error={submitError}
        />
      </Modal>
    </div>
  );
}

export default CapacitacionesPage;
