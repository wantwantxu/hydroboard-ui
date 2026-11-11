

function pad(n) {
  return String(n).padStart(2, '0')
}

function fmt(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`
}


export function listDangerAreaForecast() {
  return [
    {
      id: 'DA001',
      dangerAreaName: '青云河中游',
      x: 104.06,
      y: 30.68,
      mean: [1.2, 6.5, 14.8]
    },
    {
      id: 'DA002',
      dangerAreaName: '蓝溪河谷',
      x: 104.18,
      y: 30.62,
      mean: [0, 2.1, 5.4]
    },
    {
      id: 'DA003',
      dangerAreaName: '云梦库区',
      x: 104.05,
      y: 30.75,
      mean: [3.6, 12.0, 28.5]
    },
    {
      id: 'DA004',
      dangerAreaName: '雾岭山区',
      x: 103.85,
      y: 30.78,
      mean: [8.2, 22.4, 41.0]
    },
    {
      id: 'DA005',
      dangerAreaName: '石门流域',
      x: 104.32,
      y: 30.66,
      mean: [0.4, 1.8, 3.2]
    },
    {
      id: 'DA006',
      dangerAreaName: '锦江口段',
      x: 104.10,
      y: 30.65,
      mean: [2.5, 9.1, 18.6]
    }
  ]
}


export function listXyRainSeries(hour = 72) {
  const n = Math.max(1, Number(hour) || 72)
  const now = new Date()
  now.setMinutes(0, 0, 0)
  const list = []
  for (let i = 1; i <= n; i++) {
    const t = new Date(now.getTime() + i * 3600 * 1000)

    const rain = i <= 24
      ? Math.round((2 + Math.sin(i / 3) * 4 + (i % 5) * 0.6) * 10) / 10
      : Math.round(Math.max(0, 1.5 - (i - 24) / 40 + Math.sin(i / 5) * 0.8) * 10) / 10
    list.push({ date: fmt(t), rain: Math.max(0, rain) })
  }
  return list
}


export function listXyRainMinuteSeries(hour = 3) {
  const totalMin = Math.max(1, Number(hour) || 3) * 60
  const step = 10
  const now = new Date()
  now.setSeconds(0, 0)
  const list = []
  for (let m = step; m <= totalMin; m += step) {
    const t = new Date(now.getTime() + m * 60 * 1000)
    const rain = Math.round(Math.max(0, 0.8 + Math.sin(m / 25) * 1.2) * 10) / 10
    list.push({ date: fmt(t), rain })
  }
  return list
}

export function mockGeocoder() {
  return {
    formatted_address: '示范省示范市示范区青云河畔',
    location: { lon: 104.06, lat: 30.65 },
    addressComponent: {
      province: '示范省',
      city: '示范市',
      county: '示范区',
      town: '',
      road: '青云路'
    }
  }
}


export function listFcstObjects() {
  return [
    { id: 'DEMO006', name: '青云站', type: '河道', area: 1260 },
    { id: 'DEMO009', name: '云梦水库', type: '水库', area: 860 },
    { id: 'DEMO012', name: '锦江口', type: '河道', area: 2140 },
    { id: 'DEMO015', name: '蓝溪桥', type: '河道', area: 480 }
  ]
}


export function listFcstModels() {
  return [
    { id: 1, name: '新安江' },
    { id: 2, name: 'API' },
    { id: 3, name: '上下游预报' },
    { id: 6, name: '马斯京根' }
  ]
}


export function listFcstPlans(params = {}) {
  const objectsId = params.objectsId || 'DEMO006'
  const modelId = params.modelId || 1
  return [
    { id: `${objectsId}-P1`, name: '默认方案', objectsId, modelId },
    { id: `${objectsId}-P2`, name: '汛期方案', objectsId, modelId }
  ]
}


export function listFcstPlanResults(params = {}) {
  const start = params.stm ? new Date(params.stm) : new Date()
  if (Number.isNaN(start.getTime())) start.setTime(Date.now())
  start.setMinutes(0, 0, 0)
  const list = []
  for (let i = 0; i < 48; i++) {
    const t = new Date(start.getTime() + i * 3600 * 1000)
    const wave = Math.sin(i / 6) * 0.5 + Math.sin(i / 14) * 0.25
    list.push({
      tm: fmt(t),
      z: Math.round((5.8 + wave + i * 0.01) * 100) / 100,
      q: Math.round((120 + wave * 80 + i * 1.5) * 1000) / 1000,
      rainfall: Math.round(Math.max(0, 3 + Math.sin(i / 4) * 4) * 10) / 10
    })
  }
  return list
}


export function listFcstObjectsGeom(params = {}) {
  const objectsId = params.objectsId || 'DEMO006'
  return [{
    objectsId,
    geom: JSON.stringify({
      type: 'Feature',
      properties: { objectsId },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.00, 30.70],
          [104.12, 30.70],
          [104.12, 30.60],
          [104.00, 30.60],
          [104.00, 30.70]
        ]]
      }
    })
  }]
}
