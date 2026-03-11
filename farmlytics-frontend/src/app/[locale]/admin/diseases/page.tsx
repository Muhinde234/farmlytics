'use client'

import { useState } from 'react'
import { useDiseaseRisk, usePlantingWindow } from '@/hooks/use-ml'
import { useCrops } from '@/hooks/use-crops'
import { useDistricts } from '@/hooks/use-district'
import type { District } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Loader2,
  Bug,
  AlertTriangle,
  Shield,
  CheckCircle2,
  Calendar,
  Sprout,
  Construction,
} from 'lucide-react'
import Topsection from '@/components/common/topsection'

const RISK_STYLES: Record<string, string> = {
  'Low Risk': 'text-green-700 bg-green-50 border-green-200',
  'Medium Risk of Disease': 'text-amber-700 bg-amber-50 border-amber-200',
  'High Risk': 'text-red-700 bg-red-50 border-red-200',
}

export default function DiseasesPage() {
  const { data: crops = [], isLoading: loadingCrops } = useCrops()
  const { data: districts = [], isLoading: loadingDistricts } = useDistricts()
  const { loading: riskLoading, result: riskResult, predict: predictRisk } = useDiseaseRisk()
  const { loading: windowLoading, result: windowResult, recommend: recommendWindow } = usePlantingWindow()

  const [riskInput, setRiskInput] = useState({ crop: '', district: '' })
  const [windowInput, setWindowInput] = useState({ crop: '', district: '' })

  return (
    <div className="space-y-8 pb-10">
      <Topsection />

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-emerald-800">Disease &amp; Risk Intelligence</h1>
        <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
          <Construction className="h-3 w-3" /> Under Development
        </span>
      </div>
      <p className="text-sm text-gray-500 -mt-6">
        AI-powered disease risk prediction and optimal planting window recommendations.
        Predictions are currently simulated — full ML integration is pending.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Disease Risk */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
              <Bug className="h-4 w-4 text-red-500" /> Disease Risk Predictor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Select value={riskInput.crop} onValueChange={(v) => setRiskInput({ ...riskInput, crop: v })} disabled={loadingCrops}>
                <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                <SelectContent>
                  {crops.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={riskInput.district} onValueChange={(v) => setRiskInput({ ...riskInput, district: v })} disabled={loadingDistricts}>
                <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                <SelectContent>
                  {(districts as District[]).map((d) => <SelectItem key={String(d.code)} value={d.name}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button
                onClick={() => { if (riskInput.crop && riskInput.district) predictRisk(riskInput) }}
                disabled={riskLoading || !riskInput.crop || !riskInput.district}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {riskLoading ? <Loader2 className="animate-spin h-4 w-4 mr-1" /> : <Bug className="h-4 w-4 mr-1" />}
                Predict Disease Risk
              </Button>
            </div>

            {riskResult && (
              <div className={`rounded-xl border p-4 space-y-3 ${RISK_STYLES[riskResult.prediction] ?? RISK_STYLES['Medium Risk of Disease']}`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">{riskResult.prediction}</span>
                  <span className="ml-auto text-sm opacity-75">Score: {(riskResult.risk_score * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1 opacity-75">Diseases &amp; Pests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {riskResult.common_diseases_pests.map((d) => (
                      <span key={d} className="text-xs bg-white/70 border rounded-full px-2 py-0.5">{d}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1 opacity-75 flex items-center gap-1"><Shield className="h-3 w-3" /> Preventive Measures</p>
                  <ul className="text-xs space-y-0.5 list-disc list-inside">
                    {riskResult.preventive_measures.map((m) => <li key={m}>{m}</li>)}
                  </ul>
                </div>
                <p className="text-xs italic opacity-60">{riskResult.message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Planting Window */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600" /> Optimal Planting Window
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Select value={windowInput.crop} onValueChange={(v) => setWindowInput({ ...windowInput, crop: v })} disabled={loadingCrops}>
                <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                <SelectContent>
                  {crops.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={windowInput.district} onValueChange={(v) => setWindowInput({ ...windowInput, district: v })} disabled={loadingDistricts}>
                <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                <SelectContent>
                  {(districts as District[]).map((d) => <SelectItem key={String(d.code)} value={d.name}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button
                onClick={() => { if (windowInput.crop && windowInput.district) recommendWindow(windowInput) }}
                disabled={windowLoading || !windowInput.crop || !windowInput.district}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                {windowLoading ? <Loader2 className="animate-spin h-4 w-4 mr-1" /> : <Sprout className="h-4 w-4 mr-1" />}
                Get Planting Window
              </Button>
            </div>

            {windowResult && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-800 text-sm">Recommended Window</p>
                    <p className="text-sm text-emerald-700 mt-0.5">
                      <strong>{new Date(windowResult.optimal_start_date).toLocaleDateString()}</strong>
                      {' → '}
                      <strong>{new Date(windowResult.optimal_end_date).toLocaleDateString()}</strong>
                    </p>
                  </div>
                </div>
                <p className="text-xs text-emerald-700">{windowResult.rationale}</p>
                <p className="text-xs italic text-emerald-500">{windowResult.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-amber-200 bg-amber-50">
        <CardContent className="p-4 flex items-start gap-3">
          <Construction className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Full ML Integration Coming Soon</p>
            <p className="text-xs text-amber-700 mt-1">
              The predictions above are generated by a mock ML model. Real-time satellite imagery,
              weather data, and field sensor integration are planned for future releases.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}