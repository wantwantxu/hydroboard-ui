<template>
  <el-dialog
    title="水位流量关系"
    :visible.sync="innerVisible"
    width="900px"
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
        accept=".xlsx,.xls"
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
        <el-table-column prop="stcd" label="测站编码" />
        <el-table-column prop="ptno" label="点序号" />
        <el-table-column prop="z" label="水位" />
        <el-table-column prop="q" label="流量" />
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import Api from "../../../api";

export default {
  name: "ZqLineDialog",
  props: {
    options: {
      type: Object,
      default: () => ({
        objectsId: null,
        planId: null,
        modelId: null
      })
    }
  },
  data() {
    return {
      innerVisible: false,
      tableData: [],
      stationOptions: [],
      loadingStations: false
    };
  },
  methods: {

    async handleUpload(param) {
      const formData = new FormData();
      formData.append("file", param.file);
      try {
        const res = await Api.importZqrl(formData);
        this.$message.success("导入成功，共 " + res.result + " 条数据");
        this.getTableList();
        if (param.onSuccess) param.onSuccess();
      } catch (e) {
        console.error(e);
        this.$message.error("导入失败");
        if (param.onError) param.onError(e);
      }
    },


    async handleExport() {
      try {
        this.$message.info("正在导出，请稍候...");
        await Api.exportZqrl({stcd: this.options.objectsId});
        this.$message.success("导出成功！");
      } catch (e) {
        console.error(e);
        this.$message.error("导出失败");
      }
    },


    getTableList() {
      Api.listZqrl({
        stcd: this.options.objectsId
      }).then(response => {
        if (response.code === 200) {
          this.tableData = response.result;
        }
      }).catch(err => {
        console.error(err);
      });
    },

    open() {
      this.getTableList();
      this.innerVisible = true;
    },

    close() {
      this.innerVisible = false;
      this.stationOptions = [];
    }
  }
};
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: flex-end; 
  gap: 8px; 
  align-items: center;
  margin-top: 10px;
  margin-bottom: 8px;
}
</style>
