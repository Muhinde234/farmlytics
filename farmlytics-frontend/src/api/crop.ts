import type { CropListResponse } from "@/lib/types";
import API from "@/api/axios";

export const cropsService = {
  getAllCrops: async () => {
    const response = await API.get<CropListResponse>("/crops/list");
    return response.data;
  },
};
