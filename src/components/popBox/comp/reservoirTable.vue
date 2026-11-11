<template>
  <div class="table-box">
    <el-form :model="formData" label-width="75px">
      <el-form-item label="起止时间">
        <el-date-picker v-model="formData.date" :picker-aoptions="pickerOptions"
                        type="datetimerange" range-separator="至"
                        format="MM-dd HH:mm" value-format="yyyy/MM/dd HH:mm:ss"
                        :clearable="false"
                        ref="dateTime"
                        @change="getReservoirTable"
        />
      </el-form-item>
    </el-form>
    <el-table :data="tableData"  fit
              height="540" stripe highlight-current-row>
      <el-table-column prop="tm" label="时间">
        <template slot-scope="{row}">
          {{fmt(row.gpTime)}}
        </template>
      </el-table-column>
      <el-table-column prop="gpSyShuiWei" label="库水位(m)" />
      <el-table-column prop="inq" label="入库流量(m3/s)" />
      <el-table-column prop="gpLiuliang" label="出库流量(m3/s)" />
    </el-table>
  </div>
</template>
<script type="text/ecmascript-6">
  import Api from '../../../api'

  import {formatDate} from '@/assets/js/common'
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
    props: {
      options: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
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
        stcd: '',
        tableData: []
      }
    },

    created() {

      let e = new Date()
      let y = new Date(new Date().setDate(new Date().getDate() - 1))
      this.formData['date'] = [formatDate(y, 'yyyy/MM/dd 08:00:00'), formatDate(e, 'yyyy/MM/dd hh:mm:ss')]
    },
    methods: {
      fmt(text) {
        if (!text) {
          return '无'
        }
        return dayjs(text).format('DD HH:mm')
      },
      init() {
        this.$nextTick(() => {
          this.getReservoirTable()
        })
      },
      getReservoirTable() {
        Api.listFlow({
          gpId: this.options.gpId,
          startDate: this.formData.date[0],
          endDate: this.formData.date[1]}).then(res => {
            console.log(res.result)
            this.tableData = res.result
        })
      }
    },
    watch: {
      options: {
        handler(v) {
          this.init()
        },
        immediate: true
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>

</style>
