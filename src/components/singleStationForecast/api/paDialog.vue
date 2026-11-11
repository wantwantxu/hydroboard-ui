<template>
  <el-dialog
    title="方案结果表"
    :visible.sync="innerVisible"
    width="1000px"
    :modal="true"
    append-to-body
    modal-class="home-dialog-mask"
    custom-class="home-dialog"
  >
    
    <div class="toolbar">
      <el-date-picker
        v-model="query.startTime"
        type="date"
        placeholder="选择开始时间"
        style="margin-right: 10px"
      />
      <el-date-picker
        v-model="query.endTime"
        type="date"
        placeholder="选择结束时间"
      />
      <el-button size="small" type="primary" @click="loadData" style="margin-left: 10px">
        查询
      </el-button>
      <el-button size="small" type="primary" @click="handleExport">
        导出结果
      </el-button>
    </div>

    
    <div style="max-height: 480px; overflow-y: auto;">
      <el-table class="no-table-border" :data="tableData" stripe style="width: 100%">

        <el-table-column prop="dataTime" label="时间" />

        <el-table-column prop="z" label="日雨量(mm)">
          <template v-slot="{ row }">{{ row.z }}</template>
        </el-table-column>

        <el-table-column prop="rain" label="PA值">
          <template v-slot="{ row }">{{ row.rain }}</template>
        </el-table-column>

      </el-table>
    </div>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 10px; text-align: right"
      background
      layout="prev, pager, next"
      :page-size="query.pageSize"
      :current-page="query.pageNo"
      :total="total"
      @current-change="handlePageChange"
    />

  </el-dialog>
</template>

<script>
import Api from "../../../api";

export default {
  name: "PlanResultDialog",
  props: {
    options: {
      type: Object,
      default: () => ({
        planId: null,
        objectsId: null
      })
    }
  },
  data() {
    return {
      innerVisible: false,
      loading: false,
      tableData: [],
      total: 0,

      query: {
        pageNo: 1,
        pageSize: 20,
        startTime: null,
        endTime: null
      }
    };
  },

  created() {

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);


    this.query.startTime = this.formatDate(startDate);
    this.query.endTime = this.formatDate(endDate);
  },

  methods: {

    
    open() {
      this.innerVisible = true;
      this.query.pageNo = 1;
      this.loadData();
    },

    
    close() {
      this.innerVisible = false;
      this.tableData = [];
    },

    
    async loadData() {
      this.loading = true;

      try {
        const params = {
          ...this.query,
          planId: this.options.planId,
          objectsId: this.options.objectsId
        };

        let res = await Api.listPaPlanResult(params);

        if (res.code === 200) {
          this.tableData = res.result.records;
          this.total = res.result.total || 0;
        }
      } catch (e) {
        this.$message.error("加载数据失败");
      } finally {
        this.loading = false;
      }
    },

    
    handlePageChange(page) {
      this.query.pageNo = page;
      this.loadData();
    },

    
    async handleExport() {
      try {
        this.$message.info("导出中...");

        await Api.exportPlanResult({
          planId: this.options.planId,
          objectsId: this.options.objectsId,
          startTime: this.query.startTime,
          endTime: this.query.endTime
        });

        this.$message.success("导出成功");
      } catch (e) {
        this.$message.error("导出失败");
      }
    },

    
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
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

.date-filter {
  margin-bottom: 10px;
}
</style>
