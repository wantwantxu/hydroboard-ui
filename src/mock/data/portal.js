

export const DEMO_USER = {
  id: '10001',
  userId: '10001',
  username: 'demo',
  realName: '演示用户',
  nickname: '演示用户',
  roleName: '演示访客',
  roleId: 'demo',
  deptName: '开源演示'
}

export const DEMO_MENUS = [
  { name: '首页', path: '/index', meta: {} },
  { name: '雨情服务', path: '/rainfall', meta: {} },
  { name: '水情服务', path: '/water', meta: {} },
  { name: '预警预报', path: '/radar', meta: {} },
  { name: '单站预报', path: '/single', meta: {} },
  { name: '综合服务', path: '/forecast', meta: {} }
]

export const DEMO_PORTAL_CONFIG = {
  title: '水情一张图（演示版）',
  systemCode: 'hydroboard-demo',
  rainInterval: 60,
  mapZoom: 10,
  centerLng: 104.06,
  centerLat: 30.65
}


const TDT_TK = 'f94c86b0a84c24ffa47431281930fc2d'
export const DEMO_BASE_LAYERS = [
  {
    name: '天地图影像',
    url: 'https://t{s}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk={token}',
    token: TDT_TK,
    subdomains: '01234567',
    maxZoom: 18,
    minZoom: 3,
    isOverlay: false
  },
  {
    name: '天地图影像注记',
    url: 'https://t{s}.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk={token}',
    token: TDT_TK,
    subdomains: '01234567',
    maxZoom: 18,
    minZoom: 3,
    isOverlay: true
  },
  {
    name: '天地图矢量',
    url: 'https://t{s}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk={token}',
    token: TDT_TK,
    subdomains: '01234567',
    maxZoom: 18,
    minZoom: 3,
    isOverlay: false
  },
  {
    name: '天地图矢量注记',
    url: 'https://t{s}.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk={token}',
    token: TDT_TK,
    subdomains: '01234567',
    maxZoom: 18,
    minZoom: 3,
    isOverlay: true
  },
  {
    name: '高德地图',
    url: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    subdomains: '1234',
    maxZoom: 18,
    minZoom: 3,
    isOverlay: false
  },
  {
    name: '高德影像',
    url: 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    subdomains: '1234',
    maxZoom: 18,
    minZoom: 3,
    isOverlay: false
  },
  {
    name: '高德影像注记',
    url: 'https://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
    subdomains: '1234',
    maxZoom: 18,
    minZoom: 3,
    isOverlay: true
  },
  {
    name: '智图深蓝',
    url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 16,
    minZoom: 3,
    isOverlay: false
  }
]

export const DEMO_LAYER_TREE = [
  {
    label: '水雨情监测',
    children: [
      { label: '实时雨情', value: 1001, meta: {} },
      { label: '实时水情', value: 1002, meta: {} },
      { label: '雨量等值面', value: 1006, meta: {} },
      { label: '气象雷达', value: 1005, meta: {} }
    ]
  },
  {
    label: '水利对象',
    children: [
      { label: '水库', value: 3003, meta: {} },
      { label: '洪水淹没', value: 7001, meta: {} }
    ]
  },
  {
    label: '降雨预报',
    children: [
      { label: '24h降雨', value: 2003, meta: {} },
      { label: '48h降雨', value: 2004, meta: {} },
      { label: '72h降雨', value: 2005, meta: {} }
    ]
  }
]

function dictItem(dictType, name, value, sort = 1) {
  return [{
    id: String(Math.floor(Math.random() * 1e12)),
    pid: null,
    dictType,
    name,
    value,
    description: '',
    createDate: Date.now(),
    modifiedDate: null,
    sort
  }]
}

export const DEMO_DICTS = {
  CenterPointCoordinates: dictItem(
    'CenterPointCoordinates',
    '行政区行政中心坐标',
    '[30.65, 104.06]'
  ),
  layerController: dictItem(
    'layerController',
    '图层控制',
    JSON.stringify(DEMO_LAYER_TREE),
    5
  ),
  menu: dictItem(
    'menu',
    '菜单',
    JSON.stringify(DEMO_MENUS),
    2
  ),
  modelForecast: dictItem(
    'modelForecast',
    '预报模式',
    '{"lntelligentGrid":false,"Meteorological":false,"hefeng":false}'
  ),
  imageBounds: dictItem(
    'imageBounds',
    '降雨等值面',
    '[[30.95, 103.70], [30.30, 104.45]]'
  ),
  mapCoordinates: dictItem(
    'mapCoordinates',
    '地图坐标',
    '[[30.95, 103.70], [30.30, 104.45]]',
    4
  ),
  parameter: dictItem(
    'parameter',
    '降雨等值面传入参数',
    'demo'
  ),
  layers: dictItem(
    'layers',
    '图层',
    ''
  ),
  systemType: dictItem(
    'systemType',
    '系统分类',
    '{"0":"数据中心","1":"数据接收"}'
  ),

  wmsServices: dictItem(
    'wmsServices',
    '地图路径',
    JSON.stringify({
      loadAreaServices: '',
      ip: '',
      floodIP: '',
      gaoQingIP: ''
    }),
    3
  ),
  rbjointName: dictItem(
    'rbjointName',
    '系统名称',
    '水情一张图（演示版）',
    1
  ),
  bsnm: dictItem(
    'bsnm',
    '流域',
    JSON.stringify([
      { id: '1', value: '示范河' },
      { id: '2', value: '青云河' },
      { id: '3', value: '蓝溪河' }
    ]),
    6
  ),
  video: dictItem('video', '视频监控站点', '[]', 5),
  videoUrl: dictItem('videoUrl', '视频接口', '', 5)
}

export function getPortalInitPayload() {
  return {
    userInfo: DEMO_USER,
    menus: DEMO_MENUS,
    layerTree: DEMO_LAYER_TREE,
    portalConfig: DEMO_PORTAL_CONFIG,
    baseLayers: DEMO_BASE_LAYERS
  }
}
