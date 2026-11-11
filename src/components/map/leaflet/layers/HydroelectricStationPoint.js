import * as L from 'leaflet'
import flow from '@/assets/images/flow.png'

class HydroelectricStationPoint {
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

  openPopup = (data) => {

    const param = this.queryParam
    data.type = 'hydroelectricStation'
    window.eventBus.$emit('showPop', data, param)
  }

  showPointPopup(params, queryParam) {
    console.log(params)
    params.type = this.type
    let data = {
      citId: params.citId,
      countyId: params.countyId,
      gpId: params.gpId,
      gpKuRongLV: params.gpKuRongLV,
      lttd: params.gpLat,
      lgtd: params.gpLog,
      gpLiuliang: params.gpLiuliang,
      gpName: params.gpName,
      gpSyShuiWei: params.gpSyShuiWei,
      gpTime: params.gpTime,
      gpType: params.gpType,
      gpXyShuiWei: params.gpXyShuiWei,
      provinceId: params.provinceId,
      queryParam: queryParam,
      type: params.type
    }
    window.mpPlugin.popup().showTabs(data, queryParam)
  }

  showPoint(data, queryParam) {
    this.queryParam = queryParam
    this.clearLayer()
    console.log(data)
    data.forEach((item) => {
      if (item.gpLat && item.gpLog) {
        let latlng = [item.gpLat, item.gpLog]
        let html = this.creatHtml(item)
        let marker = this.createMaker(item, latlng, html)
         marker.on('click', () => {
           this.showPointPopup(item, this.queryParam)
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
    return L.canvasMarker(latlng, {
      img: {
        url: flow,
        size: [14, 14],
        rotate: 0
      },
      renderer: window.poiRender
    }).bindTooltip(html, {direction: 'top', className: 'water-marker-tooltip'}).bringToFront()
  }
}
export default HydroelectricStationPoint
