<template>
  <div class="wrap" :class="{'bg-com':!isMin}">
    <title-box title="水质" second isVariable @change="toggle"/>
    <el-form :model="formData" label-width="3rem">
      <el-form-item label="筛选">
        <el-input v-model="search" clearable @input="handleSearch" placeholder="请输入名称" />
      </el-form-item>
    </el-form>
    <ul style="height: 435px;" v-if="!isMin">
       <water-quality ref="allStationRef"></water-quality>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import titleBox from '@/components/titleBox'
import WaterQuality from '../comp/waterQuality'


export default {
  components: {
    WaterQuality,
    titleBox
  },
  props: {
    isMin: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      allData:[],
      search: '',
      formData: {
        date: []
      },
      queryData: {}
    }
  },
  created() {

  },
  beforeDestroy(){

  },
  mounted() {

  },
  methods: {


    toggle(type) {
      if (type === 'max' && !this.isMin) return
      this.$emit('sizeChange', !this.isMin)

      if(!type){
        this.$nextTick(()=>{
          this.handleTabClick()
        })
      }
    },
    init(data) {

    },
    handleSearch() {
      this.$refs.allStationRef.getAllList(this.search)
    },
    handleTabClick() {

    },
    clearLayers() {

    },
    input() {
      this.$forceUpdate()
    },
    dateChange() {

    },
    rowClickHandler(row) {

    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
</style>
