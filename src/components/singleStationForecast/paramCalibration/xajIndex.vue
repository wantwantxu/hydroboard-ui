<template>
  <el-dialog
    title="参数率定"
    width="1000px"
    :visible.sync="options.visible"
    :modal="true"
    append-to-body
    modal-class="home-dialog-mask"
    custom-class="home-dialog"
    @close="handleClose"
    class="param-dialog">

    <div class="dialog-content">

      <div class="form-section">
        <el-form label-width="100px" :inline="true">
          <el-form-item label="率定方案">
            <el-select
              v-model="selectedSchemeId"
              placeholder="选择或新建率定方案"
              filterable
              @change="onSchemeChange">
              <el-option
                v-for="s in configOptions"
                :key="s.id"
                :label="s.schemeName"
                :value="s.id" />
            </el-select>
            <el-button type="primary" @click="createNewScheme" :disabled="!selectedFcstPlan">新增</el-button>
          </el-form-item>
          
          <el-form-item label="流域">
            <el-select
              v-model="selectedBasin"
              placeholder="选择流域"
              @change="onBasinChange">
              <el-option
                v-for="item in fcstObjectsList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="预报方案">
            <el-select v-model="selectedFcstPlan" placeholder="选择预报方案" :disabled="!selectedBasin" @change="onFcstPlanChange">
              <el-option v-for="p in fcstPlanList" :key="p.id" :label="p.name" :value="p.id" />
            </el-select>
          </el-form-item>

          
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              align="right"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="success" @click="saveScheme">保存方案</el-button>
          </el-form-item>
        </el-form>
      </div>

      
      <div class="table-container">
        <el-table
          class="no-table-border"
          :data="paramTable"
          size="small"
          style="width: 100%"
          height="400px">
          <el-table-column prop="paramName" label="参数" width="150" />
          <el-table-column label="推荐值">
            <template #default="{ row }">
              <el-input-number
                v-model="row.value"
                :min="row.valueMin"
                :max="row.valueMax"
                :step="0.1"
                controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column label="最小值">
            <template #default="{ row }">
              <el-input-number
                v-model="row.valueMin"
                :step="0.1"
                controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column label="最大值">
            <template #default="{ row }">
              <el-input-number
                v-model="row.valueMax"
                :step="0.1"
                controls-position="right" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 操作按钮 -->
      <div class="btn-group" style="margin-top:10px;text-align:right">
        <el-button type="primary" @click="runModel">运行模型</el-button>
        <el-button type="warning" @click="autoTune">自动率定</el-button>
      </div>

      <!-- 评分显示 -->
      <div class="score-section" v-if="scores" style="margin-top:10px">
        <el-card>
          <div v-for="(val,key) in scores" :key="key">
            {{ key }} : {{ val }}
          </div>
        </el-card>
      </div>

    </div>
  </el-dialog>
</template>

<script>
import Api from "@/api";

export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      modelId: this.options.modelId,
      selectedBasin: null,
      selectedFcstPlan: null,
      selectedSchemeId: null,
      fcstPlanList: [],
      configOptions: [],
      stationIds: [],
      stationOptions: [],
      dateRange: [],
      fcstObjectsList: [],
      selectedModel: 'xaj',
      scores: null,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setDate(end.getDate() - 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(end.getMonth() - 1);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近两月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(end.getMonth() - 2);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(end.getMonth() - 3);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      paramTable: []
    };
  },
  mounted() {
    this.loadCalibrationConfig();
    this.loadObjectsList();
  },
  methods: {
    handleClose() { this.$emit('close'); },


    async onBasinChange(objectsId) {
      this.stationOptions = [];
      this.fcstPlanList = [];
      if(!objectsId) return;
      this.loadFcstPlan(objectsId);
    },
    async loadFcstPlan(objectsId) {
      this.selectedFcstPlan = '';
      const res = await Api.getFcstPlanList({ objectsId, modelId: this.modelId });
      this.fcstPlanList = res.result || [];

      const scheme = this.configOptions.find(s => s.id === this.selectedSchemeId);
      if (!scheme || !scheme.fcstplanId || !this.fcstPlanList.length) {
        return;
      }
      const targetPlanId = typeof this.fcstPlanList[0].id === 'number'
        ? Number(scheme.fcstplanId)
        : String(scheme.fcstplanId);
      this.$nextTick(() => {
        this.selectedFcstPlan = targetPlanId;
      });
    },

    async onFcstPlanChange(planId) {
      this.stationIds = [];
      this.stationOptions = [];
      if(!planId) return;
      const res = await Api.getPlanRelStationList({ objectsId: this.selectedBasin, planId, modelId: this.modelId })
      this.stationOptions = res.result || [];
    },

    async onSchemeChange(schemeId) {
      if (!schemeId) return;
      const scheme = this.configOptions.find(s => s.id === this.selectedSchemeId);
      if (!scheme) return;


      this.selectedBasin = scheme.objectsId;
      this.dateRange = [scheme.startTime, scheme.endTime];
      console.log(this.dateRange)
      await this.loadFcstPlan(scheme.objectsId);
      this.scores = null;
      try {
        const res = await Api.listCalibrationDetail({ calibrationId: schemeId });
        this.paramTable = res.result || [];
      } catch (ex) {
        this.$message.error('加载方案失败');
      }
    },

    createNewScheme(){
      this.selectedSchemeId = null;
      this.stationIds = [];
      this.dateRange = [];
      this.scores = null;

      this.paramTable = [
        { paramName: 'K', value: null, valueMin: 0, valueMax: 5 },
        { paramName: 'WM', value: null, valueMin: 0, valueMax: 300 },
        { paramName: 'B', value: null, valueMin: 0, valueMax: 2 },
        { paramName: 'IMP', value: null, valueMin: 0, valueMax: 1 },
        { paramName: 'SM', value: null, valueMin: 0, valueMax: 200 },
        { paramName: 'EX', value: null, valueMin: 0, valueMax: 2 },
        { paramName: 'KSS', value: null, valueMin: 0, valueMax: 5 },
        { paramName: 'CG', value: null, valueMin: 0, valueMax: 1 },
        { paramName: 'CI', value: null, valueMin: 0, valueMax: 1 },
        { paramName: 'CS', value: null, valueMin: 0, valueMax: 1 },
        { paramName: 'C', value: null, valueMin: 0, valueMax: 1 },
        { paramName: 'L', value: null, valueMin: 0, valueMax: 10 }
      ];
    },
    async loadCalibrationConfig() {
      const res = await Api.listCalibrationConfig({});
      this.configOptions = res.result || [];
    },
    async loadObjectsList() {
      const res = await Api.fcstObjectsList({});
      this.fcstObjectsList = res.result || [];
    },


    async saveScheme(){
      if(!this.selectedBasin || !this.dateRange.length){
        this.$message.warning('请选择流域、站点和时间范围');
        return;
      }
      const payload = {
        id: this.selectedSchemeId,
        modelId: this.options.modelId,
        objectsId: this.selectedBasin,
        fcstplanId: this.selectedFcstPlan,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1],
        paramConfig: this.paramTable
      };
      const res = await Api.saveOrUpdateCalibrationConfig(payload);
      if(res.code===200){
        this.$message.success('保存成功');

        this.onBasinChange(this.selectedBasin);
      } else {
        this.$message.error('保存失败');
      }
    },

    async runModel(){
      if (!this.selectedFcstPlan || !this.paramTable.length) {
        this.$message.warning('请选择预报方案并配置参数');
        return;
      }
      const payload = {
        planId: this.selectedFcstPlan,
        modelId: this.options.modelId || this.modelId,
        objectsId: this.selectedBasin,
        persist: true,
        params: this.paramTable.map(p => ({
          paramName: p.paramName,
          value: p.value != null ? p.value : p.paramValue,
          valueMin: p.valueMin,
          valueMax: p.valueMax
        }))
      };
      const res = await Api.calibrationRun(payload);
      if (res.code === 200) {
        this.scores = (res.result && res.result.scores) || res.result;
        this.$message.success('模型运行完成');
      } else {
        this.$message.error(res.message || '运行失败');
      }
    },
    async autoTune(){
      if (!this.selectedFcstPlan || !this.paramTable.length) {
        this.$message.warning('请选择预报方案并配置参数');
        return;
      }
      const payload = {
        planId: this.selectedFcstPlan,
        modelId: this.options.modelId || this.modelId,
        objectsId: this.selectedBasin,
        persist: true,
        params: this.paramTable.map(p => ({
          paramName: p.paramName,
          value: p.value != null ? p.value : p.paramValue,
          valueMin: p.valueMin,
          valueMax: p.valueMax
        }))
      };
      const res = await Api.calibrationAutoTune(payload);
      if (res.code === 200) {
        this.scores = (res.result && res.result.scores) || res.result;
        if (res.result && res.result.message) {
          this.$message.success(res.result.message);
        } else {
          this.$message.success('自动率定完成');
        }

        this.paramTable = this.paramTable.map(p => {
          if (p.value == null && p.valueMin != null && p.valueMax != null) {
            return { ...p, value: (Number(p.valueMin) + Number(p.valueMax)) / 2 };
          }
          return p;
        });
      } else {
        this.$message.error(res.message || '自动率定失败');
      }
    }
  }
};
</script>

<style scoped>
.dialog-content { display:flex; flex-direction:column; height:100%; }
.form-section { padding:10px 0; flex-shrink:0; }
.table-container { flex:1; min-height:0; overflow:auto; }
.btn-group { margin-top:10px; text-align:right; }
.score-section { margin-top:10px; }
</style>
