<template>
  <div class="map-panel" :style="isActive?'background-color: rgba(0,255,246,.15);':''" @click="toogle">
    <div class="ms-content">
      <img src="/static/svg/mapGrid.svg" alt="">
      <p>经纬网</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import MapLib from '../../map/leaflet/MapLib'
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
        MapLib.createGraticule()
      } else {
        MapLib.removeGraticule()
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.map-panel {

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
