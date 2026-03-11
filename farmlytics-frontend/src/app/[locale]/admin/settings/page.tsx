'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useUser } from '@/context/userContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  User,
  Phone,
  MapPin,
  Sprout,
  Globe,
  Bell,
  Shield,
  Database,
  HelpCircle,
  LogOut,
  AlertTriangle,
  Lock,
  Download,
  Trash2,
  MessageSquare,
  Bug,
  ChevronRight,
} from 'lucide-react'
import Topsection from '@/components/common/topsection'
import { toast } from 'sonner'

const LANGUAGES = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
]

type NotifKey = 'market' | 'disease' | 'harvest' | 'weather'

export default function SettingsPage() {
  const t = useTranslations('settings')
  const { user, logout } = useUser()
  const router = useRouter()
  const currentLocale = useLocale()

  const [notifications, setNotifications] = useState<Record<NotifKey, boolean>>({
    market: true,
    disease: true,
    harvest: true,
    weather: false,
  })

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?'

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(
        currentLocale === 'rw' ? 'fr-RW' : currentLocale,
        { year: 'numeric', month: 'long' }
      )
    : '—'

  const handleLocaleChange = (value: string) => {
    router.replace('/admin/settings', { locale: value as 'en' | 'fr' | 'rw' })
    toast.success(t('languageChanged'))
  }

  const handleNotifChange = (key: NotifKey) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
    toast.success('Preferences saved')
  }

  const profileFields: { label: string; value: string | undefined; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: t('name'), value: user?.name, icon: User },
    { label: t('email'), value: user?.email, icon: User },
    { label: t('phone'), value: user?.phone, icon: Phone },
    { label: t('district'), value: user?.district, icon: MapPin },
    { label: t('sector'), value: user?.sector, icon: MapPin },
    { label: t('farmSize'), value: user?.farmSize ? `${user.farmSize} ha` : undefined, icon: Sprout },
  ]

  return (
    <div className="pb-10 space-y-6">
      <Topsection />

      {/* ── Profile Hero ─────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-700 to-emerald-500 p-6 text-white shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12),_transparent)]" />
        <div className="relative flex items-center gap-5">
          <div className="w-16 h-16 shrink-0 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-2xl font-bold select-none">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-emerald-200 font-medium uppercase tracking-widest mb-0.5">
              {t('welcome')}
            </p>
            <h2 className="text-xl font-bold truncate">{user?.name ?? user?.email ?? '—'}</h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-medium">
                {user?.role === 'FARMER' ? t('farmer') : t('buyer')}
              </span>
              {user?.email && (
                <span className="text-xs text-emerald-200 truncate">• {user.email}</span>
              )}
            </div>
          </div>
          <div className="text-right hidden sm:block shrink-0">
            <p className="text-xs text-emerald-300">{t('memberSince')}</p>
            <p className="text-sm font-semibold mt-0.5">{memberSince}</p>
          </div>
        </div>
      </div>

      {/* ── Profile Details ──────────────────────────────────── */}
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="flex items-center gap-2.5 text-base text-gray-800">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <User className="h-4 w-4 text-emerald-700" />
            </div>
            {t('profileInfo')}
          </CardTitle>
          <p className="text-xs text-gray-400 mt-1">{t('viewOnlyNote')}</p>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="grid sm:grid-cols-2 gap-4">
            {profileFields.map(({ label, value, icon: Icon }) => (
              <div key={label} className="space-y-1.5">
                <Label className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Icon className="h-3 w-3" /> {label}
                </Label>
                <div className="flex items-center h-9 px-3 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-700">
                  {value ?? <span className="text-gray-300 italic">—</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Language + Notifications ─────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Language */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="flex items-center gap-2.5 text-base text-gray-800">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <Globe className="h-4 w-4 text-blue-600" />
              </div>
              {t('languageSettings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            {LANGUAGES.map(({ value, label, flag }) => (
              <button
                key={value}
                onClick={() => handleLocaleChange(value)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  currentLocale === value
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/50'
                }`}
              >
                <span className="text-lg leading-none">{flag}</span>
                <span className="flex-1 text-left">{label}</span>
                {currentLocale === value && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                )}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="flex items-center gap-2.5 text-base text-gray-800">
              <div className="p-1.5 bg-amber-50 rounded-lg">
                <Bell className="h-4 w-4 text-amber-600" />
              </div>
              {t('notifications')}
            </CardTitle>
            <p className="text-xs text-gray-400 mt-1">{t('notifNote')}</p>
          </CardHeader>
          <CardContent className="pt-4 space-y-1">
            {(
              [
                { id: 'market' as NotifKey, label: t('marketUpdates') },
                { id: 'disease' as NotifKey, label: t('diseaseAlerts') },
                { id: 'harvest' as NotifKey, label: t('harvestReminders') },
                { id: 'weather' as NotifKey, label: t('weatherAlerts') },
              ]
            ).map(({ id, label }) => (
              <label
                key={id}
                htmlFor={id}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Checkbox
                  id={id}
                  checked={notifications[id]}
                  onCheckedChange={() => handleNotifChange(id)}
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <span className="text-sm text-gray-700 select-none">{label}</span>
              </label>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Security + Data ──────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Security */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="flex items-center gap-2.5 text-base text-gray-800">
              <div className="p-1.5 bg-violet-50 rounded-lg">
                <Shield className="h-4 w-4 text-violet-600" />
              </div>
              {t('accountSecurity')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-violet-200 hover:bg-violet-50/50 text-sm text-gray-700 font-medium transition-all group">
              <Lock className="h-4 w-4 text-gray-400 group-hover:text-violet-600" />
              <span className="flex-1 text-left">{t('changePassword')}</span>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-violet-400" />
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-red-200 hover:bg-red-50 text-sm text-gray-700 font-medium transition-all group"
            >
              <LogOut className="h-4 w-4 text-gray-400 group-hover:text-red-500" />
              <span className="flex-1 text-left group-hover:text-red-600">{t('logout')}</span>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-red-400" />
            </button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="flex items-center gap-2.5 text-base text-gray-800">
              <div className="p-1.5 bg-sky-50 rounded-lg">
                <Database className="h-4 w-4 text-sky-600" />
              </div>
              {t('dataManagement')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-sky-200 hover:bg-sky-50/50 text-sm text-gray-700 font-medium transition-all group">
              <Download className="h-4 w-4 text-gray-400 group-hover:text-sky-600" />
              <span className="flex-1 text-left">{t('downloadData')}</span>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-sky-500" />
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-sky-200 hover:bg-sky-50/50 text-sm text-gray-700 font-medium transition-all group">
              <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-sky-600" />
              <span className="flex-1 text-left">{t('clearLogs')}</span>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-sky-500" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* ── Help ────────────────────────────────────────────── */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="flex items-center gap-2.5 text-base text-gray-800">
            <div className="p-1.5 bg-teal-50 rounded-lg">
              <HelpCircle className="h-4 w-4 text-teal-600" />
            </div>
            {t('helpSupport')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 grid sm:grid-cols-2 gap-3">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-teal-200 hover:bg-teal-50/50 text-sm text-gray-700 font-medium transition-all group">
            <MessageSquare className="h-4 w-4 text-gray-400 group-hover:text-teal-600" />
            <span className="flex-1 text-left">{t('contactSupport')}</span>
            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-teal-500" />
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-teal-200 hover:bg-teal-50/50 text-sm text-gray-700 font-medium transition-all group">
            <Bug className="h-4 w-4 text-gray-400 group-hover:text-teal-600" />
            <span className="flex-1 text-left">{t('reportProblem')}</span>
            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-teal-500" />
          </button>
        </CardContent>
      </Card>

      {/* ── Danger Zone ─────────────────────────────────────── */}
      <Card className="border border-red-100 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2.5 text-base text-red-700">
            <div className="p-1.5 bg-red-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            {t('dangerZone')}
          </CardTitle>
          <p className="text-xs text-red-400 mt-1">{t('deleteAccountDesc')}</p>
        </CardHeader>
        <CardContent>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors">
            <Trash2 className="h-4 w-4" />
            {t('deleteAccount')}
          </button>
        </CardContent>
      </Card>

      {/* ── App Info ────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 py-4 text-xs text-gray-300 select-none">
        <Sprout className="h-3 w-3" />
        <span>{t('appVersion')}</span>
        <span>•</span>
        <span>{t('builtFor')}</span>
      </div>
    </div>
  )
}
