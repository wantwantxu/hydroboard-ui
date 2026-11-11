import * as L from 'leaflet'
import rsvrImg from '@/assets/images/reservoirStation.png'

class Sandmining {
  constructor(map) {
    this.map = map
    this.type = '3022'
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
    window.mpPlugin.popup().showTabs(data, this.queryParam)
  }

  showPoint(data, queryParam) {
    this.queryParam = queryParam
    this.clearLayer()
    L.divIcon({
      html: '<div class="rain-station "/>',
      className: ''
    })
    data.forEach((item) => {
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
    return html
  }


  createMaker (item, latlng, html) {
    return L.canvasMarker(latlng, {
      img: {
        url: rsvrImg,
        size: [16, 16],
        rotate: 0
      },
      renderer: window.poiRender
    }).bindTooltip(html, {direction: 'top', className: 'water-marker-tooltip'}).bringToFront()
  }
}

export default Sandmining
