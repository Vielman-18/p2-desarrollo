// src/hooks/useTrainings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingService, type TrainingFilters } from '../services/trainingService';
import type { CreateTrainingDto, UpdateTrainingDto } from '../types';

// Query key factory — centraliza los nombres de las queries
export const trainingKeys = {
  all: ['trainings'] as const,
  list: (filters: TrainingFilters) => ['trainings', 'list', filters] as const,
  detail: (id: number) => ['trainings', id] as const,
};

// Hook para obtener la lista de capacitaciones
export function useTrainings(filters: TrainingFilters = {}) {
  return useQuery({
    queryKey: trainingKeys.list(filters),
    queryFn: () => trainingService.getAll(filters),
  });
}

// Hook para obtener una capacitación por ID
export function useTraining(id: number | null) {
  return useQuery({
    queryKey: trainingKeys.detail(id!),
    queryFn: () => trainingService.getById(id!),
    enabled: !!id, // Solo ejecuta si hay un ID
  });
}

// Hook para crear capacitación
export function useCreateTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTrainingDto) => trainingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.all });
    },
  });
}

// Hook para actualizar capacitación
export function useUpdateTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTrainingDto }) =>
      trainingService.update(id, data),
    onSuccess: (updatedTraining) => {
      queryClient.setQueryData(
        trainingKeys.detail(updatedTraining.id),
        updatedTraining
      );
      queryClient.invalidateQueries({ queryKey: trainingKeys.all });
    },
  });
}

// Hook para eliminar capacitación
export function useDeleteTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => trainingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.all });
    },
  });
}
