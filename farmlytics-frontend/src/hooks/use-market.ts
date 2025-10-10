import { useState, useEffect, useCallback } from 'react'
import { marketService } from '@/api/market'
import type { MarketDemand, Cooperative, Buyer, Exporter } from '@/lib/types'

export function useMarketConnections() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [demands, setDemands] = useState<MarketDemand[]>([])
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([])
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [exporters, setExporters] = useState<Exporter[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [demandsRes, coopRes, buyersRes, exportersRes] = await Promise.all([
        marketService.getDemands(),
        marketService.getCooperatives(),
        marketService.getBuyers(),
        marketService.getExporters(),
      ])
      setDemands(demandsRes)
      setCooperatives(coopRes)
      setBuyers(buyersRes)
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

  return { loading, error, demands, cooperatives, buyers, exporters, refetch: fetchData }
}
