<template>
  <el-table ref="table" :data="list" style="width: 100%;" height="420"
    max-height="390px">
    <el-table-column label="序号" width="50" align="center">
      <template slot-scope="scope">{{ scope.$index + 1 }}</template>
    </el-table-column>
    <el-table-column label="站名" width="100" prop="stnm" align="center" show-overflow-tooltip/>
    <el-table-column label="站码" width="100" prop="stcd" align="center" show-overflow-tooltip/>
    <el-table-column label="维护次数" align="center" width="80">
      <template slot-scope="scope">
        <span style="text-decoration: underline; cursor: pointer" @click="openDetails(scope.row)">{{ scope.row.counts }}</span>
      </template>
    </el-table-column>
<!--    <el-table-column label="警戒/汛限(m)" prop="warn" align="center"/>-->
    <el-table-column label="最近维护时间" width="100" prop="maintenanceDate" align="center"/>
  </el-table>
</template>

<script type="text/ecmascript-6">
import Api from '../../../api'
import dayjs from 'dayjs'
export default {
  components: {
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
      querParam: {},
      list: []
    }
  },
  watch:{
      tabData:{
        handler(val){
          this.list = val
        },
        deep:true
      }
  },
  created() {
  },
  mounted() {

    this.$nextTick(()=>{
      this.getAllList()
    })
    window.eventBus.$on('refreshMaintenanceList', ()=> {
      this.getAllList()
    })
  },
  methods: {
    fmt(text) {
      if (!text) {
        return '无'
      }
      return dayjs(text).format('DD HH:mm')
    },
    rowClickHandler(row) {

    },
    getWaterList(queryParam) {
      this.queryParam = queryParam
      Api.listNewRiverAll({
        sttpList: ['ZZ', 'ZP', 'DD', 'ZQ', 'RR', 'ZC', 'ZD'],
        startTime: queryParam.startDate,
        endTime: queryParam.endDate
      }).then(response => {
        if (response.code === 200) {
          this.list = response.result
          window.mpPlugin.waterPoint().showPoint(this.list, {
            startDate: queryParam.startDate,
            endDate: queryParam.endDate
          })
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
    },
    openDetails(data){
      console.log(data)
      window.eventBus.$emit('openDailyMaintenanceDetail', data.stcd)
    },

    getAllList(data){
      let params = {}
      if (data){
        params = {
          stnm: data
        }
      }
      Api.getDailyMaintenanceList(params).then(res => {
        console.log("日常维护数据")
        console.log(res)
        if(res.code === 200){
          this.list = res.result
        }
      })
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
</style>
