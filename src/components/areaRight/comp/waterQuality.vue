<template>
  <el-table ref="table" :data="list" style="width: 100%;" height="420" stripe highlight-current-row
    max-height="390px" @row-click="rowClickHandler">
    <el-table-column label="序号" width="50" align="center">
      <template slot-scope="scope">{{ scope.$index + 1 }}</template>
    </el-table-column>
    <el-table-column label="站名" width="100" prop="stnm" align="center" show-overflow-tooltip/>
    <el-table-column label="站码" width="100" prop="stcd" align="center" show-overflow-tooltip/>
    <el-table-column label="水位类别" align="center" width="100" prop="wqg"/>
<!--    <el-table-column label="警戒/汛限(m)" prop="warn" align="center"/>-->
    <el-table-column label="时间" prop="asot" align="center"/>

  </el-table>
</template>

<script type="text/ecmascript-6">
import Api from '../../../api'
import dayjs from 'dayjs'
export default {
  components: {
  },
  props: {

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
  },
  methods: {
    rowClickHandler(row) {
      if (row) {
        row.querParam = this.querParam
        if(row.sttp == 'RR'){
          window.mpPlugin.reservoirPoint().showPointPopup(row)
        }else{
          window.mpPlugin.waterPoint().showPointPopup(row)
        }
      }
    },
    getWaterList(queryParam) {
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

    getAllList(data){
      let params = {}
      if (data) {
        params = {
          stnm: data
        }
      }
      Api.getWqMsarAList(params).then(res => {
        console.log("水质数据")
        console.log(res)
        if(res.code === 200){
          this.list = res.result
        }
      })
    },
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
</style>
