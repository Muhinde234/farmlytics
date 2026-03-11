'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCropPlans } from '@/hooks/use-crop'
import type { CropPlan, RecordHarvestDTO } from '@/lib/types'
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
import {
  Loader2,
  Wheat,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  ChevronRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { toast } from 'sonner'
import Topsection from '@/components/common/topsection'

const EMPTY_HARVEST: RecordHarvestDTO = {
  actualHarvestDate: '',
  actualYieldKgPerHa: 0,
  actualSellingPricePerKgRwf: 0,
  harvestNotes: '',
}

function RecordHarvestModal({
  plan,
  onConfirm,
  loading,
}: {
  plan: CropPlan
  onConfirm: (id: string, data: RecordHarvestDTO) => Promise<void>
  loading: boolean
}) {
  const [form, setForm] = useState<RecordHarvestDTO>(EMPTY_HARVEST)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs">
          <ChevronRight className="h-3 w-3 mr-1" /> Record Harvest
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md bg-white rounded-2xl border border-emerald-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-emerald-800">
            Record Harvest â€” {plan.cropName}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="space-y-3 mt-2">
          <Input
            type="date"
            placeholder="Actual harvest date"
            value={form.actualHarvestDate}
            onChange={(e) => setForm({ ...form, actualHarvestDate: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Actual yield (kg/ha)"
            value={form.actualYieldKgPerHa || ''}
            onChange={(e) => setForm({ ...form, actualYieldKgPerHa: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Selling price (RWF/kg)"
            value={form.actualSellingPricePerKgRwf || ''}
            onChange={(e) => setForm({ ...form, actualSellingPricePerKgRwf: Number(e.target.value) })}
          />
          <Input
            placeholder="Harvest notes (optional)"
            value={form.harvestNotes ?? ''}
            onChange={(e) => setForm({ ...form, harvestNotes: e.target.value })}
          />
        </div>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-emerald-700 hover:bg-emerald-800 text-white"
            onClick={() => onConfirm(plan._id, form)}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Harvest'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function HarvestTrackerPage() {
  const t = useTranslations('HarvestTracker')
  const { cropPlans, loading, harvestCropPlan } = useCropPlans()

  const harvested = cropPlans.filter((p) => p.status === 'Harvested')
  const pending = cropPlans.filter((p) => p.status !== 'Harvested')
  const totalActualRevenue = harvested.reduce((s, p) => s + (p.actualRevenueRwf ?? 0), 0)
  const totalEstRevenue = cropPlans.reduce((s, p) => s + (p.estimatedRevenueRwf ?? 0), 0)
  const totalYield = harvested.reduce((s, p) => s + (p.actualTotalProductionKg ?? 0), 0)

  // Chart: actual vs estimated yield per crop
  const cropYieldMap: Record<string, { estimated: number; actual: number }> = {}
  cropPlans.forEach((p) => {
    if (!cropYieldMap[p.cropName]) cropYieldMap[p.cropName] = { estimated: 0, actual: 0 }
    cropYieldMap[p.cropName].estimated += p.estimatedTotalProductionKg ?? 0
    cropYieldMap[p.cropName].actual += p.actualTotalProductionKg ?? 0
  })
  const yieldChartData = Object.entries(cropYieldMap)
    .map(([crop, d]) => ({ crop, ...d }))
    .slice(0, 6)

  const handleRecordHarvest = async (id: string, data: RecordHarvestDTO) => {
    try {
      await harvestCropPlan(id, data)
      toast.success('Harvest recorded successfully!')
    } catch {
      toast.error('Failed to record harvest.')
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <Topsection />
      <h1 className="text-2xl font-bold text-emerald-800">{t('title')}</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Harvested Plans', value: harvested.length, icon: CheckCircle2, color: 'text-blue-600 bg-blue-50' },
          { label: 'Pending Harvest', value: pending.length, icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Total Yield (kg)', value: totalYield.toLocaleString(), icon: Wheat, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Actual Revenue', value: `${(totalActualRevenue / 1000).toFixed(0)}K RWF`, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`inline-flex p-2 rounded-lg ${color.split(' ')[1]} mb-2`}>
                <Icon className={`h-4 w-4 ${color.split(' ')[0]}`} />
              </div>
              <p className="text-xl font-bold text-gray-900">{loading ? 'â€¦' : value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Yield Chart */}
      {yieldChartData.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-700 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              Actual vs Estimated Production (kg)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={yieldChartData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                <XAxis dataKey="crop" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="estimated" fill="#d1fae5" name="Estimated" radius={[3, 3, 0, 0]} />
                <Bar dataKey="actual" fill="#22c55e" name="Actual" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Pending Harvests */}
      <div>
        <h2 className="text-lg font-semibold text-emerald-800 mb-4">Pending Harvests ({pending.length})</h2>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-600 h-8 w-8" /></div>
        ) : pending.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">{t('noData')}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map((plan) => (
              <Card key={plan._id} className="border border-emerald-100 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-100 rounded-full">
                        <Wheat className="h-4 w-4 text-emerald-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-800 text-sm">{plan.cropName}</p>
                        <p className="text-xs text-gray-400">{plan.districtName}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px]">{plan.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
                    <span className="text-gray-400">Area</span><span>{plan.actualAreaPlantedHa} Ha</span>
                    <span className="text-gray-400">Planted</span><span>{new Date(plan.plantingDate).toLocaleDateString()}</span>
                    {plan.estimatedHarvestDate && (
                      <><span className="text-gray-400">Est. Harvest</span><span className="text-amber-600 font-medium">{new Date(plan.estimatedHarvestDate).toLocaleDateString()}</span></>
                    )}
                    {plan.estimatedRevenueRwf && (
                      <><span className="text-gray-400">Est. Revenue</span><span className="text-emerald-700 font-semibold">{plan.estimatedRevenueRwf.toLocaleString()} RWF</span></>
                    )}
                  </div>
                  <RecordHarvestModal plan={plan} onConfirm={handleRecordHarvest} loading={loading} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Harvests */}
      <div>
        <h2 className="text-lg font-semibold text-emerald-800 mb-4">Completed Harvests ({harvested.length})</h2>
        {harvested.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No harvests recorded yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-emerald-100">
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 text-emerald-800">
                <tr>
                  {['Crop', 'District', 'Harvest Date', 'Yield (kg/ha)', 'Total (kg)', 'Revenue (RWF)', 'Notes'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {harvested.map((p) => (
                  <tr key={p._id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-emerald-800">{p.cropName}</td>
                    <td className="px-4 py-3 text-gray-600">{p.districtName}</td>
                    <td className="px-4 py-3 text-gray-600">{p.actualHarvestDate ? new Date(p.actualHarvestDate).toLocaleDateString() : 'â€”'}</td>
                    <td className="px-4 py-3 text-gray-600">{p.actualYieldKgPerHa?.toLocaleString() ?? 'â€”'}</td>
                    <td className="px-4 py-3 text-gray-600">{p.actualTotalProductionKg?.toLocaleString() ?? 'â€”'}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-700">{p.actualRevenueRwf?.toLocaleString() ?? 'â€”'}</td>
                    <td className="px-4 py-3 text-gray-400 italic text-xs max-w-[150px] truncate">{p.harvestNotes ?? 'â€”'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
