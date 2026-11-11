<template>
  <div class="wrap" :class="{'bg-com':!isMin}">
    <title-box title="日常维护" second isVariable @change="toggle"/>
    <el-form :model="formData" >
      <el-form-item label="筛选" label-width="3rem">
        <el-input v-model="search" clearable @input="handleSearch" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item>
        <div class="ybfajs" @click="addMaintenance">
          <span>新增维护记录</span>
          <span></span>
        </div>
      </el-form-item>
    </el-form>
    <ul style="height: 435px;" v-if="!isMin">
       <daily-maintenance  ref="allStationRef"></daily-maintenance>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import titleBox from '@/components/titleBox'
import DailyMaintenance from '../comp/dailyMaintenance'

export default {
  components: {
    DailyMaintenance,
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

    },
    addMaintenance() {
      window.eventBus.$emit('openAddMaintenancePopup')
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.ybfajs{
  line-height: 40px;
  text-align: center;
  color: #00FFF6;
  background: url(../../../assets/images/ybfajs1.png) 0 0 no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  span{
    display: inline-block;
    margin: 0 5px;
  }
  span:last-child{

  }
}
.ybfajs:hover{
  color: #CCFF00;
  background: url(../../../assets/images/ybfajs2.png) 0 0 no-repeat;
  background-size: 100% 100%;
  
}
</style>
