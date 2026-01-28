import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { Project, Post, Room } from "@shared/schema";

/**
 * Hook để fetch Project detail theo ID
 */
export function useProjectDetail(id: number | null) {
    return useQuery<Project>({
        queryKey: ['project-detail', id],
        queryFn: async () => {
            if (!id) throw new Error('Project ID is required');

            const url = `/api/projects/id/${id}`;
            const res = await fetch(url);

            if (res.status === 404) {
                throw new Error('Project not found');
            }

            if (!res.ok) {
                throw new Error('Failed to fetch project details');
            }

            return res.json();
        },
        enabled: !!id, // Only run query if ID exists
    });
}

/**
 * Hook để fetch Post detail theo ID
 */
export function usePostDetail(id: number | null) {
    return useQuery<Post>({
        queryKey: ['post-detail', id],
        queryFn: async () => {
            if (!id) throw new Error('Post ID is required');

            const url = `/api/posts/id/${id}`;
            const res = await fetch(url);

            if (res.status === 404) {
                throw new Error('Post not found');
            }

            if (!res.ok) {
                throw new Error('Failed to fetch post details');
            }

            return res.json();
        },
        enabled: !!id,
    });
}

/**
 * Hook để fetch Room detail theo ID
 */
export function useRoomDetail(id: number | null) {
    return useQuery<Room>({
        queryKey: ['room-detail', id],
        queryFn: async () => {
            if (!id) throw new Error('Room ID is required');

            const url = `/api/admin/rooms/id/${id}`;
            const res = await fetch(url);

            if (res.status === 404) {
                throw new Error('Room not found');
            }

            if (!res.ok) {
                throw new Error('Failed to fetch room details');
            }

            return res.json();
        },
        enabled: !!id,
    });
}
