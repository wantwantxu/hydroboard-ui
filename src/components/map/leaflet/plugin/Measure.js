
const areaMeasure = {
  points: [],
  color: 'red',
  L: null,
  layers: null,
  polygon: null,
  marker: null,
  init: function (map, L) {
    areaMeasure.L = L
    areaMeasure.map = map
    areaMeasure.points = []
    areaMeasure.polygon = null
    areaMeasure.layers = L.layerGroup()
    areaMeasure.map.on('click', areaMeasure.click).on('dblclick', areaMeasure.dblclick)
  },

  click: function (e) {
    areaMeasure.map.doubleClickZoom.disable()
    areaMeasure.points.push(e.latlng)
    areaMeasure.map.on('mousemove', areaMeasure.mousemove)
  },

  mousemove: function (e) {
    areaMeasure.points.push(e.latlng)
    if (areaMeasure.polygon) {
      areaMeasure.map.removeLayer(areaMeasure.polygon)
    }
    areaMeasure.polygon = areaMeasure.L.polygon(areaMeasure.points, {
      showMeasurements: true,
      color: 'red'
    })
    areaMeasure.polygon.addTo(areaMeasure.layers)
    areaMeasure.layers.addTo(areaMeasure.map)
    areaMeasure.points.pop()
  },

  dblclick: function (e) {
    areaMeasure.polygon.addTo(areaMeasure.layers)
    areaMeasure.polygon.enableEdit()
    areaMeasure.map.on('editable:vertex:drag editable:vertex:deleted', areaMeasure.polygon.updateMeasurements, areaMeasure.polygon)
    areaMeasure.map.off('click', areaMeasure.click).off('mousemove', areaMeasure.mousemove).off('dblclick', areaMeasure.dblclick)
  },

  destory: function () {
    if (areaMeasure.polygon) {
      areaMeasure.map.removeLayer(areaMeasure.polygon)
    }
    if (areaMeasure.layers) {
      areaMeasure.layers.clearLayers()
    }
  }
}
const startMeasureArea = function (map, L) {
  areaMeasure.destory()
  areaMeasure.init(map, L)
}


const distanceMeasure = {
  points: [],
  color: 'blue',
  L: null,
  map: null,
  layers: null,
  polyline: null,
  marker: null,

  init: function (map, L) {
    distanceMeasure.L = L
    distanceMeasure.map = map
    distanceMeasure.points = []
    distanceMeasure.polyline = null
    distanceMeasure.marker = null
    distanceMeasure.layers = L.layerGroup()
    map.on('click', distanceMeasure.click).on('dblclick', distanceMeasure.dblclick)
  },

  click: function (e) {
    distanceMeasure.map.doubleClickZoom.disable()
    distanceMeasure.points.push(e.latlng)
    distanceMeasure.map.on('mousemove', distanceMeasure.mousemove)
  },

  mousemove: function (e) {
    distanceMeasure.points.push(e.latlng)
    if (distanceMeasure.polyline) {
      distanceMeasure.map.removeLayer(distanceMeasure.polyline)
    }
    distanceMeasure.polyline = distanceMeasure.L.polyline(distanceMeasure.points, { showMeasurements: true, color: 'red' })
    distanceMeasure.polyline.addTo(distanceMeasure.layers)
    distanceMeasure.layers.addTo(distanceMeasure.map)
    distanceMeasure.points.pop()
  },

  dblclick: function (e) {
    distanceMeasure.polyline.enableEdit()
    distanceMeasure.polyline.addTo(distanceMeasure.layers)
    distanceMeasure.map.on('editable:vertex:drag editable:vertex:deleted', distanceMeasure.polyline.updateMeasurements, distanceMeasure.polyline)
    distanceMeasure.map.off('click', distanceMeasure.click).off('mousemove', distanceMeasure.mousemove).off('dblclick', distanceMeasure.dblclick)
  },

  destory: function () {
    if (distanceMeasure.polyline) {
      distanceMeasure.map.removeLayer(distanceMeasure.polyline)
    }
    if (distanceMeasure.marker) {
      distanceMeasure.marker.remove()
    }
    if (distanceMeasure.layers) {
      distanceMeasure.layers.clearLayers()
    }
  }
}
const startMeasureLen = function (map, L) {
  distanceMeasure.destory()
  distanceMeasure.init(map, L)
}


const clearMeasure = function () {
  areaMeasure.destory()
  distanceMeasure.destory()
}


export default {
  startMeasureArea,
  startMeasureLen,
  clearMeasure
}
