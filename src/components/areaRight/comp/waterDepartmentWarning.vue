<template>
  <el-table
    :data="tableData"
    ref="multipleTable"
    style="width: 100%;" height="420" max-height="390px"
    class="rc-bd"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection">
    </el-table-column>
    <el-table-column
      type="index"
      label="序号"
      width="50">
    </el-table-column>
    <el-table-column
      width="180"
      label="预警内容"
      show-overflow-tooltip>
      <template slot-scope="scope">
        <img :src="scope.row.wrIcon" class="warnImg"/>
        <span style="margin-left: 10px">{{ scope.row.wrTitle }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="时间"
      show-overflow-tooltip>
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.iymdh }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script type="text/ecmascript-6">
import Api from '@/api'
export default {
name: "waterDepartmentWarning",
  data(){
  return{
    tableData: [],
    setIntervalHandler: null,
    multipleSelection: []
   }
  },
  mounted() {
   this.getWaringData()

   this.setIntervalHandler = setInterval(this.getWaringData(),5 * 60 * 1000)
  },
  destroyed() {

   this.setIntervalHandler &&  clearInterval(this.setIntervalHandler)
  },
  methods:{
    getWaringData() {

      window.mpPlugin.waterWarningPoint().clearLayer()
      Api.listWaringWater().then((res) => {
        if (res.code === 0) {
          this.tableData = res.data.list.filter(item => item.unitName === '示范水文')
          console.log(res)
          this.tableData = res.data.list
          window.mpPlugin.waterWarningPoint().showPoint(this.tableData)
        }
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
.warnImg{
  width: 18px;
  min-width: 18px;
  height: 18px;
  margin-top: 4px;
}
</style>
