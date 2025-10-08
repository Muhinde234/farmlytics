import { CropPlan, CreateCropPlanDTO, RecordHarvestDTO } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://farmlytics1-1.onrender.com/api-docs";

export async function getCropPlans(): Promise<CropPlan[]> {
  const res = await fetch(`${API_BASE_URL}/crop-plans`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch crop plans");
  const data = await res.json();
  return data.data || [];
}

export async function getCropPlanById(id: string): Promise<CropPlan> {
  const res = await fetch(`${API_BASE_URL}/crop-plans/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch crop plan");
  const data = await res.json();
  return data.data;
}

export async function createCropPlan(plan: CreateCropPlanDTO): Promise<CropPlan> {
  const res = await fetch(`${API_BASE_URL}/crop-plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plan),
  });

  if (!res.ok) throw new Error("Failed to create crop plan");
  const data = await res.json();
  return data.data;
}

export async function recordHarvest(id: string, harvestData: RecordHarvestDTO): Promise<CropPlan> {
  const res = await fetch(`${API_BASE_URL}/crop-plans/${id}/record-harvest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(harvestData),
  });

  if (!res.ok) throw new Error("Failed to record harvest");
  const data = await res.json();
  return data.data;
}

export async function deleteCropPlan(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/crop-plans/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete crop plan");
}
