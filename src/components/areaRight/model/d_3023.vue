<template>
  <div class="wrap" :class="{'bg-com':!isMin}">
    <title-box title="山洪测站" second isVariable @change="toggle"/>
    <el-form :model="formData" label-width="75px">
      <el-form-item label="起止时间" prop="date">
        <el-date-picker v-model="formData.date" :picker-options="options" type="datetimerange" range-separator="至"
                        format="MM-dd HH:mm" value-format="yyyy/MM/dd HH:mm:ss" ref="dateTime" :clearable="false" @change="changeHandle"/>
      </el-form-item>
      <el-form-item label="站点分组" prop="type">
        <el-select v-model="sttp" style="width: 100%" @change="changeHandle">
          <el-option v-for="item in sttpList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table ref="table" :data="tableData" max-height="450px" stripe highlight-current-row
              @row-click="changeTr">
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="站名" prop="stnm" align="center"/>
      <el-table-column label="类型" prop="sttp" align="center" width="90">
        <template slot-scope="{row}">雨量站</template>
      </el-table-column>
      <el-table-column label="区划" width="80" align="center">
        <template slot-scope="{row}"></template>
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
    isMin: {
      type: Boolean,
      default() {
        return false
      }
    },
    isPopShow: {
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
      type: 3023,
      sttp: '',
      options: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
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
        },
        shortcuts: [...shortList]
      },
      sttpList: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '雨量站',
          value: 'PP'
        },
        {
          label: '河道水文站',
          value: 'ZQ'
        },
        {
          label: '水库水文站',
          value: 'RR'
        }
      ],
      formData: {
        date: [],
        type: ''
      },
      queryData: {},
      tableData: []
    }
  },
  created() {

    let e = new Date()
    if (new Date().getHours() > 8) {
      this.formData['date'] = [formatDate(e, 'yyyy/MM/dd 08:00:00'), formatDate(e, 'yyyy/MM/dd hh:00:00')]
    } else {
      let y = new Date(new Date().setDate(new Date().getDate() - 1))
      this.formData['date'] = [formatDate(y, 'yyyy/MM/dd 08:00:00'), formatDate(e, 'yyyy/MM/dd hh:00:00')]
    }
    this.changeHandle()

  },
  methods: {
    toggle(type) {
      if (type === 'max' && !this.isMin) return
      this.$emit('sizeChange', !this.isMin)
    },
    toEmit() {
      let json = {
        type: this.type,
        stm: this.formData.date[0],
        etm: this.formData.date[1],
        data: this.tableData
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
    changeHandle() {
      this.queryData.sttp = this.sttp
      this.queryData.stm = this.formData.date[0]
      this.queryData.etm = this.formData.date[1]
      this.getRainSumList()
    },
    changeTr(row) {
      if (row) {

        this.$emit('pop', {data: {...row, date: this.queryData}, type: this.type})
      }
    },
    getRainSumList() {
      this.timeUpdate()
      this.queryData.sttp = this.sttp
      Api.getShList({}).then(response => {
        if (response.code === 0) {
          this.tableData = response.result
          this.toEmit()
        }
      })
    },

    setCurrentRow(data) {
      let scrollHeight = this.$refs.table.bodyWrapper.scrollHeight
      let len = this.tableData.length
      for (let i = 0; i < len; i++) {
        let row = this.tableData[i]
        if (row.stcd === data.stcd) {
          this.$refs.table.setCurrentRow(row)
          if (i < 6) {
            this.$refs.table.bodyWrapper.scrollTo({top: 0, behavior: 'smooth'})
          } else {
            this.$refs.table.bodyWrapper.scrollTo({top: (scrollHeight / len) * (i - 2), behavior: 'smooth'})
          }
        }
      }
    }

  },
  filters: {
    level(l) {
      return ['无雨', '小雨', '中雨', '大雨', '暴雨', '大暴雨', '特大暴雨'][l]
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
