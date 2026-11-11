import * as L from 'leaflet'
import 'leaflet.chinatmsproviders'
export const configMap = {
  minZoom: 3,
  maxZoom: 18,
  center: [31.02, 104.5],

  zoom: 7,
  zoomControl: false,
  editable: true,
  worldCopyJump: true,
  doubleClickZoom: false,
  attributionControl: false,
  closePopupOnClick: false

}


export const basinOptions = { maxZoom: 14, minZoom: 5 }
export const baseMapName = ['智图', '高德地图', '高德影像图', '天地图影像', '天地图', '天地图地形图']
export const tdtToken = 'f94c86b0a84c24ffa47431281930fc2d'
export const baseMaps = [
  {name: baseMapName[3],
  layerList: [
   L.tileLayer.chinaProvider(
      'TianDiTu.Satellite.Map',
      {
        key: tdtToken,
        maxZoom: 18,
        minZoom: 1
      }), L.tileLayer.chinaProvider(
      'TianDiTu.Satellite.Annotion',
      {
        key: tdtToken,
        maxZoom: 18,
        minZoom: 1
      })]
  },
  {
    name: baseMapName[4],
    layerList: [
      L.tileLayer.chinaProvider(
        'TianDiTu.Normal.Map',
        {
          key: tdtToken,
          maxZoom: 18,
          minZoom: 1
        }), L.tileLayer.chinaProvider(
        'TianDiTu.Normal.Annotion',
        {
          key: tdtToken,
          maxZoom: 18,
          minZoom: 1
        })]
  },
  {
    name: baseMapName[5],
    layerList: [
      L.tileLayer.chinaProvider(
        'TianDiTu.Terrain.Map',
        {
          key: tdtToken,
          maxZoom: 18,
          minZoom: 1
        }), L.tileLayer.chinaProvider(
        'TianDiTu.Terrain.Annotion',
        {
          key: tdtToken,
          maxZoom: 18,
          minZoom: 1
        })]
  },
  {
    name: baseMapName[0],
    layerList: [
       L.tileLayer.chinaProvider(
        'Geoq.Normal.PurplishBlue',
        {
          maxZoom: 18,
          minZoom: 1
        })]
  },
  {
    name: baseMapName[1],
    layerList: [
      L.tileLayer.chinaProvider(
        'GaoDe.Normal.Map',
        {
          maxZoom: 18,
          minZoom: 1
        })]
  },
  {
    name: baseMapName[2],
    layerList: [
      L.tileLayer.chinaProvider(
        'GaoDe.Satellite.Map',
        {
          maxZoom: 18,
          minZoom: 1
        }), L.tileLayer.chinaProvider(
        'GaoDe.Satellite.Annotion',
        {
          maxZoom: 18,
          minZoom: 1
        })]
  }
  ]

export const baseMapsTrack = [
  {name: baseMapName[3],
    layerList: [
      L.tileLayer.chinaProvider(
        'TianDiTu.Satellite.Map',
        {
          key: tdtToken,
          maxZoom: 18,
          minZoom: 1
        }), L.tileLayer.chinaProvider(
        'TianDiTu.Satellite.Annotion',
        {
          key: tdtToken,
          maxZoom: 18,
          minZoom: 1
        })]
  },
  {
    name: baseMapName[4],
    layerList: [
      L.tileLayer.chinaProvider(
        'TianDiTu.Normal.Map',
        {
          key: tdtToken,
          maxZoom: 18,
          minZoom: 1
        }), L.tileLayer.chinaProvider(
        'TianDiTu.Normal.Annotion',
        {
          key: tdtToken,
          maxZoom: 18,
          minZoom: 1
        })]
  },
  {
    name: baseMapName[5],
    layerList: [
      L.tileLayer.chinaProvider(
        'TianDiTu.Terrain.Map',
        {
          key: tdtToken,
          maxZoom: 18,
          minZoom: 1
        }), L.tileLayer.chinaProvider(
        'TianDiTu.Terrain.Annotion',
        {
          key: tdtToken,
          maxZoom: 18,
          minZoom: 1
        })]
  },
  {
    name: baseMapName[0],
    layerList: [
      L.tileLayer.chinaProvider(
        'Geoq.Normal.PurplishBlue',
        {
          maxZoom: 18,
          minZoom: 1
        })]
  },
  {
    name: baseMapName[1],
    layerList: [
      L.tileLayer.chinaProvider(
        'GaoDe.Normal.Map',
        {
          maxZoom: 18,
          minZoom: 1
        })]
  },
  {
    name: baseMapName[2],
    layerList: [
      L.tileLayer.chinaProvider(
        'GaoDe.Satellite.Map',
        {
          maxZoom: 18,
          minZoom: 1
        }), L.tileLayer.chinaProvider(
        'GaoDe.Satellite.Annotion',
        {
          maxZoom: 18,
          minZoom: 1
        })]
  }
]
