import API from './axios'
import type {
  ApiResponse,
  SendNotificationRequest,
  SendNotificationResponse,
} from '@/lib/types'

export const notificationService = {
  send: async (
    payload: SendNotificationRequest
  ): Promise<SendNotificationResponse> => {
    const res = await API.post<SendNotificationResponse>('/notifications/send', payload)
    return res.data
  },

  registerDevice: async (deviceToken: string): Promise<void> => {
    await API.post('/notifications/register-device', { deviceToken })
  },
}
