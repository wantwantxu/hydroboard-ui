<template>
  <div class="pop-base">
    <div class="pop-hd">
      <span @click="toClose">
        <i class="el-icon-close"></i>
      </span>
      <h3>
        <i class="el-icon-location-information"></i>
        {{ options.dangerareaName }}
      </h3>
    </div>
    <div class="pop-tips">{{ tips }}</div>
    <div class="pop-chart">
      <div class="chart" ref="chart"/>
    </div>
    <div v-if="!isMore" class="pop-more" @click="toMore">查看更多预报&gt;</div>
    <div class="more-chart" v-if="isMore">
      <h3>7天预报</h3>
      <div class="chart" ref="more"/>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {rainType} from '@/assets/js/common'

export default {
  props: {
    options: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      isMore: false,
      chart: null,
      moreChart: null,
      tips: ''
    }
  },
  methods: {
    setTips(mean) {
      let totalRain = 0
      for (var i = 0; i < mean.length; i++) {
        let rain = mean[i]
        totalRain += rain
      }
      let v = rainType(totalRain)['value']
      if (v === 0) {
        this.tips = '未来两小时不会下雨'
      } else if (v === 1) {
        this.tips = '可能有小雨'
      } else if (v === 2) {
        this.tips = '可能有中雨'
      } else if (v === 3) {
        this.tips = '可能有大雨'
      }
    },
    draw(data) {
      this.setTips(data)
      var arr = []
      for (var i = 0; i < data.length; i++) {
        arr.push(rainType(data[i])['value'])
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
          left: '60px',
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
      this.chart = this.$eCharts.init(this.$refs.chart)
      this.chart.setOption(option)
    },
    drawMore(series) {
      series = series.map(group => {
        group.data = group.data.map(o => {
          return rainType(o)['value']
        })
        return group
      })
      let option = {
        tooltip: {
          trigger: 'axis',
          formatter: function (p) {
            let text = []
            let arr = ['无雨', '小雨', '中雨', '大雨']
            p.forEach(o => {
              text.push(o['seriesName'] + '：' + arr[o.value])
            })
            return p[0]['name'] + '<br/>' + text.join('<br/>')
          }
        },
        legend: {
          y: 'bottom',
          textStyle: {
            color: '#00fff6'
          }
        },
        grid: {
          top: '15px',
          left: '60px',
          right: '10px',
          bottom: '45px'
        },
        color: ['rgba(255, 1, 32, .8)', 'rgba(0, 210, 255, .8)', 'rgba(255, 238, 77, .8)'],
        xAxis: {
          type: 'category',
          data: ['今天', '明天', '04/04', '04/05', '04/06', '04/07', '04/08'],
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
        series
      }
      this.moreChart = this.$eCharts.init(this.$refs.more)
      this.moreChart.setOption(option)
    },
    toMore() {
      this.isMore = true
      this.$nextTick(() => {
        this.drawMore([
          {
            name: '最大降水',
            type: 'line',
            data: [15, 2, 0, 0, 13, 2, 8]
          },
          {
            name: '平均降水',
            type: 'line',
            data: [10, 6, 7, 11, 0, 2, 7]
          },
          {
            name: '最小降水',
            type: 'line',
            data: [0, 1, 5, 7, 2, 0, 15]
          }
        ])
      })
    },
    toClose() {
      this.$emit('close')
    }
  },
  watch: {
    options: {
      handler(v) {
        this.isMore = false

        let _this = this
        setTimeout(() => {
          _this.draw(v.mean)
        }, 500);
      },
      immediate: true
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.pop-base {
  padding: 15px 15px 5px;
  box-shadow: 0 0 10px 0 #00fff6;
  background: rgba(0, 16, 30, .9);
  border-radius: 8px;
  color: #fff;
  width: 420px;

  .pop-hd {
    position: relative;
    height: 30px;
    line-height: 30px;

    span {
      float: right;
      color: rgba(0, 252, 255, .7);
      font-size: 24px;
      cursor: pointer;
    }

    h3 {
      color: #fff;
      font-size: 22px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      i {
        color: rgba(0, 252, 255, .7);
      }
    }
  }

  .pop-tips {
    color: #00fff6;
    font-size: 15px;
    padding-left: 25px;
  }

  .pop-chart {
    height: 150px;

    & > .chart {
      height: 100%;
    }
  }

  .pop-more {
    text-align: center;
    font-size: 13px;
    color: rgba(0, 255, 246, .5);
    cursor: pointer;
    margin-bottom: 10px;
  }

  .more-chart {

    h3 {
      font-size: 16px;
      color: #fff;
      line-height: 24px;
    }

    .chart {
      height: 180px;
    }
  }
}
</style>
