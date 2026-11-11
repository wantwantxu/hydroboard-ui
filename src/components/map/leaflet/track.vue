<template>
  <div  ref="mapTrack" class="map-area">
    
    <pop-box ref="popBox" @close="popupClose"></pop-box>
  </div>
</template>

<script type="text/ecmascript-6">
import 'leaflet/dist/leaflet.css'
import MapLib from './MapMain'
import popBox from '@/components/popBox'
import eventBus from '@/eventBus'
  export default {
    name: 'Map',
    components: {
      popBox
    },
    props: {
      center: {
        type: Object,
        default: () => ({
          lat: 35.681298,
          lng: 139.767052
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
        map: null
      }
    },
    mounted() {

    },
    methods: {
      initMap() {
        window.popBox = this.$refs.popBox
        const mapcontainer = this.$refs.mapTrack
        MapLib.initMapTrack(mapcontainer, {})
      },
      popupClose() {
        console.log(333)
        let popBox = window.popBox
        popBox.isPopShow = false
        eventBus.$emit('isPopShow', false)
        if (window.popup !== null) {
          window.map.closePopup(window.popup)
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .map-area{
    position: absolute;
    z-index: 0;

    width:100%;
    height:100%;

    background-size: cover;
  }
</style>
