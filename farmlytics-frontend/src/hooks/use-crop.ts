"use client";

import { useState, useEffect } from "react";
import { CropPlan, CreateCropPlanDTO } from "@/lib/types";
import { getCropPlans, createCropPlan } from "@/api/cropPlans";

export function useCropPlans() {
  const [cropPlans, setCropPlans] = useState<CropPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCropPlans = async () => {
    try {
      setLoading(true);
      const data = await getCropPlans();
      setCropPlans(data);
    } catch (err: any) {
      console.error("[v0] Error fetching crop plans:", err.response?.data || err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCropPlan = async (plan: CreateCropPlanDTO) => {
    try {
      setLoading(true);
      console.log("[v0] Submitting crop plan:", plan);
      const response = await createCropPlan(plan);
      console.log("[v0] Create crop plan response:", response);
      await fetchCropPlans();
      return response; // ✅ return response to the caller
    } catch (err: any) {
      console.error("[v0] Error creating crop plan:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
      throw err; // ✅ re-throw so component can handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCropPlans();
  }, []);

  return { cropPlans, loading, error, addCropPlan, fetchCropPlans };
}
