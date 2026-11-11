import * as L from 'leaflet'
import {Message} from 'element-ui'
import Vue from 'vue'
import Api from '../../../../api'

Vue.component(Message.name, Message)

class Meteorology {
  constructor(map) {
    this.map = map

    this.isChecked = false
    this.layerGroup = L.featureGroup().addTo(map)
  }

  clearLayer() {
    this.isChecked = false
    if (this.layerGroup) {
      this.layerGroup.clearLayers()
    }
  }

  clearLayerOfWeatherRadar() {
    this.isChecked = false
    if (this.layerGroup) {
      this.layerGroup.clearLayers()
    }
    try {
      window.rainviewer.unload()
    } catch (e) {

     }
    window.rainviewer && window.rainviewer.remove()
  }


  async weatherRadar() {
    this.isChecked = true
    window.rainviewer = window.L.control.rainviewer({
      position: 'bottomleft',
      nextButtonText: '>>',
      playStopButtonText: '播放/停止',
      prevButtonText: '<<',
      positionSliderLabelText: '时间:',
      opacitySliderLabelText: '透明度:',
      animationInterval: 500,
      opacity: 0.5
    })
    window.rainviewer.addTo(window.map)
  }
  async rainFall48(option) {
    this.isChecked = true
    let opt = {t: new Date().getTime()}
    let data = await Api.getRainFall48(opt)

    let oData = this._formatData(data)
    this.drawOnMap(oData)
  }
  async rainFall24(option) {
    this.isChecked = true
    let opt = {t: new Date().getTime()}
    let data = await Api.getRainFall24(opt)

    let oData = this._formatData(data)
    this.drawOnMap(oData)

  }
  async rainFall72(option) {
    this.isChecked = true
    let opt = {t: new Date().getTime()}
    let data = await Api.getRainFall72(opt)

    let oData = this._formatData(data)
    this.drawOnMap(oData)
  }

  _formatData(data) {
    data = data.replace('diamond14_rainfall_24_json(', '')
    data = data.replace('diamond14_rainfall_48_json(', '')
    data = data.replace('diamond14_rainfall_72_json(', '')
    data = data.substring(0, data.length - 1)
    let data1 = JSON.parse(data)
    return data1
  }
  drawOnMap(data) {
    if (!this.isChecked) {
      return
    }
    this.layerGroup.clearLayers()
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

      polygon.addTo(this.layerGroup)
    }
  }
}

export default Meteorology
