<template>
  <div class="content">
    <header-area/>
    <div class="area-left">
      <water-warn ref="water"/>
    </div>
    <legend-box ref="legend" :checked="[1002]"/>
    <right-layer/>
    <area-right :isPopShow="isPopShow" ref="area" @change="mapDataChange" @pop="popShow"/>
  </div>
</template>

<script type="text/ecmascript-6">
import headerArea from '@/components/header'
import areaRight from '@/components/areaRight'
import legendBox from '@/components/legend'
import rightLayer from '@/components/rightLayer'
import waterWarn from '@/components/waterWarn'
import eventBus from '@/eventBus'

export default {
  components: {
    headerArea,
    areaRight,
    legendBox,
    rightLayer,
    waterWarn
  },
  data() {
    return {
      isPopShow: false,
      mapOptions: {}
    }
  },
  mounted() {
    this.$refs.legend.set(1002)
    this.$refs.area.set(1002)
  },
  methods: {
    mapChange(option) {
      this.mapOptions = Object.assign({}, this.mapOptions, option)
      this.popClose()
    },
    mapDataChange(option) {
      this.mapOptions = Object.assign({}, this.mapOptions, option)
      this.popClose()
    },
    popShow() {
      this.isPopShow = true

      if (this.$refs.water) this.$refs.water.loadData()
    },
    popClose() {
      eventBus.$on('isPopShow', (b) => {
        this.isPopShow = b
      })
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.area-left {
  position: absolute;
  z-index: 502;
  top: var(--panel-top, 6.25rem);
  left: var(--panel-gap, 1.25rem);
  width: 21.5625rem;
}
</style>
