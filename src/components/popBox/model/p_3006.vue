<template>
  <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <el-tab-pane label="泥沙过程线" name="SedimentHydrograph">
      <sediment-hydrograph :options="options"></sediment-hydrograph>
    </el-tab-pane>
  </el-tabs>
</template>

<script type="text/ecmascript-6">
 import SedimentHydrograph from '../comp/sedimentHydrograph'
  export default {
    components: {SedimentHydrograph},
    props: {
      options: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        activeName: 'SedimentHydrograph',
        sttp: ''
      }
    },
    created() {
      this.init(this.options)
    },
    methods: {
      init(data) {
        this.sttp = data.sttp
      },
      handleTabClick() {

      },
      toClose() {

      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>

</style>
