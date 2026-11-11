import * as L from 'leaflet'

let type = 1004
let isChecked = false
let layerGroup = null

const createLayer = (map) => {
  if (layerGroup === null) {
    layerGroup = L.layerGroup().addTo(map)
  }
}

const clearLayer = () => {
   isChecked = false
  if (layerGroup) {
    layerGroup.clearLayers()
  }
}

const loadData = async (option) => {
  isChecked = true

  drawOnMap()
}

const drawOnMap = (data) => {
  if (!isChecked) {
    return
  }
  return


  layerGroup.clearLayers()

  let url = 'https://sat.windy.com/satellite/tile/deg41e/202205221230'


  L.tileLayer.grayscale(url + '/{z}/{x}/{y}/visir.jpg', {


  }).setOpacity(0.7).addTo(layerGroup).bringToFront()
}
const setQueryTime = (data) => {

}

export default {
  type,
  createLayer,
  clearLayer,
  loadData,
  setQueryTime
}
