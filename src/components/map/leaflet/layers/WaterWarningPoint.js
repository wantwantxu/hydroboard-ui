import * as L from 'leaflet'


import flood_blue_big from '@/assets/images/flood_blue_big.png'

import flood_redImg from '@/assets/images/flood_red_big.png'

import flood_yellowImg from '@/assets/images/flood_yellow_big.png'
class WaterWarningPoint {
  constructor(map) {
    this.map = map
    this.type = '1007'
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



  }

  createMaker (item, latlng, html) {

    let img = flood_blue_big
    if (item.wrLevel === '蓝色') {

      img = flood_blue_big
    } else if (item.wrLevel === '红色') {

      img = flood_redImg
    } else if (item.wrLevel === '黄色') {

      img = flood_yellowImg
    }
    return L.canvasMarker(latlng, {
      img: {
        url: img,
        size: [30, 30],
        rotate: 0
      },
      renderer: window.poiRender
    }).bringToFront()
  }

  openPopup = (data) => {
    data.type = this.type
    window.mpPlugin.popup().showTabs(data, this.queryParam)
  }
}

export default WaterWarningPoint
