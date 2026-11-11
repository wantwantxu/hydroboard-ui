import * as L from 'leaflet'
import { formatDate } from '@/assets/js/common'

import flood_blue_big from '@/assets/images/flood_blue_big.png.png'

import flood_redImg from '@/assets/images/flood_red_big.png.png'

import flood_yellowImg from '@/assets/images/flood_yellow_big.png.png'

import flood_originImg from '@/assets/images/flood_origin_bigg.png.png'
class DangerOutPoint {
  constructor(map) {
    this.map = map
    this.type = '5001'
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
    let e = new Date()
    let formData = {
      date: ''
    }
    if (new Date().getHours() > 8) {

      formData['date'] = [
        formatDate(e, 'yyyy-MM-dd 08:00:00'),
        formatDate(e, 'yyyy-MM-dd hh:mm:ss')
      ]
    } else {
      let y = new Date(new Date().setDate(new Date().getDate() - 1))
      formData['date'] = [
        formatDate(y, 'yyyy-MM-dd 08:00:00'),
        formatDate(e, 'yyyy-MM-dd hh:mm:ss')
      ]
    }
    queryParam = {startDate: formData.date[0], endDate: formData.date[1]}
    this.queryParam = queryParam
    this.clearLayer()
    data.forEach((item, index) => {
      item.stcd = item.stationId || item.stcd
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

    return html
  }


  createMaker (item, latlng, html, index) {
    let img

    if (item.type === 'warn' && item.statisType === 'z') {

      img = flood_yellowImg
    }
    if (item.type === 'hwarn' && item.statisType === 'z') {

      img = flood_originImg
    }
    if (item.type === 'hhwarn' && item.statisType === 'rz') {

      img = flood_yellowImg
    }
    if (item.type === 'hwarn' && item.statisType === 'rz') {

      img = flood_originImg
    }
    if (item.type === 'warn' && item.statisType === 'rz') {

      img = flood_originImg
    }



    return L.canvasMarker(latlng, {
      img: {
        url: img,
        size: [30, 30],
        rotate: 0
      },
      renderer: window.poiRender
    }).bindTooltip(html, {direction: 'top', className: 'water-marker-tooltip'}).bringToFront()
  }

  openPopup = (data) => {

    data.stcd = data.stationId || data.stcd
    if (data.statisType === 'z') {
      data.typeWarn = '1002'
    }

    if (data.statisType === 'rz') {
      data.typeWarn = '3003'
    }
    console.log(data.type)
    window.mpPlugin.popup().showTabs(data, this.queryParam)
  }
}

export default DangerOutPoint
