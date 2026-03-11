import { useState, useEffect, useCallback } from 'react'
import { marketService } from '@/api/market'
import type {
  MarketConsumption,
  BusinessEntity,
  BuyersProcessorsResponse,
} from '@/lib/types'

export function useMarketConnections() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [demands, setDemands] = useState<MarketConsumption[]>([])
  const [cooperatives, setCooperatives] = useState<BusinessEntity[]>([])
  const [buyersProcessors, setBuyersProcessors] = useState<BuyersProcessorsResponse>({
    Potential_Buyers: [],
    Food_Processors: [],
  })
  const [exporters, setExporters] = useState<BusinessEntity[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [demandsRes, coopRes, bpRes, exportersRes] = await Promise.all([
        marketService.getDemands(),
        marketService.getCooperatives(),
        marketService.getBuyersProcessors(),
        marketService.getExporters(),
      ])
      setDemands(demandsRes)
      setCooperatives(coopRes)
      setBuyersProcessors(bpRes)
      setExporters(exportersRes)
    } catch (err) {
      console.error(err)
      setError('Failed to load market data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { loading, error, demands, cooperatives, buyersProcessors, exporters, refetch: fetchData }
}
