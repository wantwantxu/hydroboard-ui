

export function getUserRole() {
  return '演示访客'
}

export function isSuperAdmin() {
  return true
}

export function filterMenuByRole(menuList) {
  return Array.isArray(menuList) ? menuList : []
}

export function filterLayersByRole(layerList) {
  return Array.isArray(layerList) ? layerList : []
}
