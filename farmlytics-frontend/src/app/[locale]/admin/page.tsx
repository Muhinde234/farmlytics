'use client'

import Topsection from '@/components/common/topsection'
import { useCropPlans } from '@/hooks/use-crop'
import { useRoleStats } from '@/hooks/useUser'
import { useTranslations } from 'next-intl'
import {
  Leaf,
  TrendingUp,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const STATUS_COLORS: Record<string, string> = {
  Planted: '#22c55e',
  Harvested: '#3b82f6',
  Planned: '#f59e0b',
  Failed: '#ef4444',
}

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const { cropPlans, loading } = useCropPlans()
  const { data: roleStats } = useRoleStats()

  const totalPlans = cropPlans.length
  const harvested = cropPlans.filter((p) => p.status === 'Harvested').length
  const planted = cropPlans.filter((p) => p.status === 'Planted').length
  const totalRevenue = cropPlans.reduce((sum, p) => sum + (p.actualRevenueRwf ?? p.estimatedRevenueRwf ?? 0), 0)
  const totalArea = cropPlans.reduce((sum, p) => sum + (p.actualAreaPlantedHa ?? 0), 0)

  // Status distribution for pie chart
  const statusDist = cropPlans.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  }, {})
  const pieData = Object.entries(statusDist).map(([name, value]) => ({ name, value }))

  // Revenue by crop for bar chart
  const revByCrop = cropPlans.reduce<Record<string, number>>((acc, p) => {
    const rev = p.actualRevenueRwf ?? p.estimatedRevenueRwf ?? 0
    acc[p.cropName] = (acc[p.cropName] ?? 0) + rev
    return acc
  }, {})
  const barData = Object.entries(revByCrop)
    .map(([crop, revenue]) => ({ crop, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6)

  const recentPlans = [...cropPlans]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 5)

  const statCards = [
    {
      label: t('stats.totalPlans'),
      value: totalPlans,
      icon: Leaf,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: t('stats.harvested'),
      value: harvested,
      icon: CheckCircle2,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: t('stats.planted'),
      value: planted,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: t('stats.totalRevenue'),
      value: `${(totalRevenue / 1000).toFixed(0)}K RWF`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: t('stats.totalArea'),
      value: `${totalArea.toFixed(1)} Ha`,
      icon: BarChart3,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: t('stats.totalFarmers'),
      value: roleStats?.roleCounts?.FARMER ?? '—',
      icon: Users,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ]

  return (
    <div className="space-y-8 pb-10">
      <Topsection />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{loading ? '…' : value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue by Crop */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-700">
              {t('charts.revenueByCrop')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {barData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">{t('noData')}</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="crop" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v: number) => [`${v.toLocaleString()} RWF`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-700">
              {t('charts.statusDist')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">{t('noData')}</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map(({ name }) => (
                      <Cell
                        key={name}
                        fill={STATUS_COLORS[name] ?? '#94a3b8'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            {t('recentActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentPlans.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">{t('noData')}</p>
          ) : (
            <div className="space-y-3">
              {recentPlans.map((plan) => (
                <div
                  key={plan._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-emerald-100 rounded-full">
                      <Leaf className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{plan.cropName}</p>
                      <p className="text-xs text-gray-500">{plan.districtName} · {plan.actualAreaPlantedHa} Ha</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      {(plan.actualRevenueRwf || plan.estimatedRevenueRwf) && (
                        <p className="text-sm font-semibold text-emerald-700">
                          {((plan.actualRevenueRwf ?? plan.estimatedRevenueRwf ?? 0) / 1000).toFixed(0)}K RWF
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : '—'}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      style={{ borderColor: STATUS_COLORS[plan.status] ?? '#94a3b8', color: STATUS_COLORS[plan.status] ?? '#94a3b8' }}
                      className="text-xs"
                    >
                      {plan.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}