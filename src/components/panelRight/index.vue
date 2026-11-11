<template>
  <div class="panel-right">
    <map-measure />
    <map-grid />
    <map-source />
  </div>
</template>

<script type="text/ecmascript-6">
  import mapSource from './mapSource'
  import mapMeasure from './mapMeasure'
  import mapGrid from './mapGrid'
export default {
  components: {
    mapSource,
    mapMeasure,
    mapGrid
  },
  data() {
    return {
      gridActive: false
    }
  },
  methods: {
    toggleMeasure() {
      this.measureActive = !this.measureActive
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.panel-right {
  position: absolute;
  
  right: var(--area-right-tools-right, var(--panel-gap, 1.25rem));
  top: var(--panel-top, 6.25rem);
  z-index: 507;
  height: var(--map-tools-h, 3.5rem);
  box-sizing: border-box;
  background: rgba(0, 16, 30, 0.6);
  border: 1px solid rgba(0, 255, 246, 0.5);
  border-radius: 6px;
  transition: right 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: stretch;

  ::v-deep .ms-content {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.625rem;
  }

  ::v-deep .ms-content img {
    width: 1.25rem;
    height: 1.25rem;
    display: block;
  }

  ::v-deep .ms-content p {
    margin: 0.125rem 0 0;
    line-height: 1;
    font-size: 0.75rem;
  }
}
</style>
