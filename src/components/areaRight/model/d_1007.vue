<template>
  <div>
    <div class="wrap" :class="{'bg-com':!isMin}">
      <div ref="mapArea" class="map-area">
        
        
      </div>
      <title-box title="水情预警" second isVariable @change="toggle"/>
      <el-form :model="formData" >
        <el-form-item label="起止时间" prop="date">
          <el-date-picker
            v-model="formData.date"
            type="datetimerange"
            :default-time="defaultTime"
            range-separator="至"
            format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="true"
          />
        </el-form-item>
        <el-form-item>

          <div class="ybfajs" @click="issueWarning">
            <span>预警发布</span>
            <span></span>
          </div>
        </el-form-item>
      </el-form>
      <ul style="height: 435px;" v-if="!isMin">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="监测预警" name="monitor">
          <monitor-warning ref="monitor"></monitor-warning>
        </el-tab-pane>
        <el-tab-pane label="水利部预警" name="department">
          <water-department-warning ref="departmentWarn"></water-department-warning>
        </el-tab-pane>
      </el-tabs>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Api from '@/api'
  import titleBox from '@/components/titleBox'
  import { formatDate } from '@/assets/js/common'
  import MonitorWarning from "../comp/monitorWarning";
  import WaterDepartmentWarning from "../comp/waterDepartmentWarning";
  import IssueWarning from "../comp/issueWarning";

  export default {
    components: {
      IssueWarning,
      WaterDepartmentWarning,
      MonitorWarning,
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
    created() {

    },
    data() {
      return {
        defaultTime:['00:00:00',formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')],
        tableData: [],
        formData: {
          date: []
        },
        options1: [{
          value: '洪水',
          label: '洪水'
        }, {
          value: '干旱',
          label: '干旱'
        }],
        options2: [{
          value: '蓝色',
          label: '蓝色'
        }, {
          value: '黄色',
          label: '黄色'
        }, {
          value: '红色',
          label: '红色'
        }, {
          value: '橙色',
          label: '橙色'
        }],
        options3: [],
        value1: '',
        value2: '',
        value3: '示范水文',
        activeName: 'monitor'
      }
    },

    mounted() {

    },
    methods: {
      toggle(type) {
        console.log(type)
        if (type === 'max' && !this.isMin) return
        this.$emit('sizeChange', !this.isMin)
      },
      issueWarning() {
        window.eventBus.$emit('openIssueWarningPopup', this.activeName === 'monitor' ? this.$refs.monitor.multipleSelection : this.$refs.departmentWarn.multipleSelection, this.activeName )
      },
      handleClick(value){
        console.log(this.activeName)
        console.log(value)
        this.activeName === 'monitor' ? this.$refs.monitor.cleanCheckBox() : this.$refs.departmentWarn.cleanCheckBox()
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
      width: 12px;
      height: 12px;

    }
  }
  .ybfajs:hover{
    color: #CCFF00;
    background: url(../../../assets/images/ybfajs2.png) 0 0 no-repeat;
    background-size: 100% 100%;
    
  }
</style>
