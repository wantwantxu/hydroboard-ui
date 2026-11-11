<template>
  <el-dialog
    title="洪峰滞时"
    :visible.sync="innerVisible"
    width="800px"
    :modal="true"
    append-to-body
    modal-class="home-dialog-mask"
    custom-class="home-dialog"
  >
    
    <div class="toolbar">
      
      <el-upload
        action="#"
        :http-request="handleUpload"
        :show-file-list="false"
      >
        <el-button size="small" type="success">导入Excel</el-button>
      </el-upload>

      
      <el-button
        size="small"
        type="primary"
        @click="handleExport"
      >
        导出Excel
      </el-button>
    </div>

    
    <div style="max-height: 400px; overflow-y: auto;">
      <el-table class="no-table-border" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="r" label="R值 (Y)" width="100" />
        <el-table-column prop="lagHours" label="时间 (X)" />
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import Api from "../../../api";

export default {
  name: "PeakLagTimeDialog",
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      innerVisible: false,
      searchR: "",
      searchX: "",
      tableData: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async handleUpload(param) {
      const objectsId = this.options.objectsId
      const formData = new FormData();
      formData.append("file", param.file);
      formData.append("objectsId", objectsId);

      try {
        let res = await Api.importPeakLagTime(formData);
        this.$message.success("导入成功，共 " + res.result + " 条数据");
        this.fetchData();
        param.onSuccess();
      } catch (e) {
        this.$message.error("导入失败");
        param.onError(e);
      }
    },
    fetchData() {
      const objectsId = this.options.objectsId
      this.loading = true;
      Api.listPeakLagTime({objectsId}).then(response => {
        this.tableData = response.result;
      }).finally(() => {
        this.loading = false;
      });
    },
    
    async handleExport() {
      try {
        const objectsId = this.options.objectsId
        this.$message.info("正在导出，请稍候...");
        const res = await Api.exportPeakLagTime({objectsId});
        this.$message.success("导出成功！");
      } catch (e) {
        console.error(e)
        this.$message.error("导出失败");
      }
    },
    open() {
      this.innerVisible = true;
    },
    close() {
      this.innerVisible = false;
    },
    handleSearch() {

    },
    resetSearch() {
      this.searchR = "";
      this.searchX = "";
    }
  }
};
</script>


<style scoped>
.toolbar{
  display: flex;
  justify-content: flex-end; 
  gap: 8px;                  
  align-items: center;
  margin-top: 10px;
  margin-bottom: 8px;
}
</style>
