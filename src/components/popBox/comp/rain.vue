<template>
    <div class="pop-base">
      <div class="tab-con">
        <div class="tips">
          <dl>
            <dt>时长：</dt>
            <dd>
              <span :class="{active:t1===0}" @click="timeChange(0)">默认</span>
              <span :class="{active:t1===1}" @click="timeChange(1)">1天</span>
              <span :class="{active:t1===2}" @click="timeChange(2)">3天</span>
              <span :class="{active:t1===3}" @click="timeChange(3)">自定义</span>
            </dd>
          </dl>
          <dl>
            <dt>时间：</dt>
            <dd>
              <el-form>
                <el-form-item style="margin-bottom: 0">
                  <el-date-picker v-model="formData" :readonly="readOnly" type="datetimerange" range-separator="至" ref="dateBox"
                                  format="MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss" :default-time="defaultTime" :clearable="false" @change="toChange(0)"/>
                </el-form-item>
              </el-form>
            </dd>
          </dl>
          <dl>
            <dt>累计雨量：</dt>
            <dd>{{sumRain}}mm</dd>
          </dl>
        </div>
        <div class="tab-main">
          <div class="tab-l">
            <div class="tab-chart">
              <div class="chart" ref="rtRainChatRef"/>
            </div>
            <div class="tab-title">累计降雨量(mm)</div>
            
            <table class="tab-table">
              <thead>
              <tr>
                <th>1小时 <span :class="getColor(hour1)">{{getStatus(hour1)}}</span></th>
                <th>3小时 <span :class="getColor(hour3)">{{getStatus(hour3)}}</span></th>
                <th>6小时 <span  :class="getColor(hour6)">{{getStatus(hour6)}}</span></th>
                <th>12小时 <span :class="getColor(hour12)">{{getStatus(hour12)}}</span></th>
                <th>24小时 <span :class="getColor(hour24)">{{getStatus(hour24)}}</span></th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td style="color: #00fcff">{{hour1}}mm</td>
                <td style="color: #00fcff">{{hour3}}mm</td>
                <td style="color: #00fcff">{{hour6}}mm</td>
                <td style="color: #00fcff">{{hour12}}mm</td>
                <td style="color: #00fcff">{{hour24}}mm</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import Api from '../../../api'
import dayjs from 'dayjs'
import RainChart from '../../charts/RainChart'
import BaseInfo from '../comp/baseInfo'
import {formatDate} from '@/assets/js/common'

export default {
  name: 'Rain',
  components: {BaseInfo},
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
      chart1: null,
      chart2: null,
      chart3: null,
      tabCur: 0,
      time: '',
      t1: 0,
      t2: 0,
      hour1: '',
      hour3: '',
      hour6: '',
      hour12: '',
      hour24: '',
      formData: [],
      sumRain: '',
      readOnly: true,
      hourList: [1, 3, 6, 12, 24],
      defaultTime:['00:00:00',formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')],
    }
  },
  created() {
    this.formData[0] = this.options.queryParam.startDate

    this.formData[1] = this.options.queryParam.endDate

  },
  methods: {
    init(options) {
      this.toChange(0)
      console.log(this.formData)
    },
    toChange(v) {
      this.readOnly = true
      this.tabCur = v
      if (v === 0) {
        this.$nextTick(() => {
          console.log('雨量')
          this.getData()
          this.getSumRain()
          this.getMaxRainOfHour(this.hourList)
        })
      }
    },
    timeChange(v) {
      this.t1 = v
      if (v === 0) {
        this.lessDate(0)
      }
      if (v === 2) {

        this.lessDate(3)
      }
      if (v === 1) {

        this.lessDate(1)
      }
      if (v === 3) {
        this.readOnly = false
        this.$refs.dateBox.$el.click()
      }
    },

    lessDate(lessDay) {
      const startDate = this.formData[0]
      const endDate = this.formData[1]
      if (lessDay === 0) {
        let fromDataLess = new Date(formatDate(new Date(this.formData[0]), 'yyyy-MM-dd 08:00:00'))
        let fromDataLess1 = new Date(formatDate(new Date(this.formData[1]), 'yyyy-MM-dd hh:mm:ss'))
        this.$set(this.formData, 0, dayjs(fromDataLess).format('YYYY-MM-DD HH:mm:ss'))
        this.$set(this.formData, 1, dayjs(fromDataLess1).format('YYYY-MM-DD HH:mm:ss'))
        this.toChange(0)
        this.$nextTick(() => {
          this.formData[0] = startDate
          this.formData[1] = endDate
        })
        return
      }
      let fromDataLess = new Date(formatDate(new Date(this.formData[1]), 'yyyy-MM-dd hh:mm:ss'))
      let fromDataLess1 = new Date(formatDate(new Date(this.formData[1]), 'yyyy-MM-dd hh:mm:ss'))
      fromDataLess = fromDataLess.setDate(fromDataLess.getDate() - lessDay)
      fromDataLess1 = fromDataLess1.setDate(fromDataLess1.getDate())
      this.$set(this.formData, 0, dayjs(fromDataLess).format('YYYY-MM-DD HH:mm:ss'))
      this.$set(this.formData, 1, dayjs(fromDataLess1).format('YYYY-MM-DD HH:mm:ss'))
      console.log(this.formData[0])
      console.log(this.formData[1])
      this.toChange(0)
      this.$nextTick(() => {
        this.formData[0] = startDate
        this.formData[1] = endDate
      })
    },

    getSumRain() {
      Api.getRainSumList(
        {stcdList: [this.options.stcd],
          startDate: this.formData[0],
          endDate: this.formData[1]

        }).then(response => {
        if (response.code === 200) {
          this.sumRain = response.result[0].rain
        }
      })
    },

    getStatus(status) {
      if (status > 250) return '特大暴雨'
      else if (status > 0 && status < 10) return '小雨'
      else if (status < 25 && status >= 10) return '中雨'
      else if (status >= 25 && status <= 50) return '大雨'
      else if (status > 50 && status <= 100) return '暴雨'
      else if (status > 100 && status <= 250) return '大暴雨'
      else return '无雨'
    },
    getColor(status) {
      if (status > 250) return 'c7'
      else if (status > 0 && status < 10) return 'c2'
      else if (status < 25 && status >= 10) return 'c4'
      else if (status >= 25 && status <= 50) return 'c4'
      else if (status > 50 && status <= 100) return 'c5'
      else if (status > 100 && status <= 250) return 'c6'
      else return 'c1'
    },
    stepChange(v) {
      this.t2 = v
    },
    getMaxRainOfHour(h) {
      Api.getRainStationList({
        stcd: this.options.stcd,
        startDate: this.formData[0],
        endDate: this.formData[1],
        hourList: h.join()}).then((res) => {
        if (res.code === 200) {
          for (let i = 0; i < res.result.length; i++) {
            if (res.result[i].length > 0) {
              this['hour' + this.hourList[i]] = res.result[i][0].rain
            }
            if (res.result[i].length === 0) {
              this['hour' + this.hourList[i]] = 0
            }
          }
        }
      })
    },
    getData() {

      Api.getRainList({stcd: this.options.stcd,
        startDate: this.formData[0],
        endDate: this.formData[1]
      }).then((res) => {
        const result = res.result
        let maxYaxis = 0
        let datas = []
        let labels = []
        for (let i = 0; i < result.length; i++) {
          const item = result[i]
          datas.push(item.drp)
          labels.push(dayjs(item.tm).format('MM-DD HH:mm'))
        }
        for (let i = 0; i < result.length; i++) {
          const item = result[i]
          if (item.drp > 5) {
            console.log(item.drp)
            maxYaxis = null
            break
          } else {
            maxYaxis = 5
          }
        }
        let myChart = this.$eCharts.init(this.$refs.rtRainChatRef)
        const rainChart = new RainChart()
        const chartOptions = rainChart.init(
          {
            data: labels
          },
          {
            max: maxYaxis
          },
          [
            {
              name: '雨量',
              type: 'bar',
              data: datas
            }
          ]
        )
        myChart.setOption(chartOptions)
      })
    }
  },
  watch: {
    options: {
      handler(v) {
        let _this = this

        _this.$nextTick(()=>{
          _this.init(v)
        })
      },
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
.tab-main {
  display: flex;
  flex-direction: row;
  height: 100%;
  min-height: 18rem;
  max-height: calc(88vh - 6rem);
  margin: 0 -10px;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  overflow: hidden;

  .tab-l {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .tab-r {
    flex: 0 0 min(20.625rem, 42%);
    width: min(20.625rem, 42%);
    max-width: 42%;
    background: #0d313d;
    overflow: auto;
  }

  .tab-chart {
    flex: 1 1 auto;
    min-height: 12rem;
    height: auto;
    .chart {
      height: 100%;
      min-height: 12rem;
    }
  }

  .tr-t {
    padding: 4px 10px;
    background: linear-gradient(90deg, rgba(15, 87, 99, 1), rgba(15, 87, 99, .1));

    h2 {
      font-size: 15px;
      font-weight: normal;
      color: #fff;
    }

    p {
      font-size: 12px;
      color: #00b5b5
    }
  }

  .chart2 {
    height: 140px;

    .chart {
      height: 100%;
    }
  }

  .chart3 {
    height: 240px;

    .chart {
      height: 100%;
    }
  }
}

.tips {
  padding: 10px 18px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;

  dt {
    color: #426b6f;
  }

  dl {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  dd {
    color: #00fcff;
    display: flex;
    flex-direction: row;

    span {
      height: 30px;
      border: 1px solid #445a68;
      line-height: 30px;
      border-radius: 3px;
      background: rgba(68, 90, 104, .5);
      color: #51dbcb;
      padding: 0 6px;
      margin-right: 5px;
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      &.active {
        color: rgba(255, 221, 0, .8);
        border-color: rgba(255, 221, 0, .8);
        background: rgba(186, 177, 72, .3);
      }
    }
  }
}

.pop-base {

  
  
  
  
  border-radius: 4px;
  
  color: #fff;
  overflow: hidden;
  overflow-y: scroll;
  white-space: nowrap;
  height:100%;
  width:100%;

  .pop-tab {
    display: flex;
    flex-direction: row;
    margin: 10px 0 15px;

    li {
      cursor: pointer;
      margin-right: 10px;
      height: 30px;
      border: 1px solid rgba(0, 255, 246, .1);
      background: rgba(0, 255, 246, .15);
      color: #00fff6;
      line-height: 30px;
      padding: 0 15px;
      border-radius: 3px;
      transition: all .5s;

      &.active {
        background: #fd0;
        border-color: #fd0;
        color: #333;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
.pop-base::-webkit-scrollbar {
  width: 0;
}

.tab-con {
  
  
  
}

.tab-title {
  padding: 0 0 10px 15px;
  font-size: 15px;
  color: #fff;
  line-height: 25px;
}

.tab-table {
  background: rgba(0, 16, 30, .8);
  width: calc(100% - 30px);
  margin: 0 15px;
  border-top: 1px solid #153b46;
  border-right: 1px solid #153b46;

  th {
    color: #00fcff;
    font-weight: normal;
    height: 30px;

    span {
      background: #1f3d45;
      border: 1px solid #0b2933;
      font-size: 12px;
      padding: 0 7px;
      margin-left: 5px;
      border-radius: 3px;
      display: inline-block;
      height: 24px;
      line-height: 24px;

      &.c1 {
        color: rgba(255, 255, 255, .5);
      }

      &.c2 {
        color: rgba(0, 210, 255, .9);
      }

      &.c3 {
        color: rgba(0, 255, 141, .9);
      }

      &.c4 {
        color: rgba(255, 238, 77, .9);
      }

      &.c5 {
        color: rgba(255, 153, 74, .9);
      }

      &.c6 {
        color: rgba(255, 83, 47, .9);
      }

      &.c7 {
        color: rgba(255, 1, 32, .9);
      }
    }
  }

  td {
    height: 40px;
    color: #426b6f;
    text-align: center;
  }

  th, td {
    border-left: 1px solid #153b46;
    border-bottom: 1px solid #153b46;
  }
}

.info-list {
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
</style>
