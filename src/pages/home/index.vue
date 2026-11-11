<template>
  <div class="content" :class="{ 'has-area-right': areaShow, 'is-area-min': areaMin }">
    
    <header-area/>
    
    <layer-control ref="layer" @change="layerChange"/>
    
    <panel-right @change="changepanelRight"/>
    
    <sub-icon ref="subIcon" @close="layerClose" @changeArea="areaRightChange"/>
    
    <area-right :areaShow="areaShow" :isPopShow="isPopShow" ref="area" @sizeChange="areaSizeChange" @pop="popShow"/>
    
    <legend-box ref="legend" :checked="checkedList"/>
    
    
    
    <time-area :timeShow="timeShow"/>
    
    <flood-inundation-map v-if="floodShow" ref="floodMap"/>
    <water-resources-statis ref="waterResourcesStatis" @close="waterResourcesClose"></water-resources-statis>
  </div>
</template>

<script type="text/ecmascript-6">
import headerArea from '@/components/header'
import layerControl from '@/components/layerControl'
import panelRight from '@/components/panelRight'
import legendBox from '@/components/legend'
import areaRight from '@/components/areaRight'
import subIcon from '@/components/subIcon'
import timeArea from '@/components/timeArea'
import RainstormArea from '../../components/map/leaflet/layers/RainstormArea'
import {formatDate} from '@/assets/js/common'
import warning from '../warning'
import BaseMap from '../../components/map/leaflet/BaseMap'
import waterResourcesStatis from '../../components/waterResources/statis'
import floodInundationMap from '@/components/floodInundationMap'
import WordPreview from '@/components/wordPreview'
import DailyMaintenanceDetail from '@/components/dailyMaintenanceDetail'
import AddMaintenance from  '@/components/dailyMaintenanceDetail/addMaintenance'


export default {
  components: {
    headerArea,
    layerControl,
    panelRight,
    legendBox,
    areaRight,
    subIcon,
    timeArea,
    warning,
    waterResourcesStatis,
    floodInundationMap
  },
  data() {
    return {
      warnAudio: new URL('@/assets/warn.mp3', import.meta.url).href,
      checkedList: [],
      mapOptions: {
        source: 3,
        windWavePot: '',
        hours: '',
        moon: false,
        radar: false,
        weather: false,
        potList: []
      },
      openDanger: false,
      areaShow: false,
      areaMin: false,
      isPopShow: false,
      timeShow: false,
      floodShow: false,
      formData: {
        date: [],
        type: ''
      },
      dangerArr: [],
      closeMusic: true,
      timer: null,
      show:false
    }
  },
  async mounted() {
    this.$nextTick(() => {

      if( window&&window.mpPlugin){
        window.mpPlugin.clearAll()

      }

      window.eventBus.$on('isPopShow', (b) => {
        this.isPopShow = b
      })
      window.eventBus.$on('waterResourcesShow', (b) => {
        this.$refs.waterResourcesStatis.visible = true
      })
    })
  },
  methods: {
    close(data) {
      this.openDanger = !data
    },


    initIsosurface() {
      let e = new Date()
      if (new Date().getHours() > 8) {

        this.formData['date'] = [
          formatDate(e, 'yyyy-MM-dd 08:00:00'),
          formatDate(e, 'yyyy-MM-dd hh:mm:ss')
        ]
      } else {
        let y = new Date(new Date().setDate(new Date().getDate() - 1))
        this.formData['date'] = [
          formatDate(y, 'yyyy-MM-dd 08:00:00'),
          formatDate(e, 'yyyy-MM-dd hh:mm:ss')
        ]
      }

    },
    getWsData(res) {
      if (res && res instanceof Array) {
        let dangerNumber = res.length
        this.$store.state.dangerArr = res
        this.$store.state.dangerTableData = res
        if (dangerNumber > 0) {
          window.mpPlugin.dangerOutPoint().showPoint(this.$store.state.dangerArr)
          if (dangerNumber !== this.$store.state.dangerNumber) {

            this.$store.state.dangerNumber = dangerNumber
          }
        } else {
          this.$store.state.dangerNumber = 0
          window.mpPlugin.dangerOutPoint().clearLayer()
        }
      }
    },

    layerChange(val, checked) {
      const isJoin = !!checked
      const idx = this.checkedList.indexOf(val)
      if (isJoin && idx === -1) {
        this.checkedList.push(val)
      } else if (!isJoin && idx !== -1) {
        this.checkedList.splice(idx, 1)
      }
      this.popClose()
      this.$refs.subIcon.set(val, isJoin)
      switch (val) {

        case 1001:
          console.log('实时雨情' + (isJoin ? '显示' : '去除'))
          !isJoin && window.mpPlugin.rainPoint().clearLayer()
          this.$refs.legend.set(val, isJoin)
          break
        case 1002:
          console.log('实时水情' + (isJoin ? '显示' : '去除'))
          !isJoin && window.mpPlugin.waterPoint().clearLayer()
          this.$refs.legend.set(val, isJoin)
          break
        case 1003:
        case 1004:
              break
        case 1005:
          console.log('天气实况 卫星云图 气象雷达' + (isJoin ? '显示' : '去除'))
          if (isJoin) {
            window.mpPlugin.meteorology().weatherRadar()
            return
          }
          window.mpPlugin.meteorology().clearLayerOfWeatherRadar()
          break
        case 1006:
          console.log('降雨分布' + (isJoin ? '显示' : '去除'))
          !isJoin && window.mpPlugin.isosurface().clearLayer()
          break
        case 1007:
          console.log('水情预警' + (isJoin ? '显示' : '去除'))
          !isJoin && window.mpPlugin.waterWarningPoint().clearLayer()
          break
        case 6001:
          console.log('水质' + (isJoin ? '显示' : '去除'))
          break
        case 2002:
          console.log('雷达测雨' + (isJoin ? '显示' : '去除'))
          this.$refs.legend.set(val, isJoin)
          break
        case 2003:
          if (isJoin) {
            window.mpPlugin.meteorology().rainFall24()
            return
          }
          window.mpPlugin.meteorology().clearLayer()
              break
        case 2004:
          if (isJoin) {
            window.mpPlugin.meteorology().rainFall48()
            return
          }
          window.mpPlugin.meteorology().clearLayer()
          break
        case 2005:
          console.log('降雨' + (isJoin ? '显示' : '去除'))
          if (isJoin) {
            window.mpPlugin.meteorology().rainFall72()
            return
          }
          window.mpPlugin.meteorology().clearLayer()
          this.$refs.legend.set(val, isJoin)
          break
        case 2006:
          if (isJoin) {
            RainstormArea.createLayer(window.map)
            RainstormArea.loadData()
          }
          console.log('降雨落区' + (isJoin ? '显示' : '去除'))
          this.$refs.legend.set(val, isJoin)
          break
        case 2007:
          console.log('风场' + (isJoin ? '显示' : '去除'))
          this.$refs.legend.set(val, isJoin)
          break
        case 2008:
          console.log('浪场' + (isJoin ? '显示' : '去除'))
          this.$refs.legend.set(val, isJoin)
          break
        case 2009:
          console.log('副高' + (isJoin ? '显示' : '去除'))
          this.$refs.legend.set(val, isJoin)
          break
        case 3001:
          !isJoin && window.mpPlugin.dangerAreaPoint().clearLayer()
          break
        case 3002:
        case 3003:
          !isJoin && window.mpPlugin.reservoirPoint().clearLayer()
          break
        case 3004:
          !isJoin && window.mpPlugin.hydroelectricStationPoint().clearLayer()
              break
        case 3005:
          !isJoin && window.mpPlugin.hexinzhouislandPoint().clearLayer()
              break
        case 3006:
        case 3008:
        case 3009:
        case 3010:
        case 3011:
        case 3012:
        case 3013:
        case 3014:
        case 3015:
        case 3016:
        case 3017:
        case 3018:
        case 3022:
          break
        case 3023:
        case 3024:
          console.log('关注对象' + (isJoin ? '显示' : '去除'))
          this.$refs.legend.set(val, isJoin)
          break
        case 4001:
          console.log('人口普查' + (isJoin ? '显示' : '去除'))
          this.$refs.legend.set(val, isJoin)
          break
        case 5001:
          console.log('合理性分析' + (isJoin ? '显示' : '去除'))
          this.$refs.legend.set(val, isJoin)
          break
        case 7001:
          console.log('洪水淹没' + (isJoin ? '显示' : '去除'))
          this.floodShow = isJoin
          break
        case 9999:
          this.shwo=!this.shwo
          this.areaShow = this.shwo
          break
      }
      if (!isJoin) {
      }

      if(val && val > 999000){
        this.jiChuTuCengAPI(val,isJoin)
      }
    },
    
    jiChuTuCengAPI(val,is){
      console.log('val',val)
      let layerList = JSON.parse(window.dict.layerController[0].value)
      layerList.forEach(item => {
          item.children.forEach(list => {
              if(list.value == val){
                  BaseMap.APIloadlayers(list,is)
              }
          });
      });
    },

    layerClose(val) {
      this.$refs.layer.change(val)
    },
    waterResourcesClose(val){
      this.$refs.waterResourcesStatis.visible = false
      this.$refs.layer.change(val)
    },

    areaRightChange(val) {
      if (val) {
        console.log('右侧视图修改', val)
        this.timeShow = (val === 1006) ? !this.timeShow : false
        let noData = [1003, 1006, 2006, 7001]
        if (noData.indexOf(val) === -1) {
          this.areaShow = true
          this.areaMin = false
          this.$refs.area.set(val)
        } else {
          this.areaShow = false
        }
      } else {
        this.timeShow = false
        this.areaShow = false
      }
    },

    areaSizeChange(isMin) {
      this.areaMin = isMin
    },

    popShow(data) {
      this.isPopShow = true

    },

    popClose() {

    },

    changepanelRight(v) {
      this.mapOptions['source'] = v
      console.log('修改成第' + v + '个地图源')
    },
    openMaintenanceDetil(data){
      this.$refs.maintenanceDetail.isShow = true
      this.$refs.maintenanceDetail.getDetailInfo(data)
    },
    openAddMaintenance(){
      this.$refs.addMaintenance.isShow = true
    }
  },

   created() {

    let e = new Date()
    if (new Date().getHours() > 8) {

      this.formData['date'] = [
        formatDate(e, 'yyyy-MM-dd 08:00:00'),
        formatDate(e, 'yyyy-MM-dd hh:mm:ss')
      ]
    } else {
      let y = new Date(new Date().setDate(new Date().getDate() - 1))
      console.log(y)
      this.formData['date'] = [
        formatDate(y, 'yyyy-MM-dd 08:00:00'),
        formatDate(e, 'yyyy-MM-dd hh:mm:ss')
      ]
    }
  },
  destroyed() {
    clearInterval(this.timer)

    if( window&&window.mpPlugin){
      window.mpPlugin.clearAll()

    }
  },

}
</script>

<style type="text/scss" lang="scss" scoped>
  .dangerBtn{
    width: 160px;
    position: absolute;

    bottom: 1rem;
    left: 1rem;
    cursor: pointer;
    >span{
      position: absolute;
      left: 0;
      width: 100%;
      text-align: center;
    }
    img{
      display: block;
      width: 100%;
      height: 100%;
    }

  }
</style>
