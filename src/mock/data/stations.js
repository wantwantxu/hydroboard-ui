

const STATIONS = [

  { stcd: 'DEMO001', stnm: '青云站', lgtd: 104.02, lttd: 30.68, sttp: 'PP', admauth: '示范市水文' },
  { stcd: 'DEMO002', stnm: '蓝溪站', lgtd: 104.12, lttd: 30.62, sttp: 'PP', admauth: '示范市水文' },
  { stcd: 'DEMO003', stnm: '翠湖站', lgtd: 103.95, lttd: 30.72, sttp: 'PP', admauth: '示范市水文' },
  { stcd: 'DEMO004', stnm: '银滩站', lgtd: 104.22, lttd: 30.55, sttp: 'PP', admauth: '示范市水文' },
  { stcd: 'DEMO005', stnm: '碧峰站', lgtd: 103.88, lttd: 30.58, sttp: 'PP', admauth: '示范市水文' },
  { stcd: 'DEMO011', stnm: '雾岭站', lgtd: 103.82, lttd: 30.78, sttp: 'PP', admauth: '示范县水文' },
  { stcd: 'DEMO012', stnm: '石门站', lgtd: 104.35, lttd: 30.66, sttp: 'PP', admauth: '示范县水文' },

  { stcd: 'DEMO006', stnm: '锦江口', lgtd: 104.08, lttd: 30.65, sttp: 'ZQ', admauth: '示范市水文' },
  { stcd: 'DEMO007', stnm: '澄江桥', lgtd: 104.18, lttd: 30.70, sttp: 'ZQ', admauth: '示范市水文' },
  { stcd: 'DEMO013', stnm: '桃花滩', lgtd: 104.15, lttd: 30.52, sttp: 'ZQ', admauth: '示范市水文' },
  { stcd: 'DEMO016', stnm: '望江楼', lgtd: 104.25, lttd: 30.61, sttp: 'ZQ', admauth: '示范市水文' },

  { stcd: 'DEMO008', stnm: '清河闸', lgtd: 103.98, lttd: 30.60, sttp: 'ZZ', admauth: '示范市水文' },
  { stcd: 'DEMO014', stnm: '白鹭洲', lgtd: 103.92, lttd: 30.66, sttp: 'ZZ', admauth: '示范市水文' },
  { stcd: 'DEMO017', stnm: '金沙湾', lgtd: 104.10, lttd: 30.58, sttp: 'ZP', admauth: '示范市水文' },
  { stcd: 'DEMO018', stnm: '柳林渡', lgtd: 104.30, lttd: 30.72, sttp: 'ZP', admauth: '示范县水文' },
  { stcd: 'DEMO019', stnm: '芦花荡', lgtd: 103.85, lttd: 30.70, sttp: 'ZP', admauth: '示范县水文' },

  { stcd: 'DEMO009', stnm: '云梦水库', lgtd: 104.05, lttd: 30.75, sttp: 'RR', admauth: '示范市水库' },
  { stcd: 'DEMO010', stnm: '望川水库', lgtd: 104.28, lttd: 30.48, sttp: 'RR', admauth: '示范市水库' },
  { stcd: 'DEMO015', stnm: '飞霞水库', lgtd: 104.42, lttd: 30.58, sttp: 'RR', admauth: '示范市水库' },
  { stcd: 'DEMO020', stnm: '映月水库雨量', lgtd: 104.00, lttd: 30.80, sttp: 'RP', admauth: '示范市水库' },
  { stcd: 'DEMO021', stnm: '青萝水库雨量', lgtd: 104.38, lttd: 30.50, sttp: 'RP', admauth: '示范市水库' },

  { stcd: 'DEMO022', stnm: '龙潭沟', lgtd: 103.78, lttd: 30.74, sttp: 'PB', admauth: '示范县防汛' },
  { stcd: 'DEMO023', stnm: '红岩溪', lgtd: 104.45, lttd: 30.68, sttp: 'PB', admauth: '示范县防汛' },
  { stcd: 'DEMO024', stnm: '黑石滩', lgtd: 103.90, lttd: 30.52, sttp: 'PB', admauth: '示范县防汛' },
  { stcd: 'DEMO025', stnm: '黄泥坡', lgtd: 104.20, lttd: 30.78, sttp: 'ZD', admauth: '示范县防汛' },
  { stcd: 'DEMO026', stnm: '白庙子', lgtd: 104.08, lttd: 30.45, sttp: 'ZD', admauth: '示范县防汛' },
  { stcd: 'DEMO027', stnm: '三岔口', lgtd: 103.96, lttd: 30.82, sttp: 'ZC', admauth: '示范县防汛' }
]


const DEMO_DRP = {
  DEMO001: 12.5, DEMO002: 28.0, DEMO003: 3.2, DEMO004: 56.8, DEMO005: 0,
  DEMO006: 18.4, DEMO007: 42.1, DEMO008: 8.6, DEMO009: 33.5, DEMO010: 61.2,
  DEMO011: 95.0, DEMO012: 6.4, DEMO013: 22.7, DEMO014: 1.5, DEMO015: 47.3,
  DEMO016: 15.8, DEMO017: 31.0, DEMO018: 9.2, DEMO019: 72.4, DEMO020: 25.6,
  DEMO021: 11.0, DEMO022: 48.5, DEMO023: 105.2, DEMO024: 19.8, DEMO025: 38.6,
  DEMO026: 4.1, DEMO027: 27.3
}

function rand(min, max) {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10
}

function nowStr() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:00`
}

function gradeByDrp(drp) {
  if (drp > 250) return 6
  if (drp > 100) return 5
  if (drp > 50) return 4
  if (drp > 25) return 3
  if (drp > 10) return 2
  if (drp > 0) return 1
  return 0
}

function normalizeSttpList(sttpList) {
  if (!sttpList) return []
  let list = sttpList
  if (typeof list === 'string') {
    try {
      const parsed = JSON.parse(list)
      list = Array.isArray(parsed) ? parsed : String(list).split(',')
    } catch (e) {
      list = String(list).split(',')
    }
  }
  if (!Array.isArray(list)) list = [list]
  return list
    .flatMap((v) => String(v || '').split(','))
    .map((v) => v.trim())
    .filter(Boolean)
}

export function listStations(sttpList) {
  let list = STATIONS
  const types = normalizeSttpList(sttpList)
  if (types.length) {
    const set = new Set(types)
    list = STATIONS.filter((s) => set.has(s.sttp))
  }
  return list.map((s) => ({ ...s }))
}

const STTP_NAME = {
  PP: '雨量站', ZQ: '水文站', ZZ: '水位站', ZP: '水位雨量站',
  RR: '水库水文站', RP: '水库雨量站', PB: '山洪雨量站', ZC: '山洪水位站', ZD: '山洪水位雨量站'
}

const STTP_MONITOR = {
  PP: ['降雨量', '时段雨量', '日雨量'],
  ZQ: ['水位', '流量', '含沙量', '降雨量'],
  ZZ: ['水位'],
  ZP: ['水位', '降雨量'],
  RR: ['库水位', '蓄水量', '入库流量', '出库流量', '降雨量'],
  RP: ['降雨量'],
  PB: ['降雨量'],
  ZC: ['水位'],
  ZD: ['水位', '降雨量']
}


export function getStationDetail(stcd) {
  const base = STATIONS.find((s) => s.stcd === stcd) || STATIONS[0]
  const isRsvr = base.sttp === 'RR' || base.sttp === 'RP'
  const seed = Number(String(base.stcd).replace(/\D/g, '')) || 1
  const year = 1958 + (seed % 40)
  return {
    ...base,
    sttpName: STTP_NAME[base.sttp] || '测站',
    rvnm: isRsvr ? '青云河' : (seed % 2 ? '青云河' : '锦江'),
    hnnm: '岷江水系',
    bsnm: isRsvr ? '青云河流域' : '中游示范流域',
    stlc: `${base.admauth || '示范市'} · 示范镇水文观测断面附近`,
    drna: isRsvr ? (80 + seed % 120) : (320 + seed % 800),
    esstym: `${year}-01`,
    bgfrym: `${year}-06`,
    usfl: '1',
    frgrd: isRsvr ? '中型' : '国家基本站',
    atcunit: base.admauth || '示范市水文',
    admauth: base.admauth || '示范市水文',
    locality: '示范省示范市',
    stbk: seed % 2 ? '左岸' : '右岸',
    dstrvm: isRsvr ? null : (12 + seed % 80),
    phcd: '4130',
    comments: '开源演示站，数据均为虚构。',

    monitorItems: (STTP_MONITOR[base.sttp] || ['水位']).map((name, i) => ({
      name,
      method: i === 0 ? '自动遥测' : (i === 1 ? '自动遥测' : '人工观测'),
      freq: name.includes('雨') ? '分钟/时段' : '整点/加密',
      equip: name.includes('雨') ? '翻斗式雨量计' : (name.includes('流') ? 'ADCP/流速仪' : '压力式水位计'),
      status: '正常'
    })),

    floodIndex: isRsvr
      ? [
          { label: '汛限水位', value: '68.00', unit: 'm' },
          { label: '正常蓄水位', value: '62.00', unit: 'm' },
          { label: '设计洪水位', value: '75.00', unit: 'm' },
          { label: '校核洪水位', value: '76.50', unit: 'm' },
          { label: '死水位', value: '48.00', unit: 'm' },
          { label: '总库容', value: '1.26', unit: '亿m³' }
        ]
      : [
          { label: '警戒水位', value: '7.50', unit: 'm' },
          { label: '保证水位', value: '8.80', unit: 'm' },
          { label: '历史最高水位', value: '9.62', unit: 'm' },
          { label: '历史最大流量', value: '3280', unit: 'm³/s' },
          { label: '基面', value: '1985国家高程', unit: '' },
          { label: '水准点', value: `BM-${base.stcd.slice(-3)}`, unit: '' }
        ],

    history: [
      { year: String(year), event: '设站观测，列入国家基本站网。' },
      { year: String(year + 12), event: '完成站房改建，更新水位观测设施。' },
      { year: String(year + 28 > 2020 ? 2012 : year + 28), event: '接入自动遥测系统，实现数据自动报送。' },
      { year: '2020', event: '完成站网复核与资料整编数字化。' },
      { year: '2024', event: '纳入水情一张图统一管理。' }
    ],

    materials: [
      { name: `${base.stnm}站考证表`, type: 'PDF', size: '1.2 MB', date: '2023-06-18' },
      { name: '水准点成果表', type: 'XLS', size: '256 KB', date: '2022-11-03' },
      { name: '大断面测量成果', type: 'PDF', size: '3.4 MB', date: '2021-09-22' },
      { name: '遥测设备维护记录', type: 'DOC', size: '860 KB', date: '2024-03-15' },
      { name: '历史洪水调查报告', type: 'PDF', size: '5.1 MB', date: '2019-08-07' }
    ],

    photos: [
      { title: '站房外观', url: '/static/img/pmt_bg.png' },
      { title: '观测断面', url: '/static/img/pmt_hl.png' },
      { title: '水尺断面', url: '/static/img/pmt_sk.png' },
      { title: '遥测设备', url: '/static/img/waterflow.png' }
    ]
  }
}

export function listRainLatest(sttpList) {
  const types = normalizeSttpList(sttpList)
  let list = STATIONS
  if (types.length) {
    const set = new Set(types)
    list = STATIONS.filter((s) => set.has(s.sttp))
  } else {

    const rainTypes = new Set(['PP', 'ZQ', 'ZZ', 'ZP', 'RR', 'RP', 'PB', 'ZD'])
    list = STATIONS.filter((s) => rainTypes.has(s.sttp))
  }
  return list.map((s) => {
    const drp = DEMO_DRP[s.stcd] != null ? DEMO_DRP[s.stcd] : rand(0, 80)
    return {
      ...s,
      drp,
      intv: 1,
      tm: nowStr(),
      grade: gradeByDrp(drp),
      ratn: drp
    }
  })
}

export function listRainTop() {
  return listRainLatest().sort((a, b) => b.drp - a.drp).slice(0, 10)
}

export function listBeyondRain() {
  return listRainLatest().filter((s) => s.drp >= 50)
}

export function listRiverLatest() {
  return STATIONS.filter((s) => s.sttp === 'ZQ' || s.sttp === 'ZZ' || s.sttp === 'ZP' || s.sttp === 'ZC' || s.sttp === 'ZD').map((s) => {
    const z = rand(2.5, 8.5)
    const wrz = 7.5
    const grz = 8.8
    return {
      ...s,
      z,
      q: rand(20, 800),
      wrz,
      grz,
      tm: nowStr(),
      wptn: z > wrz ? 4 : 5
    }
  })
}

export function listRsvrLatest() {
  return STATIONS.filter((s) => s.sttp === 'RR').map((s) => {
    const rz = rand(45, 72)
    const fsltdz = 68
    return {
      ...s,
      rz,
      w: rand(1200, 8500),
      inq: rand(5, 120),
      otq: rand(5, 100),
      fsltdz,
      dsflz: 75,
      tm: nowStr(),
      rwptn: rz > fsltdz ? 4 : 5
    }
  })
}

export function listWaterLatest() {
  return [...listRiverLatest(), ...listRsvrLatest()]
}

export function listHistorySeries(baseValue = 5, step = 0.2) {
  const points = []
  const end = Date.now()
  for (let i = 24; i >= 0; i--) {
    const t = new Date(end - i * 3600 * 1000)
    const p = (n) => String(n).padStart(2, '0')
    points.push({
      tm: `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())} ${p(t.getHours())}:00:00`,
      z: Math.round((baseValue + Math.sin(i / 3) * step + rand(-0.1, 0.1)) * 100) / 100,
      q: Math.round((80 + Math.sin(i / 2) * 30 + rand(-5, 5)) * 10) / 10,
      rz: Math.round((55 + Math.sin(i / 4) * 2 + rand(-0.2, 0.2)) * 100) / 100,
      drp: Math.max(0, rand(0, 8)),
      w: rand(2000, 5000)
    })
  }
  return points
}

export function listExceedRiver() {
  return listRiverLatest().slice(0, 2).map((s) => ({ ...s, z: s.wrz + rand(0.1, 0.6) }))
}

export function listExceedRsvr() {
  return listRsvrLatest().slice(0, 1).map((s) => ({ ...s, rz: s.fsltdz + rand(0.2, 1.2) }))
}

export { STATIONS }
