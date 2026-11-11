<template>
  <div class="wrap" :class="{'bg-com':!isMin}">
    <title-box title="水电站" second isVariable @change="toggle"/>

    <el-form :model="formData" label-width="75px">
      <el-form-item label="起止时间">
        <el-date-picker v-model="formData.date" :picker-options="pickerOptions" ref="dateTime" type="datetimerange" range-separator="至"
                        format="MM-dd HH:mm" value-format="yyyy/MM/dd HH:mm:ss" :clearable="false" @change="getWaterCurList"/>
      </el-form-item>
    </el-form>
    <el-table ref="table" 
        :data="waterList"
        height="390px"
        max-height="390px" 
        stripe highlight-current-row
        @row-click="changeTr">
      <el-table-column label="编号" width="50" align="center">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="站名" min-width="100" prop="gpName" align="center" show-overflow-tooltip/>
      <el-table-column label="流量(m³/s)" prop="gpLiuliang" width="95" align="center"/>
      <el-table-column label="时间" prop="gpTime" :formatter="dateFormat" width="90" align="center">
      </el-table-column>
    </el-table>
    <div class="bg-border"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import titleBox from '@/components/titleBox'
  import {formatDate} from '@/assets/js/common'
  import Api from '@/api'
  import dayjs from 'dayjs'

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
    components: {
      titleBox
    },
    props: {
      isPopShow: {
        type: Boolean,
        default() {
          return false
        }
      },
      isMin: {
        type: Boolean,
        default() {
          return false
        }
      },
      popupShowData: {
        type: Object,
        default() {
          return {
            type: 1001,
            data: {
              hpnm: ''
            }
          }
        }
      }
    },
    data() {
      return {
        type: 3004,
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
        waterList: [],
        queryData: {}
      }
    },
    created() {

      let e = new Date()
      let y = new Date(new Date().setDate(new Date().getDate() - 1))
      this.formData['date'] = [formatDate(y, 'yyyy/MM/dd 08:00:00'), formatDate(e, 'yyyy/MM/dd hh:mm:ss')]
      this.getWaterCurList()
    },
    methods: {
      dateFormat(row, column) {
        if (row.gpTime != null) {
          var dT = new Date(row.gpTime)
          return (dT.getMonth() + 1) + '-' + dT.getDate() + ' ' + dT.getHours() + ':' + dT.getMinutes()
        }
        return ''
      },

      toEmit() {
        let json = {
          type: this.type,
          startTime: this.formData.date[0],
          endTime: this.formData.date[1],
          data: this.waterList
        }
        this.$emit('change', json)
      },
      toggle(type) {
        if (type === 'max' && !this.isMin) return
        this.$emit('sizeChange', !this.isMin)

        if(!type){
          this.$nextTick(()=>{
            this.getWaterCurList()
          })
        }
      },
      changeTr(row) {
        console.log(row,'dddd')
        if (row) {
          let option = {data: {...row, date: this.formData.date}, type: this.type}
          window.mpPlugin.hydroelectricStationPoint().showPointPopup(row)
          this.$emit('pop', option)
        }
      },
      getWaterCurList() {
        this.queryData.startDate = this.formData.date[0]
        this.queryData.endDate = this.formData.date[1]
        Api.listNewFlow(this.queryData).then(response => {
          if (response.code === 200) {
            this.waterList = response.result
            window.mpPlugin.hydroelectricStationPoint().showPoint(this.waterList, this.queryData)
            this.toEmit()
          }
        })
      },

      setCurrentRow(data) {
      }
    },
    watch: {
      isPopShow(v) {
        if (!v && this.$refs.table) {
          this.$refs.table.setCurrentRow()
        }
      },
      popupShowData(v) {
        if (v.type === this.type) {
          this.setCurrentRow(v.data)
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
</style>
