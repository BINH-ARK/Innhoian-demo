import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useServices() {
  return useQuery({
    queryKey: [api.admin.services.list.path],
    queryFn: async () => {
      const res = await fetch(api.admin.services.list.path);
      if (!res.ok) throw new Error("Failed to fetch services");
      return api.admin.services.list.responses[200].parse(await res.json());
    },
  });
}
