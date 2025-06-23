import { HttpRequest, HttpResponse } from '@/generated/typeshare-types'
import { invoke } from '@tauri-apps/api/core'

export class ProxyHttpBridge {
  static async proxy_http_request(request: HttpRequest): Promise<HttpResponse> {
    try {
      return await invoke<HttpResponse>('proxy_http_request', {
        request,
      })
    } catch (error) {
      console.error('Failed to send HTTP request:', error)
      throw error
    }
  }
}
