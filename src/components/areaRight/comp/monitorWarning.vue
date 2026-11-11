<template>
  <el-table
    :data="tableData"
    @selection-change="handleSelectionChange"
    ref="multipleTable"
    style="width: 100%;" height="420" max-height="390px" class="rc-bd">
    <el-table-column
      type="selection">
    </el-table-column>
    <el-table-column
      label="序号"
      type="index"
      width="50">
    </el-table-column>
    <el-table-column
      prop="stnm"
      label="站名"
      width="80">
    </el-table-column>
    <el-table-column
      prop="stationId"
      label="站码"
      width="80">
    </el-table-column>
    <el-table-column
      prop="type"
      label="类型">
    </el-table-column>
    <el-table-column
      prop="tm"
      label="时间"
     width="100">
    </el-table-column>
  </el-table>
</template>

<script type="text/ecmascript-6">
import Api from "@/api"
export default {
name: "monitorWarning",
data(){
  return{
    tableData: [],
    multipleSelection: []
   }
  },
mounted() {

  this.initData()
},
methods:{
  initData(){
    let that = this
    Api.getWarnInfoList().then(res => {
      console.log(res)
      that.tableData = res.result
    })
  },
  handleSelectionChange(val) {
    this.multipleSelection = val;
    console.log(this.multipleSelection)
  },
  cleanCheckBox() {
    this.$refs.multipleTable.clearSelection();
  }
}
}
</script>

<style type="text/scss" lang="scss" scoped>


</style>
