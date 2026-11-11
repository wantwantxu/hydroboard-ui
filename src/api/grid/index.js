import {http} from '@/http'
const API_HOST = process.env.API_HOST
const API_URL = API_HOST + '/nc'
const MODE = process.env.MODE === 'SITE_B'

export default {
  listXyRain: (data) => http((MODE ? '/crontab/tiff/listFeatureXyRain' : (API_HOST + '/crontab/gridset/listFeatureXyRain')), 'postJson', data),
  listXyRainMinute: (data) => http((MODE ? '/crontab/tiff/listFeatureXyRainMinute' : (API_HOST + '/crontab/gridset/listFeatureXyRainMinute')), 'postJson', data),
  getLastModifiedDate: (data) => http(API_HOST + '/crontab/contour/getLastModified', 'get', data),
  getProcessList: (data) => http(API_URL + '/flow/listProcess', 'get', data),
  getNcMeanList: (data) => http(API_URL + '/flow/listMean', 'get', data),
  getRtProcessList: (data) => http(API_URL + '/rtFlow/listProcess', 'get', data),
  getRtRainList: (data) => http(API_URL + '/rtFlow/listRain', 'get', data),
}
