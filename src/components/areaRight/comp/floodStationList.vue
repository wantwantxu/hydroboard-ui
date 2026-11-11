<template>
  <el-table ref="table"
            :data="list.filter(data => !search || data.stnm.toLowerCase().includes(search.toLowerCase()))"
            style="width: 100%;" max-height="390px" stripe highlight-current-row
            @row-click="rowClickHandler">
    <el-table-column label="序号" width="50" align="center">
      <template slot-scope="scope">{{ scope.$index + 1 }}</template>
    </el-table-column>
    <el-table-column label="站名" align="center" width="110" show-overflow-tooltip>
      <template slot-scope="{row}">
        <warn-dot :row="row"/>
        <span>{{ row.stnm }}</span>
      </template>
    </el-table-column>
    <el-table-column label="水位(m)" align="center" width="100">
      <template slot-scope="{row}">
        <div class="water-box" :class="`c_${row.status} t_${row.wptn}`">
          <img v-if="row.wptn === '5'" src="/static/svg/arrow-up.svg" alt="">
          <span>{{ row.z }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="流量(m3/s)" prop="q" align="center"/>
    <el-table-column label="时间" prop="tm" align="center">
      <template slot-scope="{row}">
        {{fmt(row.tm)}}
      </template>
    </el-table-column>
  </el-table>
</template>

<script type="text/ecmascript-6">
import Api from '../../../api'
import dayjs from 'dayjs'
import waterWarnList from '@/mixins/waterWarnList'
import WarnDot from './WarnDot'
export default {
  mixins: [waterWarnList],
  components: {
    WarnDot
  },
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    tabData:{
      type: Array,
      default: ()=> []
    }
  },
  data() {
    return {
      search: '',
      list: []
    }
  },
  watch:{
      tabData:{
        handler(val){
          this.setWarnedList(val || [])
        },
        deep:true
      }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    fmt(text) {
      if (!text) {
        return '无'
      }
      return dayjs(text).format('DD HH:mm')
    },
    rowClickHandler(row) {
      if (row) {
        console.log(this.type)
        window.mpPlugin.waterPoint().showPointPopup({...row,
          formData: {
            type: this.type

          }})
      }
    },
    tabClickHandler(row, index) {
      this.tabCur = index
      this.$refs.table.setCurrentRow()
      this.getWaterList()
    },
    getWaterList(queryParam) {
      Api.listNewRiver({
        sttpList: ['ZC', 'ZD'],
        startDate: queryParam.startDate,
        endDate: queryParam.endDate
      }).then(response => {
        if (response.code === 200) {
          this.setWarnedList(response.result || [])
          window.mpPlugin.waterPoint().showPoint(this.list)
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
          console.log((scrollHeight / len))
          console.log((scrollHeight / len) * i)
          this.$refs.table.setCurrentRow(row)
          if (i < 10) {
            this.$refs.table.bodyWrapper.scrollTo({top: 0, behavior: 'smooth'})
          } else {
            this.$refs.table.bodyWrapper.scrollTo({top: (scrollHeight / len) * (i - 15), behavior: 'smooth'})
          }
        }
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
</style>
