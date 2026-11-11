<template>
  <el-dialog
    title="单位线管理"
    :visible.sync="innerVisible"
    width="500px"
    :modal="true"
    append-to-body
    modal-class="home-dialog-mask"
    custom-class="home-dialog"
  >
    
    <div class="toolbar">
      
      <el-upload
        :auto-upload="false"
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

    
    <el-table
      class="no-table-border"
      :data="tableData"
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column
        prop="stepNo"
        label="时段序号"
        type="index"
        width="120px"
      />
      <el-table-column
        prop="ordinateValue"
        label="单位线纵坐标值"
      />
    </el-table>
  </el-dialog>
</template>

<script>
import Api from "../../../api";

export default {
  name: "UnitHydrographDialog",
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      innerVisible: false,
      tableData: [],
      loading: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    
    async handleUpload(param) {
      const formData = new FormData();
      formData.append("objectsId", this.options.objectsId);
      formData.append("file", param.file);

      try {
        let res = await Api.importUnitHydrograph(formData);
        this.$message.success("导入成功，共 " + res.result + " 条数据");
        this.fetchData();
        param.onSuccess();
      } catch (e) {
        this.$message.error("导入失败");
        param.onError(e);
      }
    },

    
    async handleExport() {
      try {
        this.$message.info("正在导出，请稍候...");
        const res = await Api.exportUnitHydrograph();
        this.$message.success("导出成功！");
      } catch (e) {
        console.error(e)
        this.$message.error("导出失败");
      }
    },

    
    fetchData() {
      this.loading = true;
      const objectsId = this.options.objectsId
      Api.unitHydrographList({objectsId})
        .then(response => {
          this.tableData = response.result || [];
        })
        .finally(() => {
          this.loading = false;
        });
    },

    open() {
      this.innerVisible = true;
      this.fetchData();
    },

    close() {
      this.innerVisible = false;
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
