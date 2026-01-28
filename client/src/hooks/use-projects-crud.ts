import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Project, InsertProject } from '@shared/schema';

/**
 * Hook để Save (Create hoặc Update) Project
 * Tự động phân biệt Create/Update dựa trên có ID hay không
 */
export function useSaveProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<InsertProject> & { id?: number }) => {
            const { id, ...projectData } = data;

            if (id) {
                // UPDATE - PUT /api/admin/projects/:id
                console.log('[useSaveProject] Updating project:', id, projectData);

                const res = await fetch(`/api/admin/projects/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projectData),
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || 'Failed to update project');
                }

                const updated = await res.json();
                console.log('[useSaveProject] Updated successfully:', updated);
                return updated;
            } else {
                // CREATE - POST /api/admin/projects
                console.log('[useSaveProject] Creating project:', projectData);

                const res = await fetch('/api/admin/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projectData),
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || 'Failed to create project');
                }

                const created = await res.json();
                console.log('[useSaveProject] Created successfully:', created);
                return created;
            }
        },
        onSuccess: () => {
            // Refresh projects list
            queryClient.invalidateQueries({ queryKey: ['/api/admin/projects'] });
        },
        onError: (error) => {
            console.error('[useSaveProject] Error:', error);
        },
    });
}

/**
 * Hook để Delete Project
 */
export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            console.log('[useDeleteProject] Deleting project:', id);

            const res = await fetch(`/api/admin/projects/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to delete project');
            }

            const result = await res.json();
            console.log('[useDeleteProject] Deleted successfully:', id);
            return result;
        },
        onSuccess: () => {
            // Refresh projects list
            queryClient.invalidateQueries({ queryKey: ['/api/admin/projects'] });
        },
        onError: (error) => {
            console.error('[useDeleteProject] Error:', error);
        },
    });
}
