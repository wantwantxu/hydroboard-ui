<template>
  <div class="wrap" :class="{'bg-com':!isMin}">
    <title-box title="合理性分析" second isVariable @change="toggle"/>
    <el-form :model="formData" label-width="75px">
      <el-form-item label="起止时间" prop="date">
          <el-date-picker
            style="width: 150px;"
            v-model="formSearch.stm"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
          至
          <el-date-picker
            style="width: 150px;"
            v-model="formSearch.etm"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      

      <el-form-item label="计算类型" prop="type">
        <el-select v-model="formSearch.calcType" placeholder="请选择" @change="getList">
          <el-option label="行政区划" value="addvcd"></el-option>
          <el-option label="流域" value="basin"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行政区划" prop="type" v-if="formSearch.calcType === 'addvcd'">
        <el-select v-model="formSearch.addvcd" placeholder="所有区县" @change="getList">
          <el-option label="所有区县" value=""></el-option>
          <el-option label="旌阳区" value="510603"></el-option>
          <el-option label="罗江区" value="510604"></el-option>
          <el-option label="广汉市" value="510681"></el-option>
          <el-option label="什邡市" value="510682"></el-option>
          <el-option label="绵竹市" value="510683"></el-option>
          <el-option label="中江县" value="510623"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="流域" prop="type" v-if="formSearch.calcType === 'basin'">
          <el-select v-model="formSearch.basinId" placeholder="所有流域" @change="getList">
            <el-option label="所有流域" value=""></el-option>
            <el-option v-for="(item, index) in basinList" :key="index" :label="item.basinName"
                       :value="item.basinId"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="formSearch.type" placeholder="请选择">
          <el-option label="降雨量" value="rain"></el-option>
          <el-option label="径流量" value="runoff"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计算方法" prop="type">
        <el-select v-model="calculationMethod" placeholder="请选择计算方法" v-if="formSearch.type==='rain'">
          <el-option label="泰森多边形法" value="rainfallCalculation1"></el-option>
          <el-option label="栅格统计法" value="rainfallCalculation2"></el-option>
        </el-select>
        <el-select v-model="calculationMethod" placeholder="请选择计算方法" v-if="formSearch.type==='runoff'">
          <el-option label="径流系数法" value="rainfallCalculation1"></el-option>
          <el-option label="读取实测数据" value="rainfallCalculation2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="getList">查询</el-button>
        <el-button type="text" @click="showDialog()">详情</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="table" :data="tableData" height="500px" max-height="600px" v-loading="loading" stripe highlight-current-row
              @row-click="$emit('resultShow')">
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="行政区划" prop="addvnm" align="center" />
      <el-table-column label="流域" prop="basinName" align="center" />
      <el-table-column label="降雨量" prop="rainfall" align="center" />
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
import titleBox from '@/components/titleBox'
import Api from '@/api/index'

export default {
  name: 'd_5001',
  components: {
    titleBox
  },
  props: {
    isPopShow: {
      type: Boolean,
      default() {
        return false
      }
    },
    isMin: {
      type: Boolean,
      default() {
        return false
      }
    },
    popupShowData: {
      type: Object,
      default() {
        return {
          type: 5001,
          data: {
            stnm: ''
          }
        }
      }
    }
  },
  data() {
    return {
      type: 5001,
      tableData: [],
      loading: false,
      formSearch: {
        calcType: 'basin',
        stm: this.getLastWeekStart(),
        etm: this.getToday(),
        addvcd: '',
        type: 'rain',
        basinId: ''
      },
      options: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      basinList: [],
      calculationMethod: 'rainfallCalculation1',
      formData: {
        date: []
      },
      queryData: {},
      list: []
    }
  },
  methods: {
    getToday() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    getLastWeekStart() {
      const date = new Date();
      date.setDate(date.getDate() - 6);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    toEmit() {
      let json = {
        type: this.type,
        startTime: this.formData.date[0],
        endTime: this.formData.date[1]
      }
      this.$emit('change', json)
    },
    timeUpdate() {
      let json = {
        type: this.type,
        stm: this.formData.date[0],
        etm: this.formData.date[1]
      }
      this.$emit('timeUpdate', json)
    },
    changeHandle() {
    },
    toggle(type) {
      if (type === 'max' && !this.isMin) return
      this.$emit('sizeChange', !this.isMin)

      if(!type){
        this.$nextTick(()=>{
          this.getList()
        })
      }
    },
    changeTr(row) {
      if (row) {

        window.mpPlugin.dangerAreaPoint().showPointPopup(row)
        let option = {data: {...row, date: this.formData.date}, type: this.type}
        this.$emit('pop', option)
      }
    },
    clickHandler(row, index) {
      this.$refs.table.setCurrentRow()
    },
    showDialog() {
      window.eventBus.$emit('waterResourcesShow')
    },
    getBasinList(){
      Api.listBasin().then(res => {
        this.basinList = res.result
        this.getList()
      })
    },
    getList() {
      this.loading = true
      this.timeUpdate()
      this.queryData.sttp = this.sttp

      if (this.calculationMethod === 'rainfallCalculation1') {
        Api.listRainfallStatis(this.formSearch).then(res => {
          this.loading = false
          this.tableData = res.result
        })
      }

      if (this.calculationMethod === 'rainfallCalculation2') {
        Api.listRasterRainfallStatis(this.formSearch).then(res => {
          this.loading = false
          this.tableData = res.result
        })
      }
      setTimeout(()=> this.loading=false, 10000)
    },

    setCurrentRow(data) {
      let scrollHeight = this.$refs.table.bodyWrapper.scrollHeight
      let tableData = this.waterList['list_' + this.tabCur]
      let len = tableData.length
      for (let i = 0; i < len; i++) {
        let row = tableData[i]
        if (row.stcd === data.stcd) {
          this.$refs.table.setCurrentRow(row)
          if (i < 12) {
            this.$refs.table.bodyWrapper.scrollTo({top: 0, behavior: 'smooth'})
          } else {
            this.$refs.table.bodyWrapper.scrollTo({top: (scrollHeight / len) * (i - 2), behavior: 'smooth'})
          }
        }
      }
    }
  },
  created() {
    this.getBasinList()
  },
  watch: {
    isPopShow(v) {
      if (!v && this.$refs.table) {
        this.$refs.table.setCurrentRow()
      }
    },
    popupShowData(v) {
      if (v.type === this.type) {
        this.setCurrentRow(v.data)
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
</style>
