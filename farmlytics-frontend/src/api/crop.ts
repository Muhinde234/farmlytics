import type { ApiResponse, CropListResponse, CropRecommendation } from '@/lib/types'
import API from '@/api/axios'

export const cropsService = {

  getAllCrops: async () => {
    const response = await API.get<CropListResponse>('/crops/list')
    return response.data
  },


  getRecommendations: async (): Promise<CropRecommendation[]> => {
    const response = await API.get<ApiResponse<CropRecommendation[]>>('/crop-plans/recommendations')
    return response.data.data ?? []
  },
}
