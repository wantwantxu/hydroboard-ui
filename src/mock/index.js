import axios from 'axios'
import { resolveMockResponse } from './handlers'


export function setupMock() {
  const enabled = String(import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false'
  if (!enabled) {
    console.info('[mock] disabled')
    return
  }

  axios.interceptors.request.use((config) => {
    const body = resolveMockResponse(config)
    if (!body) return config

    config.adapter = () => Promise.resolve({
      data: body,
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      request: {}
    })
    return config
  })

  console.info('[mock] HydroBoard demo mock API enabled — no backend required')
}

setupMock()

export default setupMock
