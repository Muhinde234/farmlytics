"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCropPlans } from "@/hooks/use-crop";
import { CreateCropPlanDTO, District } from "@/lib/types";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Leaf, PlusCircle } from "lucide-react";

import { useDistricts } from "@/hooks/use-district";
import { useCrops } from "@/hooks/use-crops"; // safe useCrops hook
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Topsection from "@/components/common/topsection";

export default function CropPlannerPage() {
  const t = useTranslations("cropPlanner");
  const { cropPlans, loading, addCropPlan } = useCropPlans();
  const { data: districts, isLoading: loadingDistricts } = useDistricts();
  const { data: crops, isLoading: loadingCrops } = useCrops();

  const [newPlan, setNewPlan] = useState<CreateCropPlanDTO>({
    cropName: "",
    districtName: "",
    actualAreaPlantedHa: 0,
    plantingDate: "",
    status: "Planted",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addCropPlan(newPlan);
    setNewPlan({
      cropName: "",
      districtName: "",
      actualAreaPlantedHa: 0,
      plantingDate: "",
      status: "Planted",
    });
  };

  return (
    <div className="space-y-8">
      <Topsection/>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-emerald-800">{t("title")}</h1>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-2">
              <PlusCircle size={18} />
              {t("addButton")}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="max-w-lg bg-white rounded-2xl shadow-xl border border-emerald-100">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold text-emerald-800">
                {t("addButton")}
              </AlertDialogTitle>
            </AlertDialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Crop Select */}
                <Select
                  value={newPlan.cropName}
                  onValueChange={(value) => setNewPlan({ ...newPlan, cropName: value })}
                  disabled={loadingCrops}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {crops?.map((crop) => (
                      <SelectItem key={crop.CropName} value={crop.CropName}>
                        {crop.CropName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* District Select */}
                <Select
                  value={newPlan.districtName}
                  onValueChange={(value) => setNewPlan({ ...newPlan, districtName: value })}
                  disabled={loadingDistricts}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts?.map((d: District) => (
                      <SelectItem key={d.code} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Area Planted */}
                <Input
                  type="number"
                  placeholder={t("form.area")}
                  value={newPlan.actualAreaPlantedHa === 0 ? "" : newPlan.actualAreaPlantedHa}
                  onChange={(e) =>
                    setNewPlan({
                      ...newPlan,
                      actualAreaPlantedHa: e.target.value === "" ? 0 : Number(e.target.value),
                    })
                  }
                  required
                />

                {/* Planting Date */}
                <Input
                  type="date"
                  value={newPlan.plantingDate}
                  onChange={(e) => setNewPlan({ ...newPlan, plantingDate: e.target.value })}
                  required
                />
              </div>

              <AlertDialogFooter className="pt-4">
                <AlertDialogCancel type="button">{t("closeButton")}</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : t("form.submit")}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Crop Plans Section */}
      <h2 className="text-2xl font-semibold mb-4 text-emerald-800">{t("listTitle")}</h2>

      {loading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
        </div>
      ) : cropPlans.length === 0 ? (
        <p className="text-gray-600">{t("noData")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cropPlans.map((plan) => (
            <Card
              key={plan._id}
              className="hover:shadow-lg border-emerald-100 rounded-2xl transition-all duration-200"
            >
              <CardContent className="p-5">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-emerald-100 rounded-full mr-3">
                    <Leaf className="text-emerald-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-emerald-800">{plan.cropName}</h3>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>{t("form.districtName")}:</strong> {plan.districtName}
                  </p>
                  <p>
                    <strong>{t("form.area")}:</strong> {plan.actualAreaPlantedHa} Ha
                  </p>
                  <p>
                    <strong>{t("form.plantingDate")}:</strong>{" "}
                    {new Date(plan.plantingDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>{t("status")}:</strong>{" "}
                    <span className="text-emerald-700 font-medium">{plan.status}</span>
                  </p>

                  {plan.estimatedRevenueRwf && (
                    <p className="font-medium text-gray-700">
                      {t("estRevenue")}:{" "}
                      <span className="text-emerald-800 font-bold">{plan.estimatedRevenueRwf.toLocaleString()} RWF</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
