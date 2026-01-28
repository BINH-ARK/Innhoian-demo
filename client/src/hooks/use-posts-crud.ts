import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Post, InsertPost } from '@shared/schema';

/**
 * Hook để Save (Create hoặc Update) Post
 */
export function useSavePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<InsertPost> & { id?: number }) => {
            const { id, ...postData } = data;

            if (id) {
                // UPDATE
                console.log('[useSavePost] Updating post:', id, postData);

                const res = await fetch(`/api/posts/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData),
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || 'Failed to update post');
                }

                const updated = await res.json();
                console.log('[useSavePost] Updated successfully:', updated);
                return updated;
            } else {
                // CREATE
                console.log('[useSavePost] Creating post:', postData);

                const res = await fetch('/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData),
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || 'Failed to create post');
                }

                const created = await res.json();
                console.log('[useSavePost] Created successfully:', created);
                return created;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error) => {
            console.error('[useSavePost] Error:', error);
        },
    });
}

/**
 * Hook để Delete Post
 */
export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            console.log('[useDeletePost] Deleting post:', id);

            const res = await fetch(`/api/posts/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to delete post');
            }

            const result = await res.json();
            console.log('[useDeletePost] Deleted successfully:', id);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error) => {
            console.error('[useDeletePost] Error:', error);
        },
    });
}
