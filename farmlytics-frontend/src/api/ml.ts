import API from './axios'
import type {
  ApiResponse,
  YieldPredictionRequest,
  YieldPredictionResponse,
  DiseaseRiskRequest,
  DiseaseRiskResponse,
  PlantingWindowRequest,
  PlantingWindowResponse,
} from '@/lib/types'

export const mlService = {
  predictYield: async (
    payload: YieldPredictionRequest
  ): Promise<YieldPredictionResponse> => {
    const res = await API.post<ApiResponse<YieldPredictionResponse>>(
      '/ml/predict-yield',
      payload
    )
    return res.data.data
  },

  predictDiseaseRisk: async (
    payload: DiseaseRiskRequest
  ): Promise<DiseaseRiskResponse> => {
    const res = await API.post<ApiResponse<DiseaseRiskResponse>>(
      '/ml/predict-disease-risk',
      payload
    )
    return res.data.data
  },

  recommendPlantingWindow: async (
    payload: PlantingWindowRequest
  ): Promise<PlantingWindowResponse> => {
    const res = await API.post<ApiResponse<PlantingWindowResponse>>(
      '/ml/recommend-planting-window',
      payload
    )
    return res.data.data
  },
}
