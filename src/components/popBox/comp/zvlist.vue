<template>
  <div class="tab-con">
    <div class="chart-box">
      <div class="chart" ref="zvLineChartRef"></div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Api from '../../../api'
import SimpleChart from '../../charts/SimpleChart'

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
      zvlist: [],
      zvLineChart: null
    }
  },
  methods: {
    getList() {
      Api.listZvarl({stcd: this.options.stcd}).then((res) => {
        if (!this.$refs.zvLineChartRef) return
        if (this.zvLineChart) {
          this.zvLineChart.dispose()
        }
        this.zvLineChart = this.$eCharts.init(this.$refs.zvLineChartRef)
        const result = res.result || []
        var rz = []
        var w = []
        for (var i = 0; i < result.length; i++) {
          const data = result[i]
          rz.push(data.rz)
          w.push(data.w)
        }
        const simpleChart = new SimpleChart(rz, w, this.zvLineChart)
        let legendconf = {
          legend: {
            data: ['水位']
          }
        }
        simpleChart.init('库容(万m³)', '水位(m)', legendconf)
        this.$nextTick(() => {
          this.zvLineChart && this.zvLineChart.resize()
        })
      })
    }
  },
  watch: {
    options: {
      handler() {
        this.getList()
      },
      immediate: true
    }
  },
  beforeDestroy() {
    if (this.zvLineChart) {
      this.zvLineChart.dispose()
      this.zvLineChart = null
    }
  }
}
</script>
<style type="text/css" scoped lang="scss">
  .tab-con {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    box-sizing: border-box;

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
  }
</style>
