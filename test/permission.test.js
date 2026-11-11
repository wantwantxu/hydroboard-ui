/**
 * permission.js 过滤逻辑测试——用不同角色用户验证菜单/图层过滤。
 * 运行方式：node test/permission.test.js
 */

// 导入被测函数（用 require 路径直接引用源文件）
const path = require('path')
const { getUserRole, isSuperAdmin, filterMenuByRole, filterLayersByRole } = require(path.join(__dirname, '..', 'src', 'utils', 'permission.js'))

let passed = 0, failed = 0
function assert(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  console.log(`${ok ? '✅' : '❌'} ${name}`)
  if (!ok) {
    console.log(`   expected: ${JSON.stringify(expected)}`)
    console.log(`   actual:   ${JSON.stringify(actual)}`)
    failed++
  } else {
    passed++
  }
}

// ========== 测试数据 ==========

// 从 dict.js 真实数据中提取的菜单（与生产一致）
const FULL_MENU = [
  { name: '首页', path: '/index', meta: { role: ['管理员'] } },
  { name: '雨情服务', path: '/rainfall', meta: { role: ['管理员'] } },
  { name: '水情服务', path: '/water', meta: { role: ['管理员'] } },
  { name: '预警预报', path: '/radar', meta: { role: ['管理员'] } },
  { name: '综合服务', path: '/forecast', meta: { role: ['管理员'] } },
  { name: '洪水淹没', path: '/flood', meta: { role: ['admin'] } },
]

// 模拟「给防汛员开放雨情和水情」的配置
const MENU_WITH_FLOOD_ROLE = [
  { name: '首页', path: '/index', meta: { role: ['管理员'] } },
  { name: '雨情服务', path: '/rainfall', meta: { role: ['管理员', '防汛员'] } },
  { name: '水情服务', path: '/water', meta: { role: ['管理员', '防汛员'] } },
  { name: '预警预报', path: '/radar', meta: { role: ['管理员'] } },
  { name: '综合服务', path: '/forecast', meta: { role: ['管理员'] } },
  { name: '洪水淹没', path: '/flood', meta: { role: ['admin'] } },
]

// 菜单中有无限制项（无 meta.role）
const MENU_WITH_OPEN_ITEM = [
  { name: '首页', path: '/index', meta: { role: ['管理员'] } },
  { name: '公开页', path: '/public' },  // 无 meta.role → 所有人可见
  { name: '洪水淹没', path: '/flood', meta: { role: ['admin'] } },
]

// 从 dict.js 真实数据中提取的图层
const FULL_LAYERS = [
  {
    label: '基础图层',
    children: [
      { label: '供水厂', value: 999004, meta: { role: ['admin'] } },
      { label: '古堰', value: 999005, meta: { role: ['admin'] } },
    ]
  },
  {
    label: '水雨情监测',
    children: [
      { label: '实时雨情', value: 1001, meta: { role: ['管理员'] } },
      { label: '实时水情', value: 1002, meta: { role: ['管理员'] } },
      { label: '雨量等值面', value: 1006, meta: { role: ['管理员'] } },
    ]
  },
  {
    label: '水利对象',
    children: [
      { label: '山洪危险区', value: 999008, meta: { role: ['管理员'] } },
      { label: '水库', value: 3003, meta: { role: ['管理员'] } },
    ]
  },
]

// 图层中给监测员开放水雨情
const LAYERS_WITH_MONITOR_ROLE = [
  {
    label: '基础图层',
    children: [
      { label: '供水厂', value: 999004, meta: { role: ['admin'] } },
    ]
  },
  {
    label: '水雨情监测',
    children: [
      { label: '实时雨情', value: 1001, meta: { role: ['管理员', '监测员'] } },
      { label: '实时水情', value: 1002, meta: { role: ['管理员', '监测员'] } },
    ]
  },
]

// ========== 测试用例 ==========

console.log('\n========== isSuperAdmin ==========')
assert('超级管理员 → true', isSuperAdmin('超级管理员'), true)
assert('系统管理员 → true', isSuperAdmin('系统管理员'), true)
assert('admin → true', isSuperAdmin('admin'), true)
assert('监测员 → false', isSuperAdmin('监测员'), false)
assert('防汛员 → false', isSuperAdmin('防汛员'), false)
assert('空字符串 → false', isSuperAdmin(''), false)

console.log('\n========== filterMenuByRole — 管理员（全部可见）==========')
const adminMenu = filterMenuByRole(FULL_MENU, '超级管理员')
assert('管理员看到全部 6 个菜单', adminMenu.length, 6)
assert('管理员菜单名', adminMenu.map(m => m.name), ['首页', '雨情服务', '水情服务', '预警预报', '综合服务', '洪水淹没'])

console.log('\n========== filterMenuByRole — 防汛员（无权限项时为空）==========')
const floodMenu1 = filterMenuByRole(FULL_MENU, '防汛员')
assert('防汛员看原始菜单（全受限）→ 0 个', floodMenu1.length, 0)

console.log('\n========== filterMenuByRole — 防汛员（开放雨情+水情后）==========')
const floodMenu2 = filterMenuByRole(MENU_WITH_FLOOD_ROLE, '防汛员')
assert('防汛员看到 2 个菜单', floodMenu2.length, 2)
assert('防汛员菜单名', floodMenu2.map(m => m.name), ['雨情服务', '水情服务'])

console.log('\n========== filterMenuByRole — 监测员（有公开项）==========')
const monitorMenu = filterMenuByRole(MENU_WITH_OPEN_ITEM, '监测员')
assert('监测员看到 1 个公开菜单', monitorMenu.length, 1)
assert('监测员菜单名', monitorMenu.map(m => m.name), ['公开页'])

console.log('\n========== filterMenuByRole — 空角色（dev 模式，全部可见）==========')
const devMenu = filterMenuByRole(FULL_MENU, '')
assert('dev 模式 → 全部 6 个', devMenu.length, 6)

console.log('\n========== filterLayersByRole — 管理员（全部可见）==========')
const adminLayers = filterLayersByRole(FULL_LAYERS, '超级管理员')
assert('管理员看到全部 3 个分组', adminLayers.length, 3)
assert('管理员基础图层 2 项', adminLayers[0].children.length, 2)
assert('管理员水雨情 3 项', adminLayers[1].children.length, 3)

console.log('\n========== filterLayersByRole — 防汛员（原始数据全部受限→空）==========')
const floodLayers1 = filterLayersByRole(FULL_LAYERS, '防汛员')
assert('防汛员 → 0 个分组（全被过滤）', floodLayers1.length, 0)

console.log('\n========== filterLayersByRole — 监测员（开放水雨情后）==========')
const monitorLayers = filterLayersByRole(LAYERS_WITH_MONITOR_ROLE, '监测员')
assert('监测员 → 1 个分组（基础图层全过滤）', monitorLayers.length, 1)
assert('监测员分组名', monitorLayers.map(g => g.label), ['水雨情监测'])
assert('监测员水雨情 2 项', monitorLayers[0].children.length, 2)

console.log('\n========== filterLayersByRole — 空角色（dev 模式）==========')
const devLayers = filterLayersByRole(FULL_LAYERS, '')
assert('dev → 全部 3 个分组', devLayers.length, 3)

console.log('\n========== getUserRole — 从 Vuex store 提取角色 ==========')
const store1 = { getters: { 'user/userInfo': { roleName: '防汛员', name: '张三' } } }
assert('getUserRole 提取 roleName', getUserRole(store1), '防汛员')

const store2 = { getters: { 'user/userInfo': { role: '监测员' } } }
assert('getUserRole 提取 role（兼容）', getUserRole(store2), '监测员')

const store3 = { getters: { 'user/userInfo': null } }
assert('getUserRole userInfo 为 null', getUserRole(store3), '')

const store4 = { getters: {} }
assert('getUserRole 无 userInfo getter', getUserRole(store4), '')

// ========== 结果 ==========
console.log(`\n========== 结果：${passed} 通过，${failed} 失败 ==========`)
process.exit(failed > 0 ? 1 : 0)
