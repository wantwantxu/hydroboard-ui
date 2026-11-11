<template>
  <div class="modelIndex">
    <div class="hd">
      <h3>
        <div class="name">{{ options.fcstObjects.name }} - 梯级预报 / 河道拓扑</div>
        <el-button class="close" type="text" icon="el-icon-close" @click="$emit('close')"/>
      </h3>
    </div>

    <el-tabs v-model="tab" class="cascade-tabs">
      <el-tab-pane label="拓扑图编辑" name="graph">
        <topology-editor
          :root-stcd="objectsId"
          :root-name="options.fcstObjects.name"
          @saved="onTopoSaved"
        />
      </el-tab-pane>

      <el-tab-pane label="河段列表" name="topo">
        <div class="reach-pane" v-loading="loading">
          <div class="reach-toolbar">
            <div class="reach-count">共 {{ reachList.length }} 段</div>
            <div>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addRow">新增河段</el-button>
              <el-button size="mini" icon="el-icon-refresh" @click="loadTopo">刷新</el-button>
            </div>
          </div>
          <div v-if="!reachList.length" class="reach-empty">还没有河段。在拓扑图里连线，或点「新增河段」。</div>
          <div v-else class="reach-list">
            <div v-for="(row, index) in reachList" :key="row.id || ('new-' + index)" class="reach-card">
              <div class="reach-head">
                <span class="reach-no">{{ index + 1 }}</span>
                <span class="reach-flow">
                  <b>{{ row.upstreamStnm || row.upstreamStcd || '上游' }}</b>
                  <i class="el-icon-right"/>
                  <b>{{ row.downstreamStnm || row.downstreamStcd || '下游' }}</b>
                </span>
                <el-tag size="mini" effect="plain">{{ transferLabel(row.flowTransferType) }}</el-tag>
              </div>
              <div class="reach-grid">
                <label>上游站码<el-input v-model="row.upstreamStcd" size="mini"/></label>
                <label>上游站名<el-input v-model="row.upstreamStnm" size="mini"/></label>
                <label>下游站码<el-input v-model="row.downstreamStcd" size="mini"/></label>
                <label>下游站名<el-input v-model="row.downstreamStnm" size="mini"/></label>
                <label>传递方式
                  <el-select v-model="row.flowTransferType" size="mini">
                    <el-option label="出流 outflow" value="outflow"/>
                    <el-option label="总出流 total_out" value="total_out"/>
                    <el-option label="按比例 portion" value="portion"/>
                  </el-select>
                </label>
                <label>传递比例<el-input-number v-model="row.flowTransferRatio" :min="0" :max="1" :step="0.1" :precision="2" size="mini" controls-position="right"/></label>
                <label>传播时间(h)<el-input-number v-model="row.delayTimeH" :min="0" size="mini" controls-position="right"/></label>
                <label>衰减系数<el-input-number v-model="row.attenuationCoeff" :min="0.5" :max="1.5" :step="0.05" :precision="2" size="mini" controls-position="right"/></label>
              </div>
              <div class="reach-actions">
                <el-button type="primary" size="mini" @click="saveRow(row)">保存</el-button>
                <el-button type="danger" size="mini" plain @click="removeRow(row, index)">删除</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="运行预报" name="run">
        <div class="run-pane">
          <el-form label-width="120px" size="small" :model="form">
            <el-form-item label="预报方案">
              <el-select v-model="form.planId" placeholder="请选择方案" style="width:280px">
                <el-option v-for="p in planList" :key="p.id" :label="p.name" :value="p.id"/>
              </el-select>
              <el-button style="margin-left:8px" @click="showPlan = true">方案管理</el-button>
            </el-form-item>
            <el-alert
              title="梯级演算使用马斯京根方案参数 K（传播时间）、X（比重因子）。请先在方案管理中配置，再运行。"
              type="info" :closable="false" show-icon style="margin-bottom:12px"/>
            <el-row :gutter="12">
              <el-col :span="8"><el-form-item label="初始入流"><el-input-number v-model="form.initialFlow" :min="0" style="width:100%"/></el-form-item></el-col>
              <el-col :span="8"><el-form-item label="总降雨(mm)"><el-input-number v-model="form.totalRainfall" :min="0" style="width:100%"/></el-form-item></el-col>
              <el-col :span="8"><el-form-item label="时长(小时)"><el-input-number v-model="form.durationHours" :min="1" style="width:100%"/></el-form-item></el-col>
            </el-row>
            <el-form-item>
              <el-button type="success" :loading="running" @click="runCascade">运行梯级预报</el-button>
            </el-form-item>
          </el-form>
          <el-table v-if="resultRows.length" :data="resultRows" height="280" size="mini">
            <el-table-column prop="tm" label="时间" width="160"/>
            <el-table-column prop="objectsId" label="断面"/>
            <el-table-column prop="q" label="流量"/>
            <el-table-column prop="z" label="水位"/>
            <el-table-column prop="modelType" label="模型"/>
            <el-table-column prop="remark" label="备注"/>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <plan v-if="showPlan" :options="{ objectsId, modelId }" @close="showPlan=false" @refresh="loadPlans"/>
  </div>
</template>

<script>
import Api from '@/api'
import TopologyEditor from './TopologyEditor.vue'
import plan from '@/components/singleStationForecast/plan/index.vue'

export default {
  components: { TopologyEditor, plan },
  props: {
    options: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      tab: 'graph',
      objectsId: this.options.fcstObjects.id,
      modelId: Number(this.options.modelId) || 6,
      showPlan: false,
      loading: false,
      running: false,
      reachList: [],
      planList: [],
      resultRows: [],
      form: {
        planId: null,
        initialFlow: 100,
        totalRainfall: 50,
        durationHours: 24
      }
    }
  },
  mounted() {
    this.loadTopo()
    this.loadPlans()
  },
  methods: {
    onTopoSaved() {
      this.loadTopo()
    },
    transferLabel(type) {
      return { outflow: '出流', total_out: '总出流', portion: '按比例' }[type] || type || '出流'
    },
    loadPlans() {
      Api.getFcstPlanList({ objectsId: this.objectsId, modelId: this.modelId }).then(res => {
        this.planList = res.result || []
        if (!this.planList.some(p => p.id === this.form.planId)) {
          this.form.planId = this.planList.length ? this.planList[0].id : null
        }
      })
    },
    loadTopo() {
      this.loading = true
      Api.reachRelListByRoot({ rootStcd: this.objectsId }).then(res => {
        this.reachList = res.result || []
        if (!this.reachList.length) {
          return Api.reachRelList({})
        }
        return null
      }).then(res => {
        if (res && res.result) this.reachList = res.result
      }).finally(() => { this.loading = false })
    },
    addRow() {
      this.reachList.unshift({
        id: 0,
        upstreamStcd: this.objectsId,
        upstreamStnm: this.options.fcstObjects.name,
        downstreamStcd: '',
        downstreamStnm: '',
        flowTransferType: 'outflow',
        flowTransferRatio: 1,
        delayTimeH: 1,
        attenuationCoeff: 1,
        orderIndex: this.reachList.length + 1
      })
    },
    saveRow(row) {
      if (!row.upstreamStcd || !row.downstreamStcd) {
        this.$message.warning('上下游站码不能为空')
        return
      }
      Api.reachRelSave(row).then(res => {
        if (res.code === 200) {
          this.$message.success('已保存')
          this.loadTopo()
        }
      })
    },
    removeRow(row, index) {
      if (!row.id) {
        this.reachList.splice(index, 1)
        return
      }
      Api.reachRelRemove(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success('已删除')
          this.loadTopo()
        }
      })
    },
    runCascade() {
      if (!this.form.planId) {
        this.$message.warning('请选择方案')
        return
      }
      this.running = true
      Api.cascadeRun({
        rootObjectsId: this.objectsId,
        planId: this.form.planId,
        initialFlow: this.form.initialFlow,
        totalRainfall: this.form.totalRainfall,
        durationHours: this.form.durationHours
      }).then(res => {
        if (res.code === 200) {
          this.resultRows = (res.result && res.result.rows) || []
          this.$message.success(`梯级预报完成，保存 ${res.result && res.result.saved || 0} 条`)
        } else {
          this.$message.error(res.message || '运行失败')
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.hd > h3 { overflow: hidden; flex-shrink: 0; }
.hd .name { float: left; font-size: 20px; }
.hd .close { float: right; }
.cascade-tabs {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.cascade-tabs >>> .el-tabs__content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.cascade-tabs >>> .el-tab-pane {
  height: 100%;
}
.reach-pane, .run-pane {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.reach-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-shrink: 0;
}
.reach-count { color: rgba(255, 255, 255, 0.7); font-size: 13px; }
.reach-empty {
  padding: 36px 12px;
  text-align: center;
  color: rgba(255, 255, 255, 0.55);
  border: 1px dashed rgba(52, 220, 255, 0.35);
  border-radius: 8px;
}
.reach-list {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 12px;
  align-content: start;
  padding-right: 4px;
}
.reach-card {
  background: rgba(8, 30, 50, 0.55);
  border: 1px solid rgba(52, 220, 255, 0.22);
  border-radius: 8px;
  padding: 12px;
}
.reach-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.reach-no {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(52, 220, 255, 0.2);
  color: #34dcff;
  font-size: 12px;
  line-height: 22px;
  text-align: center;
  flex-shrink: 0;
}
.reach-flow {
  flex: 1;
  min-width: 0;
  color: #fff;
  font-size: 14px;
}
.reach-flow b { font-weight: 600; }
.reach-flow .el-icon-right { margin: 0 6px; color: #34dcff; }
.reach-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
}
.reach-grid label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}
.reach-grid .el-input-number,
.reach-grid .el-select { width: 100%; }
.reach-actions {
  margin-top: 10px;
  text-align: right;
}
</style>
