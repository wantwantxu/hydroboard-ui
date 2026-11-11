import * as L from 'leaflet'

let animationLayer = null
function createLayerGroup () {
  animationLayer = L.featureGroup().addTo(window.map)
}
function clearLayers() {
  animationLayer.clearLayers()
}
export const pulseEffect = (xy) => {
  if (animationLayer === null) {
    createLayerGroup()
  } else {
    clearLayers()
  }

  let times = 1000
  const colors = ['#00f100', '#ff0000']

  const pulsingIcon = window.L.icon.pulse({
    iconSize: [30, 30],
    color: colors[0],
    fillColor: ''
  })
  const picGroupMarker = window.L.marker(xy, { icon: pulsingIcon }).addTo(animationLayer)

  const timeInterval = setInterval(() => {
    if (times > 0) {
      times--
    } else {
      clearInterval(timeInterval)
      picGroupMarker.remove()
    }
  }, 1000)
}
