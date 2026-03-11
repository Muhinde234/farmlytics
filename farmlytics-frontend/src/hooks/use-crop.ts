'use client'

import { useState, useEffect } from 'react'
import type { CropPlan, CreateCropPlanDTO, RecordHarvestDTO } from '@/lib/types'
import {
  getCropPlans,
  createCropPlan,
  recordHarvest,
  deleteCropPlan,
} from '@/api/cropPlans'

export function useCropPlans() {
  const [cropPlans, setCropPlans] = useState<CropPlan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCropPlans = async () => {
    try {
      setLoading(true)
      const data = await getCropPlans()
      setCropPlans(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addCropPlan = async (plan: CreateCropPlanDTO) => {
    try {
      setLoading(true)
      const response = await createCropPlan(plan)
      await fetchCropPlans()
      return response
    } catch (err: any) {
      setError(err.response?.data?.message || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const harvestCropPlan = async (id: string, data: RecordHarvestDTO) => {
    try {
      setLoading(true)
      const response = await recordHarvest(id, data)
      await fetchCropPlans()
      return response
    } catch (err: any) {
      setError(err.response?.data?.message || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeCropPlan = async (id: string) => {
    try {
      setLoading(true)
      await deleteCropPlan(id)
      await fetchCropPlans()
    } catch (err: any) {
      setError(err.response?.data?.message || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCropPlans()
  }, [])

  return { cropPlans, loading, error, addCropPlan, harvestCropPlan, removeCropPlan, fetchCropPlans }
}
