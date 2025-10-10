import type { ApiResponse, District } from "@/lib/types"
import API from "@/api/axios"

export const districtService = {
  getAll: async (): Promise<District[]> => {
    console.log("[v0] Fetching districts...")
    const response = await API.get<ApiResponse<District[]>>("/districts")

    console.log("[v0] Districts response:", {
      success: response.data.success,
      dataLength: response.data.data?.length,
      data: response.data.data,
    })

    if (!response.data.success) {
      throw new Error("Failed to fetch districts")
    }
    return response.data.data
  },
}
