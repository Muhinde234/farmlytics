import API from './axios'
import type {
  ApiResponse,
  MarketConsumption,
  BusinessEntity,
  BuyersProcessorsResponse,
} from '@/lib/types'

export const marketService = {
  getDemands: async (): Promise<MarketConsumption[]> => {
    const res = await API.get<ApiResponse<MarketConsumption[]>>('/market/demand')
    return res.data.data ?? []
  },

  getCooperatives: async (): Promise<BusinessEntity[]> => {
    const res = await API.get<ApiResponse<BusinessEntity[]>>('/market/cooperatives')
    return res.data.data ?? []
  },

  getBuyersProcessors: async (): Promise<BuyersProcessorsResponse> => {
    const res = await API.get<ApiResponse<BuyersProcessorsResponse>>('/market/buyers-processors')
    return res.data.data ?? { Potential_Buyers: [], Food_Processors: [] }
  },

  getExporters: async (): Promise<BusinessEntity[]> => {
    const res = await API.get<ApiResponse<BusinessEntity[]>>('/market/exporters')
    return res.data.data ?? []
  },
}
