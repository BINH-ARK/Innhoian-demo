import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

// Type cho dashboard stats response
export interface DashboardStats {
    stats: {
        projects: {
            total: number;
            growth: number;
        };
        services: {
            total: number;
            growth: number;
        };
        posts: {
            total: number;
            growth: number;
        };
        messages: {
            total: number;
            growth: number;
        };
    };
}

/**
 * Hook để lấy dữ liệu thống kê cho Admin Dashboard
 * Sử dụng React Query để cache và auto-refetch
 */
export function useDashboardStats() {
    return useQuery<DashboardStats>({
        queryKey: [api.admin.dashboard.path],
        queryFn: async () => {
            const res = await fetch(api.admin.dashboard.path);
            if (!res.ok) {
                throw new Error("Failed to fetch dashboard statistics");
            }
            const data = await res.json();
            return api.admin.dashboard.responses[200].parse(data);
        },
        // Refetch mỗi 30 giây để cập nhật dữ liệu
        refetchInterval: 30000,
        // Giữ dữ liệu cũ khi refetch để tránh UI nhấp nháy
        staleTime: 10000,
    });
}
