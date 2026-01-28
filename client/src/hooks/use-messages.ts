import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

/**
 * Hook để lấy danh sách messages từ database
 * Hiển thị trong tab Messages của Admin Dashboard
 */
export function useMessages() {
    return useQuery({
        queryKey: [api.admin.messages.list.path],
        queryFn: async () => {
            const res = await fetch(api.admin.messages.list.path);
            if (!res.ok) throw new Error("Failed to fetch messages");
            return api.admin.messages.list.responses[200].parse(await res.json());
        },
    });
}
