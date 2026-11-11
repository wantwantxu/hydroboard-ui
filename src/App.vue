<template>
  <div class="wrapper" v-if="authCompleted && authSuccess">
    
    <keep-alive>
      <map-area/>
    </keep-alive>
    <router-view/>
  </div>
</template>

<script>
import mapArea from '@/components/map/leaflet'
import { mapState } from 'vuex'

  export default {
    name: 'App',
    components: {
      mapArea
    },
    computed: {
      ...mapState('auth', [
        'authCompleted',
        'authSuccess'
      ])
    },
    data() {
      return {
      }
    },
    created() {
      console.log('初始化app', this.authSuccess)
      console.log('初始化app', this.authSuccess)
    }
  }

</script>

<style type="text/scss" lang="scss" scoped>
</style>
