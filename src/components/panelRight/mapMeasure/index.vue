<template>
  <div class="map-source"  :style="isActive?'background-color: rgba(0,255,246,.15);':''" @click="toogle">
    <div class="ms-content">
      <img src="/static/svg/mapMeasure.svg" alt="">
      <p>测量</p>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Measure from '../../map/leaflet/plugin/Measure'

export default {
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    toogle() {
      this.isActive = !this.isActive
      if (this.isActive) {
      Measure.startMeasureLen(window.map, window.L)
      } else {
        Measure.clearMeasure()
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.map-source {

  .ms-content {
    text-align: center;
    padding: 5px 10px;
    color: #00fff6;
    font-size: 12px;
    cursor: pointer;
    position: relative;
    height: 46px;
  }

}
</style>
