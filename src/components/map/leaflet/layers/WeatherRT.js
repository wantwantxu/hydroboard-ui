import * as L from 'leaflet'
import Api from '@/api/index'

import weartherImage from '@/assets/images/weather.png'

import {point, bbox, bboxPolygon, booleanPointInPolygon} from '@turf/turf'
let type = 1003
let weatherRTLayer = null

const createLayer = (map) => {
  if (weatherRTLayer === null) {
    weatherRTLayer = L.layerGroup().addTo(map)
  }
}

const clearLayer = () => {
  if (weatherRTLayer) {
    weatherRTLayer.clearLayers()
  }
}

const loadData = async (option) => {
  clearLayer()
  let opt = {t: new Date().getTime()}
  let data = await Api.getWeatherRT(opt)
  let extent = await Api.getExtentBaseArea()
  drawOnMap(data, extent)
}


const drawOnMap = (dataText, extent) => {
  let data = _formatData(dataText, extent)
  let icon = L.divIcon({
    html: '<div class="rain-station "/>',
    className: ''
  })

  let date = data.date.monthValue + '月' + data.date.dayOfMonth + '日' + data.date.hour + '时'
  data.contours.forEach((item) => {
    item.title = item[27] + '(' + date + ')'

    let latlng = [item[2], item[1]]
    let html = creatHtml(item)
    let marker = createMaker(icon, {}, latlng, html)
    createMakerClickEvent(marker, latlng, item)
    marker.addTo(weatherRTLayer)
  })



}
const _formatData = (data, extent) => {
   data = data.replace('diamond1_view_json(', '')
  data = data.substring(0, data.length - 1)
  let data1 = JSON.parse(data)

  let data2 = []
  let box = bbox(extent)
  let boxPoly = bboxPolygon(box)
  for (let i = 0; i < data1.contours.length; i++) {
    let contour = data1.contours[i]
    let pt = point([contour[1], contour[2]])

    if (booleanPointInPolygon(pt, boxPoly)) {
      data2.push(contour)
    }
  }
  let data3 = []
  for (let i = 0; i < data2.length; i++) {
    let contour = data2[i]
    let pt = point([contour[1], contour[2]])
    for (let j = 0; j < extent.features.length; j++) {
      let poly = extent.features[j]
      if (booleanPointInPolygon(pt, poly)) {
        data3.push(contour)
        break
      }
    }
  }
  data1.contours = data3
  return data1
}

const creatHtml = (station) => {
  let html = '<h4 style="width:100px;height:20px;">' + station[27] + '</h4>'
  return html
}


const createMaker = (icon, point, latlng, html) => {

    return L.canvasMarker(latlng, {

      img: {
      url: weartherImage,
        size: [14, 14],
        rotate: 0
    },
     renderer: window.poiRender

  }).bindTooltip(html, {direction: 'top', className: 'water-marker-tooltip'}).bringToFront()
}
const setQueryTime = (data) => {

}


const createMakerClickEvent = (marker, latlng, station) => {
  marker.on('click', () => {
    console.log(station)
    getDetail(station, latlng)

    window.map.panTo(latlng)
  })
}

const getDetail = async (station, latlng) => {
  let result = formateDetailData(station)
  showRainPopup(result, latlng)
}
const formateDetailData = (station) => {
  let result = {
    'data': station,
    'type': 1003
  }
  return result
}

const showRainPopup = (data, latlng) => {
  let popBox = window.popBox
  popBox.isPopShow = true
  popBox.set(data)
  let popup = L.popup({
    className: 'marker-weather-popup',
    closeButton: false,
    minWidth: 330,
    autoPanPaddingTopLeft: [240, 80],
    autoPanPaddingBottomRight: [250, 10]
  })
  let el = popBox.$el
  popup.setContent(el)
    .setLatLng(latlng)
    .openOn(window.map)
  window.popup = popup
}

export default {
  type,
  createLayer,
  clearLayer,
  loadData,

  setQueryTime,
  showRainPopup
}
