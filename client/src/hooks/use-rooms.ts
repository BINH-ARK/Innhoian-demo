import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "./use-toast";

export function useRooms() {
    return useQuery({
        queryKey: [api.rooms.list.path],
        queryFn: async () => {
            const res = await fetch(api.rooms.list.path);
            if (!res.ok) throw new Error("Failed to fetch rooms");
            return api.rooms.list.responses[200].parse(await res.json());
        },
    });
}

export function useSaveRoom() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (roomData: {
            id?: number;
            name: string;
            type: string;
            price: number;
            status?: string;
            projectId?: number;
            description?: string;
            amenities?: string[];
            images?: string[];
        }) => {
            const res = await fetch(api.rooms.save.path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(roomData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to save room');
            }

            return res.json();
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [api.rooms.list.path] });
            toast({
                title: variables.id ? "Room Updated" : "Room Created",
                description: variables.id
                    ? `${data.name} has been updated successfully.`
                    : `${data.name} has been created successfully.`,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });
}

export function useDeleteRoom() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (roomId: number) => {
            const url = buildUrl(api.rooms.delete.path, { id: roomId });
            const res = await fetch(url, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to delete room');
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [api.rooms.list.path] });
            toast({
                title: "Room Deleted",
                description: "The room has been deleted successfully.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });
}
