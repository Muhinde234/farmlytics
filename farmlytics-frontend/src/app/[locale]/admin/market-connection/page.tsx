'use client'

import { useMarketConnections } from '@/hooks/use-market'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

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
