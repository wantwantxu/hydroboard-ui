import { getPortalInitPayload, DEMO_DICTS, DEMO_PORTAL_CONFIG, DEMO_USER } from './data/portal'
import {
  listStations,
  getStationDetail,
  listRainLatest,
  listRainTop,
  listBeyondRain,
  listRiverLatest,
  listRsvrLatest,
  listWaterLatest,
  listHistorySeries,
  listExceedRiver,
  listExceedRsvr
} from './data/stations'
import {
  listDangerAreaForecast,
  listXyRainSeries,
  listXyRainMinuteSeries,
  mockGeocoder,
  listFcstObjects,
  listFcstModels,
  listFcstPlans,
  listFcstPlanResults,
  listFcstObjectsGeom
} from './data/forecast'

function ok(result) {
  return {
    code: 200,
    msg: 'success',
    message: 'success',
    result,

    data: result
  }
}

function parseParams(config) {
  const params = { ...(config.params || {}) }
  if (typeof config.data === 'string' && config.data) {
    try {
      const sp = new URLSearchParams(config.data)
      sp.forEach((v, k) => { params[k] = v })
    } catch (e) {  }
  } else if (config.data && typeof config.data === 'object') {
    Object.assign(params, config.data)
  }
  return params
}

function match(url, pattern) {
  return url.includes(pattern)
}


export function resolveMockResponse(config) {
  const url = String(config.url || '')
  const method = String(config.method || 'get').toLowerCase()
  const params = parseParams(config)


  if (match(url, '/sys/sysPortal/init')) return ok(getPortalInitPayload())
  if (match(url, '/sys/sysDict/listDict')) return ok(DEMO_DICTS)
  if (match(url, '/portalConfig/getBySystem')) return ok(DEMO_PORTAL_CONFIG)
  if (match(url, '/sys/sysUser/info')) return ok(DEMO_USER)
  if (match(url, '/sys/sysUser/login')) {
    return ok(JSON.stringify({ access_token: 'demo-token', token_type: 'bearer', expires_in: 86400 }))
  }
  if (match(url, '/oauth/token/') && (method === 'delete' || method === 'del')) return ok(true)


  if (match(url, '/stPptnR/getLatestRain') || match(url, '/stPptnR/listLatestInstantRain')) {
    return ok(listRainLatest(params.sttpList))
  }
  if (match(url, '/stPptnR/listTopRainStation') || match(url, '/stats/rainfall/getTopRainStations')) return ok(listRainTop())
  if (match(url, '/stats/rainfall/listAreaRainfall')) {
    const dim = params.dim || 'addvcd'
    const areaMap = {
      addvcd: [
        { name: '示范市', dim: 'addvcd', drp: 36.5 },
        { name: '青云区', dim: 'addvcd', drp: 42.1 },
        { name: '锦江县', dim: 'addvcd', drp: 28.8 },
        { name: '望川县', dim: 'addvcd', drp: 31.4 },
        { name: '飞霞区', dim: 'addvcd', drp: 25.6 }
      ],
      rvnm: [
        { name: '青云河', dim: 'rvnm', drp: 41.2 },
        { name: '锦江', dim: 'rvnm', drp: 33.5 },
        { name: '澄江', dim: 'rvnm', drp: 27.9 },
        { name: '清河', dim: 'rvnm', drp: 22.4 },
        { name: '白鹭河', dim: 'rvnm', drp: 18.7 }
      ],
      basin: [
        { name: '青云河流域', dim: 'basin', drp: 39.6 },
        { name: '锦江流域', dim: 'basin', drp: 34.1 },
        { name: '中游示范流域', dim: 'basin', drp: 45.0 },
        { name: '下游联防区', dim: 'basin', drp: 29.3 }
      ]
    }
    return ok(areaMap[dim] || areaMap.addvcd)
  }
  if (match(url, '/stPptnR/listTopBeyondStation')) return ok(listBeyondRain())
  if (match(url, '/stPptnR/countExceedingThreshold')) return ok(listBeyondRain().length)
  if (match(url, '/stPptnR/listRainRecords')) return ok(listHistorySeries(2, 1).map((p) => ({ ...p, stcd: params.stcd || 'DEMO001', stnm: '青云站' })))


  if (match(url, '/duty/warn/log/')) return ok({ records: [], total: 0, list: [] })
  if (match(url, '/reservoir/getOne') || match(url, '/ssReservoir/getOne')) {
    return ok({ stcd: params.stcd || 'DEMO009', stnm: '云梦水库', fsltdz: 68, dsflz: 75 })
  }

  if (match(url, '/stStbprpB/list')) return ok(listStations(params.sttpList))
  if (match(url, '/stStbprpB/get')) {
    return ok(getStationDetail(params.stcd))
  }
  if (match(url, '/water/listLatest')) {
    const types = [].concat(params.sttpList || []).flatMap((v) => String(v).split(',')).map((s) => s.trim()).filter(Boolean)
    const all = listWaterLatest()
    return ok(types.length ? all.filter((s) => types.includes(s.sttp)) : all)
  }
  if (match(url, '/stRiverR/listLatestWaterByStation')) {
    const types = [].concat(params.sttpList || []).flatMap((v) => String(v).split(',')).map((s) => s.trim()).filter(Boolean)
    const all = listRiverLatest()
    return ok(types.length ? all.filter((s) => types.includes(s.sttp)) : all)
  }
  if (match(url, '/stRsvrR/listLatestWaterByStation')) return ok(listRsvrLatest())
  if (match(url, '/stRiverR/listHistoricalData')) return ok(listHistorySeries(5.2, 0.4))
  if (match(url, '/stRsvrR/listHistoricalData')) return ok(listHistorySeries(58, 1.2))

  if (match(url, '/stRvfcchB/list')) {
    return ok([{ stcd: params.stcd || 'DEMO006', wrz: 7.5, grz: 8.8, hlz: 4.2 }])
  }
  if (match(url, '/stRsvrfcchB/list') || match(url, '/stRsvrfsrB/list')) {
    return ok([{ stcd: params.stcd || 'DEMO009', fsltdz: 68, dsflz: 75, normz: 62 }])
  }
  if (match(url, '/stZvarlB/list')) {
    return ok([{ stcd: params.stcd || 'DEMO009', rz: 60, w: 3200 }])
  }
  if (match(url, '/stZvarlB/getW')) return ok({ w: 3200, rz: 60 })
  if (match(url, '/waterLevelCalculation/getStationMinMaxValue')) {
    return ok({ minZ: 4.0, maxZ: 9.2, minQ: 10, maxQ: 900 })
  }


  if (match(url, '/stats/river/listExceedWarning')) return ok(listExceedRiver())
  if (match(url, '/stats/river/listExceedGuarantee')) return ok([])
  if (match(url, '/stats/rsvr/listExceedFloodLimit')) return ok(listExceedRsvr())
  if (match(url, '/stats/rsvr/listExceedCheckLevel')) return ok([])


  if (match(url, '/dangerArea/mean/getNew') || match(url, '/dangerArea/mean/listOrder')) {
    return ok(listDangerAreaForecast())
  }
  if (match(url, '/dangerArea/info/list')) return ok(listDangerAreaForecast())
  if (match(url, '/dangerArea/warn/list')) return ok([])


  if (match(url, '/fcst/objects/list')) return ok(listFcstObjects())
  if (match(url, '/fcst/model/list')) return ok(listFcstModels())
  if (match(url, '/fcst/objects/boundary/list')) return ok(listFcstObjectsGeom(params))
  if (match(url, '/fcst/plan/listByModelId') || match(url, '/fcst/plan/list')) return ok(listFcstPlans(params))
  if (match(url, '/fcst/planResults/list')) return ok(listFcstPlanResults(params))
  if (match(url, '/fcst/planRelStation/') || match(url, '/fcst/planParams/') ||
      match(url, '/fcst/model/params/') || match(url, '/fcst/reachRel/') ||
      match(url, '/fcst/paramsCalibration') || match(url, '/fcst/unitHydrograph/') ||
      match(url, '/fcst/pr/') || match(url, '/fcst/peakLagTime/') || match(url, '/fcst/riverNet/')) {
    return ok([])
  }
  if (match(url, '/fcst/') && (method === 'post' || method === 'put' || method === 'delete' || method === 'del')) {
    return ok(true)
  }


  if (match(url, 'listFeatureXyRainMinute') || match(url, '/listFeatureXyRainMinute')) {
    return ok(listXyRainMinuteSeries(params.hour || 3))
  }
  if (match(url, 'listFeatureXyRain') || match(url, '/listFeatureXyRain')) {
    return ok(listXyRainSeries(params.hour || 72))
  }
  if (match(url, '/crontab/contour/getLastModified')) {
    return ok({ lastModified: Date.now(), tm: new Date().toISOString() })
  }
  if (match(url, '/tdt/geocoder') || match(url, '/geocoder')) {
    return ok(mockGeocoder())
  }


  if (match(url, 'rainfall/24.json') || match(url, 'rainfall/48.json') || match(url, 'rainfall/72.json')) {
    const hours = match(url, '72') ? 72 : match(url, '48') ? 48 : 24
    return ok({ times: listXyRainSeries(hours).map((i) => i.date), data: listXyRainSeries(hours) })
  }
  if (match(url, '/contour/idw')) {
    return ok({ type: 'FeatureCollection', features: [] })
  }


  if (match(url, '/warn-release-api/')) return ok([])


  if (url.includes('/crontab/')) {
    if (method === 'get' || method === 'post') return ok([])
  }


  if (match(url, 'basin.json') || match(url, 'GetFeature') || match(url, '/ows')) {
    return ok({ type: 'FeatureCollection', features: [] })
  }


  if (method === 'get' || method === 'post' || method === 'put' || method === 'delete') {
    if (url.includes('/api') || url.startsWith('/api') || url.includes('/sl/') || url.includes('/ss/') ||
        url.includes('/gp/') || url.includes('/sys/') || url.includes('/fcst') || url.includes('/statis') ||
        url.includes('/ys/') || url.includes('/call/') || url.includes('/warn-release')) {
      return ok([])
    }
  }


  return null
}
