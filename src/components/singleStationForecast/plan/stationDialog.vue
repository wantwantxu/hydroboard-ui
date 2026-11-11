<template>
  <el-dialog
    title="测站管理"
    :visible.sync="innerVisible"
    width="900px"
    :modal="true"
    append-to-body
    modal-class="home-dialog-mask"
    custom-class="home-dialog"
  >
    
    <div style="margin-bottom: 10px;">
      <el-button size="small" type="primary" @click="addRow">新增测站</el-button>
    </div>

    
    <div style="max-height: 400px; overflow-y: auto;">
      <el-table class="no-table-border" :data="tableData" stripe style="width: 100%">

        
        <el-table-column prop="stcd" label="测站编码" width="150">
          <template v-slot="{ row }">
            <span v-if="!row._editing">{{ row.stcd }}</span>
            <el-select
              v-else
              v-model="row.stcd"
              value-key="stcd"
              filterable
              remote
              placeholder="输入测站名或编码搜索"
              :loading="loadingStations"
              :remote-method="queryStations"
              @change="handleStationChange(row)"
            >
              <el-option
                v-for="item in stationOptions"
                :key="item.stcd"
                :value="item.stcd"
              >
                {{`${item.stcd} - ${item.stnm}`}}
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <!-- 测站名称 -->
        <el-table-column prop="stnm" label="测站名称" width="250">
          <template v-slot="{ row }">
            <span>{{ row.stnm }}</span>
          </template>
        </el-table-column>

        <!-- 测站类型 -->
        <el-table-column prop="sttp" label="测站类型" width="150">
          <template v-slot="{ row }">
            <span v-if="!row._editing">
              {{ row.sttp === 'RR' ? '水文站' : row.sttp === 'PP' ? '雨量站' : row.sttp === 'ZZ' ? '水位站' : '' }}
            </span>
            <el-select v-else v-model="row.sttp" placeholder="类型" style="width: 100%">
              <el-option label="水文站" value="RR" />
              <el-option label="雨量站" value="PP" />
              <el-option label="水位站" value="ZZ" />
            </el-select>
          </template>
        </el-table-column>

        <!-- 权重 -->
        <el-table-column prop="weight" label="权重" width="150">
          <template v-slot="{ row }">
            <span v-if="!row._editing">{{ row.weight }}</span>
            <el-input v-else v-model="row.weight" placeholder="权重" />
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" width="180">
          <template v-slot="{ row, $index }">
            <el-button
              v-if="!row._editing"
              size="mini"
              type="primary"
              @click="row._editing = true"
            >编辑</el-button>

            <el-button
              v-else
              size="mini"
              type="success"
              @click="saveRow($index)"
            >保存</el-button>

            <el-button
              size="mini"
              type="danger"
              @click="removeRow($index)"
            >删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import Api from "../../../api";

export default {
  name: "StationDialog",
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
    getTableList() {
      Api.getPlanRelStation({
        objectsId: this.options.objectsId,
        planId: this.options.planId,
        modelId: this.options.modelId
      }).then(response => {
        if (response.code === 200) {
          this.tableData = response.result.map(item => ({
            ...item,
            _editing: false
          }));
        }
      });
    },

    handleStationChange(row) {
      const selectedOption = this.stationOptions.find(item => item.stcd === row.stcd);
      if (selectedOption) {
        row.stnm = selectedOption.stnm;
      }
    },

    addRow() {
      this.tableData.push({
        stcd: "",
        stnm: "",
        sttp: "",
        weight: 0.5,
        objectsId: this.options.objectsId,
        planId: this.options.planId,
        modelId: this.options.modelId,
        _editing: true
      });
    },

    removeRow(index) {
      this.tableData.splice(index, 1);
    },

    saveRow(index) {
      const row = this.tableData[index];
      if (!row.stnm) {
        this.$message.error("请选择测站名称");
        return;
      }
      if (!row.sttp) {
        this.$message.error("请选择测站类型");
        return;
      }
      if (row.weight === "" || isNaN(row.weight) || row.weight < 0 || row.weight > 1) {
        this.$message.error("请输入0-1之间的有效权重");
        return;
      }
      Api.savetPlanAutoRel(row).then(res => {
        if (res.code === 200) {
          this.$message.success("保存成功");
          row._editing = false;
          this.getTableList();
        }
      });
    },

    queryStations(query) {
      if (query.trim() === "") {
        this.stationOptions = [];
        return;
      }
      this.loadingStations = true;
      Api.getStation({ keyword: query.trim() }).then(res => {
        this.loadingStations = false;
        if (res.code === 200) {
          this.stationOptions = res.result;
        }
      }).catch(() => {
        this.loadingStations = false;
        this.$message.error("搜索测站失败");
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
