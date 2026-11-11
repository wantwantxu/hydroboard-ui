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
      <div class="chart"  ref="chart"/>
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
      listStRvfcchB: []
    }
  },
  methods: {
    getNew() {
      const queryParam = this.options.queryParam
      Api.getNewRiver({stcdList: [this.options.stcd], ...queryParam}).then((res) => {
        this.newRiver = res.result || {}
      })
      Api.listStRvfcchB({stcd: this.options.stcd}).then((res) => {
        if (res.result.length === 0) {
          this.listStRvfcchB = []
        }
        if (res.result.length > 0) {
          this.listStRvfcchB = res.result[0] || {}
        }
      })
    },

    getZList() {
       const queryParam = this.options.queryParam

      Api.listRiver({stcdList: [this.options.stcd], ...queryParam}).then((res) => {
        const qlineChart = this.$eCharts.init(this.$refs.chart)
        const result = res.result
        var q = []
        var tm = []
        for (var i = 0; i < result.length; i++) {
          const data = result[i]
          q.push(data.q)
          tm.push(dayjs(data.tm).format('MM-DD HH:mm'))
        }
        const waterChart = new SimpleChart(q, tm, qlineChart,50,150)
        let legendconf = {
          legend: {
            data: ['流量']
          }
        }
        waterChart.init('时间', '流量', legendconf)

      })
    }
  },
  watch: {
    options: {
      handler(v) {
        this.getNew()
        this.getZList()
      },
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
