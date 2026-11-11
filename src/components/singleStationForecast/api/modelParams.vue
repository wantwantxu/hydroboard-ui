<template>
  <div class="modelIndex">
    <div class="hd">
      <h3>
        <div class="name">{{ options.fcstObjects.name }} - {{ options.modelName }}</div>
        <el-button
          class="close"
          type="text"
          icon="el-icon-close"
          @click="$emit('close')"
        />
      </h3>
    </div>

    
    <div class="card-item mt-4">
      <h6><span>基础数据配置</span></h6>
        <el-button @click="openDialog('unit')" class="param-btn">单位线表</el-button>
        <el-button @click="openDialog('relation')" class="param-btn">降雨径流关系表</el-button>
        <el-button @click="openDialog('lag')" class="param-btn">洪峰滞时表</el-button>
        <el-button @click="openDialog('pa')" class="param-btn">Pa计算表</el-button>
        <el-button @click="openDialog('zqLine')" class="param-btn">水位流量关系</el-button>

        <unit-hydrograph-dialog :options="{ objectsId: objectsId, modelId: modelId}" ref="unitDialogRef"></unit-hydrograph-dialog>
        <p-r-dialog :options="{ objectsId: objectsId, modelId: modelId}" ref="prDialogRef"></p-r-dialog>
        <peak-lag-time-dialog :options="{ objectsId: objectsId, modelId: modelId}" ref="lagDialogRef"></peak-lag-time-dialog>
        <pa-dialog :options="{ objectsId: objectsId, modelId: modelId}" ref="paDialogRef"></pa-dialog>
        <zq-line-dialog :options="{ objectsId: objectsId, modelId: modelId}" ref="zqLineDialogRef"></zq-line-dialog>
    </div>
    <div class="card-item mt-4">
      <h6><span>参数配置</span></h6>
      <div class="card-item-content">
        <el-form
          label-width="150px"
        >
          <el-form-item label="上游测站">
            <el-select
              v-model="upStcd"
              filterable
              remote
              placeholder="输入测站名或编码搜索"
              :remote-method="fetchUpstreamStations"
            >
              <el-option
                v-for="item in upstreamStationOptions"
                :key="item.stcd"
                :value="item.stcd"
              >
                {{ item.stcd }} - {{ item.stnm }}
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="传播时间(小时)">
            <el-input v-model="propagationHours"
              type="number"
              placeholder="请输入传播时间"
              clearable
            />
          </el-form-item>

          <el-form-item label="基本径流">
            <el-input v-model="baseRunoff"
              type="number"
              placeholder="请输入基本径流"
              clearable
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :loading="saving" @click="saveConfig">保存参数</el-button>
            <el-button type="success" @click="openPlanResult">查看预报结果</el-button>
          </el-form-item>
        </el-form>
      </div>
      </div>
  </div>
</template>

<script>
import UnitHydrographDialog from "./unitHydrographDialog";
import PRDialog from "./prDialog";
import PeakLagTimeDialog from "./peakLagTimeDialog";
import PaDialog from "./paDialog";
import ZqLineDialog from "./zqLineDialog";
import Api from "../../../api";

export default {
  components: {ZqLineDialog, UnitHydrographDialog, PRDialog, PeakLagTimeDialog, PaDialog },
  props: {
    options: {
      type: Object,
      default: () => ({
        fcstObjects: { name: '默认流域' },
        modelId: '',
        modelName: 'API洪水预报模型',
        unitHydroId: '',
        prRelationId: '',
        peakLagId: ''
      })
    }
  },
  data() {
    return {
      upStcd: '',
      propagationHours: null,
      baseRunoff: null,
      modelId: this.options.modelId,
      objectsId: this.options.fcstObjects.id,
      planVisible: false,

      calcMode: 'manual',
      isFetchingData: false,
      manualMeasuredData: [],
      isCalculating: false,
      calcResultVisible: false,
      calcResult: {},

      autoCalcForm: {
        freq: '30'
      },
      autoCalcStatus: 'paused',
      nextCalcTime: '',
      autoCalcTimer: null,
      upstreamStationOptions: [],
      saving: false,
      planId: null
    };
  },
  mounted() {

    this.calculateNextCalcTime();
    Api.getFcstPlanList({ objectsId: this.objectsId, modelId: this.modelId }).then(res => {
      const list = res.result || [];
      if (list.length) this.planId = list[0].id;
    });
  },
  beforeDestroy() {

    if (this.autoCalcTimer) {
      clearTimeout(this.autoCalcTimer);
    }
  },
  methods: {
    hidePlan(){
      this.planVisible = false
    },
    fetchUpstreamStations(query) {
      if (!query) return;
      Api.getStation({keyword: query}).then(res => {
        if (res.code === 200) {
          this.upstreamStationOptions = res.result;
        }
      });
    },

    openDialog(type) {
      if (type === 'unit' && this.$refs.unitDialogRef) this.$refs.unitDialogRef.open();
      if (type === 'relation' && this.$refs.prDialogRef) this.$refs.prDialogRef.open();
      if (type === 'lag' && this.$refs.lagDialogRef) this.$refs.lagDialogRef.open();
      if (type === 'pa' && this.$refs.paDialogRef) this.$refs.paDialogRef.open();
      if (type === 'zqLine' && this.$refs.zqLineDialogRef) this.$refs.zqLineDialogRef.open();
    },
    async saveConfig() {
      if (!this.planId) {

        const saveRes = await Api.savePlan({
          name: (this.options.fcstObjects.name || 'API') + '-默认方案',
          objectsId: this.objectsId,
          modelId: this.modelId
        });
        if (saveRes.code === 200 && saveRes.result) {
          this.planId = saveRes.result.id || saveRes.result;
        }
      }
      if (!this.planId) {
        this.$message.warning('请先在方案管理中创建预报方案');
        return;
      }
      this.saving = true;
      try {
        const entries = [
          { paramsName: 'upStcd', paramsValue: this.upStcd },
          { paramsName: 'propagationHours', paramsValue: this.propagationHours },
          { paramsName: 'baseRunoff', paramsValue: this.baseRunoff }
        ];
        for (const e of entries) {
          await Api.savePlanParams({
            planId: this.planId,
            modelId: this.modelId,
            paramsName: e.paramsName,
            paramsValue: String(e.paramsValue == null ? '' : e.paramsValue)
          });
        }
        this.$message.success('API 模型参数已保存（单位线/P-R/滞时等请在上方基础表中维护）');
      } catch (e) {
        this.$message.error('保存异常');
      } finally {
        this.saving = false;
      }
    },
    openPlanResult() {
      this.$message.info('请关闭本面板后点击左侧「预报方案计算」查看结果；或先完成基础表配置与方案运行。');
    },

    handleCalcModeChange() {

      if (this.calcMode === 'auto') {
        this.calculateNextCalcTime();
      }
    },


    handleManualCalc() {
      this.isCalculating = true;

      setTimeout(() => {

        const calcResult = {
          peakDischarge: 1280.5,
          peakTime: Date.now() + 3600000 * 5
        };

        this.showCalcResult(
          '手动计算成功',
          `计算完成！\n峰值流量：${calcResult.peakDischarge} m³/s\n峰值时间：${this.formatTime(calcResult.peakTime)}`,
          'success'
        );

        this.$emit('calcSuccess', calcResult);
        this.isCalculating = false;
      }, 2000);
    },


    handleFreqChange() {

      if (this.autoCalcStatus === 'running') {
        this.restartAutoCalcTimer();
      } else {
        this.calculateNextCalcTime();
      }
    },


    startAutoCalc() {
      this.autoCalcStatus = 'running';
      this.restartAutoCalcTimer();
      this.showCalcResult('自动计算已启动', `按 ${this.autoCalcForm.freq} 分钟/次频次执行`, 'success');
    },


    pauseAutoCalc() {
      this.autoCalcStatus = 'paused';
      if (this.autoCalcTimer) {
        clearTimeout(this.autoCalcTimer);
      }
      this.showCalcResult('自动计算已暂停', '后续需手动启动以恢复自动计算', 'info');
    },


    restartAutoCalcTimer() {

      if (this.autoCalcTimer) {
        clearTimeout(this.autoCalcTimer);
      }


      this.calculateNextCalcTime();


      const freqMs = this.autoCalcForm.freq * 60 * 1000;
      this.autoCalcTimer = setTimeout(() => {

        this.executeAutoCalc();
      }, freqMs);
    },


    executeAutoCalc() {

      setTimeout(() => {

        const autoCalcResult = {
          peakDischarge: 1260.2,
          peakTime: Date.now() + 3600000 * 4
        };

        this.showCalcResult(
          '自动计算成功',
          `[${this.formatTime(Date.now())}]\n峰值流量：${autoCalcResult.peakDischarge} m³/s`,
          'success'
        );
        this.$emit('calcSuccess', autoCalcResult);


        if (this.autoCalcStatus === 'running') {
          this.restartAutoCalcTimer();
        }
      }, 1500);
    },


    calculateNextCalcTime() {
      const now = new Date();
      const nextTime = new Date(now.getTime() + this.autoCalcForm.freq * 60 * 1000);
      this.nextCalcTime = this.formatTime(nextTime.getTime());
    },


    showCalcResult(title, message, type) {
      this.calcResult = { title, message, type };
      this.calcResultVisible = true;

      setTimeout(() => {
        this.calcResultVisible = false;
      }, 5000);
    },


    formatTime(timestamp) {
      const date = new Date(timestamp);
      const Y = date.getFullYear();
      const M = String(date.getMonth() + 1).padStart(2, '0');
      const D = String(date.getDate()).padStart(2, '0');
      const H = String(date.getHours()).padStart(2, '0');
      const m = String(date.getMinutes()).padStart(2, '0');
      const s = String(date.getSeconds()).padStart(2, '0');
      return `${Y}-${M}-${D} ${H}:${m}:${s}`;
    }
  }
};
</script>
<style lang="scss" scoped>
.modelIndex {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  background: var(--panel-bg, rgba(0, 16, 30, 0.52));
  backdrop-filter: blur(8px);
  border-radius: 4px;
  color: #fff;
  border: 1px solid rgba(0, 255, 246, 0.2);
  position: relative;

  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border: 1px solid;
    z-index: 99;
  }

  &:before {
    left: 0;
    top: 0;
    border-color: #00fff6 transparent transparent #00fff6;
  }

  &:after {
    right: 0;
    top: 0;
    border-color: #00fff6 #00fff6 transparent transparent;
  }

  .hd {
    > h3 {
      overflow: hidden;

      .name {
        float: left;
        font-size: 20px;
        font-family: YouSheBiaoTiHei-Regular, YouSheBiaoTiHei, sans-serif;
        font-weight: 400;
        margin-left: 35px;
      }

      .close {
        float: right;
        cursor: pointer;
      }
    }
  }
  .card-item {
    padding: 10px;
    background: #00000033;
    border-radius: 8px;

    h6 {
      font-size: 14px;
      padding: 0 20px;
      line-height: 40px;
      font-weight: normal;
      background: url(../../../assets/images/item-header.png) 0 center no-repeat;
    }

    .card-item-content {
      padding: 5px;
      background: rgba(0, 255, 246, 0.05);
      border-radius: 4px;
      border: 1px solid rgba(0, 255, 246, 0.2);
    }
  }

  .action {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .param-btn {
    background: rgba(0, 255, 246, 0.14);
    border: 1px solid rgba(0, 255, 246, 0.55);
    color: #00fff6;

    &:hover,
    &:focus {
      background: rgba(0, 255, 246, 0.24);
      border-color: #00fff6;
      color: #ccff00;
    }
  }

  #rainfall-runoff-chart {
    width: 100%;
    height: 100%;  
  }
}
</style>
