<template>
  <div class="content single-forecast-page">
    
    <header-area/>
    
    <div class="area-left">
      <single-station-forecast ref="forecastStationRef" @modelShow="showModel" @resultShow="showResult" @adminPanelShow="showAdminPanel" />
    </div>
    
    <div class="model" v-if="modelVisible || resultVisible || fcstObjectsListVisible">
      <fcst-objects-list v-if="fcstObjectsListVisible" ref="fcstObjectsList" @close="fcstObjectsListVisible=false" @change="handleObjectsChange" :options="options"></fcst-objects-list>
      <component :is="modelComp" ref="model" v-if="modelVisible" @close="modelVisible=false" :options="options"></component>
      <component :is="resultComp" ref="result" v-if="resultVisible" @close="resultVisible=false" :options="options"></component>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerArea from '@/components/header'
  import popBox from '@/components/popBox'
  import singleStationForecast from '@/components/singleStationForecast/index.vue'
  import apiModelParams from '@/components/singleStationForecast/api/modelParams.vue'
  import xajModelParams from '@/components/singleStationForecast/xaj/modelParams.vue'
  import oneDHydrodModelParams from '@/components/singleStationForecast/oneDHydrod/modelParams.vue'
  import fcstObjectsList from '@/components/singleStationForecast/fcstObjects/list.vue'
  import upstreamDownstreamModelParams from '@/components/singleStationForecast/upstreamDownstream/modelParams.vue'
  import muskingumModelParams from '@/components/singleStationForecast/muskingum/modelParams.vue'
  import cascadeModelParams from '@/components/singleStationForecast/cascade/modelParams.vue'
  import fcstResult from '@/components/singleStationForecast/xaj/planResult.vue'

  export default {
    components: {
      headerArea,
      popBox,
      singleStationForecast,
      oneDHydrodModelParams,
      apiModelParams,
      xajModelParams,
      upstreamDownstreamModelParams,
      muskingumModelParams,
      cascadeModelParams,
      fcstResult,
      fcstObjectsList
    },
    data() {
      return {
        modelComp: '',
        resultComp: '',
        modelVisible:false,
        resultVisible:false,
        fcstObjectsListVisible: false,
        options: {}
      }
    },
    mounted() {
    },
    created() {
      if (window.eventBus) {
        window.eventBus.$on('singleResultShow', this.showResult)
      }
    },
    beforeDestroy() {
      if (window.eventBus) {
        window.eventBus.$off('singleResultShow', this.showResult)
      }
    },
    methods: {
      showResult(data) {
        if (!data || (!data.modelId && data.panel !== 'cascade')) {
          this.$message.error('无效的模型配置');
          return;
        }

        this.options = data;
        this.fcstObjectsListVisible = false;
        this.modelVisible = false;
        this.resultVisible = true;
        this.resultComp = 'fcstResult';
      },
      showModel(data) {
        this.options = data
        this.fcstObjectsListVisible = false;
        this.resultVisible = false;
        this.modelVisible = true
        const modelId = data.modelId

        if (data.panel === 'cascade' || modelId === 'cascade') {
          this.modelComp = 'cascadeModelParams'
          return
        }
        switch (Number(modelId)) {
          case 1:
            this.modelComp = 'xajModelParams'
            break
          case 2:
            this.modelComp = 'apiModelParams'
            break
          case 3:
            this.modelComp = 'upstreamDownstreamModelParams'
            break
          case 5:
            this.modelComp = 'oneDHydrodModelParams'
            break
          case 6:
            this.modelComp = 'muskingumModelParams'
            break
          default:
            this.$message.warning('暂不支持的模型类型: ' + modelId)
            this.modelVisible = false
        }
      },
      handleObjectsChange(){
        this.$refs.forecastStationRef.gettableList()
      },
      showAdminPanel(){
        this.fcstObjectsListVisible = true;

        this.modelVisible = false;
        this.resultVisible = false;
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  
  .single-forecast-page {
    --panel-bg: rgba(1, 16, 30, 0.96);
    --single-inner-bg: rgba(3, 26, 42, 0.92);
    --single-inner-border: rgba(0, 255, 246, 0.28);
  }

  .area-left {
    position: absolute;
    z-index: 502;
    top: var(--panel-top, 6.25rem);
    bottom: var(--panel-gap, 1.25rem);
    left: var(--panel-gap, 1.25rem);
    width: 21.5625rem;
  }

  .model {
    position: absolute;
    z-index: 502;
    top: var(--panel-top, 6.25rem);
    bottom: var(--panel-gap, 1.25rem);
    left: calc(var(--panel-gap, 1.25rem) + 21.5625rem + 1.25rem);
    right: var(--panel-gap, 1.25rem);
    overflow: hidden;
    --panel-bg: rgba(1, 16, 30, 0.96);
    background: rgba(1, 16, 30, 0.96);
    border: 1px solid rgba(0, 255, 246, 0.32);
    border-radius: 4px;
    box-shadow: 0 10px 32px rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(12px);
  }

  
  .model ::v-deep .modelIndex,
  .model ::v-deep .pointParamIndex {
    background: rgba(1, 16, 30, 0.98) !important;
  }

  .model ::v-deep .card-item,
  .model ::v-deep .plan-box,
  .model ::v-deep .param-block,
  .model ::v-deep .topology-wrap,
  .model ::v-deep .rel-card {
    background: var(--single-inner-bg) !important;
    border-color: var(--single-inner-border) !important;
  }

  .model ::v-deep .card-item-content {
    background: rgba(0, 22, 38, 0.78) !important;
  }

  .model ::v-deep .scroll-body {
    background: rgba(0, 18, 32, 0.5);
  }

  .model ::v-deep .hd {
    background: rgba(0, 20, 36, 0.96) !important;
  }

  .model ::v-deep .el-table,
  .model ::v-deep .el-table__expanded-cell,
  .model ::v-deep .el-table th,
  .model ::v-deep .el-table tr,
  .model ::v-deep .el-table td {
    background-color: transparent !important;
  }

  .model ::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: rgba(0, 255, 246, 0.06) !important;
  }

  .model ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: rgba(0, 255, 246, 0.12) !important;
  }
</style>
