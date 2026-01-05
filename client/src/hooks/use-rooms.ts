import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// Types derived from schema
type CreateRoomInput = z.infer<typeof api.rooms.create.input>;
type UpdateRoomInput = z.infer<typeof api.rooms.update.input>;
type VerifyRoomInput = z.infer<typeof api.rooms.verify.input>;

// Hooks
export function useRoom(slug: string, password?: string) {
  return useQuery({
    queryKey: [api.rooms.get.path, slug, password], // Include password in key to re-fetch on unlock
    queryFn: async () => {
      // If we have a stored password for this session, we might want to send it
      // But for the initial GET, we usually expect public data or a 403
      // If we want to support sending password via header for GET, we'd add it here.
      // For now, let's assume GET is public or 403, and verify endpoint is used for check.
      
      const url = buildUrl(api.rooms.get.path, { slug });
      const res = await fetch(url);
      
      if (res.status === 403) {
        // Return a specific object indicating password is required
        return { isLocked: true };
      }
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch room");
      
      return api.rooms.get.responses[200].parse(await res.json());
    },
    retry: false,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateRoomInput) => {
      const res = await fetch(api.rooms.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 409) throw new Error("Slug already taken");
        throw new Error("Failed to create room");
      }
      
      return api.rooms.create.responses[201].parse(await res.json());
    },
    // No invalidation needed as we redirect to the new slug usually
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, ...data }: UpdateRoomInput & { slug: string }) => {
      const url = buildUrl(api.rooms.update.path, { slug });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 403) throw new Error("Incorrect password or forbidden");
        throw new Error("Failed to save room");
      }

      return api.rooms.update.responses[200].parse(await res.json());
    },
    onSuccess: (data, variables) => {
      // Update the cache immediately with the new data
      queryClient.setQueryData([api.rooms.get.path, variables.slug], data);
    },
  });
}

export function useVerifyRoom() {
  return useMutation({
    mutationFn: async ({ slug, password }: VerifyRoomInput & { slug: string }) => {
      const url = buildUrl(api.rooms.verify.path, { slug });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        if (res.status === 403) throw new Error("Invalid password");
        throw new Error("Verification failed");
      }

      return api.rooms.verify.responses[200].parse(await res.json());
    },
  });
}
