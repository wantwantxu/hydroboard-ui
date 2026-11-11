import {http} from '@/http'
import da from "element-ui/src/locale/lang/da";
const API_HOST = process.env.API_HOST
const MODE = process.env.MODE === 'SITE_B'

const API_URL = API_HOST + '/sl'
const SS_API = API_HOST + '/ss'
const GP_API = API_HOST + '/gp'

const STATIS_API = API_HOST + '/stats'
const DY_VIDEOURL_API = API_HOST + '/sl/hik'

const OAUTH_API = API_HOST + '/oauth'
const SYS_API = API_HOST + '/sys'
const API_HOST_MAP = process.env.API_HOST_MAP
const API_URL_MAP = API_HOST_MAP + '/map/geoserver/demo'

export default {

  listDict: () => http(SYS_API + '/sysDict/listDict', 'get'),
  getPortalConfig: (systemCode) => http(SS_API + '/portalConfig/getBySystem?systemCode=' + encodeURIComponent(systemCode), 'get'),
  logout: (token) => http(OAUTH_API + '/token/' + token, 'del'),
  getToken: (data) => http(SYS_API + '/sysUser/login', 'get', data),

  portalInit: (systemCode) => http(SYS_API + '/sysPortal/init' + (systemCode ? '?systemCode=' + encodeURIComponent(systemCode) : ''), 'get'),
  getFujiangGeojson: () => http(API_HOST + '/static/basin.json', 'get', {}),
  getExtent: (data) => http(API_URL_MAP + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=demo:basin&maxFeatures=50&outputFormat=application%2Fjson', 'get', data),
  getExtentBaseArea: (data) => http(API_URL_MAP + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=demo:basin&maxFeatures=50&outputFormat=application%2Fjson', 'get', data),

  getRainList: (data) => http(API_URL + '/stPptnR/listRainRecords', 'get', data),
  getRainSumList: (data) => http(API_URL + '/stPptnR/getLatestRain', 'get', data),
  getRainTopList: (data) => http(API_URL + '/stPptnR/listTopRainStation', 'get', data),

  getTopRainStations: (data) => http(API_HOST + '/stats/rainfall/getTopRainStations', 'get', data),

  listAreaRainfall: (data) => http(API_HOST + '/stats/rainfall/listAreaRainfall', 'get', data),
  getBeyondRainList: (data) => http(API_URL + '/stPptnR/listTopBeyondStation', 'get', data),

  countBeyondRain: (data) => http(API_URL + '/stPptnR/countExceedingThreshold', 'get', data),

  getStationList: (data) => http(API_URL + '/stStbprpB/list', 'get', data),
  getStationInfo: (data) => http(API_URL + '/stStbprpB/get', 'get', data),
  listNewRiverAll: (data) => http(API_URL + '/water/listLatest', 'get', data),
  listNewRiver: (data) => http(API_URL + '/stRiverR/listLatestWaterByStation', 'get', data),
  listNewRsvr: (data) => http(API_URL + '/stRsvrR/listLatestWaterByStation', 'get', data),
  getNewRiver: (data) => http(API_URL + '/stRiverR/listLatestWaterByStation', 'get', data),
  getNewRsvr: (data) => http(API_URL + '/stRsvrR/listLatestWaterByStation', 'get', data),
  listZvarl: (data) => http(API_URL + '/stZvarlB/list', 'get', data),
  listRiver: (data) => http(API_URL + '/stRiverR/listHistoricalData', 'get', data),
  listRsvr: (data) => http(API_URL + '/stRsvrR/listHistoricalData', 'get', data),
  listRiverStcd: (data) => http(SS_API + '/ssRiverDbls/listStcd', 'get', data),
  listRiverZ: (data) => http(SS_API + '/ssRiverZarea/list', 'get', data),
  listSection: (data) => http(SS_API + '/ssSectionInfo/list', 'get', data),

  getRsvrRw: (data) => http(API_URL + '/stZvarlB/getW', 'get', data),

  listStRvfcchB: (data) => http(API_URL + '/stRvfcchB/list', 'get', data),

   getMinMax: (data) => http(API_URL + '/waterLevelCalculation/getStationMinMaxValue', 'get', data),

  listStRsvrfcchB: (data) => http(API_URL + '/stRsvrfcchB/list', 'get', data),

  getOneReservoir: (data) => http(SS_API + '/reservoir/getOne', 'get', data),

  listStRsvrfsrB: (data) => http(API_URL + '/stRsvrfsrB/list', 'get', data),
  getYsToken: () => http(API_HOST + '/ys/config/getToken', 'get'),
  getDeviceList: (data) => http(API_HOST + '/ys/videoDevice/listByStcd', 'get', data),

  getWeatherRadar: (data) => http(API_HOST_MAP + '/weatherservice/imgs/radar/default', 'get', data),
  getweatherRadaMapUrl: () => { return API_HOST_MAP + '/weatherservice/imgs/radar/' },

  getWeatherRT: (data) => http(API_HOST_MAP + '/weatherservice/diamond1/view/json?callback=diamond1_view_json', 'get', data),

  getRainFall24: (data) => http('/weatherservice/diamond14/rainfall/24.json', 'get', data),

  getRainFall48: (data) => http('/weatherservice/diamond14/rainfall/48.json', 'get', data),

  getRainFall72: (data) => http('/weatherservice/diamond14/rainfall/72.json', 'get', data),

  listDutyWarnPage: (data) => http(SS_API + '/duty/warn/log/listPage', 'post1', data),
  listDutyWarnCountByTypeAndStation: (data) => http(SS_API + '/duty/warn/log/listWarnCountByTypeAndStation', 'get', data),
  getDutyRecentWarnLogsSseUrl: (params = {}) => {
    const qs = Object.keys(params || {})
      .filter(k => params[k] !== undefined && params[k] !== null && params[k] !== '')
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&')
    return API_HOST + '/ss/duty/warn/log/sseRecentWarnLogs' + (qs ? ('?' + qs) : '')
  },

  listOut: (data) => http(API_HOST + '/stats/river/listExceedWarning', 'get', data),
  listOutOfGrz: (data) => http(API_HOST + '/stats/river/listExceedGuarantee', 'get', data),
  listOutReservoir: (data) => http(API_HOST + '/stats/rsvr/listExceedFloodLimit', 'get', data),
  listOutReservoirDsflz: (data) => http(API_HOST + '/stats/rsvr/listExceedCheckLevel', 'get', data),
  getRainStationList: (data) => http(API_URL + '/stPptnR/listLatestInstantRain', 'get', data),
  listOutReservoirFsltdz: (data) => http(API_HOST + '/stats/rsvr/listExceedFloodLimit', 'get', data),

  listHexinzhouislandInfo: (data) => http(SS_API + '/hexinzhouislandInfo/list', 'get', data),

  listSsdimentNew: (data) => http(SS_API + '/ssSediment/listNew', 'get', data),
  listSsdiment: (data) => http(SS_API + '/ssSediment/list', 'get', data),

  listNewFlow: (data) => http(GP_API + '/flow/listNew', 'get', data),

  listFlow: (data) => http(GP_API + '/flow/list', 'get', data),
  listGpStation: (data) => http(GP_API + '/station/list', 'get', data),
  listGpStationLL: (data) => http(GP_API + '/stationLL/listStation', 'get', data),

  listGpFlowYear: (data) => http(GP_API + '/flow/listGpFlowYear', 'get', data),

  listZYearRiver: (data) => http(STATIS_API + '/water/day/getFullWaterLevelTable', 'get', data),

  listQYearRiver: (data) => http(STATIS_API + '/water/day/getFullFlowTable', 'get', data),

  geocoder: (data) => http(API_HOST + '/tdt/tdt/geocoder', 'get', data),

  getUrl: (url, data) => http(url, 'get', data),
  getDYVideoUrl: (data) => http(DY_VIDEOURL_API + '/cameras/preview/getUrlByStcd', 'get', data),
  listWaringWater: (data) => http('/warn-release-api/warn/query/record/list', 'get'),
  listWaringWater1: (data) => http('/warn-release-api/unit/query/list/level/first', 'get'),

  sendText: (data) => http('/call/sms/sendSMS', 'post', data),
  callNumber: (data) => http('/call/message/call/phones', 'get', data),
  sendNew: (data) => http('/call/api/v1/send', 'postJson', data),

  getFeatureWfs: (url, data) => http(url + '/ows?', 'getWfs', data),
  postWfsQuery: (url,data) => http(url+ '/ows','postJson', data),

  listLoginUserInfo: () => http(SYS_API + '/sysUser/info', 'get'),

  getContour: (data) => http(API_HOST + '/contour/idw', 'get', data),

}
