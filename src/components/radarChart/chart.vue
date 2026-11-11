<template>
  <div ref="chart" class="chart"></div>
</template>

<script type="text/ecmascript-6">
  import {rainType} from '@/assets/js/common'

  export default {
    props: {
      chartData: {
        type: Object,
        default() {
          return null
        }
      }
    },
    data() {
      return {
        chart: null
      }
    },
    methods: {
      draw(mean) {

        var arr = []
        for (var i = 0; i < mean.length; i++) {
          arr.push(rainType(mean[i])['value'])
        }
        let option = {
          tooltip: {
            trigger: 'axis',
            formatter: function (p) {
              let res = p[0]['name'] + '<br/>'
              return res + ['不会下雨', '可能有小雨', '可能有中雨', '可能有大雨'][p[0]['value']]
            }
          },
          grid: {
            top: '15px',
            left: '30px',
            right: '10px',
            bottom: '30px'
          },
          color: ['rgba(0, 210, 255, .9)'],
          xAxis: {
            type: 'category',
            data: ['现在', '1小时', '2小时'],
            axisLabel: {
              textStyle: {
                color: '#00fff6'
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#00fff6',
                fontSize: '10px'
              },
              formatter: function (v) {
                let texts = []
                if (v === 0) {
                  texts.push('无雨')
                } else if (v === 1) {
                  texts.push('小雨')
                } else if (v === 2) {
                  texts.push('中雨')
                } else if (v === 3) {
                  texts.push('大雨')
                }
                return texts
              }
            },
            splitLine: {
              show: false
            }
          },
          series: [
            {
              data: arr,
              type: 'line'
            }
          ]
        }
        if (!this.chart) {
          this.chart = this.$eCharts.init(this.$refs.chart)
        }
        this.chart.setOption(option)
        this.$nextTick(() => {
          this.chart && this.chart.resize()
        })
      },
      onResize() {
        this.chart && this.chart.resize()
      }
    },
    mounted() {
      window.addEventListener('resize', this.onResize)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.onResize)
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }
    },
    watch: {
      chartData: {
        handler(v) {
          this.$nextTick(() => {
            if (v && v.mean) this.draw(v.mean)
          })
        },
        immediate: true
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .chart {
    width: 100%;
    height: 100%;
    min-height: 5.5rem;
  }
</style>
