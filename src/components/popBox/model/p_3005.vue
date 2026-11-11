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
    <div class="tab-con" v-show="tabCur==0">
      <ul class="info">
        <li>当前水位：{{options.z || '-' }}m</li>
        <li>当前流量：{{options.q || '-' }}m³/s</li>
        <li>警戒水位：{{options.wrz || '-' }}m</li>
        <li>保证水位：{{options.grz || '-' }}m</li>
      </ul>
      <div class="chart" ref="chart"/>
    </div>
    <div class="tab-con" v-if="tabCur==1">
      <div class="pd15">
        <div class="profile">
          <div class="profile-top">
            <div class="pt-time">{{ formatDateTime(new Date(), 'yyyy/MM/dd HH:mm:ss') }} 同步</div>
            <div class="pt-tips">
              <span>当前水位({{options.z || '-' }}m)</span>
              <span>警戒水位({{options.wrz || '-' }}m)</span>
            </div>
          </div>
          <div class="profile-hd">
            <div class="profile-water"/>
            <div class="line1" style="top:25%"><span>实时水位：{{options.z || '-' }}m</span></div>
            <div class="line2" style="top: 18%"><span>警戒水位：{{options.wrz|| '-' }}m</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-con" v-if="tabCur==2">
      <ul class="details">
        <li><span>站点编号：</span>{{ options.stcd }}</li>
        <li><span>站点名称：</span>{{ options.stnm }}</li>
        <li><span>所属地区：</span>{{ options.adnm }}</li>
        <li><span>所属河道：</span>{{ options.rvnm }}</li>
        <li><span>警戒水位：</span>{{options.wrz || '-' }}m</li>
        <li><span>警戒流量：</span>{{options.wrq || '-' }}m³/s</li>
        <li><span>保证水位：</span>{{options.grz || '-' }}m</li>
        <li><span>保证流量：</span>{{options.grq || '-' }}m³/s</li>
      </ul>
    </div>
    <div class="tab-con" v-if="tabCur==3">
      <div class="st-img-div">
        <img :src="src" class="st-img">
      </div>
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
        tabList: ['过程线', '剖面图', '基础信息', '多媒体信息'],
        tabCur: 0,
        chart: null,
        chartData: [],
        timeList: [],
        waterList: [],
        list1: [],
        list2: [],
        swMax: '',
        swMin: '',
        src: ''
      }
    },
    methods: {
      init(data) {
        this.tabCur = 0
        this.getChartData()
        console.log('cd' + this.options.stcd)
        this.src = '/static/img/popBox/' + this.options.stcd + '.png'
      },
      formatDateTime(datetime) {
        return formatDate(new Date(datetime), 'yyyy/MM/dd hh:mm:ss')
      },
      draw_1() {
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
            right: '30px',
            bottom: '45px'
          },
          color: ['rgba(0, 210, 255, .9)', 'rgba(255, 153, 74, .9)', 'rgba(255, 1, 32, .8)'],
          xAxis: {
            type: 'category',
            data: this.timeList,
            axisLabel: {
              textStyle: {
                color: '#00fff6'
              }
            }
          },
          yAxis: [
            {
              type: 'value',
              name: '水位',
              nameTextStyle: {
                color: '#8efffb'
              },
              max: this.swMax,
              min: this.swMin,
              axisLabel: {
                textStyle: {
                  color: '#00fff6',
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
              data: this.valList,
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
              name: '警戒水位',
              data: this.list1,
              type: 'line'
            },
            {
              name: '保证水位',
              data: this.list2,
              type: 'line'
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
        console.log('获取图表数据')

        let data = this.options
        let swMax = ''
        let swMin = ''
        Api.listLandChar({stcd: data.stcd, sttp: data.sttp, stm: data.date[0], etm: data.date[1]}).then(response => {
          if (response.code === 0) {
            this.valList = []
            this.timeList = []
            this.list1 = []
            this.list2 = []
            response.result.forEach(d => {
              const rz = d.z
              if (swMax === '' || rz > swMax) {
                swMax = rz
              }
              if (swMin === '' || rz < swMin) {
                swMin = rz
              }
              this.valList.push(d.z)
              this.timeList.push(this.formatDateTime(d.tm, 'yyyy/MM/dd hh:mm:ss'))
              this.list1.push(data.wrz)
              this.list2.push(data.grz)
            })
            this.swMax = swMax
            this.swMin = swMin
            this.draw_1(this.valList, this.timeList, this.list1, this.list2)
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
  .st-img-div {
    margin: 10px auto;
    height: 100%;
  }

  .st-img {
    height: 98%;
    width: 95%;
    display: flex;
    margin: auto;
  }

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
      height: 200px;
      position: absolute;
      right: 0;
      left: 0;
      bottom: 0;
      &:before {
        content: '';
        position: absolute;
        z-index: 15;
        background: url('/static/img/pmt_hx.png') no-repeat center;
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
          left: 0;
          text-align: center;

          span {
            transform-origin: 50% 50%;
          }
        }

        &.w1 {
          left: 0;
          width: 70%;
        }

        &.w2 {
          left: 70%;
          right: 0;
          background-size: auto 100%;
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
          right: 5px;
          transform-origin: 100% 100%;
        }
      }

      .line2 {
        right: 0;
        border-color: #f00;
        color: #f00;

        span {
          left: 5px;
          transform-origin: 0 100%;
        }
      }
    }
  }
</style>
