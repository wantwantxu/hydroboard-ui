<template>
  <el-dialog
    title="降雨径流关联表"
    :visible.sync="innerVisible"
    width="80%"
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
    
      <el-table class="no-table-border" :data="filteredRows" max-height="400" style="width: 100%">
      
      <el-table-column prop="p" label="P" width="80" fixed />
      
      <el-table-column
        v-for="pa in paList"
        :key="pa"
        :label="'Pa=' + pa"
        :prop="'pa_' + pa"
        align="center"
      />
    </el-table>
  </el-dialog>
</template>

<script>
import Api from "../../../api";

export default {
  name: "PRDialog",
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      innerVisible: false,
      paList: [],
      tableRows: [],
      searchR: "",
      loading: false,
    };
  },
  computed: {
    filteredRows() {
      if (!this.searchR) return this.tableRows;
      return this.tableRows.filter(row =>
        Object.values(row).some(val =>
          val != null && val.toString().includes(this.searchR)
        )
      );
    }
  },
  methods: {
    async handleUpload(param) {
      const formData = new FormData();
      formData.append("objectsId", this.options.objectsId);
      formData.append("file", param.file);

      try {
        let res = await Api.importPR(formData);
        this.$message.success("导入成功，共 " + res.result + " 条数据");
        this.fetchData();
        param.onSuccess();
      } catch (e) {
        this.$message.error("导入失败");
        param.onError(e);
      }
    },
    async fetchData() {
      const objectsId = this.options.objectsId
      this.loading = true;
      try {
        let response = await Api.prList({objectsId});
        let data = response.result || [];


        this.paList = [...new Set(data.map(d => d.pa))].sort((a, b) => a - b);


        let grouped = {};
        data.forEach(item => {
          if (!grouped[item.p]) {
            grouped[item.p] = { p: item.p };
          }
          grouped[item.p]["pa_" + item.pa] = item.r;
        });

        this.tableRows = Object.values(grouped).sort((a, b) => a.p - b.p);
      } finally {
        this.loading = false;
      }
    },
    
    async handleExport() {
      try {
        const objectsId = this.options.objectsId
        this.$message.info("正在导出，请稍候...");
        const res = await Api.exportPR({objectsId});
        this.$message.success("导出成功！");
      } catch (e) {
        console.error(e)
        this.$message.error("导出失败");
      }
    },
    open() {
      this.innerVisible = true;
      this.fetchData();
    },
    close() {
      this.innerVisible = false;
    },
    save() {
      console.log("保存数据:", this.tableRows);
      this.$message.success("保存成功！");
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
