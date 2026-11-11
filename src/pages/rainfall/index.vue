<template>
  <div class="content">
    
    <header-area/>
    
    <div class="area-left">
      <rain-warn ref="rainWarn"/>
      <rain-area ref="rainArea"/>
    </div>
    
    <legend-box ref="legend" :checked="[1001]"/>
    
    <right-layer />
    

    
    <area-right ref="area" @timeUpdate="timeUpdate"
                @pop="popShow"/>
    

  </div>
</template>

<script type="text/ecmascript-6">
  import headerArea from '@/components/header'

  import areaRight from '@/components/areaRight'

  import legendBox from '@/components/legend'
  import rainWarn from '@/components/rainWarn'
  import rainArea from '@/components/rainArea'
  import rightLayer from '@/components/rightLayer'
  export default {
    components: {
      headerArea,

      areaRight,

      legendBox,
      rainWarn,
      rainArea,
      rightLayer
    },
    data() {
      return {
        popShow: true
      }
    },
    mounted() {
      this.$refs.legend.set(1001)
      this.$refs.area.set(1001)

    },
    methods: {
      timeUpdate(data) {
        console.log(data)
        console.log('data2222')
        this.$refs.rainWarn.loadData(data)
        this.$refs.rainArea.loadData(data)
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .area-left {
    position: absolute;
    z-index: 502;
    top: var(--panel-top, 6.25rem);
    bottom: var(--panel-gap, 1.25rem);
    left: var(--panel-gap, 1.25rem);
    width: min(23.75rem, 26vw);
    min-width: 17.5rem;
    max-width: 23.75rem;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;

    ::v-deep .rain-warn-panel {
      flex: 0 0 auto;
    }

    ::v-deep .rain-area-panel {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }
</style>
