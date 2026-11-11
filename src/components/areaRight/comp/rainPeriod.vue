<template>
  <div class="warp">
    <el-table
      :data="tableData"
      max-height="390px"
      stripe
      highlight-current-row
      @row-click="onRowClick"
    >
      <el-table-column type="index" label="序号" width="50" align="center"/>
      <el-table-column prop="stnm" label="站名" align="center" show-overflow-tooltip/>
      <el-table-column prop="drp" label="时段雨量(mm)" width="120" align="center"/>
      <el-table-column prop="tm" label="时间" align="center" show-overflow-tooltip/>
    </el-table>
  </div>
</template>

<script>
import Api from '@/api'

export default {
  data() {
    return {
      tableData: [],
      queryParam: {}
    }
  },
  methods: {
    init(date) {
      this.queryParam = date || {}
      this.load()
    },
    changeHandle(date) {
      this.init(date)
    },
    load() {
      Api.getRainSumList({
        startDate: this.queryParam.startDate,
        endDate: this.queryParam.endDate,
        sttpList: this.queryParam.sttpList
      }).then((response) => {
        const list = (response && response.result) || []
        this.tableData = Array.isArray(list) ? list.map(r => ({ ...r, stnm: (r.stnm || '').trim() })) : []
      }).catch(() => {
        this.tableData = []
      })
    },
    onRowClick(row) {
      if (row && window.mpPlugin && window.mpPlugin.rainPoint) {
        window.mpPlugin.rainPoint().showPointPopup(row)
      }
    }
  }
}
</script>
