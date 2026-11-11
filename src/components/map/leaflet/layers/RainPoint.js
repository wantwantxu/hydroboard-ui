import * as L from 'leaflet'
import rain0 from '@/assets/images/rain0.png'
import rain1 from '@/assets/images/rain1.png'
import rain2 from '@/assets/images/rain2.png'
import rain3 from '@/assets/images/rain3.png'
import rain4 from '@/assets/images/rain4.png'
import rain5 from '@/assets/images/rain5.png'
import rain6 from '@/assets/images/rain7.png'

class RainPoint {
  constructor(map) {
    this.map = map
    this.type = '1001'
    this.layerGroup = L.featureGroup().addTo(map)
    this.queryParam = {}
  }

  clearLayer() {
    if (this.layerGroup) {
      this.layerGroup.clearLayers()
    }
  }

  showPointPopup(data) {
    data.type = this.type
      window.mpPlugin.popup().showCharts(data, this.queryParam)
  }
  showPoint(data, queryParam) {
    this.queryParam = queryParam
    this.clearLayer()
    L.divIcon({
      html: '<div class="rain-station "/>',
      className: ''
    })
    let arr = JSON.parse(JSON.stringify(data))
    arr.reverse().forEach((item) => {
      if (item.lttd && item.lgtd) {
        let latlng = [item.lttd, item.lgtd]
        let html = this.creatHtml(item)
        let marker = this.createMaker(item, latlng, html)
        marker.on('click', () => {
          this.showPointPopup(item)
        })
        marker.addTo(this.layerGroup)
      }
    })
  }


  creatHtml(station) {
    let html = '<h4 style="width:100px;height:20px;">' + station.stnm + '</h4>'
    if (station.drp !== null && station.drp !== undefined) {
      html += '<h4>' + station.drp + ' mm' + '</h4>'
    } else {
      html += '<h4>无降雨</h4>'
    }
    return html
  }


  createMaker (item, latlng, html) {
    let img = rain0
    const rain = item.drp
    if (rain <= 0) {

      img = rain0
    } else if (rain >= 0.1 && rain <= 9.9) {

      img = rain1
    } else if (rain >= 10 && rain <= 24.9) {

      img = rain2
    } else if (rain >= 25 && rain <= 49.9) {

      img = rain3
    } else if (rain >= 50 && rain <= 99.9) {

      img = rain4
    } else if (rain >= 100 && rain <= 249.9) {

      img = rain5
    } else if (rain >= 250) {

      img = rain6
    }
    return L.canvasMarker(latlng, {
      img: {
        url: img,
        size: [14, 14],
        rotate: 0
      },
      renderer: window.poiRender
    }).bindTooltip(html, {direction: 'top', className: 'water-marker-tooltip'}).bringToFront()
  }
}

export default RainPoint
