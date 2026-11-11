<template>
  <div ref="mapArea" class="map-area">
    
    <pop-box ref="popBox" @close="popupClose"></pop-box>
    
    <div id="map-legend" class="map-legend" :class="{ 'is-empty': !htmlContent }">
      <ul id="legend-list" class="legend-list" v-html="htmlContent"></ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import 'leaflet/dist/leaflet.css'
  import MapLib from './MapMain'
  import popBox from '@/components/popBox'
  import {formatDate} from '@/assets/js/common'

  export default {
    name: 'Map',
    components: {
      popBox
    },
    props: {
      center: {
        type: Object,
        default: () => ({

        })
      },
      zoom: {
        type: Number,
        default: 14
      },
      markers: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        map: null,
        formData: {
          date: []
        },
        htmlContent:''
      }
    },
    mounted() {
      console.log("start init map ...")
      this.initMap()
    },
    methods: {
      initMap() {
        window.popBox = this.$refs.popBox
        const mapcontainer = this.$refs.mapArea
        MapLib.initMap(mapcontainer, {})
      },

      popupClose() {
        window.mpPlugin.popup().close()
      },

      setlegend(html){
        this.htmlContent=html
      },
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .map-area {
    position: fixed;

    width: 100%;
    height: 100%;

    background-size: cover;
  }
  .map-legend {
    width: 110px;
    position: absolute;
    right: 14%;
    background-color: rgba(0, 16, 30, 0.72);
    border: 1px solid rgba(0, 255, 246, 0.35);
    padding: 5px;
    border-radius: 5px;
    z-index: 999;
    bottom: 20px;

    
    &.is-empty:not(:has(li)) {
      display: none;
    }
  }

  .legend-item {
    list-style-type: none;
  }

  .legend-item-title {
    display: inline-block;
    padding-left: 10px;

  }

  .legend-item-swatch {
    border-radius: 6px;
    width: 32px;
    height: 20px;
    border: 1px solid #91A7AF;
    display: inline-block;
    position: relative;
    top: 3px;
  }
  .legend-item-grad {
    width: 32px;
    height: 200px;
    border: 1px solid #91A7AF;
    display: inline-block;
  }

  .legend-item-min {
    display: inline-block;
    padding-left: 10px;
    position: relative;
    top: -195px;
  }

  .legend-item-max {
    display: inline-block;
    padding-left: 10px;
    position: relative;
    left: -23px;
  }
</style>
