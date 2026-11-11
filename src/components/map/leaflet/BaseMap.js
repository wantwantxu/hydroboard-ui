import * as L from 'leaflet'
import {baseMaps, baseMapsTrack, basinOptions} from './config/configMap'
import axios from "axios";
import Api from '../../../api'
import appService from '@/store/services/appService'

let basemapLayerGroup = null
let baseAreaLayerGroup = null
let baseRiverLayerGroup = null
let baseMapLayerTrackGroup = null
let baseAreaLayeTrackrGroup = null
let wmsLayerSS = []
const API_HOST_MAP = process.env.API_HOST_MAP
const createLayer = (map) => {
  basemapLayerGroup = L.layerGroup().addTo(map)
  baseAreaLayerGroup = L.layerGroup().addTo(map)
  baseRiverLayerGroup = L.layerGroup().addTo(map)
}

const createTrackLayer = (map) => {
  baseMapLayerTrackGroup = L.layerGroup().addTo(map)
  baseAreaLayeTrackrGroup = L.layerGroup().addTo(map)
}

const getBaseMaps = () => {
  const cfgList = window.baseLayers
  if (!Array.isArray(cfgList) || cfgList.length === 0) {
    return baseMaps
  }
  const list = []
  cfgList.forEach((b) => {
    if (!b || !b.url) return

    let url = String(b.url)
    if (b.token) {
      url = url.replace('{token}', b.token)
    }
    const opts = {
      maxZoom: b.maxZoom || 18,
      minZoom: b.minZoom || 1,
      subdomains: (b.subdomains && b.subdomains.length) ? b.subdomains : '01234567'
    }
    const layer = L.tileLayer(url, opts)
    const isOverlay = b.isOverlay === true || b.isOverlay === 'true'
    if (isOverlay && list.length > 0) {

      list[list.length - 1].layerList.push(layer)
    } else {
      list.push({ name: b.name, layerList: [layer] })
    }
  })
  return list.length > 0 ? list : baseMaps
}


const getDefaultBaseMapName = () => {
  const list = getBaseMaps()
  return list.length > 0 ? list[0].name : '天地图影像'
}


const changeBaseMap = (name) => {
  basemapLayerGroup.clearLayers()
  getBaseMaps().forEach((baseMap) => {
    if (baseMap.name === name) {
      baseMap.layerList.forEach((layer) => {
        basemapLayerGroup.addLayer(layer)
      })
    }
  })
  _areaExtentBringToFont()
  _baseMapAnnotionBringToFont()
}


const changeBaseMapTrack = (name) => {
  baseMapLayerTrackGroup.clearLayers()
  baseMapsTrack.forEach((baseMap) => {
    if (baseMap.name === name) {
      baseMap.layerList.forEach((layer) => {
        baseMapLayerTrackGroup.addLayer(layer)
      })
    }
  })
  _areaExtentBringToFont()
  _baseMapAnnotionBringToFont()
}

const loadlayers = async () => {
  const dicts = window.dicts
  if (!dicts || !dicts.wmsServices || !dicts.wmsServices[0]) return
  let wmsServices
  try {
    wmsServices = JSON.parse(dicts.wmsServices[0].value)
  } catch (e) {
    return
  }

  if (!wmsServices.loadAreaServices) return
  let layers = (dicts.layers && dicts.layers[0] && dicts.layers[0].value) || ''
  if (!layers) return
  var wmsLayer = {
    url: wmsServices.loadAreaServices + '/wms',
    options: {
      layers: layers,
      format: 'image/png',
      transparent: true
    }
  }
  L.tileLayer.wms(wmsLayer.url, wmsLayer.options).addTo(baseAreaLayerGroup)
  _baseMapAnnotionBringToFont()
}


const APIloadlayers = async (obj, is) => {
  const dicts = window.dicts
  if (!dicts || !dicts.wmsServices || !dicts.wmsServices[0]) return
  let wmsServices
  try {
    wmsServices = JSON.parse(dicts.wmsServices[0].value)
  } catch (e) {
    return
  }
  if (!wmsServices.loadAreaServices || !obj || !obj.key) return
  let wmsLayer = {
    url: wmsServices.loadAreaServices + '/wms',
    options: {
      layers: obj.key,
      format: 'image/png',
      transparent: true
    }
  }
  let maps = L.tileLayer.wms(wmsLayer.url, wmsLayer.options)
  let res = wmsLayerSS.some(ele => {
    ele.options.layers === obj.key
  })
  if (res) {

  } else {

    wmsLayerSS.push(maps)
    maps.addTo(baseAreaLayerGroup)

  }
  wmsLayerSS.forEach((item, i) => {

    if (item.options.layers === obj.key) {

      if (is) {

        item.addTo(baseAreaLayerGroup)
      } else {
        wmsLayerSS = wmsLayerSS.filter(v => v.options.layers !== obj.key);

        baseAreaLayerGroup.removeLayer(item)
      }
    }
  })


  _baseMapAnnotionBringToFont()
}


const loadBasislayers = () => {

}


const loadBasisGongChenglayers = async (layers) => {
  const dicts = window.dicts
  if (dicts.wmsServices == undefined && dicts.wmsServices == '') {
    return
  }
  let wmsServices = JSON.parse(dicts.wmsServices[0].value)
  let queryData = {
    service: 'wfs',
    version: '1.0.0',
    request: 'GetFeature',
    srsName: 'EPSG:4490',
    typename: layers.join(','),
    outputFormat: 'application/json',

  }

  var wfsUrl = wmsServices.loadAreaServices + '/wfs'

  fetch(wfsUrl)
    .then(function (response) {
      return response.json();
    }).then(function (res) {
    console.log('456677', res)
  })
}

const geoJSON = (data) => {
  let that = this

  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      console.log(latlng)

      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: '/static/img/ship.png',
          iconSize: [25, 41],
          iconAnchor: [12, 40]
        })
      });
    },
    onEachFeature: function (feature, layer) {

      if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.name);
      }
    }
  }).addTo(window.map);
}


const loadRiver = async () => {
  const dicts = window.dicts
  if (dicts.wmsServices == undefined && dicts.wmsServices == '') {
    return
  }
  if (dicts.riverLayer == undefined && dicts.riverLayer == '') {
    return
  }
  let riverLayer = dicts.riverLayer[0].value
  let wmsServices = JSON.parse(dicts.wmsServices[0].value)
  if (wmsServices !== undefined && wmsServices !== '' && riverLayer !== undefined && riverLayer !== '') {
    var wmsLayer = {

      url: wmsServices.loadAreaServices + '/wms',
      options: {
        layers: riverLayer,
        format: 'image/png',
        transparent: true
      }
    }
    L.tileLayer.wms(wmsLayer.url, wmsLayer.options).addTo(baseRiverLayerGroup)
    _baseMapAnnotionBringToFont()
  }
}
const loadAreaTrack = async () => {
  L.tileLayer(basinOptions).addTo(baseAreaLayeTrackrGroup)
  _baseMapAnnotionBringToFont()
}
const _areaExtentBringToFont = () => {
  let basemapLayerList = baseAreaLayerGroup.getLayers()
  if (basemapLayerList.length > 0) {
    basemapLayerList[0].bringToFront()
  }
}
const _baseMapAnnotionBringToFont = () => {
  let basemapLayerList = basemapLayerGroup.getLayers()
  if (basemapLayerList.length > 1) {
    basemapLayerList[1].bringToFront()
  }
}
export default {
  createLayer,
  createTrackLayer,
  changeBaseMap,
  getBaseMaps,
  getDefaultBaseMapName,
  changeBaseMapTrack,
  loadRiver,
  loadAreaTrack,
  loadlayers,
  APIloadlayers,
  loadBasislayers,
  geoJSON,
  loadBasisGongChenglayers
}
