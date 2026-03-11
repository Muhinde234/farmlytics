'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCropPlans } from '@/hooks/use-crop'
import { useCrops, useCropRecommendations } from '@/hooks/use-crops'
import { useDistricts } from '@/hooks/use-district'
import { useYieldPrediction } from '@/hooks/use-ml'
import type { CreateCropPlanDTO, CropPlan, District } from '@/lib/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  PlusCircle,
  Loader2,
  Leaf,
  Trash2,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from 'lucide-react'
import { toast } from 'sonner'
import Topsection from '@/components/common/topsection'

const STATUS_COLORS: Record<string, string> = {
  Planted: 'bg-green-100 text-green-700',
  Harvested: 'bg-blue-100 text-blue-700',
  Planned: 'bg-amber-100 text-amber-700',
  Failed: 'bg-red-100 text-red-700',
}

function PlanCard({ plan, onDelete }: { plan: CropPlan; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <Card className="border border-emerald-100 rounded-2xl hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-full">
              <Leaf className="text-emerald-700 h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-800">{plan.cropName}</h3>
              <p className="text-xs text-gray-500">{plan.districtName}</p>
            </div>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[plan.status] ?? 'bg-gray-100 text-gray-600'}`}>
            {plan.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
          <span className="text-gray-400">Area</span>
          <span className="font-medium">{plan.actualAreaPlantedHa} Ha</span>
          <span className="text-gray-400">Planted</span>
          <span className="font-medium">{new Date(plan.plantingDate).toLocaleDateString()}</span>
          {plan.estimatedRevenueRwf && (
            <>
              <span className="text-gray-400">Est. Revenue</span>
              <span className="font-semibold text-emerald-700">{plan.estimatedRevenueRwf.toLocaleString()} RWF</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-emerald-600 flex items-center gap-1 hover:underline"
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {expanded ? 'Less' : 'More details'}
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this crop plan?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => onDelete(plan._id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-dashed border-emerald-100 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
            {plan.estimatedHarvestDate && (
              <>
                <span className="text-gray-400">Est. Harvest</span>
                <span>{new Date(plan.estimatedHarvestDate).toLocaleDateString()}</span>
              </>
            )}
            {plan.estimatedYieldKgPerHa && (
              <>
                <span className="text-gray-400">Est. Yield</span>
                <span>{plan.estimatedYieldKgPerHa} kg/ha</span>
              </>
            )}
            {plan.actualRevenueRwf && (
              <>
                <span className="text-gray-400">Actual Revenue</span>
                <span className="font-semibold text-blue-700">{plan.actualRevenueRwf.toLocaleString()} RWF</span>
              </>
            )}
            {plan.harvestNotes && (
              <>
                <span className="text-gray-400 col-span-2">Notes</span>
                <span className="col-span-2 italic text-gray-500">{plan.harvestNotes}</span>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function CropPlansPage() {
  const t = useTranslations('cropPlans')
  const { cropPlans, loading, addCropPlan, removeCropPlan } = useCropPlans()
  const { data: crops = [], isLoading: loadingCrops } = useCrops()
  const { data: districts = [], isLoading: loadingDistricts } = useDistricts()
  const { data: recommendations = [], isLoading: loadingRecs } = useCropRecommendations()
  const { loading: yieldLoading, result: yieldResult, predict: predictYield } = useYieldPrediction()

  const [newPlan, setNewPlan] = useState<CreateCropPlanDTO>({
    cropName: '',
    districtName: '',
    actualAreaPlantedHa: 0,
    plantingDate: '',
    status: 'Planted',
  })
  const [yieldInput, setYieldInput] = useState({ district: '', crop: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addCropPlan(newPlan)
      toast.success(t('successCreate'))
      setNewPlan({ cropName: '', districtName: '', actualAreaPlantedHa: 0, plantingDate: '', status: 'Planted' })
    } catch {
      toast.error(t('errorCreate'))
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await removeCropPlan(id)
      toast.success('Crop plan deleted.')
    } catch {
      toast.error('Failed to delete crop plan.')
    }
  }

  const handleYieldPredict = async () => {
    if (!yieldInput.district || !yieldInput.crop) return
    await predictYield(yieldInput)
  }

  return (
    <div className="space-y-8 pb-10">
      <Topsection />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-emerald-800">{t('title')}</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              {t('addButton')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-lg bg-white rounded-2xl border border-emerald-100">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-emerald-800">{t('addButton')}</AlertDialogTitle>
            </AlertDialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select value={newPlan.cropName} onValueChange={(v) => setNewPlan({ ...newPlan, cropName: v })} disabled={loadingCrops}>
                  <SelectTrigger><SelectValue placeholder={loadingCrops ? 'Loading…' : 'Select crop'} /></SelectTrigger>
                  <SelectContent>
                    {crops.map((c) => (
                      <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={newPlan.districtName} onValueChange={(v) => setNewPlan({ ...newPlan, districtName: v })} disabled={loadingDistricts}>
                  <SelectTrigger><SelectValue placeholder={loadingDistricts ? 'Loading…' : 'Select district'} /></SelectTrigger>
                  <SelectContent>
                    {(districts as District[]).map((d) => (
                      <SelectItem key={String(d.code)} value={d.name}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Area (Ha)"
                  value={newPlan.actualAreaPlantedHa || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, actualAreaPlantedHa: Number(e.target.value) })}
                  required
                />
                <Input
                  type="date"
                  value={newPlan.plantingDate}
                  onChange={(e) => setNewPlan({ ...newPlan, plantingDate: e.target.value })}
                  required
                />

                <Select value={newPlan.status} onValueChange={(v) => setNewPlan({ ...newPlan, status: v })}>
                  <SelectTrigger className="col-span-2"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    {['Planted', 'Planned', 'Harvested', 'Failed'].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <AlertDialogFooter className="pt-2">
                <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button type="submit" disabled={loading} className="bg-emerald-700 hover:bg-emerald-800 text-white">
                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : t('form.submit')}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* AI Recommendations */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-50 to-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-emerald-800 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            {t('aiRecommendations')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingRecs ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="animate-spin h-4 w-4" /> Loading recommendations…
            </div>
          ) : recommendations.length === 0 ? (
            <p className="text-sm text-gray-400">{t('noRecommendations')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec) => (
                <div key={rec.CropName} className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold text-emerald-800">{rec.CropName}</span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <p>Recommended area: <strong>{rec.Recommended_Area_ha} Ha</strong></p>
                    <p>Est. yield: <strong>{rec.Estimated_Yield_Kg_per_Ha.toFixed(0)} kg/ha</strong></p>
                    <p>Total production: <strong>{rec.Estimated_Total_Production_Kg.toFixed(0)} kg</strong></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Yield Prediction Widget */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            {t('yieldPredictor')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <Select value={yieldInput.crop} onValueChange={(v) => setYieldInput({ ...yieldInput, crop: v })}>
              <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
              <SelectContent>
                {crops.map((c) => (
                  <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={yieldInput.district} onValueChange={(v) => setYieldInput({ ...yieldInput, district: v })}>
              <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
              <SelectContent>
                {(districts as District[]).map((d) => (
                  <SelectItem key={String(d.code)} value={d.name}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleYieldPredict}
              disabled={yieldLoading || !yieldInput.crop || !yieldInput.district}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {yieldLoading ? <Loader2 className="animate-spin h-4 w-4 mr-1" /> : null}
              Predict
            </Button>
          </div>
          {yieldResult && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm font-medium text-blue-800">
                Predicted yield:{' '}
                <strong>{yieldResult.predicted_yield_kg_per_ha.toLocaleString()} kg/ha</strong>
              </p>
              <p className="text-xs text-blue-600 mt-0.5">
                Confidence: {(yieldResult.confidence * 100).toFixed(0)}% · {yieldResult.message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Crop Plans Grid */}
      <div>
        <h2 className="text-lg font-semibold text-emerald-800 mb-4">{t('listTitle')}</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-emerald-600 h-8 w-8" />
          </div>
        ) : cropPlans.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Leaf className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{t('noData')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cropPlans.map((plan) => (
              <PlanCard key={plan._id} plan={plan} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}