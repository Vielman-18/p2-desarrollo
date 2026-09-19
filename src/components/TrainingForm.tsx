// src/components/TrainingForm.tsx
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trainingSchema, type TrainingFormData, type TrainingFormInput } from '../schemas/trainingSchema';
import type { Training } from '../types';

interface TrainingFormProps {
  training?: Training;          // Si viene, es modo edición
  onSubmit: (data: TrainingFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;        // Error de la mutación (crear/actualizar falló), no de validación
}

// Mismo componente de campo que EmployeeForm (podría extraerse a un archivo
// compartido, pero se deja igual para mantener el mismo patrón del código base)
function FormField({
  label,
  error,
  children,
  required = false,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError: boolean) => `
  w-full px-3 py-2 border rounded-lg text-sm transition-colors
  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
  ${hasError
    ? 'border-red-400 bg-red-50 focus:ring-red-400'
    : 'border-slate-300 bg-white'
  }
`;

function TrainingForm({ training, onSubmit, onCancel, isLoading = false, error }: TrainingFormProps) {
  const isEditing = !!training;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TrainingFormInput, unknown, TrainingFormData>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      nombre: '',
      categoria: 'Tecnología',
      instructor: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: new Date().toISOString().split('T')[0],
      cupoMaximo: 20,
      inscritos: 0,
      estado: 'programada',
      descripcion: '',
    },
  });

  // Si viene una capacitación (modo edición), poblar el formulario
  useEffect(() => {
    if (training) {
      reset({
        nombre: training.nombre,
        categoria: training.categoria,
        instructor: training.instructor,
        fechaInicio: training.fechaInicio,
        fechaFin: training.fechaFin,
        cupoMaximo: training.cupoMaximo,
        inscritos: training.inscritos,
        estado: training.estado,
        descripcion: training.descripcion || '',
      });
    }
  }, [training, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Fila 1: Nombre e Instructor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Nombre de la capacitación" error={errors.nombre?.message} required>
          <input
            {...register('nombre')}
            type="text"
            placeholder="Fundamentos de React"
            className={inputClass(!!errors.nombre)}
            aria-required="true"
          />
        </FormField>

        <FormField label="Instructor" error={errors.instructor?.message} required>
          <input
            {...register('instructor')}
            type="text"
            placeholder="Ana García"
            className={inputClass(!!errors.instructor)}
            aria-required="true"
          />
        </FormField>
      </div>

      {/* Fila 2: Categoría y Estado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Categoría" error={errors.categoria?.message} required>
          <select
            {...register('categoria')}
            className={inputClass(!!errors.categoria)}
            aria-required="true"
          >
            {['Tecnología', 'Liderazgo', 'Seguridad', 'Ventas', 'Habilidades Blandas', 'Cumplimiento'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Estado" error={errors.estado?.message}>
          <select {...register('estado')} className={inputClass(!!errors.estado)}>
            <option value="programada">Programada</option>
            <option value="en_curso">En curso</option>
            <option value="finalizada">Finalizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </FormField>
      </div>

      {/* Fila 3: Fechas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Fecha de inicio" error={errors.fechaInicio?.message} required>
          <input
            {...register('fechaInicio')}
            type="date"
            className={inputClass(!!errors.fechaInicio)}
            aria-required="true"
          />
        </FormField>

        <FormField label="Fecha de fin" error={errors.fechaFin?.message} required>
          <input
            {...register('fechaFin')}
            type="date"
            className={inputClass(!!errors.fechaFin)}
            aria-required="true"
          />
        </FormField>
      </div>

      {/* Fila 4: Cupo e Inscritos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Cupo máximo" error={errors.cupoMaximo?.message} required>
          <input
            {...register('cupoMaximo')}
            type="number"
            min="1"
            step="1"
            placeholder="25"
            className={inputClass(!!errors.cupoMaximo)}
            aria-required="true"
          />
        </FormField>

        <FormField label="Inscritos" error={errors.inscritos?.message} required>
          <input
            {...register('inscritos')}
            type="number"
            min="0"
            step="1"
            placeholder="0"
            className={inputClass(!!errors.inscritos)}
            aria-required="true"
          />
        </FormField>
      </div>

      {/* Fila 5: Descripción (opcional) */}
      <FormField label="Descripción (opcional)" error={errors.descripcion?.message}>
        <textarea
          {...register('descripcion')}
          rows={3}
          placeholder="Breve descripción del contenido de la capacitación..."
          className={inputClass(!!errors.descripcion)}
        />
      </FormField>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 border border-slate-300 hover:border-slate-400 rounded-lg transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || (!isDirty && isEditing)}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-800 hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-50 min-w-24"
        >
          {isLoading
            ? 'Guardando...'
            : isEditing ? 'Guardar cambios' : 'Crear capacitación'
          }
        </button>
      </div>
    </form>
  );
}

export default TrainingForm;
