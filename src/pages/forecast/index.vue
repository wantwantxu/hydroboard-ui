<template>
  <div class="content">

    <header-area/>

    <legend-box ref="legend"/>

    <right-control @change="mapChange"/>

    <forecast-chart ref="chartRef" :ptimes="xdata" />

    <time-preview ref="timePreviewRef" :ptimes="xdata" />

    <div class="tp-select" v-if="isTime=='minuteLevel'">
      <div class="tps-label">日历</div>
      <div class="tps-value el-form">
        <el-date-picker v-model="times" type="date" style="width: 140px;"
        format="yyyy-MM-dd" value-format="yyyy-MM-dd"
         @change="timesChange" placeholder="选择日期"></el-date-picker>
         <el-select v-model="timess" @change="timesChange" style="width: 100px;" placeholder="选择时间" >
            <el-option label="08:00" value="08:00"/>
            <el-option label="20:00" value="20:00"/>
          </el-select>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

import headerArea from '@/components/header'

import legendBox from '@/components/legend'

import rightControl from '@/components/rightControl'

import forecastChart from '@/components/forecastChart'

import timePreview from '@/components/timePreview/index.vue'

import dayjs from 'dayjs'

export default {

  components: {
    headerArea,
    legendBox,

    rightControl,
    forecastChart,
    timePreview
  },

  data() {
    return {

      mapOptions: {
        trend: false,
        model: 1,
        forecastType: 2,
        type: 2006,
        level: false,
        location: '',
        grid: false
      },
      chartShow: false,

      times: dayjs().format('YYYY-MM-DD'),
      timess: '08:00',
      xdata: '' ,
      isTime:''
    }
  },

  mounted() {

    if( window&&window.mpPlugin) {
      window.mpPlugin.isosurface().clearLayer()
    }

    this.$refs.legend.set(2006)

    this.timesChange()

    this.initChart()
    window.eventBus.$on('isTime', (b) => {
      console.log('b', b)
      this.isTime = b
    })
  },

  methods: {

    initChart() {
      try {
        const dict = window.dict || window.dicts || {}
        const raw = dict.CenterPointCoordinates && dict.CenterPointCoordinates[0] && dict.CenterPointCoordinates[0].value
        const coordinates = raw ? JSON.parse(raw) : [30.65, 104.06]
        const lat = Number(coordinates[0]) || 30.65
        const lng = Number(coordinates[1]) || 104.06
        this.drawChart(lat, lng)
        if (window.mpPlugin && window.mpPlugin.forecastLayer) {
          window.mpPlugin.forecastLayer().showLocate({ lat, lng })
          window.mpPlugin.forecastLayer().initListener((e) => {
            const itm = e.latlng
            this.drawChart(itm.lat, itm.lng)
          })
        }
      } catch (e) {
        console.warn('综合服务图表初始化失败，使用默认中心点', e)
        this.drawChart(30.65, 104.06)
      }
    },

    drawChart(lat, lng) {

      this.$nextTick(() => {

        this.$refs.chartRef.getGeocoder(lat, lng)

        this.$refs.chartRef.getToggle(lat, lng)
      })

    },

    mapChange(option) {

      this.$nextTick(() => {
        this.$refs.timePreviewRef.sing(option)
      })
    },

    changepanelRight(v) {

      this.mapOptions['source'] = v

      console.log('修改成第' + v + '个地图源')
    },

    popShow(data) {

    },

    popClose() {

    },

    timesChange() {

      console.log('this.times', this.times)

      console.log('this.timess', this.timess)

      this.xdata = this.times + ' ' + this.timess
    }
  },
  destroyed() {

    if( window&&window.mpPlugin) {
      window.mpPlugin.isosurface().clearLayer()
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  .area-left {
    position: absolute;
    z-index: 502;
    top: var(--panel-top, 6.25rem);
    left: var(--panel-gap, 1.25rem);
    width: 21.5625rem;
  }
  .tp-select{
    position: fixed;
    top:var(--panel-top, 6.25rem);
    left: 50%;
    z-index: 999;
    display: flex;
    align-items: center;
    .tps-label{
      height: 36px;
        background: rgba(0,255,246,.8);
        color:#333;
        font-size: 16px;
        border:1px solid #00fff6;
        border-radius: 3px 0 0 3px;
        line-height: 36px;
        padding: 0 8px;
        font-weight: bold;
    }
    .tps-value{
        border:1px solid #00fff6;
        border-radius:0 5px 5px 0;
        font-weight: bold;
        background: rgba(0,16,30,.8);
        display: flex;
        align-items: center;
    }
  }
</style>
