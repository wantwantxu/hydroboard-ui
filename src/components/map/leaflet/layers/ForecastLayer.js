import * as L from 'leaflet'
import {Message} from 'element-ui'
import Vue from 'vue'
Vue.component(Message.name, Message)

class ForecastLayer {
  constructor(map) {
    this.map = map
    this.autoPlay = false
    this.type = '1006'
    this.clickStatus = true
    this.contourLayer = L.featureGroup().addTo(map)
    this.layerGroup = L.featureGroup().addTo(map)
    this.hour=24
  }

  clearLayer() {
    this.autoPlay = false
    this.clickStatus = false
    if (this.layerGroup) {
      this.layerGroup.clearLayers()
    }
    if (this.contourLayer) {
      this.contourLayer.clearLayers()
    }
  }

  initListener(callback) {
    this.clickStatus = true
    this.map.on('click', (e) => {
      if (this.clickStatus) {
        this.showLocate(e.latlng)
        callback(e)
      }
    })
  }

  showLocate(itm) {
    if (this.layerGroup) {
      this.layerGroup.clearLayers()
    }
    const point = [itm.lat, itm.lng]

    L.circleMarker(point, {
      radius: 15,
      color: 'red',
      dashArray: '8 8',
      dashSpeed: -30
    }).addTo(this.layerGroup).bringToFront()
  }

  showForecastContour(index) {
    if (index <= 0 || index >= 10) {
      index = 1
    } else {
      index = index + 1
    }
    if (this.contourLayer) {
      this.contourLayer.clearLayers()
    }

    let hour = index * 24
    this.hour=hour
   let wmsServices = JSON.parse(window.dict.wmsServices[0].value)

    let res0 = wmsServices.ip+'/crontab/contour/get?hour=' + hour

    var imageBounds =JSON.parse(window.dict.imageBounds[0].value)
    console.log(imageBounds)
    L.imageOverlay(res0, imageBounds).addTo(this.contourLayer)
  }


  showMinuteForecastContour(time) {
    if (this.contourLayer) {
      this.contourLayer.clearLayers()
    }
    let wmsServices = JSON.parse(window.dict.wmsServices[0].value)
    let res0 = wmsServices.ip+'/crontab/contour/getMinute?tm='+ time
    var imageBounds =JSON.parse(window.dict.imageBounds[0].value)

    L.imageOverlay(res0, imageBounds).addTo(this.contourLayer).bringToBack();
  }


  showHourForecastContour(time) {
    if (this.contourLayer) {
      this.contourLayer.clearLayers()
    }
    let wmsServices = JSON.parse(window.dict.wmsServices[0].value)
    let res0 = wmsServices.ip+'/crontab/contour/getHourPng?tm='+ time
    var imageBounds =JSON.parse(window.dict.imageBounds[0].value)

    L.imageOverlay(res0, imageBounds).addTo(this.contourLayer).bringToBack();
  }

  showAccumulatedHoursForecastContour(time) {
    if (this.contourLayer) {
      this.contourLayer.clearLayers()
    }
    let wmsServices = JSON.parse(window.dict.wmsServices[0].value)
    let res0 = wmsServices.ip+'/crontab/contour/getSumHourPng?tm='+ time
    var imageBounds =JSON.parse(window.dict.imageBounds[0].value)

    L.imageOverlay(res0, imageBounds).addTo(this.contourLayer).bringToBack();
  }

  showSumDayForecastContour(time) {
    if (this.contourLayer) {
      this.contourLayer.clearLayers()
    }
    let wmsServices = JSON.parse(window.dict.wmsServices[0].value)
    let res0 = wmsServices.ip+'/crontab/contour/getSumDay?tm='+ time
    var imageBounds =JSON.parse(window.dict.imageBounds[0].value)
    console.log(11111)
    console.log(imageBounds)

    L.imageOverlay(res0, imageBounds).addTo(this.contourLayer).bringToBack();
  }

}




export default ForecastLayer
