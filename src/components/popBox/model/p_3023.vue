<template>
  <div class="pop-base">
    <div class="pop-hd">
      <span @click="toClose">
        <i class="el-icon-close"/>
      </span>
      <h3>
        <i class="el-icon-location-information"/>
        {{ options.stnm }}
      </h3>
    </div>
    <ul class="tab">
      <li v-for="(item,index) in tabList" :key="index" :class="{active:index === tabCur}"
          @click="tabClick(index)">
        {{ item }}
      </li>
    </ul>
    <div class="tab-con" v-show="tabCur<3">
      <div class="chart" ref="chart"/>
    </div>
    <div class="tab-con" v-if="tabCur==3">
      <ul class="details">
        <li><span>站点编号：</span>{{ options.stcd }}</li>
        <li><span>站点名称：</span>{{ options.stnm }}</li>
        <li><span>所属地区：</span>--</li>
        <li><span>所属河道：</span>{{ options.rvnm }}</li>
        <li><span>河道长：</span>--km</li>
        <li><span>汇流面积：</span>--k㎡</li>
        <li><span>河源位置：</span>--</li>
        <li><span>流域内人口：</span>--万人</li>
        <li><span>河流级别：</span>--</li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  formatDate
} from '@/assets/js/common'
import Api from '@/api'
import dayjs from 'dayjs'
import {charts} from './p_3023'

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
      tabList: ['降雨曲线图', '实测流量过程图', '预报流量过程图', '基础信息'],
      tabCur: 0,
      chart: null,
      chartData: [],
      rsvrInfo: {}
    }
  },
  methods: {
    init(data) {
      console.log(this.options)
      this.tabCur = 0
      this.rsvrInfo = this.options.rsvrInfo || {}
      this.getChartData()
    },
    formatDateTime(datetime) {
      return formatDate(new Date(datetime), 'yyyy/MM/dd hh:mm:ss')
    },
    draw_0() {
      Api.getRtRainList({riverBasinId: '607HJ007'}).then((rtRainRes) => {
        const rtRain = rtRainRes.result
        Api.getNcMeanList({riverBasinId: '607HJ007'}).then((ncMeanRes) => {
          const ncMean = ncMeanRes.result
          let hours = []
          let rainDatas = []
          let ncDatas = []
          for (const date in rtRain) {
            for (let hour in rtRain[date]) {
              let rain = rtRain[date][hour]
              const tm = date.concat(' ', hour)
              const key = dayjs(tm).format('MMDDHH')
              const mdh = dayjs(tm).format('MM-DD HH')

              if (!dayjs(key).isValid()) {
                continue
              }
              hours.push(mdh)
              if (rain > 100) {
                rain = Math.floor(rain)
              } else {
                rain = Math.floor(rain * 10) / 10
              }
              rainDatas.push(rain)
            }
          }
          for (let k = 0; k < ncMean.length; k++) {
            const nc = ncMean[k]
            const tm = nc.tm
            const mean = nc.mean
            const mdh = dayjs(tm).format('MM-DD HH')
            if (hours.length > 0 && hours.length < k) {
              if (mdh === hours[k]) {
                ncDatas.push(mean)
              }
            } else {
              hours.push(mdh)
              ncDatas.push(mean)
            }
          }

          console.log(hours)
          const x = [{data: hours}]
          const y = [
            {
              name: '实测雨量(mm)',
              min: 0,
              max: 50,
              data: rainDatas,
              type: 'bar',
              color: '#91CC75',
              position: 'right',
              formatter: '{value}'
            },
            {
              name: '预测雨量(m3/s)',
              min: 0,
              max: 500,
              data: ncDatas,
              color: '#5470C6',
              type: 'line',
              position: 'left',
              formatter: '{value}'
            }
          ]
          charts().draw(this.$refs.chart, {x, y})
        })
      })
    },
    draw_1() {
      Api.getRtProcessList({riverBasinId: '607HJ007'}).then((res) => {
        const result = res.result
        let tm = []
        let data = []
        for (let k = 0; k < result.length; k++) {
          const d = result[k]
          data.push(d.sum)
          tm.push(d.tm)
        }
        const x = [{data: tm}]
        const y = [
          {
            name: '实测流量(m3/s)',
            min: 0,
            max: 50,
            data: data,
            type: 'line',
            color: '#91CC75',
            position: 'left',
            formatter: '{value}'
          }
        ]
        charts().draw(this.$refs.chart, {x, y})
      })
    },
    getOptions(process, netrain) {
      let hours = []
      let flowDatas = []
      let rainDatas = []
      let col = 0
      for (let k = 0; k < netrain.length; k++) {
        const rowNetrain = netrain[k]
        const date = rowNetrain.tm
        const mdh = dayjs(date).format('MM-DD HH')
        let rain = rowNetrain.mean

        if (rain === null) {
          continue
        }
        const flowRow = process[col]
        flowDatas.push(flowRow.sum)
        hours.push(mdh)
        if (rain > 100) {
          rain = Math.floor(rain)
        } else {
          rain = Math.floor(rain * 10) / 10
        }
        rainDatas.push(rain)
        col++
      }

      const x = [{data: hours}, {data: hours}]
      const y = [
        {
          name: '逐时流量(m3/s)',
          min: 0,
          max: 500,
          data: flowDatas,
          color: '#5470C6',
          type: 'line',
          position: 'left',
          inverse: false,
          formatter: '{value}'
        },
        {
          name: '逐时雨量(mm)',
          min: 0,
          max: 50,
          data: rainDatas,
          type: 'bar',
          color: '#91CC75',
          position: 'right',
          inverse: true,
          formatter: '{value}'
        }
      ]
      return {x, y}
    },
    draw_2() {
      Api.getProcessList({riverBasinId: '607HJ006'}).then((processRes) => {
        Api.getNcMeanList({riverBasinId: '607HJ006'}).then((netrainRes) => {
          const process = processRes.result
          const netrain = netrainRes.result
          charts().draw(this.$refs.chart, this.getOptions(process, netrain))
        })
      })
    },
    _draw(option) {
      this.chart = this.$eCharts.init(this.$refs.chart)
      this.chart.setOption(option, true)
    },
    getChartData() {
      console.log('获取图表数据')
      this['draw_' + this.tabCur]()
    },
    toClose() {
      this.$emit('close')
    },
    tabClick(idx) {
      this.tabCur = idx
      if (idx < 3) {
        this.$nextTick(() => {
          this['draw_' + idx]()

        })
      } else {
        this.chart = null
      }
    },
    _top(v) {
      return 'top:' + ((this.options.crest - v) * 100 / this.options.crest) + '%'
    }
  },
  watch: {
    options: {
      handler(v) {
        this.$nextTick(() => {
          this.init(v)
        })
      },
      immediate: true
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.pop-base {
  padding: 15px 0 5px;
  box-shadow: 0 0 10px 0 #00fff6;
  background: rgba(0, 16, 30, .9);
  border-radius: 8px;
  color: #fff;
  width: 490px;
  overflow: auto;

  .pop-hd {
    position: relative;
    height: 30px;
    line-height: 30px;
    margin: 0 15px 10px;

    span {
      float: right;
      color: rgba(0, 252, 255, .7);
      font-size: 24px;
      cursor: pointer;
    }

    h3 {
      color: #fff;
      font-size: 22px;

      i {
        color: rgba(0, 252, 255, .7);
      }
    }
  }

  .chart {
    height: 300px;
  }

  .tab {
    background: rgba(0, 255, 246, .15);
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-color: rgba(0, 255, 246, .15);
    height: 30px;
    display: flex;

    li {
      padding: 0 15px;
      color: #00fff6;
      font-size: 15px;
      line-height: 30px;
      cursor: pointer;

      &.active {
        background: rgba(0, 16, 30, .8);
      }
    }
  }

  .info {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    padding: 10px 15px 0;

    li {
      width: 50%;
      font-size: 15px;
      color: #fff;
      height: 25px;
      line-height: 25px;
    }
  }

  .tab-con {
    height: 320px;
  }

  .details {
    padding: 15px 25px;
    font-size: 15px;
    line-height: 24px;

    li {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: #00fff6;
    }

    span {
      color: #fff;
      display: inline-block;
      width: 90px;
      text-align: right;
    }
  }
}

.pd15 {
  padding: 15px;
}

.profile {
  background: url('/static/img/pmt_bg.png') no-repeat center;
  background-size: cover;
  width: 100%;
  height: 290px;
  position: relative;

  &:after {
    background: url('/static/img/bottom.png') repeat-x center;
    content: '';
    height: 5px;
    position: absolute;
    z-index: 25;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .profile-top {
    position: absolute;
    top: 10px;
    left: 30px;

    .pt-time {
      color: #333;
      font-family: 'hb-digit';
      line-height: 18px;
    }

    .pt-tips {
      font-size: 12px;

      span {
        color: #416fff;
        margin-right: 15px;
      }
    }
  }

  .profile-main {
    height: 145px;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    z-index: 10;
  }

  &-sk {
    background: url('/static/img/pmt_sk.png') no-repeat center bottom;
    background-size: 100% 100%;
    position: absolute;
    z-index: 15;
    right: 0;
    bottom: 0;
    height: 145px;
    width: 417px;

    .sk-h {
      position: absolute;
      left: 0;
      top: -30px;
      text-align: center;
      color: #333;
      font-size: 12px;
      right: 0;
    }

    .line {
      position: absolute;
      border-bottom: 2px solid;
      height: 18px;
      line-height: 18px;
      width: 110px;
      transform: translateY(-20px);

      span {
        position: absolute;
        right: 0;
        bottom: 0;
        transform: scale(.8);
        color: inherit;
        white-space: nowrap;
      }

      &.line1 {
        border-color: #ae00ff;
        color: #ae00ff;
      }

      &.line2, &.line3 {
        border-color: #f00;
        color: #f00;
      }

      &.line1, &.line2 {
        right: 201px;
        text-align: right;

        span {
          transform-origin: 100% 100%;
        }
      }

      &.line3 {
        border-color: #f00;
        color: #f00;
        left: 217px;

        span {
          left: 0;
          right: auto;
          transform-origin: 0 100%;
        }
      }
    }

  }

  &-water {
    background: url('/static/img/waterflow.png') no-repeat center;
    position: absolute;
    z-index: 10;
    background-size: 100% 100%;
    bottom: 0;
    right: 201px;
    left: 0;

    .line {
      position: absolute;
      top: -20px;
      border-bottom: 2px solid #0000ff;
      text-align: right;
      font-size: 12px;
      width: 110px;
      height: 18px;
      line-height: 18px;

      span {
        color: #00f;
        display: inline-block;
        transform-origin: 100% 100%;
        transform: scale(.8);
      }
    }
  }

  &-hd {
    height: 160px;
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;

    &:before {
      content: '';
      position: absolute;
      z-index: 15;
      background: url('/static/img/pmt_hl.png') no-repeat center;
      background-size: 100% 100%;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .profile-water {
      left: 0;
      right: 0;
      top: 50px;

      .line {
        left: 50%;
        transform: translateX(-50%);
        text-align: center;

        span {
          transform-origin: 50% 50%;
        }
      }
    }

    .line1, .line2 {
      position: absolute;
      border-bottom: 2px solid;
      height: 18px;
      line-height: 18px;
      width: 120px;
      z-index: 16;
      transform: translateY(-20px);

      span {
        position: absolute;
        bottom: 0;
        transform: scale(.8);
        color: inherit;
        white-space: nowrap;
      }
    }

    .line1 {
      border-color: #ae00ff;
      color: #ae00ff;
      left: 0;

      span {
        right: 0;
        transform-origin: 100% 100%;
      }
    }

    .line2 {
      right: 0;
      border-color: #f00;
      color: #f00;

      span {
        left: 0;
        transform-origin: 0 100%;
      }
    }
  }
}
</style>
