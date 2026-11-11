import * as L from 'leaflet'

class WaterPoint {
  constructor(map) {
    this.map = map
    this.type = '1002'
    this.layerGroup = L.featureGroup().addTo(map)
    this.queryParam = {}
  }

  clearLayer() {
    if (this.layerGroup) {
      this.layerGroup.clearLayers()
    }
  }

  showPointPopup(params) {
    this.openPopup(params, [params.lttd, params.lgtd])
  }

  showPoint(data, queryParam) {
    console.log(data)
    this.queryParam = queryParam
    this.clearLayer()

    data.forEach((item, index) => {
      if (item.lttd && item.lgtd) {
        let latlng = [item.lttd, item.lgtd]
        let html = this.creatHtml(item)
        let marker = this.createMaker(item, latlng, html, index)
        marker.addTo(this.layerGroup)
        marker.on('click', () => {
          this.openPopup(item, latlng)
        })
      }
    })
  }


  creatHtml(station) {
    let html = '<h4 style="width:100px;height:20px;">' + station.stnm + '</h4>'
    if (station.z === null || station.z === undefined) {
      html += '<h4 style="color:red">无</h4>'
    } else {
      html += '<h4>' + station.z + ' m' + '</h4>'
    }
    return html
  }


  createMaker (item, latlng, html, index) {
    const z = item.z
    let color = '#00fff6'
    if (!z) {
      color = '#c8c8c8'
    }

    let divHtml = '<div class="water-zz" style="border-color:transparent transparent ' + color + ' transparent;"></div>'
    

    let icon = L.divIcon({
      html: divHtml,
      className: 'water-station'
    })
    let marker = L.marker(latlng, {

      icon: icon,
      iconSize: [20, 20],
      renderer: window.poiRender,
      zIndexOffset: index
    }).bindTooltip(html, {direction: 'top', className: 'water-marker-tooltip'})
    return marker
  }

  openPopup = (data) => {
    data.type = this.type
    window.mpPlugin.popup().showTabs(data, this.queryParam)
  }
}

export default WaterPoint
