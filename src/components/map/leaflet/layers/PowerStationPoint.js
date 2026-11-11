import * as L from 'leaflet'
import bPowerStationImg from '@/assets/images/bPowerStation.png'
import mPowerStationImg from '@/assets/images/mPowerStation.png'

class PowerStationPoint {
  constructor(map) {
    this.map = map
    this.type = '3004'
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
    data.forEach((item) => {
      if (item.gpLog && item.gpLat) {
        let latlng = [item.gpLat, item.gpLog]
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
    let html = '<h4 style="width:100px;height:20px;">' + station.gpName + '</h4>'
    return html
  }


  createMaker (item, latlng, html) {
    const level = item.gpKuRongLV
    return L.canvasMarker(latlng, {
      img: {
        url: level === '中型' ? mPowerStationImg : bPowerStationImg,
        size: [14, 14],
        rotate: 0
      },
      renderer: window.poiRender
    }).bindTooltip(html, {direction: 'top', className: 'water-marker-tooltip'}).bringToFront()
  }
}

export default PowerStationPoint
