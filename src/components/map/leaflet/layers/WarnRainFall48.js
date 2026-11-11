import * as L from 'leaflet'
import Api from '@/api/index'

let type = 2004
let isChecked = false
let layerGroup = null

const createLayer = (map) => {
  if (layerGroup === null) {
    layerGroup = L.featureGroup().addTo(map)
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
  let opt = {t: new Date().getTime()}
  let data = await Api.getRainFall48(opt)

  let oData = _formatData(data)
  drawOnMap(oData)
}
const _formatData = (data) => {
  data = data.replace('diamond14_rainfall_24_json(', '')
  data = data.replace('diamond14_rainfall_48_json(', '')
  data = data.replace('diamond14_rainfall_72_json(', '')
  data = data.substring(0, data.length - 1)
  let data1 = JSON.parse(data)
  return data1
}

const drawOnMap = (data) => {
  if (!isChecked) {
    return
  }
  layerGroup.clearLayers()
console.log(data)

  let date = data.date
  let len = data.contours.length
  for (var i = 0; i < len; i++) {

    let rgb = data.contours[i].color
    let name = '普通'
    let fill = 'url(/static/img/rain-low.png)'
    switch (rgb) {
      case '4,0,249,255':
        name = ' 暴雨'
        fill = 'url(/static/img/rain-hvy.png)'
        break
      case '250,0,252,255':
        name = '大暴雨'
        fill = 'url(/static/img/rain-hvy.png)'
        break
      case '58,164,2,255':
        fill = 'url(/static/img/rain-avg.png)'
        break
      case '113,180,232,255':
        fill = 'url(/static/img/rain-avg.png)'
        break
      case '164,245,140,255':
        fill = 'url(/static/img/rain-low.png)'
        break

    }

    var rgbStr = 'rgba(' + rgb + ')'
    var attributes = { id: i, rgb: rgb, date: date, name: name }

    var polygon = L.polygon(data.contours[i].latAndLong, { fill: fill, stroke: false, fillOpacity: 0.5, fillColor: rgbStr, attributes: attributes })

    polygon.addTo(layerGroup)
  }

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
