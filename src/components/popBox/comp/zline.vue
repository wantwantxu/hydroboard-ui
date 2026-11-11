<template>
  <div class="tab-con">
    <div class="tit-center">
      <div class="metric-item">
        <p class="metric-label">当前水位</p>
        <p class="metric-value">{{newRiver.z}} m</p>
      </div>
      <div class="border"></div>
      <div class="metric-item">
        <p class="metric-label">当前流量</p>
        <p class="metric-value">{{newRiver.q}}m³/s</p>
      </div>
      <div class="border"></div>
      <div class="metric-item">
        <p class="metric-label">警戒水位</p>
        <p class="metric-value">{{listStRvfcchB.wrz}} m</p>
      </div>
      <div class="border"></div>
      <div class="metric-item">
        <p class="metric-label">保证水位</p>
        <p class="metric-value">{{listStRvfcchB.grz}} m</p>
      </div>
    </div>
    <div class="chart-box">
      <div class="chart" ref="zlineChart" ></div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Api from '@/api'
import dayjs from 'dayjs'
import SimpleChart from '@/components/charts/SimpleChart'

export default {
  props: {
    options: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      newRiver: {},
      listStRvfcchB: [],
      zlineChart: null
    }
  },
  methods: {
    getNew() {
      const queryParam = this.options.queryParam
      Api.getNewRiver({stcdList: [this.options.stcd], ...queryParam}).then((res) => {
        this.newRiver = res.result || {}
      })
    },
    addWrzGrz(waterChart) {
      Api.listStRvfcchB({stcd: this.options.stcd}).then((res) => {
        if (res.result.length > 0) {
          console.log(1)
          console.log(res.result[0])

          const listStRvfcchB = res.result[0] || {}

          this.listStRvfcchB = listStRvfcchB

          const wrz = listStRvfcchB.wrz
          const grz = listStRvfcchB.grz
          const hlz = listStRvfcchB.hlz
          console.log(hlz)
          wrz && waterChart.addWrz(wrz)
          grz && waterChart.addGrz(grz)

          let arr = {
            'ZQ':'HYDROLOGY',
            'ZP':'WATER_LEVEL',
            'ZD':'MOUNTAIN_TORRENTS'
          }
          Api.getMinMax({stcd: this.options.stcd,queryType:arr[this.options.sttp.trim()]}).then(res=>{
            let arr = [wrz,grz,res.result.minZ,res.result.maxZ].filter(item=> item)
            let minZ = Math.min(...arr)
            let maxZ = Math.max(...arr)
            waterChart.setMaxMin({minZ,maxZ})
          })
        } else {
          this.listStRvfcchB = []

        }
      })
    },
    getZList() {
      const queryParam = this.options.queryParam
      let params = {stcdList: [this.options.stcd], ...queryParam}
      Api.listRiver(params).then((res) => {
          if (this.zlineChart) {
            this.zlineChart.dispose()
          }
          this.zlineChart = this.$eCharts.init(this.$refs.zlineChart)
          const result = res.result
          var z = []
          var tm = []
          for (var i = 0; i < result.length; i++) {
            const data = result[i]
            z.push(data.z)
            let yDataTime = dayjs(data.tm).format('MM-DD HH:mm')
            let yData = yDataTime
            tm.push(yData)
          }
          const waterChart = new SimpleChart(z, tm, this.zlineChart)
          let legendconf = {
            legend: {
              data: ['水位', '警戒水位', '保证水位']
            }
          }
          waterChart.init('时间', '水位', legendconf)
          this.addWrzGrz(waterChart)
      })
    }
  },
  watch: {
    options: {
      handler(v) {
        this.getNew()
        this.getZList()
        console.log('水位过程线接口触发。。。。。')
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style type="text/scss" scoped lang="scss">
  .tab-con {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    box-sizing: border-box;
    overflow: hidden;

    .chart-box {
      flex: 1 1 auto;
      min-height: 0;
      position: relative;

      .chart {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
    }

    .tit-center {
      flex: 0 0 auto;
      width: 100%;
      max-width: 100%;
      height: 58px;
      box-sizing: border-box;
      background: rgba(0, 16, 30, 0.72);
      border-radius: 6px;
      border: 1px solid rgba(0, 255, 246, 0.24);
      margin: 0 0 8px;
      display: flex;
      justify-content: space-around;
      align-items: stretch;
      padding: 4px 0;
      overflow: hidden;

      .metric-item {
        flex: 1 1 0;
        min-width: 0;
        overflow: hidden;
      }

      .border {
        flex: 0 0 1px;
        width: 1px;
        margin: 10px 0;
        background: rgba(0, 255, 246, 0.2);
      }

      .metric-label,
      .metric-value {
        margin: 0;
        text-align: center;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei, sans-serif;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .metric-label {
        font-size: 12px;
        line-height: 22px;
        color: rgba(255, 255, 255, 0.72);
        font-weight: 400;
      }

      .metric-value {
        font-size: 14px;
        line-height: 26px;
        color: #00fff6;
        font-weight: 600;
      }
    }
  }
</style>
