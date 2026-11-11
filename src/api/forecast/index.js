import {http} from '@/http'

const API_HOST = process.env.API_HOST
const API_URL = API_HOST + '/fcst'

export default {

  unitHydrographList: (data) => http(API_URL + '/unitHydrograph/list', 'get', data),

  prList: (data) => http(API_URL + '/pr/list', 'get', data),
  importPR: (data) => http(API_URL + '/pr/import', 'post1', data),
  exportPR: (data) => http(API_URL + '/pr/export', 'downLoad', data),
  listZqrl: (data) => http(API_HOST + '/sl/stZqrlB/list', 'get', data),
  importZqrl: (data) => http(API_HOST + '/sl/stZqrlB/import', 'post1', data),
  exportZqrl: (data) => http(API_HOST + '/sl/stZqrlB/export', 'downLoad', data),

  listPeakLagTime: (data) => http(API_URL + '/peakLagTime/list', 'get', data),
  importPeakLagTime: (data) => http(API_URL + '/peakLagTime/import', 'post1', data),
  exportPeakLagTime: (data) => http(API_URL + '/peakLagTime/export', 'downLoad', data),
  importUnitHydrograph: (data) => http(API_URL + '/unitHydrograph/import', 'post1', data),
  exportUnitHydrograph: (data) => http(API_URL + '/unitHydrograph/export', 'downLoad', data),
  prImport: (data) => http(API_URL + '/pr/import', 'post1', data),
  savePlan: (data) => http(API_URL + '/plan/save', 'post1', data),
  getPlanRelStation: (data) => http(API_URL + '/planRelStation/list', 'get', data),
  getInitModelParams: (data) => http(API_URL + '/model/params/list', 'get', data),

  listRiverNet: (data) => http(API_URL + '/riverNet/list', 'post1', data),
  updatePointParam: (data) => http(API_URL + '/pointParam/update', 'post1', data),

  listPaPlanResult: (data) => http(API_HOST + '/ss/pa/planResult/list', 'post1', data),

  fcstUpDownRelationSave: (data) => http(API_URL + '/updown/saveRelation', 'post1', data),
  updownRun: (data) => http(API_URL + '/updown/run', 'post1', data),
  updownCalibrate: (data) => http(API_URL + '/updown/calibrate', 'post1', data),
  updownListResult: (data) => http(API_URL + '/updown/listResult', 'get', data),

  xajRun: (data) => http(API_URL + '/xaj/run', 'post1', data),

  muskingumRun: (data) => http(API_URL + '/muskingum/run', 'post1', data),

  cascadeGetResult: (data) => http(API_URL + '/cascade/getResult', 'get', data),
  cascadeRun: (data) => http(API_URL + '/cascade/run', 'post1', data),

  reachRelList: (data) => http(API_URL + '/reachRel/list', 'get', data),
  reachRelListByRoot: (data) => http(API_URL + '/reachRel/listByRoot', 'get', data),
  reachRelSave: (data) => http(API_URL + '/reachRel/save', 'post1', data),
  reachRelBatchSave: (data) => http(API_URL + '/reachRel/batchSave', 'post1', data),
  reachRelRemove: (id) => http(API_URL + '/reachRel/remove/' + id, 'post'),

  floodRoutingRoute: (data) => http(API_URL + '/floodRouting/engine/route', 'post1', data),

  fcstObjectsSave: (data) => http(API_URL + '/objects/save', 'post1', data),

  fcstObjectsList: (data) => http(API_URL + '/objects/list', 'get', data),

  fcstObjectsDelete: (data) => http(API_URL + '/objects/remove/' + data, 'post'),

  getAutoRelStation: (data) => http(API_URL + '/planRelStation/getAutoRel', 'get', data),

  getPlanList: (data) => http(API_URL + '/plan/list', 'get', data),
  getPlanListByModelId: (data) => http(API_URL + '/plan/listByModelId', 'get', data),

  savetPlanAutoRel: (data) => http(API_URL + '/plan/saveAndRelStation', 'post1', data),
  updateRelModelAndStation: (data) => http(API_URL + '/plan/updateRelModelAndStation', 'post1', data),

  getFcstPlanList: (data) => http(API_URL + '/plan/list', 'get', data),

  getFcstPlanDelete: (data) => http(API_URL + '/plan/remove/' + data, 'post'),

  getModelList: (data) => http(API_URL + '/model/list', 'get', data),
  getObjectsGeom: (data) => http(API_URL + '/objects/boundary/list', 'get', data),

  getPlanRelStationList: (data) => http(API_URL + '/planRelStation/listRelStcd', 'get', data),
  getPlanParamsList: (data) => http(API_URL + '/planParams/list', 'get', data),
  savePlanParams: (data) => http(API_URL + '/planParams/save', 'post1', data),
  updatePlanParams: (data) => http(API_URL + '/planParams/update', 'post1', data),

  getPlanResultList: (data) => http(API_URL + '/planResults/list', 'get', data),

  getStation: (data) => http(API_HOST + '/sl/stStbprpB/search', 'get', data),
  saveOrUpdateCalibrationConfig: (data) => http(API_URL + '/paramsCalibrationConfig/saveOrUpdate', 'post1', data),
  listCalibrationConfig: (data) => http(API_URL + '/paramsCalibrationConfig/list', 'get', data),
  listCalibrationDetail: (data) => http(API_URL + '/paramsCalibrationDetail/list', 'get', data),
  deleteCalibrationConfig: (id) => http(API_URL + '/paramsCalibrationConfig/delete/' + id, 'del'),

  apiRun: (data) => http(API_URL + '/api/run', 'post1', data),
  calibrationRun: (data) => http(API_URL + '/paramsCalibrationConfig/run', 'post1', data),
  calibrationAutoTune: (data) => http(API_URL + '/paramsCalibrationConfig/autoTune', 'post1', data),

  getByDownStcd: (data) => http(API_URL + '/updown/getByDownStcd', 'get', data),
}
