import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { districtService } from "@/api/district";
import type { District } from "@/lib/types";

export const useDistricts = (): UseQueryResult<District[], Error> => {
  return useQuery<District[], Error>({
    queryKey: ["districts"],
    queryFn: districtService.getAll,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};
