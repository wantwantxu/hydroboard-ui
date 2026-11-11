
const DESIGN_WIDTH = 1920
const BASE_FONT = 16
const MIN_FONT = 10
const MAX_FONT = 20

export function setRootFontSize() {
  if (typeof document === 'undefined') return
  const width = document.documentElement.clientWidth || window.innerWidth || DESIGN_WIDTH
  const size = Math.min(MAX_FONT, Math.max(MIN_FONT, (width / DESIGN_WIDTH) * BASE_FONT))
  document.documentElement.style.fontSize = size + 'px'
}

export function initFlexible() {
  setRootFontSize()
  window.addEventListener('resize', setRootFontSize)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) setRootFontSize()
  })
}

export default initFlexible
