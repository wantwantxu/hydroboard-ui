<template>
  <div class="tab-con">
    <el-form :model="formData" label-width="75px">
      <el-form-item label="起止时间">
        <el-date-picker v-model="formData.date" :picker-aoptions="options1" type="datetimerange" range-separator="至"
                        format="MM-dd HH:mm" value-format="yyyy/MM/dd HH:mm:ss" ref="dateTime" :clearable="false" @change="getSedimentList"/>
        <el-select @change="getSedimentOfTime" v-model="value" placeholder="请选择">
          <el-option
            v-for="item in timeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div ref="sedimentRef" style="width:570px;height:230px"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Api from '../../../api'
  import dayjs from 'dayjs'
  import {formatDate} from '@/assets/js/common'
  import SimpleChart from '../../charts/SimpleChart'

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
          return {
          }
        }
      }
    },
    data() {
      return {
        options1: {
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
        timeList: [{
          value: 'value1',
          label: '5分钟'
        }, {
          value: 'value2',
          label: '10分钟'
        }, {
          value: 'value3',
          label: '15分钟'
        }, {
          value: 'value4',
          label: '20分钟'
        },
          {
          value: 'value5',
          label: '25分钟'
        },
          {
            value: 'value6',
            label: '30分钟'
          },
          {
            value: 'value7',
            label: '35分钟'
          },
          {
            value: 'value8',
            label: '40分钟'
          },
          {
            value: 'value9',
            label: '45分钟'
          },
          {
            value: 'value10',
            label: '50分钟'
          },
          {
            value: 'value11',
            label: '55分钟'
          },
          {
            value: 'value12',
            label: '60分钟'
          }

        ],
        value: '30分钟'
      }
    },

    created() {
    },
    methods: {

      getSedimentOfTime() {
        this.getSedimentList()
      },
      getSedimentList() {
          Api.listSsdiment({
            stcd: this.options.stcd,
            startDate: this.formData.date[0],
            endDate: this.formData.date[1]
          }).then((res) => {
              if (res.code === 200) {
                let myChart = this.$eCharts.init(this.$refs.sedimentRef)
                const result = res.result
                var values = []
                var tm = []
                for (var i = 0; i < result.length; i++) {
                  const data = result[i]
                    this.choose(data, values)
                  tm.push(dayjs(data.tm).format('MM-DD HH:mm'))
                }
                const chart = new SimpleChart(values, tm, myChart)
                chart.init('时间', '泥沙量')
              }
          })
      },
      choose(data, values) {
        if (this.value === 'value1') {
          values.push(data.value1)
        } else if (this.value === 'value2') {
          values.push(data.value2)
        } else if (this.value === 'value3') {
          values.push(data.value3)
        } else if (this.value === 'value4') {
          values.push(data.value4)
        } else if (this.value === 'value5') {
          values.push(data.value5)
        } else if (this.value === 'value6') {
          values.push(data.value6)
        } else if (this.value === 'value7') {
          values.push(data.value7)
        } else if (this.value === 'value8') {
          values.push(data.value8)
        } else if (this.value === 'value9') {
          values.push(data.value9)
        } else if (this.value === 'value10') {
          values.push(data.value10)
        } else if (this.value === 'value11') {
          values.push(data.value11)
        } else if (this.value === 'value12') {
          values.push(data.value12)
        } else {
          values.push(data.value3)
        }
      }
    },

    watch: {
      options: {

        handler(v) {
          let e = new Date()
          let y = new Date(new Date().setDate(new Date().getDate() - 1))
          this.formData['date'] = [formatDate(y, 'yyyy/MM/dd 08:00:00'), formatDate(e, 'yyyy/MM/dd hh:00:00')]
          this.getSedimentList()
        },
        immediate: true
      }
    }
  }
</script>
