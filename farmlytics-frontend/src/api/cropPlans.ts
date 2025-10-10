import type { CropPlan, CreateCropPlanDTO, RecordHarvestDTO } from "@/lib/types"
import api from "./axios"

export async function getCropPlans(): Promise<CropPlan[]> {
  console.log("[v0] Fetching crop plans...")
  try {
    const response = await api.get("/crop-plans")
    console.log("[v0] Crop plans response:", response.data)
    return response.data.data || []
  } catch (error) {
    console.error("[v0] Error fetching crop plans:", error)
    throw error
  }
}

export async function getCropPlanById(id: string): Promise<CropPlan> {
  console.log("[v0] Fetching crop plan by id:", id)
  try {
    const response = await api.get(`/crop-plans/${id}`)
    console.log("[v0] Crop plan response:", response.data)
    return response.data.data
  } catch (error) {
    console.error("[v0] Error fetching crop plan:", error)
    throw error
  }
}

export async function createCropPlan(plan: CreateCropPlanDTO): Promise<CropPlan> {
  console.log("[v0] Creating crop plan:", plan)
  try {
    const response = await api.post("/crop-plans", plan)
    console.log("[v0] Create crop plan response:", response.data)
    return response.data.data
  } catch (error) {
    console.error("[v0] Error creating crop plan:", error)
    throw error
  }
}

export async function recordHarvest(id: string, harvestData: RecordHarvestDTO): Promise<CropPlan> {
  console.log(" Recording harvest for crop plan:", id, harvestData)
  try {
    const response = await api.post(`/crop-plans/${id}/record-harvest`, harvestData)
    console.log("Record harvest response:", response.data)
    return response.data.data
  } catch (error) {
    console.error("[v0] Error recording harvest:", error)
    throw error
  }
}

export async function deleteCropPlan(id: string): Promise<void> {
  console.log(" Deleting crop plan:", id)
  try {
    await api.delete(`/crop-plans/${id}`)
    console.log("Crop plan deleted successfully")
  } catch (error) {
    console.error(" Error deleting crop plan:", error)
    throw error
  }
}
