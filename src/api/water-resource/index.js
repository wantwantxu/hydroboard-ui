import {http} from '@/http'
const API_HOST = process.env.API_HOST
const API_URL = API_HOST + '/szy'

export default {
  listBasin: (data) => http(API_HOST + '/ss/basin/listBasin', 'get', data),

  listRainfallStatis: (data) => http(API_HOST + '/szy/rainfallStatis/list', 'post', data),

  listRasterRainfallStatis: (data) => http(API_HOST + '/szy/rainfallStatis/listRaster', 'post', data),
  importRunoffData: (data) => http(API_HOST + '/ss/runoffData/import', 'upload', data),
  exportRunoffData: (data) => http(API_HOST + '/ss/runoffData/export', 'downLoad', data),
}
