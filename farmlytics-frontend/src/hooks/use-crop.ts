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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCropPlan = async (plan: CreateCropPlanDTO) => {
    try {
      setLoading(true);
      await createCropPlan(plan);
      await fetchCropPlans();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCropPlans();
  }, []);

  return { cropPlans, loading, error, addCropPlan, fetchCropPlans };
}
