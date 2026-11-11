<template>
  <div class="tab-con" >
  





    <el-form :model="formData" label-width="75px">
      <el-form-item label="起止时间">
        <el-date-picker v-model="formData.date" :picker-aoptions="pickerOptions"
                        type="datetimerange" range-separator="至"
                        format="MM-dd HH:mm" value-format="yyyy/MM/dd HH:mm:ss"
                        :clearable="false"
                        ref="dateTime"
                        @change="getListNewHydroelecticStaion"
        />
      </el-form-item>
    </el-form>
    <div class="tit-center">
      <div>
        <p >当前流量</p>
        <p style="font-size: 16px;">{{newLiuLiang}} m</p>
      </div>
      <div class="border"></div>
      <div>
        <p >坝上</p>
        <p  style="font-size: 16px;">{{newHydroelecticStaion.gpSyShuiWei}}m³/s</p>
      </div>
      <div class="border"></div>
      <div>
        <p >坝下</p>
        <p  style="font-size: 16px;">{{newHydroelecticStaion.gpXyShuiWei}} m</p>
      </div>
    </div>
    <div class="chart-box" style='flex:1'>
      <div class="chart" ref="chart" ></div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import Api from '@/api'
  import dayjs from 'dayjs'
  import {formatDate} from '@/assets/js/common'
  import SimpleChart from '@/components/charts/SimpleChart'

  let et = new Date()
  let shortList = [
    {
      text: '昨天8时到现在',
      onClick(picker) {
        let y = new Date(new Date().setDate(new Date().getDate() - 1))
        picker.$emit('pick', [new Date(formatDate(y, 'yyyy/MM/dd 08:00:00')), et])
      }
    }
  ]
  if (new Date().getHours() > 8) {
    shortList.push({
      text: '今天8时到现在',
      onClick(picker) {
        picker.$emit('pick', [new Date(formatDate(new Date(), 'yyyy/MM/dd 08:00:00')), et])
      }
    })
  }
  let arr = [3, 6, 12, 24, 48, 72]
  for (let i = 0; i < arr.length; i++) {
    shortList.push({
      text: '最近' + arr[i] + '小时',
      onClick(picker) {
        picker.$emit('pick', [new Date(et.getTime() - 60 * 60 * 1000 * arr[i]), et])
      }
    })
  }
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
        newHydroelecticStaion: {},
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [...shortList],
          onPick: (time) => {
            if (time.maxDate) {
              const end = new Date()
              const end1 = new Date(time.maxDate)
              if (dayjs(end).format('YYYY-MM-DD') === dayjs(end1).format('YYYY-MM-DD')) {
                setTimeout(() => {
                  this.$refs.dateTime.picker.maxDate = new Date()
                }, 15)
              }else{
                setTimeout(() => {
                  this.$refs.dateTime.picker.maxDate = new Date(dayjs(end1).format('YYYY-MM-DD 23:59:59'))
                }, 15)
              }
            }
        }
        },
        
        formData: {
          date: []
        },
        queryData: {},
        newLiuLiang: ''
      }
    },

    created() {

      let e = new Date()
      let y = new Date(new Date().setDate(new Date().getDate() - 1))
      this.formData['date'] = [formatDate(y, 'yyyy/MM/dd 08:00:00'), formatDate(e, 'yyyy/MM/dd hh:mm:ss')]
      this.getListNewHydroelecticStaion()
    },

    methods: {
      init() {
        this.getListNewHydroelecticStaion()
        this.getNewLiuLiang()
      },
      getNewLiuLiang() {
        const queryParam = this.queryData
        Api.listNewFlow({startDate: queryParam.startDate, endDate: queryParam.endDate}).then((res) => {
          var array = res.result
          for (var i = 0; i < array.length; i++) {
            if (array[i].gpId === this.options.gpId) {
              this.newLiuLiang = array[i].gpLiuliang
            }
          }
        })
      },
      getListNewHydroelecticStaion() {
        this.queryData.startDate = this.formData.date[0]
        this.queryData.endDate = this.formData.date[1]
        Api.listFlow({
          gpId: this.options.gpId,
          startDate: this.formData.date[0],
          endDate: this.formData.date[1]}
        ).then((res) => {
          const result = res.result
          var gpLiuliang = []
          var tm = []

          if (res.result.length === 0) {
            this.newHydroelecticStaion = []
            this.newHydroelecticStaion.gpLiuliang = 0
          }
          if (res.result.length > 0) {
            this.newHydroelecticStaion = res.result[0] || []
            this.newHydroelecticStaion = res.result[res.result.length - 1] || []
            if (this.newHydroelecticStaion.gpLiuliang === null) {
              this.newHydroelecticStaion.gpLiuliang = 0
            }
          }
          for (var i = 0; i < result.length; i++) {
            const data = result[i]
            gpLiuliang.push(data.gpLiuliang)
            tm.push(dayjs(data.gpTime).format('MM-DD HH:mm'))
          }
          let myChart = this.$eCharts.init(this.$refs.chart)
          const waterChart = new SimpleChart(gpLiuliang, tm, myChart)
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
            let _this = this
            setTimeout(() => {
                _this.init(v)
            }, 400)
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

    .info1 {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      padding: 15px;

      li {
        padding-right: 40px;
        font-size: 15px;
        color: #00fff6;
        height: 25px;
        line-height: 25px;
        .org{
          color: #ffdd00;
          margin-left: 25px;
        }
      }
    }

    .tab-con {
      .chart-box {
        height: 500px;

        .chart {
          top: 62px;
          height: 100%;
        }
      }
      .tit-center {
        width: 485px;
        height: 70px;
        background: rgba(30, 50, 70, 0.5);
        box-shadow: inset 0px 0px 17px 1px #00fff6;
        border-radius: 8px 8px 8px 8px;
        border: 1px solid #00fff6;
        position: absolute;
        left: 35%;
        margin-left: -241px;
        top: 100px;
        display: flex;
        justify-content: space-around;
        padding: 5px 0px;
        .border {
          width: 2px;

          margin: 10px 0;
          background: linear-gradient(
              180deg,
              rgba(0, 255, 246, 0) 0%,
              #00fff6 53%,
              rgba(0, 255, 246, 0) 100%
          );
        }
        p {
          margin: 0;
          font-size: 14px;
          font-weight: bold;
          line-height: 33px;
          color: #00fff6;
          
          text-align: center;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei,sans-serif;
          
        }
      }
      
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
      height: 160px;
      position: absolute;
      right: 0;
      left: 0;
      bottom: 0;

      .profile-mask {
        position: absolute;
        z-index: 15;
        background: url('/static/img/pmt_dz.png') no-repeat center;
        background-size: auto 100%;
        top: 0;
        bottom: 0;
        width: 30px;
        left: 68%;

        .pm-title {
          position: absolute;
          top: -25px;
          color: #333;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
        }
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

      .line1, .line2, .line3 {
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
        left: -120px;

        span {
          right: 5px;
          transform-origin: 100% 100%;
        }
      }

      .line2 {
        left: 29px;
        border-color: #f00;
        color: #f00;

        span {
          left: 5px;
          transform-origin: 0 100%;
        }
      }

      .line3 {
        left: -120px;
        border-color: #f00;
        color: #f00;

        span {
          right: 5px;
          transform-origin: 100% 100%;
        }
      }
    }
  }
</style>
