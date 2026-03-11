'use client'

import { useMarketConnections } from '@/hooks/use-market'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, ShoppingBag, Building2, Users, Truck, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import Topsection from '@/components/common/topsection'

function formatRwf(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return String(value)
}

function EntityCard({
  title,
  workers,
  turnover,
  capital,
}: {
  title: string
  workers: number
  turnover: number
  capital: number
}) {
  return (
    <Card className="border border-emerald-100 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <p className="text-sm font-semibold text-emerald-800 leading-tight mb-3">{title}</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50 rounded-lg p-2">
            <p className="text-lg font-bold text-blue-700">{workers}</p>
            <p className="text-[10px] text-blue-500">Workers</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-2">
            <p className="text-lg font-bold text-emerald-700">{formatRwf(turnover)}</p>
            <p className="text-[10px] text-emerald-500">Turnover</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-2">
            <p className="text-lg font-bold text-amber-700">{formatRwf(capital)}</p>
            <p className="text-[10px] text-amber-500">Capital</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MarketConnectionPage() {
  const t = useTranslations('market')
  const { loading, demands, cooperatives, buyersProcessors, exporters, error, refetch } =
    useMarketConnections()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-emerald-600 h-8 w-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
        >
          {t('retry')}
        </button>
      </div>
    )
  }

  const demandChartData = demands.map((d) => ({
    crop: d.CropName,
    qty: Math.round(d.Total_Weighted_Consumption_Qty_Kg / 1000),
    value: Math.round(d.Total_Weighted_Consumption_Value_Rwf / 1_000_000),
  }))

  return (
    <div className="space-y-8 pb-10">
      <Topsection />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-emerald-800">{t('pageTitle')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('pageDescription')}</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Market Demands', count: demands.length, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Cooperatives', count: cooperatives.length, icon: Users, color: 'text-blue-600 bg-blue-50' },
          {
            label: 'Buyers & Processors',
            count: (buyersProcessors.Potential_Buyers?.length ?? 0) + (buyersProcessors.Food_Processors?.length ?? 0),
            icon: ShoppingBag,
            color: 'text-amber-600 bg-amber-50',
          },
          { label: 'Exporters', count: exporters.length, icon: Truck, color: 'text-purple-600 bg-purple-50' },
        ].map(({ label, count, icon: Icon, color }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${color.split(' ')[1]}`}>
                <Icon className={`h-5 w-5 ${color.split(' ')[0]}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="demand" className="w-full">
        <TabsList className="bg-emerald-50 border border-emerald-100">
          <TabsTrigger value="demand" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            {t('tabs.demand')}
          </TabsTrigger>
          <TabsTrigger value="cooperatives" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            {t('tabs.cooperatives')}
          </TabsTrigger>
          <TabsTrigger value="buyers" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            {t('tabs.buyers')}
          </TabsTrigger>
          <TabsTrigger value="exporters" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            {t('tabs.exporters')}
          </TabsTrigger>
        </TabsList>

        {/* Demand Tab */}
        <TabsContent value="demand" className="mt-6 space-y-6">
          {demandChartData.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-gray-700">Consumption by Crop</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={demandChartData} margin={{ left: -10, right: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                    <XAxis
                      dataKey="crop"
                      tick={{ fontSize: 11 }}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}K`} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}M`} />
                    <Tooltip
                      formatter={(v: number, name: string) =>
                        name === 'qty' ? [`${v}K kg`, 'Qty'] : [`${v}M RWF`, 'Value']
                      }
                    />
                    <Bar yAxisId="left" dataKey="qty" fill="#22c55e" name="qty" radius={[3, 3, 0, 0]} />
                    <Bar yAxisId="right" dataKey="value" fill="#3b82f6" name="value" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demands.map((d) => (
              <Card key={d.CropName} className="border border-emerald-100 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <p className="font-semibold text-emerald-800 mb-2">{d.CropName}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Qty</span>
                      <span className="font-medium">{d.Total_Weighted_Consumption_Qty_Kg.toLocaleString()} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Value</span>
                      <span className="font-medium text-emerald-700">
                        {d.Total_Weighted_Consumption_Value_Rwf.toLocaleString()} RWF
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cooperatives Tab */}
        <TabsContent value="cooperatives" className="mt-6">
          {cooperatives.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No cooperatives found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cooperatives.map((c, i) => (
                <EntityCard
                  key={i}
                  title={c.ISIC_Section_Name}
                  workers={c.Total_workers}
                  turnover={c.Annual_Turnover_2022}
                  capital={c.Employed_Capital}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Buyers & Processors Tab */}
        <TabsContent value="buyers" className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-emerald-600" /> Potential Buyers
            </h3>
            {buyersProcessors.Potential_Buyers?.length === 0 ? (
              <p className="text-sm text-gray-400">No buyers found.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(buyersProcessors.Potential_Buyers ?? []).map((b, i) => (
                  <EntityCard
                    key={i}
                    title={b.ISIC_Section_Name}
                    workers={b.Total_workers}
                    turnover={b.Annual_Turnover_2022}
                    capital={b.Employed_Capital}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" /> Food Processors
            </h3>
            {buyersProcessors.Food_Processors?.length === 0 ? (
              <p className="text-sm text-gray-400">No food processors found.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(buyersProcessors.Food_Processors ?? []).map((fp, i) => (
                  <EntityCard
                    key={i}
                    title={fp.ISIC_Section_Name}
                    workers={fp.Total_workers}
                    turnover={fp.Annual_Turnover_2022}
                    capital={fp.Employed_Capital}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Exporters Tab */}
        <TabsContent value="exporters" className="mt-6">
          {exporters.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No exporters found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {exporters.map((e, i) => (
                <EntityCard
                  key={i}
                  title={e.ISIC_Section_Name}
                  workers={e.Total_workers}
                  turnover={e.Annual_Turnover_2022}
                  capital={e.Employed_Capital}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function MarketConnectionsPage() {
  const t = useTranslations('market')
  const { loading, demands, cooperatives, buyers, exporters, error, refetch } = useMarketConnections()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-green-600 h-8 w-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {t('retry') || 'Retry'}
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      <h1 className="text-3xl font-semibold text-green-700">{t('pageTitle') || 'Market Connections'}</h1>
      <p className="text-gray-600">{t('pageDescription') || 'Explore market demand, cooperatives, buyers, and exporters to grow your agribusiness.'}</p>

      <Tabs defaultValue="demand" className="w-full">
        <TabsList className="bg-green-100 text-green-800">
          <TabsTrigger value="demand">{t('tabs.demand') || 'Market Demand'}</TabsTrigger>
          <TabsTrigger value="cooperatives">{t('tabs.cooperatives') || 'Cooperatives'}</TabsTrigger>
          <TabsTrigger value="buyers">{t('tabs.buyers') || 'Buyers & Processors'}</TabsTrigger>
          <TabsTrigger value="exporters">{t('tabs.exporters') || 'Exporters'}</TabsTrigger>
        </TabsList>

        {/* Market Demand Chart */}
        <TabsContent value="demand" className="mt-4 space-y-4">
          {demands.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demands}>
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demandLevel" fill="#16a34a" name={t('chart.demand') || 'Demand'} />
                <Bar dataKey="expectedPrice" fill="#22c55e" name={t('chart.price') || 'Expected Price'} />
              </BarChart>
            </ResponsiveContainer>
          )}
          <div className="grid md:grid-cols-3 gap-4">
            {demands.map((d) => (
              <Card key={d.id} className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">{d.crop}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>{t('labels.demand') || 'Demand'}:</strong> {d.demandLevel}</p>
                  <p><strong>{t('labels.region') || 'Region'}:</strong> {d.region}</p>
                  <p><strong>{t('labels.expectedPrice') || 'Expected Price'}:</strong> {d.expectedPrice}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cooperatives */}
        <TabsContent value="cooperatives" className="mt-4 grid md:grid-cols-3 gap-4">
          {cooperatives.map((c) => (
            <Card key={c.id} className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">{c.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>{t('labels.location') || 'Location'}:</strong> {c.location}</p>
                <p><strong>{t('labels.contact') || 'Contact'}:</strong> {c.contact}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Buyers */}
        <TabsContent value="buyers" className="mt-4 grid md:grid-cols-3 gap-4">
          {buyers.map((b) => (
            <Card key={b.id} className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">{b.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>{t('labels.product') || 'Product'}:</strong> {b.product}</p>
                <p><strong>{t('labels.location') || 'Location'}:</strong> {b.location}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Exporters */}
        <TabsContent value="exporters" className="mt-4 grid md:grid-cols-3 gap-4">
          {exporters.map((e) => (
            <Card key={e.id} className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">{e.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>{t('labels.country') || 'Country'}:</strong> {e.country}</p>
                <p><strong>{t('labels.contact') || 'Contact'}:</strong> {e.contact}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
