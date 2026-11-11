
import * as L from 'leaflet'

import Api from '../../../../api'

import * as turf from '@turf/turf'

import {getContourLevelOptions, getColor, getColor2} from '../config/rainLegend'

import {Message} from 'element-ui'

import Vue from 'vue'

Vue.component(Message.name, Message)


class Isosurface {

  constructor(map) {
    this.map = map
    this.type = '1006'
    this.contourLevelOptions = getContourLevelOptions(24)
    this.layerGroup = L.featureGroup().addTo(map)
  }


  clearLayer() {
    if (this.layerGroup) {
      this.layerGroup.clearLayers()
    }
  }


  show(stm, etm) {
    this.clearLayer()
    const contourLevelOptions = this.contourLevelOptions
    const layerGroup = this.layerGroup
    let parameter = null


    if (window.dict.parameter !== undefined) {
      console.log(window.dict.parameter[0].value)
      parameter = window.dict.parameter[0].value
    }


    let obj = {}
    if (parameter != null) {
      obj = {
        startDate: stm,
        endDate: etm,
        type: parameter
      }
    } else {
      obj = {
        startDate: stm,
        endDate: etm
      }
    }


    Api.getContour(obj).then(res => {
      if (res.code === 200) {
        let clip = JSON.parse(res.result)

        clip.features.forEach(item => {
          L.geoJSON(item, {

            style: function (feature) {
              let level = item.properties.lvalue

              let color = getColor2(level, contourLevelOptions) || 'rgba(200,230,235,0.2)'
              return {
                stroke: true,
                weight: 0.8,
                fillColor: color,
                fillOpacity: 0.78,
                color: 'rgba(0, 255, 246, 0.28)',
                opacity: 0.7
              }
            },

            onEachFeature: function (feature, layer) {
            }
          }).addTo(layerGroup).bringToFront()
        })
      }
    })


  }


  render(rainList, features) {
    let rainData = this.wrap(rainList)
    if (rainData.length > 0) {
      this.surface(rainData, features)
    } else {
      Message.error('这段时间没有降雨！')
    }
  }


  wrap(data) {
    let result = []
    data.forEach(item => {

      if (item.lttd && item.lgtd && item.drp !== null) {
        result.push({
          level: item.drp,
          lgtd: item.lgtd,
          lttd: item.lttd
        })
      }
    })
    return result
  }


  getExtent(bb) {
    return [[bb[0] - 0.01, bb[1] - 0.01], [bb[2] + 0.01, bb[3] + 0.01]]
  }


  getClipData(bb) {
    return [[[
      [bb[0], bb[1]],
      [bb[0], bb[3]],
      [bb[2], bb[1]],
      [bb[2], bb[3]
      ]]]]
  }


  getBbox(extent) {
    return turf.bbox(extent)
  }


  getLegendOption() {
    return {
      position: 'bottomleft',
      gradient: false,
      direction: 'vertical',
      title: '降雨等值面图(mm)',
      backgroundColor: 'rgba(255, 255, 255, 0.6)'
    }
  }


  clipFeatures(p1, p2) {
    const polygon = turf.polygon(p1.geometry.coordinates)
    var clipPolygon = turf.polygon(p2.features[0].geometry.coordinates[0])
    var intersection = turf.intersect(polygon, clipPolygon)
    return intersection
  }


  surface(surfaceData, features) {
    this.clearLayer()
    const contourLevelOptions = this.contourLevelOptions
    const clipFeatures = this.clipFeatures
    const layerGroup = this.layerGroup

    let bbox = this.getBbox(features)
    let rainExtent = this.getExtent(bbox)
    let clipData = this.getClipData(bbox)


    var krigingImg = new window.IsoImage(
      surfaceData,
      {
        type: 'kriging',
        worker: '/static/js/worker',
        extent: rainExtent,
        clip: clipData,
        level: contourLevelOptions,
        cellWidth: 0.01,
        keyConfig: {
          x: 'lgtd',
          y: 'lttd',
          v: 'level',
          clipX: '0',
          clipY: '1'
        }
      },

      (that) => {
        let data = that.fmtLatlngsIsosurface.features

        data.forEach(function (p1, p2, p3) {

          p1.geometry.coordinates.forEach(function (p4, p5, p6) {
            p4.forEach(function (p7, p8, p9) {
              p7.reverse()
            })
          })

          let clip = clipFeatures(p1, features)
          console.log(clip)
          if (clip) {

            L.geoJSON(clip, {

              style: function (feature) {
                let level = p1.properties.val

                let color = getColor(level, contourLevelOptions) || 'rgba(200,230,235,0.2)'
                return {
                  stroke: true,
                  weight: 0.8,
                  fillColor: color,
                  fillOpacity: 0.78,
                  color: 'rgba(0, 255, 246, 0.28)',
                  opacity: 0.7
                }
              },

              onEachFeature: function (feature, layer) {
              }
            }).addTo(layerGroup).bringToFront()
          }
        })
      }
    )
  }
}


export default Isosurface
