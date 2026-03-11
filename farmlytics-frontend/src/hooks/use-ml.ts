'use client'

import { useState } from 'react'
import { mlService } from '@/api/ml'
import type {
  YieldPredictionRequest,
  YieldPredictionResponse,
  DiseaseRiskRequest,
  DiseaseRiskResponse,
  PlantingWindowRequest,
  PlantingWindowResponse,
} from '@/lib/types'

export function useYieldPrediction() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<YieldPredictionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const predict = async (payload: YieldPredictionRequest) => {
    setLoading(true)
    setError(null)
    try {
      const data = await mlService.predictYield(payload)
      setResult(data)
      return data
    } catch {
      setError('Failed to get yield prediction.')
    } finally {
      setLoading(false)
    }
  }

  return { loading, result, error, predict }
}

export function useDiseaseRisk() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DiseaseRiskResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const predict = async (payload: DiseaseRiskRequest) => {
    setLoading(true)
    setError(null)
    try {
      const data = await mlService.predictDiseaseRisk(payload)
      setResult(data)
      return data
    } catch {
      setError('Failed to get disease risk prediction.')
    } finally {
      setLoading(false)
    }
  }

  return { loading, result, error, predict }
}

export function usePlantingWindow() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PlantingWindowResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const recommend = async (payload: PlantingWindowRequest) => {
    setLoading(true)
    setError(null)
    try {
      const data = await mlService.recommendPlantingWindow(payload)
      setResult(data)
      return data
    } catch {
      setError('Failed to get planting window recommendation.')
    } finally {
      setLoading(false)
    }
  }

  return { loading, result, error, recommend }
}
