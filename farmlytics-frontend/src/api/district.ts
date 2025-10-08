import type { ApiResponse, District } from "@/lib/types";
import API from "@/api/axios";

export const districtService = {
  getAll: async (): Promise<District[]> => {
    const response = await API.get<ApiResponse<District[]>>("/districts"); // adjust endpoint
    if (!response.data.success) {
      throw new Error("Failed to fetch districts");
    }
    return response.data.data;
  },
};
