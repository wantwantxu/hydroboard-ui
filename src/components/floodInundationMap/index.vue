<template>
  
  <div class="timeLine">
    <div class="btn" v-if="isPlay" @click="play"><img src="/static/svg/play.svg" alt=""></div>
    <div class="btn" v-if="!isPlay" @click="pause"><img src="/static/svg/pause.svg" alt=""></div>
    <div class="btn" @click="next"><img src="/static/svg/next.svg" alt=""></div>
    <div>
      <ul>
        <li
          v-for="(item, index) in timeLineList"
          :key="index"
          :class="{ active: index === active }"
        >
          <div class="ss-popover" :style="'left: '+item.schedule+'%'">
            <div>{{ item.timestamp }}</div>
          </div>
        </li>
      </ul>
      <ul>
        <li
          v-for="(item, index) in timeLineList"
          :key="index"
          :class="{ active: index === active }"
          @click="toggleS(item,index)"
        >
          <p>{{ item.info }} 年</p>
        </li>
      </ul>
    </div>
    <div class="btn" @click="back">
      <img src="/static/svg/back.svg" alt="">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

import headerArea from '@/components/header'
import popBox from '@/components/popBox'
import legendBox from '@/components/legend'
import rightLayer from '@/components/rightLayer'

import eventBus from '@/eventBus'
import Api from './../../api'
import * as L from 'leaflet'
import appService from '@/store/services/appService'

const dict = appService.getAllDicts()
export default {
  components: {
    headerArea,
    popBox,
    legendBox,
    rightLayer
  },
  data() {
    return {
      isPopShow: false,
      mapOptions: {},
      active: 0,
      timeLineList: [
        {
          timestamp: '5年',
          color: '#999',
          fontsize: 18,
          size: '28',
          bgcolor: 'yellow',
          icon: 'el-iconprev',
          year: '2012',
          info: '5',
          schedule: 0,
          id: '6159218363eca09cb5cd5ba7b4e602c0'
        },
        {
          timestamp: '10年',
          color: '#999',
          fontsize: 18,
          size: '28',
          bgcolor: 'orange',
          year: '2013',
          info: '10',
          schedule: 0,
          id: '3569404391a327b6dd92b03ad1ebd0d3'
        },
        {
          timestamp: '20年',
          color: '#999',
          fontsize: 18,
          size: '28',
          bgcolor: 'red',
          year: '2014',
          info: '20',
          schedule: 0,
          id: '0bb930da7bfd9877e7fdd9114fb273d8'
        },
        {
          timestamp: '50年',
          color: '#999',
          fontsize: 18,
          year: '2015',
          size: '28',
          bgcolor: 'purple',
          info: '50',
          schedule: 0,
          id: '3a16ca06019022d7c99718b476e81a74'
        }

      ],
      bondarylayer: '',
      time: '',
      index: 0,
      isPlay: true
    }
  },
  mounted() {

    this.getFeatureWfs('5')

    this.pictureFlood('6159218363eca09cb5cd5ba7b4e602c0')
  },
  methods: {
    toggleS(obj, i) {
      this.active = i

      this.getFeatureWfs(obj.info)

      this.pictureFlood(obj.id)
    },

    mapChange(option) {
      this.mapOptions = Object.assign({}, this.mapOptions, option)
      this.popClose()

    },

    mapDataChange(option) {
      this.mapOptions = Object.assign({}, this.mapOptions, option)
      this.popClose()
    },

    popShow(data) {
      this.isPopShow = true

    },

    popClose() {

      eventBus.$on('isPopShow', (b) => {
        this.isPopShow = b
        this.removeGeoJSON()

        window.mpPlugin.floodInundationImage().clearLayer()
      })
    },

    getFeatureWfs(typeName) {
      const wmsServices = JSON.parse(dict.wmsServices[0].value)

      if (wmsServices.floodIP !== undefined && wmsServices.floodIP !== '') {
        return
      }
      let obj = {
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'demo:main_river_' + typeName,
        maxFeatures: '50',
        outputFormat: 'application/json'
      }
      Api.getFeatureWfs(wmsServices.loadAreaServices, obj).then((res) => {
        if (res.features.length > 0) {
          this.geoJSON(res.features[0])
        }
      })
    },
    geoJSON(data) {
      let that = this
      this.removeGeoJSON()
      this.bondarylayer = L.geoJSON(data, {
        style: {
          color: that.timeLineList[that.active].bgcolor ? that.timeLineList[that.active].bgcolor : '#FF2A2C',
          fillOpacity: 0.6,
          weight: 1
        },
        pane: 'overlayPane'
      })
      window.map.addLayer(this.bondarylayer)
    },
    removeGeoJSON() {
      if (this.bondarylayer !== '') {
        window.map.removeLayer(this.bondarylayer)
        this.bondarylayer = ''
      }
    },
    play() {
      this.isPlay = false
      let length = this.timeLineList.length
      if (this.time !== '') {
        clearInterval(this.time)
        this.time = ''
      }
      this.time = setInterval(() => {
        if (this.index < length) {
          this.active = this.index

          this.getFeatureWfs(this.timeLineList[this.index].info)

          this.pictureFlood(this.timeLineList[this.index].id)
          this.index = parseFloat(this.index) + 1
        } else {
          clearInterval(this.time)
          this.time = ''
          this.index = 0
          this.active = this.index
          this.isPlay = true

          this.getFeatureWfs(this.timeLineList[this.index].info)

          this.pictureFlood(this.timeLineList[this.index].id)
        }
      }, 5000)
    },
    back() {
      let length = this.timeLineList.length
      if (this.index >= length) {
        this.index = 0
      }
      this.index = parseFloat(this.index) + 1
      this.play()
    },
    next() {
      let _this = this
      if (_this.time !== '') {
        clearInterval(_this.time)
        _this.time = ''
      }
      let length = _this.timeLineList.length
      if (_this.index <= 0) {
        _this.index = length - 1
      }
      this.time = setInterval(() => {
        if (_this.index > 0) {
          this.active = _this.index

          _this.getFeatureWfs(_this.timeLineList[_this.index].info)

          this.pictureFlood(this.timeLineList[this.index].id)
          _this.index = parseFloat(_this.index) - 1
        } else {
          clearInterval(this.time)
          this.time = ''
          this.index = 0
          this.active = this.index
          this.isPlay = true

          this.getFeatureWfs(this.timeLineList[this.index].info)

          this.pictureFlood(this.timeLineList[this.index].id)
        }
      }, 5000)
    },
    pause() {
      this.isPlay = true
      clearInterval(this.time)
      this.time = ''
    },

    pictureFlood(id) {
      if (dict.wmsServices == undefined && dict.wmsServices == '') {
        return
      }
      let wmsServices = JSON.parse(dict.wmsServices[0].value)
      if (wmsServices.floodIP == undefined && wmsServices.floodIP == '') {
        return
      }

      window.mpPlugin.floodInundationImage().datasetId = id
      window.mpPlugin.floodInundationImage().getData()
    }
  },
  destroyed() {

    window.mpPlugin.floodInundationImage().clearLayer()
    if (this.time !== '') {
      clearInterval(this.time)
      this.time = ''
    }
    this.removeGeoJSON()
  },


}
</script>

<style type="text/scss" lang="scss" scoped>
.area-left {
  position: absolute;
  z-index: 502;
  top: 100px;
  left: 30px;
  width: 345px;
}

.timeLine p,
.timeLine ul,
.timeLine li {
  margin: 0;
  padding: 0;
}

.timeLine {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 999;
  width: 820px;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  border-radius: 4px;
}

.timeLine .btn {

  width: 30px;
  height: 30px;

  border-radius: 50%;

  cursor: pointer;
}

.timeLine .btn img {
  display: block;
  width: 30px;
  height: 30px;
}

.timeLine ul {
  list-style: none;
  display: flex;
  margin-top: 10px;
}

li {
  width: 140px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, .2);
  border-top: 1px solid rgba(0, 0, 0, .5);
  border-right: 1px solid rgba(0, 0, 0, .5);
  border-bottom: 1px solid rgba(0, 0, 0, .5);
  position: relative;
}

.timeLine ul li p {
  height: 40px;
  line-height: 40px;
  text-align: center;
  text-decoration: none;
  color: #00fff6;
  font-size: 16px;
  font-weight: 600;
}

.timeLine ul li.active {
  background-color: rgba(0, 0, 0, .5);
  border-top: 1px solid rgba(0, 0, 0, .5);
  border-bottom: 1px solid rgba(0, 0, 0, .5);
}

.timeLine ul li.active p {
  color: #fd0;
}

span {
  color: #1989fa;
}

.ss-popover {
  position: absolute;
  top: -4px;
  left: 0;
  margin-left: -4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid #006fff;
  background: #00fff6;
  color: #fff;
  display: none;
}

.timeLine ul li.active .ss-popover {
  display: block;
}

.ss-popover div {
  position: absolute;
  bottom: 30px;
  left: 0;
  width: 140px;
  padding: 5px;
  border-radius: 4px;
  text-align: center;
  background: #fd0;
  margin-left: -70px;
  color: #000;
}

.ss-popover div::after {
  content: '';
  display: block;
  clear: both;
  border-top: 10px solid #fd0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid transparent;
  position: absolute;
  left: 60px;
  bottom: -15px;
}
</style>
