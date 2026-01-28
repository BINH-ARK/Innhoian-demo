import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Service, InsertService } from '@shared/schema';

/**
 * Hook để Save (Create hoặc Update) Service
 */
export function useSaveService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<InsertService> & { id?: number }) => {
            const { id, ...serviceData } = data;

            if (id) {
                // UPDATE
                console.log('[useSaveService] Updating service:', id, serviceData);

                const res = await fetch(`/api/services/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(serviceData),
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || 'Failed to update service');
                }

                const updated = await res.json();
                console.log('[useSaveService] Updated successfully:', updated);
                return updated;
            } else {
                // CREATE
                console.log('[useSaveService] Creating service:', serviceData);

                const res = await fetch('/api/services', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(serviceData),
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || 'Failed to create service');
                }

                const created = await res.json();
                console.log('[useSaveService] Created successfully:', created);
                return created;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
        onError: (error) => {
            console.error('[useSaveService] Error:', error);
        },
    });
}

/**
 * Hook để Delete Service
 */
export function useDeleteService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            console.log('[useDeleteService] Deleting service:', id);

            const res = await fetch(`/api/services/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to delete service');
            }

            const result = await res.json();
            console.log('[useDeleteService] Deleted successfully:', id);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
        onError: (error) => {
            console.error('[useDeleteService] Error:', error);
        },
    });
}
