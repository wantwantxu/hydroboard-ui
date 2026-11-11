<template>
  <div class="composite-model-config">
    <div class="hd">
      <h3>
        <lottie class="mainfirst" :options="mainfirst" :width="20" style="float:left;"/>
        <div class="name">{{ options.fcstObjects.name }} - {{ options.modelName }}</div>
        <el-button class="close" type="text" icon="el-icon-close" @click="$emit('close')"/>
      </h3>
      <lottie class="mainfirst2" :options="mainfirst2" :width="1300" style="height: 20px;opacity: 1;"/>
    </div>

    <div class="ud-body">
      <section class="ud-card">
        <div class="ud-title">测站关系</div>
        <div class="ud-stations">
          <div class="ud-station">
            <span>上游测站</span>
            <el-select v-model="form.upStcd" filterable remote placeholder="搜索测站"
                       :remote-method="fetchStations" :loading="stationLoading" size="small">
              <el-option v-for="item in stationOptions" :key="item.stcd"
                         :label="item.stcd + ' - ' + item.stnm" :value="item.stcd"/>
            </el-select>
          </div>
          <i class="el-icon-right ud-arrow"/>
          <div class="ud-station">
            <span>下游测站</span>
            <el-input :value="form.downStcd + (form.downStnm ? ' - ' + form.downStnm : '')" disabled size="small"/>
          </div>
          <div class="ud-station narrow">
            <span>要素</span>
            <el-select v-model="form.elementType" size="small">
              <el-option label="流量 Q" value="Q"/>
              <el-option label="水位 Z" value="Z"/>
            </el-select>
          </div>
        </div>
      </section>

      <section class="ud-card">
        <div class="ud-title">演算参数</div>
        <div class="ud-params">
          <label>模型
            <el-select v-model="form.modelType" size="small">
              <el-option label="线性 LINEAR" value="LINEAR"/>
              <el-option label="二次 QUAD" value="QUAD"/>
            </el-select>
          </label>
          <label>滞时(分钟)<el-input-number v-model="form.lagMinutes" :min="0" size="small" controls-position="right"/></label>
          <label class="lag-range">滞时扫描
            <span class="range">
              <el-input-number v-model="form.lagMin" :min="1" size="small" controls-position="right"/>
              <em>~</em>
              <el-input-number v-model="form.lagMax" :min="1" size="small" controls-position="right"/>
            </span>
          </label>
          <label>系数 A<el-input-number v-model="form.a" :step="0.01" size="small" controls-position="right"/></label>
          <label>系数 B<el-input-number v-model="form.b" :step="0.01" size="small" controls-position="right"/></label>
          <label>系数 C<el-input-number v-model="form.c" :step="0.01" size="small" controls-position="right"/></label>
          <label class="wide">备注<el-input v-model="form.comments" size="small" placeholder="可选"/></label>
        </div>
      </section>

      <section class="ud-card">
        <div class="ud-title">率定结果</div>
        <div class="ud-metrics">
          <div><span>NSE</span><b>{{ metric(form.nse) }}</b></div>
          <div><span>相关系数</span><b>{{ metric(form.corr) }}</b></div>
          <div><span>R²</span><b>{{ metric(form.r2) }}</b></div>
          <div><span>得分</span><b>{{ metric(form.score) }}</b></div>
        </div>
      </section>

      <div class="ud-actions">
        <el-button type="primary" :loading="saving" @click="saveConfig">保存关系</el-button>
        <el-button type="warning" :loading="calibrating" @click="calibrate">参数率定</el-button>
        <el-button type="success" :loading="running" @click="runForecast">运行预报</el-button>
        <el-button @click="showParamCalibration">高级率定面板</el-button>
      </div>
    </div>
    <updown-index :options="{ objectsId: objectsId, modelId: modelId, visible: paramCalibrationVisible }"
                  @close="paramCalibrationVisible = false" @saved="init"/>
  </div>
</template>

<script>
import mainfirst from '@/assets/json/green.json'
import mainfirst2 from '@/assets/json/green2.json'
import Api from '@/api'
import UpdownIndex from '../paramCalibration/updownIndex'

export default {
  components: { UpdownIndex },
  props: {
    options: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      objectsId: this.options.fcstObjects.id,
      modelId: this.options.modelId,
      paramCalibrationVisible: false,
      stationLoading: false,
      stationOptions: [],
      saving: false,
      calibrating: false,
      running: false,
      form: {
        id: null,
        upStcd: '',
        downStcd: '',
        downStnm: '',
        elementType: 'Q',
        modelType: 'LINEAR',
        lagMinutes: 60,
        lagMin: 30,
        lagMax: 360,
        a: null,
        b: null,
        c: null,
        corr: null,
        r2: null,
        nse: null,
        score: null,
        comments: ''
      },
      mainfirst: { animationData: mainfirst, renderer: 'svg', loop: true, autoplay: true },
      mainfirst2: { animationData: mainfirst2, renderer: 'svg', loop: true, autoplay: false }
    }
  },
  mounted() {
    this.form.downStcd = this.options.fcstObjects.id
    this.form.downStnm = this.options.fcstObjects.name
    this.init()
  },
  methods: {
    init() {
      Api.getByDownStcd({ downStcd: this.form.downStcd }).then(res => {
        if (res.code === 200 && res.result) {
          Object.assign(this.form, res.result)
          if (res.result.upStcd) {
            this.stationOptions = [{ stcd: res.result.upStcd, stnm: res.result.upStcd }]
          }
        }
      })
    },
    fetchStations(keyword) {
      if (!keyword) return
      this.stationLoading = true
      Api.getStation({ stnm: keyword }).then(res => {
        this.stationOptions = res.result || res.data || []
      }).finally(() => { this.stationLoading = false })
    },
    metric(value) {
      if (value === null || value === undefined || value === '') return '--'
      const n = Number(value)
      return Number.isFinite(n) ? n.toFixed(3) : value
    },
    showParamCalibration() {
      this.paramCalibrationVisible = true
    },
    saveConfig() {
      if (!this.form.upStcd) {
        this.$message.warning('请选择上游测站')
        return
      }
      this.saving = true
      Api.fcstUpDownRelationSave(this.form).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功')
          this.init()
        }
      }).finally(() => { this.saving = false })
    },
    calibrate() {
      if (!this.form.upStcd) {
        this.$message.warning('请先配置并保存上游测站')
        return
      }
      this.calibrating = true
      Api.updownCalibrate(this.form).then(res => {
        if (res.code === 200) {
          this.$message.success('率定完成')
          if (res.result) Object.assign(this.form, res.result)
        } else {
          this.$message.error(res.message || '率定失败')
        }
      }).finally(() => { this.calibrating = false })
    },
    runForecast() {
      this.running = true
      Api.updownRun({
        upstcd: this.form.upStcd,
        downstcd: this.form.downStcd
      }).then(res => {
        if (res.code === 200) {
          const saved = res.result && res.result.saved
          this.$message.success(`预报完成，已保存 ${saved || 0} 条结果，可在「预报方案计算」中查看`)
        } else {
          this.$message.error(res.message || '预报失败')
        }
      }).finally(() => { this.running = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.composite-model-config {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  background: var(--panel-bg, rgba(0, 16, 30, 0.52));
  backdrop-filter: blur(8px);
  color: #fff;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 246, 0.2);
  overflow: auto;
  .hd > h3 {
    overflow: hidden;
    .name {
      float: left;
      margin-left: 35px;
      font-size: 20px;
      font-family: YouSheBiaoTiHei-Regular, YouSheBiaoTiHei, sans-serif;
    }
    .close { float: right; }
  }
}
.ud-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}
.ud-card {
  background: rgba(8, 30, 50, 0.45);
  border: 1px solid rgba(52, 220, 255, 0.18);
  border-radius: 8px;
  padding: 12px 14px;
}
.ud-title {
  margin-bottom: 10px;
  font-size: 14px;
  color: #34dcff;
  letter-spacing: 1px;
}
.ud-stations {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}
.ud-station {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}
.ud-station.narrow { flex: 0 0 140px; }
.ud-station .el-select,
.ud-station .el-input { width: 100%; }
.ud-arrow {
  margin-bottom: 8px;
  color: #34dcff;
  font-size: 18px;
}
.ud-params {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px 14px;
}
.ud-params label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}
.ud-params .el-select,
.ud-params .el-input-number,
.ud-params .el-input { width: 100%; }
.ud-params .wide { grid-column: span 3; }
.lag-range .range {
  display: flex;
  align-items: center;
  gap: 6px;
}
.lag-range em { font-style: normal; color: rgba(255, 255, 255, 0.55); }
.ud-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.ud-metrics div {
  padding: 10px 12px;
  border-radius: 6px;
  background: rgba(0, 16, 30, 0.45);
  border: 1px solid rgba(52, 220, 255, 0.12);
}
.ud-metrics span {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
}
.ud-metrics b {
  display: block;
  margin-top: 4px;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}
.ud-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
