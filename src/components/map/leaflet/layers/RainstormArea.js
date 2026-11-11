import * as L from 'leaflet'
import eventBus from '../../../../eventBus'
import Api from '@/api'
import {tdtToken} from '../config/configMap'

let type = 2006
let layerGroup = null
let locationMarker = null
let ncDataImage = null



const createLayer = (map) => {
  if (layerGroup === null) {
    layerGroup = L.featureGroup().addTo(map)
    eventBus.$on('showNCData', (data) => {
      let hour = (24 * data.id + 24)
      getNcData(hour)
    })
    eventBus.$on('chartClose', () => {
      _clearLocationMarker()
    })
  }
}
const setQueryTime = (data) => {
}
const showDetail = (e) => {
  console.log(e)
  _clearLocationMarker()

  getDetail(e)
  addPoint(layerGroup, e)
}

const loadData = (option) => {
 window.mapClickRainstormArea = showDetail
    window.map.on('click', showDetail)
}
const _clearLocationMarker = () => {
  if (locationMarker !== null) {
    locationMarker.remove()
    locationMarker = null
  }
}
const getNcData = async (hour) => {
  if (ncDataImage != null) {
    ncDataImage.remove()
    ncDataImage = null
    this.clearLayer()
  }
  if (!hour) {
    return
  }
  let wmsServices = JSON.parse(window.dict.wmsServices[0].value)
  console.log(wmsServices)

  let res0 = wmsServices.ip+'/crontab/contour/getSum?hour=' + hour

  var imageBounds =JSON.parse(window.dict.imageBounds[0].value)
  console.log(imageBounds)
  ncDataImage = L.imageOverlay(res0, imageBounds).addTo(layerGroup)
}

const clearLayer = () => {
  if (layerGroup) {
    layerGroup.clearLayers()
  }
}

const showPopup = (data) => {
  let latlng = [data.y, data.x]
  getDetail(data, latlng)
}

const getDetail = async (e) => {
  let postStr = JSON.stringify({
    lon: e.latlng.lng,
    lat: e.latlng.lat,
    ver: 1
  })
  let data = {
    postStr: postStr,
    type: 'geocode',
    tk: tdtToken
  }
 let res = await Api.geocoder(data)

  _openPopup(res, e)
}

const addPoint = (layerGroup, e) => {
  let icon = L.divIcon({
    html: '<div class="rain-station "/>',
    className: ''
  })
    const itm = e.latlng
    const point = [itm.lat, itm.lng]

  locationMarker = createMaker(icon, itm, point)

  locationMarker.addTo(layerGroup)
}


const createMaker = (icon, item, latlng) => {
  return L.circleMarker(latlng, {
    radius: 15,
    color: 'red',
    dashArray: '8 8',
    dashSpeed: -30
  }).bringToFront()
}

const _openPopup = (data, latlng) => {
  eventBus.$emit('chartShow', data, latlng)
}

export default {
  type,
  loadData,
  setQueryTime,
  createMaker,
  createLayer,
  clearLayer,
  showPopup
}
