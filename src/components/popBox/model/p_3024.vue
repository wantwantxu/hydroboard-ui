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
      <li v-for="(item,index) in tabList" :key="index" :class="{active:index === tabCur}" @click="tabClick(index)">
        {{ item }}
      </li>
    </ul>
    <div class="tab-con" v-show="tabCur===0">
      <ul class="info">
        <li>当前水位：{{options.rz || '-' }}m</li>
        <li>当前流量：{{options.inq || '-' }}m³/s</li>
        <li>警戒水位：{{options.wrz || '-' }}m</li>
        <li>保证水位：{{options.grz || '-' }}m</li>
      </ul>
      <div class="chart" ref="chart"/>
    </div>
    <div class="tab-con" v-if="tabCur===1">
      <div class="pd-box">
        <div class="profile">
          <div class="profile-top">
            <div class="pt-time">{{ formatDateTime(new Date(), 'yyyy/MM/dd HH:mm:ss') }} 同步</div>
            <div class="pt-tips">
              <span>当前水位({{options.rz || '-' }}m)</span>
              <span>警戒水位({{options.wrz || '-' }}m)</span>
              <span>保证水位({{options.grz || '-' }}m)</span>
            </div>
          </div>
          <div class="profile-hd">
            <div class="profile-water">
              <div class="line"><span>水位：{{options.rz}}m</span><span>流速：{{options.xsavv}}m/s</span><span>流量：{{options.inq}}m³/s</span></div>
            </div>
          </div>
        </div>
        <div class="coordinate">
          <div class="c-y">
            <span>高程(m)</span>
            <ul>
              <li>282m</li>
              <li>279m</li>
              <li>276m</li>
              <li>273m</li>
              <li>270m</li>
              <li>267m</li>
            </ul>
          </div>
          <div class="c-x">
            <ul>
              <li>0m</li>
              <li>30m</li>
              <li>60m</li>
              <li>90m</li>
              <li>120m</li>
              <li>150m</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-con" v-if="tabCur===2">
      <el-table ref="table" :data="tableData" height="320px" stripe>
        <el-table-column label="时间" width="180" prop="tm" align="center"/>
        <el-table-column label="水位(m)" align="center" min-width="80" prop="rz"/>
        <el-table-column label="流速(m/s)" prop="xsavv" min-width="90" align="center"/>
        <el-table-column label="流量(m³/s)" prop="inq" min-width="90" align="center"/>
      </el-table>
    </div>
    <div class="tab-con" v-if="tabCur===3">
      <ul class="details">
        <li><span>站点编号：</span>{{ options.stcd || '-'  }}</li>
        <li><span>站点名称：</span>{{ options.stnm || '-'  }}</li>
        <li><span>所属地区：</span>{{ options.stlc || '-' }}</li>
        <li><span>所属河道：</span>{{ options.rvnm || '-'}}</li>
        <li><span>警戒水位：</span>{{options.wrz || '-' }}m</li>
        <li><span>警戒流量：</span>{{options.wrq || '-' }}m³/s</li>
        <li><span>保证水位：</span>{{options.grz || '-' }}m</li>
        <li><span>保证流量：</span>{{options.grq || '-' }}m³/s</li>

      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Api from '@/api'
import {formatDate} from '@/assets/js/common'

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
      tabList: ['过程线', '剖面图', '报表', '基础信息'],
      tabCur: 0,
      chart: null,
      chartData: {
        timeList: [],
        waterList: [],
        list1: []
      },
      tableData: [],
      swMax: '',
      swMin: ''

    }
  },
  methods: {
    init(data) {
      this.tabCur = 0
      this.getChartData()
    },
    formatDateTime(datetime) {
      return formatDate(new Date(datetime), 'yyyy/MM/dd hh:mm:ss')
    },
    draw_1() {

      let testData = this.chartData
      let that = this
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          y: 'bottom',
          textStyle: {
            color: '#00fff6'
          }
        },
        grid: {
          top: '30px',
          left: '50px',
          right: '50px',
          bottom: '45px'
        },
        color: ['rgba(0, 210, 255, .9)', 'rgba(255, 153, 74, .9)', 'rgba(255, 1, 32, .8)'],
        xAxis: {
          type: 'category',
          data: testData.timeList,
          axisLabel: {
            textStyle: {
              color: '#00fff6'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '水位(m)',
            nameTextStyle: {
              color: '#8efffb'
            },

            max: that.swMax,
            min: that.swMin,

            axisLabel: {
              textStyle: {
                color: '#00fff6',
                fontSize: '10px'
              }
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            name: '流量(m³/s)',
            nameTextStyle: {
              color: '#ffdc75'
            },
            axisLabel: {
              textStyle: {
                color: '#ffc107',
                fontSize: '10px'
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            symbol: 'none',
            name: '水位',
            data: testData.waterList,
            type: 'line',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#3346a3'
                }, {
                  offset: 1, color: 'rgba(121,55,255,0)'
                }],
                global: false
              }
            }
          },
          {
            name: '流量',
            data: testData.list1,
            type: 'line',
            yAxisIndex: 1
          }
        ]
      }
      this._draw(option)
    },
    _draw(option) {
      this.chart = this.$eCharts.init(this.$refs.chart)
      this.chart.setOption(option)
    },
    getChartData() {

      let that = this
      let data = that.options
      let query = {
        stcd: data.stcd,
        stm: data.stm,
        etm: data.etm
      }
      let swMax = ''
      let swMin = ''

      Api.getDialogTableList(query).then(response => {
        if (response.code === 0) {
          const tableData = response.result.tableData
          this.tableData = tableData
          let chartData = {
            timeList: [],
            waterList: [],
            list1: []
          }
          tableData.forEach(item => {
            const rz = item.rz
            if (swMax === '' || rz > swMax) {
              swMax = rz
            }
            if (swMin === '' || rz < swMin) {
              swMin = rz
            }
            chartData.timeList.push(item.tm)
            chartData.waterList.push(rz)
            chartData.list1.push(item.inq)
          })
          that.chartData = chartData
          that.swMax = swMax
          that.swMin = swMin
          that.draw_1()
        }
      })

    },
    toClose() {
      this.$emit('close')
    },
    tabClick(idx) {
      this.tabCur = idx
      if (idx === 0) {
        this.$nextTick(() => {
          this.getChartData()
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
    height: 250px;
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
    height: 352px;
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

.pd-box {
  padding: 15px 15px 30px 40px;
  position: relative;
}

.coordinate{
  position: absolute;
  bottom: 0;
  left: 0;
  top: 15px;
  right: 15px;
  .c-x{
    position: absolute;
    bottom: 8px;
    left: 40px;
    right: 0;
    ul{
      line-height: 20px;
      display: flex;
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      li{
        font-size: 12px;
        color: #00fcff;
      }
    }
  }
  .c-y{
    position: absolute;
    left: 0;
    width: 40px;
    top: 0;
    bottom: 30px;
    font-size: 12px;
    white-space: nowrap;
    display: flex;
    flex-direction: column;

    ul{
      padding-right: 5px;
      padding-top: 5px;
      display: flex;
      flex-direction: column;
      color: #00fcff;
      text-align: right;
      flex: 1;
      justify-content: space-between;
    }
  }
}

.profile {
  background: url('/static/img/pmt_bg.png') no-repeat center;
  background-size: cover;
  width: 100%;
  height: 270px;
  position: relative;
  overflow: hidden;

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
      height: 18px;
      line-height: 18px;
      white-space: nowrap;

      span {
        color: #00f;
        display: inline-block;
        transform-origin: 100% 100%;
        transform: scale(.8);
      }
    }
  }

  &-hd {
    height: 200px;
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
  }
}
</style>
