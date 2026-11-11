<template>
  <div class="planDialogMask" @click.self="$emit('close')">
    <div class="planModelIndex bg-com">
      <div class="hd">
        <h3>
          <div class="name">方案管理</div>
          <el-button
            class="close"
            type="text"
            icon="el-icon-close"
            @click="$emit('close')"
          />
        </h3>
      </div>
      <div class="search-header">
        <div></div>
        <div @click="addRow" class="primaryPlainBtn">
          <i class="el-icon-plus"></i>
          <span>新增方案</span>
        </div>
      </div>

      <div style="height: calc(100% - 85px)">
        <el-table
          class="no-table-border"
          :data="tableData"
          height="100%"
          stripe
          style="width: 100%">

          <el-table-column type="index" label="序号" width="50"/>

          
          <el-table-column label="方案名称">
            <template slot-scope="scope">
              <el-input
                v-if="scope.row._editing"
                v-model="scope.row.name"
                size="mini"/>
              <span v-else>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <template v-if="scope.row._editing">
                <el-button type="primary" size="mini" @click="saveRow(scope.row)">保存</el-button>
                <el-button size="mini" @click="cancelEdit(scope.row)">取消</el-button>
              </template>
              <template v-else>
                <el-button size="mini" type="primary" @click="editRow(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/api";
export default {
  props: {
    options: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data() {
    return {
      queryForm: {
        objectsId: this.options.objectsId,
        modelId: this.options.modelId,
        name: ''
      },
      tableData: []
    };
  },
  mounted() {
    this.handleSearch();
  },
  methods: {
    handleSearch() {
      this.getTableList();
    },
    getTableList() {
      Api.getFcstPlanList(this.queryForm).then(res => {
        if (res.code === 200) {
          this.tableData = (res.result || []).map(r => ({ ...r, _editing: false }));
        }
      });
    },
    addRow() {

      if (this.tableData.some(item => item._editing)) {
        this.$message.warning("请先保存或取消正在编辑的方案！");
        return;
      }
      this.tableData.unshift({
        id: null,
        name: "",
        modelId: this.options.modelId,
        objectsId: this.objectsId,
        _editing: true
      });
    },
    editRow(row) {

      if (this.tableData.some(item => item._editing)) {
        this.$message.warning("请先保存或取消正在编辑的方案！");
        return;
      }
      row._editing = true;
    },
    cancelEdit(row) {
      if (!row.id) {

        this.tableData.splice(this.tableData.indexOf(row), 1);
      } else {
        row._editing = false;
      }
    },
    saveRow(row) {
      if (!row.name) {
        this.$message.error("方案名称不能为空！");
        return;
      }
      row.objectsId = this.options.objectsId;
      row.modelId = this.options.modelId;
      Api.savePlan(row).then(res => {
        if (res.code === 200) {
          this.$message.success("方案保存成功");
          row._editing = false;
          this.$emit('refresh');
          this.getTableList();
        }
      });
    },
    del(row) {
      this.$confirm('确定要进行删除操作吗？此操作不可恢复！', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Api.getFcstPlanDelete(row.id).then(() => {
          this.$message.success('删除成功!');
          this.handleSearch();
        });
      });
    }
  }
};
</script>


<style lang="scss" scoped>
.planDialogMask {
  position: fixed;
  inset: 0;
  background: rgba(0, 10, 20, 0.72);
  z-index: 1999;
}

.planModelIndex {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 500px;
  padding: 15px;
  color: #fff;
  z-index: 1000;
  background: #01101e !important;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.55);

  .hd {
    > h3 {
      overflow: hidden;

      .name {
        float: left;
        font-size: 20px;
        font-family: YouSheBiaoTiHei-Regular, YouSheBiaoTiHei, sans-serif;
        font-weight: 400;
        font-size: 20px;
      }

      .close {
        float: right;
        cursor: pointer;
      }

    }
  }
}

.search-header {
  width: 100%; display: flex; justify-content: space-between;
  padding-bottom: 10px;
}

.search-form {
  display: flex;
  align-items: center;
}

.primaryPlainBtn {
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  height: 32px;
  line-height: 32px;
  color: #00fff6;
  background: rgba(0, 255, 246, 0.14);
  border: 1px solid rgba(0, 255, 246, 0.55);
  border-radius: 4px;
  cursor: pointer;
}

.primaryPlainBtn i {
  margin-right: 5px;
}

.primaryPlainBtn:hover {
  background: rgba(0, 255, 246, 0.24);
  border-color: #00fff6;
  color: #ccff00;
}

.planModelIndex ::v-deep .el-button--primary,
.planModelIndex ::v-deep .el-button--danger {
  background: rgba(0, 255, 246, 0.14);
  border-color: rgba(0, 255, 246, 0.55);
  color: #00fff6;
}

.planModelIndex ::v-deep .el-button--primary:hover,
.planModelIndex ::v-deep .el-button--danger:hover {
  background: rgba(0, 255, 246, 0.24);
  border-color: #00fff6;
  color: #ccff00;
}
</style>
