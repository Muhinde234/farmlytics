'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { notificationService } from '@/api/notification'
import type { SendNotificationRequest } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Bell, Send, Loader2, CheckCircle2, Info } from 'lucide-react'
import { toast } from 'sonner'
import Topsection from '@/components/common/topsection'

const EMPTY_FORM: SendNotificationRequest = {
  deviceToken: '',
  title: '',
  body: '',
  data: {},
}

export default function NotificationPage() {
  const t = useTranslations('notifications')
  const [form, setForm] = useState<SendNotificationRequest>(EMPTY_FORM)
  const [dataRaw, setDataRaw] = useState('')
  const [sending, setSending] = useState(false)
  const [lastResult, setLastResult] = useState<string | null>(null)

  const handleSend = async () => {
    if (!form.title || !form.body) {
      toast.error('Title and body are required.')
      return
    }
    let parsedData: Record<string, string> = {}
    if (dataRaw.trim()) {
      try {
        parsedData = JSON.parse(dataRaw)
      } catch {
        toast.error('Extra data must be valid JSON (e.g. {"key":"value"})')
        return
      }
    }
    setSending(true)
    try {
      const res = await notificationService.send({ ...form, data: parsedData })
      setLastResult(res.message ?? 'sent')
      toast.success(t('success'))
      setForm(EMPTY_FORM)
      setDataRaw('')
    } catch {
      toast.error(t('error'))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <Topsection />
      <h1 className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
        <Bell className="h-6 w-6" /> {t('title')}
      </h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-emerald-800 flex items-center gap-2">
              <Send className="h-4 w-4" /> {t('sendNotification')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">{t('deviceToken')}</Label>
              <Input
                placeholder="fcm_device_token_here"
                value={form.deviceToken ?? ''}
                onChange={(e) => setForm({ ...form, deviceToken: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">{t('notificationTitle')} *</Label>
              <Input
                placeholder="e.g. Harvest Reminder"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">{t('body')} *</Label>
              <Input
                placeholder="e.g. Your maize is ready for harvest in Kigali."
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Extra Data (JSON, optional)</Label>
              <Input
                placeholder='{"cropId": "abc123"}'
                value={dataRaw}
                onChange={(e) => setDataRaw(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={sending}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              {sending ? (
                <><Loader2 className="animate-spin h-4 w-4 mr-2" /> {t('sending')}</>
              ) : (
                <><Send className="h-4 w-4 mr-2" /> {t('send')}</>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {lastResult && (
            <Card className="border border-emerald-200 bg-emerald-50">
              <CardContent className="p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-800 text-sm">Notification Sent!</p>
                  <p className="text-xs text-emerald-700 font-mono mt-1">Message ID: {lastResult}</p>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="border-0 shadow-sm bg-amber-50">
            <CardContent className="p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">About Push Notifications</p>
                <ul className="text-xs text-amber-700 mt-1 space-y-1 list-disc list-inside">
                  <li>Notifications are delivered via Firebase Cloud Messaging (FCM).</li>
                  <li>Leave Device Token blank to broadcast to all registered devices.</li>
                  <li>The Extra Data field accepts a JSON object for custom payload.</li>
                  <li>Use the Register Device endpoint in your mobile app to get a device token.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}