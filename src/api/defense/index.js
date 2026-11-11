import {http} from '@/http'
const API_HOST = process.env.API_HOST

const SS_API = API_HOST + '/ss'

export default {
  listDangerArea: (data) => http(SS_API + '/dangerArea/info/list', 'get', data),
  listDangerAreaMean: (data) => http(SS_API + '/dangerArea/mean/listOrder', 'get', data),
  getDangerAreaNew: (data) => http(SS_API + '/dangerArea/mean/getNew', 'get', data),
  insertDangerAreaWarn: (data) => http(SS_API + '/dangerArea/warn/insert', 'postJson', data),
  listDangerAreaWarn: (data) => http(SS_API + '/dangerArea/warn/list', 'get', data),
  listMessage: (data) => http(SS_API + '/message/list', 'get', data),
  emergencyPlanDown: (data) => http(SS_API + '/emergencyplan/download', 'downLoad', data),
  updateByWarnId: (data) => http(SS_API + '/warn/update', 'post', data),
  getWarnListNew: (data) => http(SS_API + '/warn/listNew', 'get', data),

  getWqMsarAList: (data) => http(SS_API + '/wqMsarA/list', 'get', data),

  getWarnPreviewWord: (data) => http(SS_API + '/warn/previewReport', 'downLoadWord', data),
  getWarnDownloadWord: (data) => http(SS_API + '/warn/downloadReport', 'downLoadWord', data),
  getWarnInfoList: (data) => http(SS_API + '/warn/listWarnInfo', 'get', data),

  getDailyMaintenanceList: (data) => http(SS_API + '/dailyMaintenance/list','get',data),
  getDailyMaintenanceDetailsList: (data) => http(SS_API + '/dailyMaintenance/detail','get',data),

  addDailyMaintenance: (data) => http(SS_API + '/dailyMaintenance/add','postJson',data)
}
