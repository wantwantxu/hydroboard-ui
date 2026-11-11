import * as L from 'leaflet'
import rain0 from '@/assets/images/rain0.png'

class SzyAnalysis {
  constructor(map) {
    this.map = map
    this.type = '1008'
    this.layerGroup = L.featureGroup().addTo(map)
    this.queryParam = {}
  }

  clearLayer() {
    if (this.layerGroup) {
      this.layerGroup.clearLayers()
    }
  }

  showObjectsGeom(geom) {
    console.log(geom)
    let bondarylayer = L.geoJSON(geom, {
      style: {
        color: '#648eea',
        fillOpacity: 0.6,
        weight: 1
      },
      pane: 'overlayPane'
    })
    console.log(geom)
    bondarylayer.addTo(this.layerGroup)


    let bounds = bondarylayer.getBounds();


    this.map.flyToBounds(bounds, {
      padding: [50, 50],
      duration: 2
    });
  }

  showPointPopup(data) {
    data.type = this.type
    window.mpPlugin.popup().showCharts(data, this.queryParam)
  }
  showPoint(data, queryParam) {
    L.divIcon({
      html: '<div class="rain-station "/>',
      className: ''
    })
    console.log(data)

    if (data.lttd && data.lgtd) {
      let latlng = [data.lttd, data.lgtd]
      let html = this.creatHtml(data)
      let marker = this.createMaker(data, latlng, html)
      marker.on('click', () => {
        this.showPointPopup(data)
      })
      marker.addTo(this.layerGroup)
    }
  }


  creatHtml(station) {
    let html = '<h4 style="width:100px;height:20px;">' + station.stnm + '</h4>'
    if (station.rain !== null) {
      html += '<h4>' + station.rain + ' mm' + '</h4>'
    } else {
      html += '<h4>无降雨</h4>'
    }
    return html
  }


  createMaker (item, latlng, html) {
    let img = rain0
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

export default SzyAnalysis
