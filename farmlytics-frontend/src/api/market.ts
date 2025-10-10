import API from './axios'
import type { MarketDemand, Cooperative, Buyer, Exporter } from '@/lib/types'

export const marketService = {
  getDemands: async (): Promise<MarketDemand[]> => {
    const res = await API.get('/market/demand')
    return res.data
  },
  getCooperatives: async (): Promise<Cooperative[]> => {
    const res = await API.get('/market/cooperatives')
    return res.data
  },
  getBuyers: async (): Promise<Buyer[]> => {
    const res = await API.get('/market/buyers-processors')
    return res.data
  },
  getExporters: async (): Promise<Exporter[]> => {
    const res = await API.get('/market/exporters')
    return res.data
  },
}
