import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useUser() {
    return useQuery({
        queryKey: ["/api/user"],
        queryFn: async () => {
            const res = await fetch("/api/user");
            if (!res.ok) {
                if (res.status === 401) return null;
                // Don't throw for 401, just return null (not logged in)
            }
            const data = await res.json();
            return data.user || null;
        },
        retry: false,
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            });
            if (!res.ok) throw new Error("Logout failed");
            return res.json();
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/user"], null);
            toast({
                title: "Logged out",
                description: "You have been successfully logged out",
            });
            window.location.href = "/admin/login";
        },
        onError: (error) => {
            toast({
                title: "Logout failed",
                description: error instanceof Error ? error.message : "Logout failed",
                variant: "destructive",
            });
        },
    });
}
