<template>
  <div class="wrap" :class="{'bg-com':!isMin}">
    <title-box title="水文站" second isVariable @change="toggle"/>
    <el-form :model="formData" label-width="75px">
      <el-form-item label="起止时间">
        <el-date-picker v-model="formData.date" :picker-options="options" type="datetimerange" range-separator="至"
                        format="MM-dd HH:mm" value-format="yyyy/MM/dd HH:mm:ss" ref="dateTime" :clearable="false" @change="getWaterCurList"/>
      </el-form-item>
    </el-form>
    <el-table ref="table" :data="waterList" height="450px" stripe highlight-current-row
              @row-click="changeTr">
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="站名" min-width="100" prop="stnm" align="center" show-overflow-tooltip/>
      <el-table-column label="水位(m)" align="center" width="80">
        <template slot-scope="{row}">
          <div class="water-box" :class="`c_${row.status} t_${row.wptn}`">
            <img v-if="row.wptn=='5'" src="/static/svg/arrow-up.svg" alt="">
            <span>{{ row.rz }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="流量(m³/s)" prop="inq" width="95" align="center"/>
      <el-table-column label="流速" prop="xsavv" width="95" align="center"/>
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
            stnm: ''
          }
        }
      }
    }
  },
  data() {
    return {
      type: 3024,
      options: {
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
    toEmit() {
      let json = {
        type: this.type,
        startTime: this.formData.date[0],
        endTime: this.formData.date[1],
        data: this.waterList
      }
      this.$emit('change', json)
    },
    timeUpdate() {
      let json = {
        type: this.type,
        stm: this.formData.date[0],
        etm: this.formData.date[1]
      }
      this.$emit('timeUpdate', json)
    },
    toggle(type) {
      if (type === 'max' && !this.isMin) return
      this.$emit('sizeChange', !this.isMin)
    },
    changeTr(row) {
      if (row) {
        let option = {data: {...row, date: this.formData.date}, type: this.type}
        this.$emit('pop', option)
      }
    },
    clickHandler(row, index) {

      this.$refs.table.setCurrentRow()
    },
    getWaterCurList() {

      this.queryData.stm = this.formData.date[0]
      this.queryData.etm = this.formData.date[1]
      Api.getSwzList(this.queryData).then(response => {
        if (response.code === 0) {
          this.waterList = response.result
          this.toEmit()
        }
      })

    },

    setCurrentRow(data) {
      let scrollHeight = this.$refs.table.bodyWrapper.scrollHeight
      let tableData = this.waterList
      let len = tableData.length
      for (let i = 0; i < len; i++) {
        let row = tableData[i]
        if (row.stcd === data.stcd) {
          this.$refs.table.setCurrentRow(row)
          if (i < 12) {
            this.$refs.table.bodyWrapper.scrollTo({top: 0, behavior: 'smooth'})
          } else {
            this.$refs.table.bodyWrapper.scrollTo({top: (scrollHeight / len) * (i - 2), behavior: 'smooth'})
          }
        }
      }
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
