<template>
  <div class="modelIndex">
    <div class="hd">
      <h3>
        <div class="name">{{ options.fcstObjects.name }} - {{ options.modelName || '马斯京根' }}</div>
        <el-button class="close" type="text" icon="el-icon-close" @click="$emit('close')"/>
      </h3>
    </div>

    <el-form label-width="140px" size="small" :model="form">
      <el-form-item label="预报方案">
        <el-select v-model="form.planId" placeholder="请选择方案" style="width:280px" @change="loadParams">
          <el-option v-for="p in planList" :key="p.id" :label="p.name" :value="p.id"/>
        </el-select>
        <el-button style="margin-left:8px" @click="showPlan = true">方案管理</el-button>
      </el-form-item>
      <el-alert
        title="马斯京根法通过方案参数 K（传播时间）、X（比重因子）进行河道洪水演算。请先在方案中配置 K、X，再运行。"
        type="info" :closable="false" show-icon style="margin-bottom:12px"/>
      <el-row :gutter="12">
        <el-col :span="8"><el-form-item label="参数 K"><el-input v-model="params.K" placeholder="小时"/></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="参数 X"><el-input v-model="params.X" placeholder="0~0.5"/></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="步长 dt"><el-input v-model="params.dt" placeholder="小时"/></el-form-item></el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="8"><el-form-item label="初始入流"><el-input-number v-model="form.initialFlow" :min="0" style="width:100%"/></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="总降雨(mm)"><el-input-number v-model="form.totalRainfall" :min="0" style="width:100%"/></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="时长(小时)"><el-input-number v-model="form.durationHours" :min="1" style="width:100%"/></el-form-item></el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" :loading="saving" @click="saveParams">保存参数</el-button>
        <el-button type="success" :loading="running" @click="run">运行马斯京根演算</el-button>
        <el-button type="warning" @click="showCalibration = true">参数率定</el-button>
      </el-form-item>
    </el-form>

    <el-table v-if="resultRows.length" :data="resultRows" height="280" size="mini" style="margin-top:12px">
      <el-table-column prop="tm" label="时间" width="160"/>
      <el-table-column prop="objectsId" label="断面"/>
      <el-table-column prop="q" label="流量 Q"/>
      <el-table-column prop="z" label="水位 Z"/>
      <el-table-column prop="modelType" label="模型"/>
    </el-table>

    <plan v-if="showPlan" :options="{ objectsId, modelId }" @close="showPlan=false" @refresh="loadPlans"/>
    <xaj-param-calibration
      :options="{ objectsId, modelId, visible: showCalibration }"
      @close="showCalibration=false"/>
  </div>
</template>

<script>
import Api from '@/api'
import plan from '@/components/singleStationForecast/plan/index.vue'
import xajParamCalibration from '@/components/singleStationForecast/paramCalibration/xajIndex.vue'

export default {
  components: { plan, xajParamCalibration },
  props: {
    options: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      objectsId: this.options.fcstObjects.id,
      modelId: this.options.modelId || 6,
      planList: [],
      showPlan: false,
      showCalibration: false,
      saving: false,
      running: false,
      resultRows: [],
      params: { K: '', X: '', dt: '1' },
      form: {
        planId: null,
        initialFlow: 100,
        totalRainfall: 50,
        durationHours: 24
      }
    }
  },
  mounted() {
    this.loadPlans()
  },
  methods: {
    loadPlans() {
      Api.getFcstPlanList({ objectsId: this.objectsId, modelId: this.modelId }).then(res => {
        this.planList = res.result || []
        if (this.planList.length) {
          this.form.planId = this.planList[0].id
          this.loadParams()
        }
      })
    },
    loadParams() {
      if (!this.form.planId) return
      Api.getPlanParamsList({ planId: this.form.planId, modelId: this.modelId }).then(res => {
        const list = res.result || []
        list.forEach(item => {
          const key = (item.paramsName || '').toUpperCase()
          if (key === 'K' || key === 'KE') this.params.K = item.paramsValue
          if (key === 'X' || key === 'XE') this.params.X = item.paramsValue
          if (key === 'DT' || key === 'DT_HOURS') this.params.dt = item.paramsValue
        })
      })
    },
    async saveParams() {
      if (!this.form.planId) {
        this.$message.warning('请选择方案')
        return
      }
      this.saving = true
      try {
        const entries = [
          { paramsName: 'K', paramsValue: this.params.K },
          { paramsName: 'X', paramsValue: this.params.X },
          { paramsName: 'dt', paramsValue: this.params.dt }
        ]
        for (const e of entries) {
          await Api.savePlanParams({
            planId: this.form.planId,
            modelId: this.modelId,
            paramsName: e.paramsName,
            paramsValue: String(e.paramsValue)
          })
        }
        this.$message.success('参数已保存')
      } finally {
        this.saving = false
      }
    },
    run() {
      if (!this.form.planId) {
        this.$message.warning('请选择方案')
        return
      }
      this.running = true
      Api.muskingumRun({
        rootObjectsId: this.objectsId,
        planId: this.form.planId,
        initialFlow: this.form.initialFlow,
        totalRainfall: this.form.totalRainfall,
        durationHours: this.form.durationHours
      }).then(res => {
        if (res.code === 200) {
          this.resultRows = (res.result && res.result.rows) || []
          this.$message.success(`演算完成，保存 ${res.result && res.result.saved || 0} 条`)
        } else {
          this.$message.error(res.message || '演算失败')
        }
      }).finally(() => { this.running = false })
    }
  }
}
</script>

<style scoped>
.modelIndex {
  height: 100%;
  padding: 15px;
  background: var(--panel-bg, rgba(0, 16, 30, 0.52));
  color: #fff;
  border: 1px solid rgba(0, 255, 246, 0.2);
  overflow: auto;
}
.hd > h3 { overflow: hidden; }
.hd .name { float: left; font-size: 20px; }
.hd .close { float: right; }
</style>
