<template>
  <div class="p3001-root">
    <div class="tab-con">
      <div class="chart-box">
        <div class="chart" ref="chart" ></div>
      </div>
      <el-button type="text" class="button" @click="initConfig">配置</el-button>
    </div>
    <el-dialog :modal="false" title="配置" style="width: 1000px;height: 850px;color: black" :visible.sync="dialogFormVisible">
      <el-form :model="formData">
        <el-form-item class="form" required label="准备转移" :label-width="formLabelWidth">
          <div v-for="(item,idx) in 4" :key="idx">
            <el-input type="number" v-model="formData.prepareIntv[item-1]" placeholder="请输入时间" aria-required="true" ></el-input>
            <el-input type="number" v-model="formData.prepareTransfer[item-1]" placeholder="请输入转移量" aria-required="true" ></el-input>
          </div>
        </el-form-item>
        <el-form-item class="form" required label="立即转移" :label-width="formLabelWidth">
          <div v-for="(item,idx) in 4" :key="idx">
            <el-input type="number" v-model="formData.immediatelyIntv[item-1]" placeholder="请输入时间" aria-required="true" ></el-input>
            <el-input type="number" v-model="formData.immediatelyTransfer[item-1]" placeholder="请输入转移量" aria-required="true" ></el-input>
          </div>
        </el-form-item>
        <el-form-item class="form" required label="汇流时间" :label-width="formLabelWidth">
          <el-input type="number" v-model="formData.convergeIntv" placeholder="请输入汇流时间"></el-input>
        </el-form-item>
        <el-form-item required label="关联测站" :label-width="formLabelWidth">
          <el-select v-model="formData.stcd" filterable placeholder="请选择">
            <el-option
              v-for="item in stationList"
              :key="item.stcd"
              :label="item.stnm"
              :value="item.stcd">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="second" @click="saveConfig()">保 存</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {formatDate} from '@/assets/js/common'
import Api from '@/api'
import dayjs from 'dayjs'

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
      chart: null,
      chartData: [],
      rsvrInfo: {},

      prepareTransfer: '',

      immediatelyTransfer: '',
      dialogVisible: false,
      formData: {
        dangerAreaId: '',
        convergeIntv: 0,
        stcd: '',
        stnm: '',
        prepareIntv: [],
        prepareTransfer: [],
        immediatelyIntv: [],
        immediatelyTransfer: []
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      stationList: [],
      currentStation: '',
      timeout: null,
      timeList: ['1小时', '3小时', '6小时', '现在', '1小时', '3小时', '6小时'],
      type: ['PREPARE', 'IMMEDIATELY']

    }
  },
  mounted() {
    Api.getStationList().then((res) => {
      this.stationList = res.result
    })
  },

  methods: {
    initConfig() {
      this.dialogFormVisible = true
    },
    saveConfig() {
       console.log(this.formData,'this.formData')

       if(!verify(this.formData.prepareIntv,this.formData.prepareTransfer)){
        this.$message.error('请完善准备转移数据！')
        return
      }
   

      if(!verify(this.formData.immediatelyIntv,this.formData.immediatelyTransfer)){
        this.$message.error('请完善立即转移数据！')
        return
      }
   
    

      Api.insertDangerAreaWarn(this.formData).then((res) => {
            if (res.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            } else {
              this.$message.error('操作失败！')
            }
          })

    

      function verify(arr1,arr2){
        if(arr1.length === arr2.length){
            let _s = 0
            for(let i = 0;i<arr1.length;i++){
                if(arr1[i] && arr2[i]){
                  _s +=1
                }else if(!arr1[i] && !arr2[i]){
                  _s +=1
                }else{
                  return false
                }
            }
            if(_s === arr1.length){
                return true
            }else{
              return false
            }
        }else{
          return false
        }
      }
    },

    querySearchAsync(queryString, cb) {
      var stationList = this.stationList
      var results = queryString ? stationList.filter(this.createStateFilter(queryString)) : stationList
      cb(results)
    },

    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },

    handleSelect(item) {
      console.log(item)
      this.formData.stcd = item.stcd
      this.formData.stnm = item.stnm
    },

    init() {
      this.getFormData()
      this.draw()
      this.getTransferOptions()
      this.getProcessOptions()
    },
    getFormData() {

      Api.listDangerArea({id: this.options.id}).then(res => {
        const result = res.result
        if (result && result.length > 0) {
          const data = result[0]
          const convergeIntv = data.convergeIntv
          const dangerAreaId = data.id
          const stcd = data.stcd
          this.$set(this.formData, 'dangerAreaId', dangerAreaId)
          this.$set(this.formData, 'stcd', stcd)
          this.$set(this.formData, 'convergeIntv', convergeIntv)
        }
      })

      Api.listDangerAreaWarn({dangerAreaId: this.options.id}).then(res => {
        let prepareIntv = []
        let prepareTransfer = []
        let immediatelyIntv = []
        let immediatelyTransfer = []
        for (let i = 0; i < res.result.length; i++) {
          const data = res.result[i]
          if (data.type === 'PREPARE') {
            prepareIntv.push(data.intv)
            prepareTransfer.push(data.warn)
          }
          if (data.type === 'IMMEDIATELY') {
            immediatelyIntv.push(data.intv)
            immediatelyTransfer.push(data.warn)
          
          }
        }
        this.$set(this.formData, 'prepareIntv', prepareIntv)
        this.$set(this.formData, 'prepareTransfer', prepareTransfer)
        this.$set(this.formData, 'immediatelyIntv', immediatelyIntv)
        this.$set(this.formData, 'immediatelyTransfer', immediatelyTransfer)
      })
    },
    getChartData() { },
    formatDateTime(datetime) {
      return formatDate(new Date(datetime), 'MM/DD HH时')
    },
    draw() {
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {

            }
          }
        },
        legend: {
          y: 'bottom',
          itemWidth: 5,
          textStyle: {
            color: '#00fff6'
          }
        },
        xAxis: [{
          id: 'tmXaxis',
          type: 'category'
        }, {
          id: 'hourXaxis',
          type: 'category'
        }],
        yAxis: [
          {id: 'processYaxis', show: false, splitLine: {show: false}, position: 'left'},
          {id: 'transferYaxis', splitLine: {show: false}, position: 'right', type: 'value'}],
        series: [{
          id: 'prepareSeries',
          xAxisIndex: 1,
          yAxisIndex: 1,
          position: 'left',
          type: 'line',
          name: '准备转移'
        }, {
          id: 'immediateSeries',
          xAxisIndex: 1,
          yAxisIndex: 1,
          position: 'left',
          name: '立即转移',
          type: 'line'
        }, {
          id: 'rtSeries',
          name: '实测降雨',
          type: 'line',
          xAxisIndex: 0,
          yAxisIndex: 1,
          position: 'right'
        },
        {
          id: 'futureSeries',
          name: '预测降雨',
          type: 'line',
          xAxisIndex: 0,
          yAxisIndex: 1,
          position: 'right',
          smooth: false,
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2,
                type: 'dotted'
              }
            }
          }
        }]
      }
      if (!this.$refs.chart) return
      this.chart = this.$eCharts.init(this.$refs.chart)
      this.chart.setOption(option)
      this.$nextTick(() => { this.chart && this.chart.resize() })
    },
    getTransferOptions() {
      Api.listDangerAreaWarn({dangerAreaId: this.options.id}).then(res => {
        const code = res.code
        if (code === 200) {
          const result = res.result
          let prepare = []
          let immediate = []
          let intvList = []
          for (let i = 0; i < result.length; i++) {
            const data = result[i]
            const type = data.type
            const intv = data.intv
            const warn = data.warn
            if (type === 'PREPARE') {
              intvList[intvList.length] = intv
              prepare[prepare.length] = warn
            }
            if (type === 'IMMEDIATELY') {
              immediate[immediate.length] = warn
            }
          }
          const maxVal = Number(Math.max(...immediate))
          const minVal = Number(Math.min(...prepare))
          let interval = ((maxVal - minVal) / 5).toFixed(0)
          this.chart.setOption({
            xAxis: {
              id: 'hourXaxis',
              data: intvList,

              axisLabel: {
                color: '#00fff6'
              }
            },
            yAxis: {
              id: 'transferYaxis',
              type: 'value',
              axisLabel: {
                color: '#00fff6'
              },
              nameTextStyle: {
                color: '#666',
                fontSize: 12,
                lineHeight: 40
              },
              min: 0,
              max: maxVal,
              splitNumber: 15,
              interval: interval
            },
            series: [
              {
                id: 'prepareSeries',
                data: prepare

              },
              {
                id: 'immediateSeries',
                data: immediate

              }
            ]
          })
        } else {
          this.$message.error('系统出错!')
        }
      })
    },
    getProcessOptions() {
      Api.listDangerAreaMean({dangerAreaId: this.options.id}).then(res => {
        console.log(res)
        const data = res.result
        const futureList = data.futureList || []
        const rtList = data.rtList || []
        this.drawProcess(rtList, futureList)
      })
    },
    drawProcess(rtList, futureList) {
      let xAxisData = []
      let yAxisData = []
      let futureXaxisData = []
      for (let j = 0; j < rtList.length; j++) {
        const rt = rtList[j]
        xAxisData[xAxisData.length] = dayjs(rt.tm).format('MM/DD HH时')
        yAxisData[yAxisData.length] = rt.drp
      }
      for (let j = 0; j < futureList.length + rtList.length; j++) {
        if (j < rtList.length) {
          futureXaxisData[futureXaxisData.length] = null
        } else {
          const future = futureList[j - rtList.length]
          xAxisData[xAxisData.length] = dayjs(future.tm).format('MM/DD HH时')
          futureXaxisData[futureXaxisData.length] = future.drp
        }
      }

      const maxVal = Number(Math.max(...yAxisData))
      const minVal = Number(Math.min(...yAxisData))
      let interval = (maxVal - minVal) / 5
      this.chart.setOption({
        xAxis: {
          id: 'tmXaxis',
          data: xAxisData,

          axisLabel: {
            rotate: 40,
            textStyle: {
              color: '#00fff6'
            }
          }
        },
        yAxis: {
          id: 'processYaxis',
          type: 'value',
          nameTextStyle: {
            color: '#666',
            fontSize: 12,
            lineHeight: 40
          },
          axisLabel: {
            color: '#00fff6'
          },
          min: 0,
          max: maxVal,
          splitNumber: 15,
          interval: interval
        },
        series: [
          {
            id: 'rtSeries',
            data: yAxisData

          },
          {
            id: 'futureSeries',

            data: futureXaxisData
          }
        ]
      })

      console.log(this.chart.getOption())
    },
    toClose() {
      this.$emit('close')
    }
  },
  watch: {
    options: {
      handler(v) {
        let _this = this
        setTimeout(() => {
          _this.init(v)
        }, 500);
      },
      immediate: true
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.form{
  .el-input{
    width: 120px;

  }
  .el-input__inner {
    background: transparent;
    border-color: transparent;
    color: #00fff6;

    &:hover {
      border-color: #fd0;
    }
  }
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

  .p3001-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    box-sizing: border-box;
  }

  .tab-con {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    position: relative;

    .button {
      position: absolute;
      right: 0.5rem;
      top: 0;
      z-index: 2;
    }

    .chart-box {
      flex: 1 1 auto;
      min-height: 16rem;
      height: auto;
      position: relative;

      .chart {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
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

.button{
  position: relative;
  float: right;
  top: 78px;
  right: 17px;
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
