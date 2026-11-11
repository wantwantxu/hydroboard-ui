import * as L from 'leaflet'
import 'leaflet.gridlayer.fadeout'
import './plugin/L.TileLayer.NoGap'
import 'leaflet-editable'
import 'leaflet-measure-path'
import 'leaflet-measure-path/leaflet-measure-path.css'

import './plugin/leaflet-canvas-markers'
import './plugin/leaflet-polygon.fillPattern'
import './plugin/leaflet-tileLayerPixelFilter'
import './plugin/TileLayer.Grayscale'
import './plugin/pulse/Pulse.css'
import './plugin/pulse/Pulse'
import './plugin/rainviewer/leaflet.rainviewer.css'
import './plugin/rainviewer/leaflet.rainviewer'
import './plugin/L.Path.DashFlow'


import appService from '@/store/services/appService'
import {baseMapName, configMap} from './config/configMap'
import BaseMap from './BaseMap'
import Plugins from './plugin/Plugins'


const models = import.meta.glob('./layers/*.js', { eager: true })
let allModels = {}
Object.keys(models).forEach(path => {
  const name = path.replace(/^\.\/layers\/(.*)\.\w+$/, '$1')
  allModels[name] = models[path].default || models[path]
})
window.L = L

let map = null
let mapTrack = null


let popup = null
window.popup = popup
window.addEventListener('dataReady', function() {

  console.log(window.dict)
})

const initMap = (div) => {
  const dicts = window.dicts

  const portalConfig = appService.getPortalConfig()

  try {
    const centerCfg = portalConfig['map_center']
    if (centerCfg) {
      const c = JSON.parse(centerCfg)
      if (Array.isArray(c) && c.length === 2) { configMap.center = c }
    }
    const zoomCfg = portalConfig['map_zoom']
    if (zoomCfg) { configMap.zoom = Number(zoomCfg) || configMap.zoom }
  } catch (e) {  }

  map = L.map(div, configMap)
  let poiPane = map.createPane('poi')
  poiPane.style.zIndex = 450
  window.poiRender = L.canvas({pane: 'poi'})
  window.map = map

  let bounds = null
  try {
    const boundsCfg = portalConfig['map_bounds']
    if (boundsCfg) {
      const b = JSON.parse(boundsCfg)
      if (Array.isArray(b)) { bounds = b }
    }
  } catch (e) {  }
  if (!bounds && dicts.mapCoordinates && dicts.mapCoordinates.length > 0) {
    bounds = JSON.parse(dicts.mapCoordinates[0].value)
  }
  if (bounds) {
    map.fitBounds(bounds)

    const lockCfg = portalConfig['map_lock']
    if (lockCfg === 'true' || lockCfg === true) {
      map.setMaxBounds(bounds)
    }
  }
  window.mpPlugin = new Plugins(map)
  BaseMap.createLayer(map)

  BaseMap.changeBaseMap(BaseMap.getDefaultBaseMapName())

  BaseMap.loadlayers()

}
const initMapTrack = (div) => {
  mapTrack = L.map(div, configMap)



  window.mapTrack = mapTrack
  BaseMap.createTrackLayer(mapTrack)



  BaseMap.changeBaseMapTrack(baseMapName[3])
  BaseMap.loadAreaTrack()

}


const loadClass = (data) => {
  if (data.type === '') {
    return
  }
  for (let key in allModels) {
    let type = allModels[key].type.toString()
    if (type.indexOf(data.type.toString()) > -1) {
      allModels[key].setQueryTime(data)
      allModels[key].loadData(data)
    }
  }
}
const clearClass = (type) => {
  if (type === '') {
    return
  }
  for (let key in allModels) {
    let t = allModels[key].type.toString()
    if (t.indexOf(type.toString()) > -1) {
      allModels[key].clearLayer()
    }
  }
}
const clearPopup = () => {
  map.closePopup()
}

const clearAllLayer = () => {
  for (let key in allModels) {
    allModels[key] && allModels[key].clearLayer && allModels[key].clearLayer()
  }
}
const showPopup = (data) => {
  for (let key in allModels) {
    if (data.type === allModels[key].type) {
      allModels[key].showPopup(data.data)
    }
  }
}
const removeMapClickEvent = () => {
  if (window.mapClickRainstormArea) {
    window.map.off('click', window.mapClickRainstormArea)
  }
}
export default {
  initMap,
  initMapTrack,
  loadClass,
  clearClass,
  clearPopup,
  clearAllLayer,
  showPopup,
  removeMapClickEvent
}
