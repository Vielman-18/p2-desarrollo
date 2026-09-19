// src/components/TrainingCard.tsx
import type { Training } from '../types';

interface TrainingCardProps {
  training: Training;
  onSelect?: (training: Training) => void;
}

const statusConfig = {
  programada: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Programada' },
  en_curso: { bg: 'bg-green-100', text: 'text-green-800', label: 'En curso' },
  finalizada: { bg: 'bg-slate-200', text: 'text-slate-700', label: 'Finalizada' },
  cancelada: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
};

function TrainingCard({ training, onSelect }: TrainingCardProps) {
  const { nombre, categoria, instructor, fechaInicio, fechaFin, cupoMaximo, inscritos, estado } = training;
  const statusStyle = statusConfig[estado];
  const cupoLleno = inscritos >= cupoMaximo;

  return (
    <div
      onClick={() => onSelect?.(training)}
      className={`
        bg-white rounded-xl border border-slate-200 p-5 w-full
        hover:shadow-md hover:border-blue-300
        transition-all duration-200
        ${onSelect ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{nombre}</h3>
          <p className="text-sm text-slate-500 truncate">Instructor: {instructor}</p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${statusStyle.bg} ${statusStyle.text}`}>
          {statusStyle.label}
        </span>
      </div>

      <div className="mt-3 text-sm text-slate-600 space-y-1">
        <p>📅 {fechaInicio} → {fechaFin}</p>
        <p className={cupoLleno ? 'text-red-600 font-medium' : ''}>
          👥 {inscritos} / {cupoMaximo} inscritos {cupoLleno && '(cupo lleno)'}
        </p>
      </div>

      <div className="mt-4">
        <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium truncate">
          {categoria}
        </span>
      </div>
    </div>
  );
}

export default TrainingCard;
