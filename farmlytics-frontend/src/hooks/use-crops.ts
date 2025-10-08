import { useQuery } from "@tanstack/react-query";
import { cropsService } from "@/api/crop";
import type { Crop } from "@/lib/types";

export const useCrops = () => {
  return useQuery<Crop[], Error>({
    queryKey: ["crops"],
    queryFn: async () => {
      const res = await cropsService.getAllCrops();
      // Ensure we always return an array
      return res?.data ?? [];
    },
    staleTime: 1000 * 60 * 5, // optional: cache for 5 min
    retry: 1, // optional: retry once if failed
  });
};
