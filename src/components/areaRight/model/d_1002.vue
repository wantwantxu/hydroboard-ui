<template>
  <div class="wrap" :class="{'bg-com':!isMin}">
    <title-box title="实时水情" second isVariable @change="toggle"/>
    <el-form class="water-form" :model="formData" label-width="3rem">
      <el-form-item label="时间">
        <el-date-picker v-model="formData.date" :picker-options="pickerOptions" ref="dateTime" @input="input()" type="datetimerange" range-separator="至"
                        format="MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss" popper-class="water-date-popper"
                        :editable="false" :clearable="false" @change="dateChange"/>
      </el-form-item>
      <el-form-item label="筛选">
        <el-input v-model="search" clearable @input="handleSearch" placeholder="请输入名称" />
      </el-form-item>
    </el-form>
    <ul style="height: 435px;" v-if="!isMin">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="全部" name="all">
          <station-list :options="options" :tabData="allData" ref="allStationRef"></station-list>
        </el-tab-pane>
        <el-tab-pane label="水文" name="hydrology">
          <hydrology-station-list :options="options" :tabData="allData" ref="hydrologyStationRef"></hydrology-station-list>
        </el-tab-pane>
        <el-tab-pane label="水位" name="river">
          <river-station-list :options="options" :tabData="allData" ref="riverStationRef"></river-station-list>
        </el-tab-pane>
        <el-tab-pane label="水库" name="reservoir">
          <reservoir-station-list :options="options" :tabData="allData" ref="reservoirStationRef"></reservoir-station-list>
        </el-tab-pane>
        <el-tab-pane label="山洪" name="flood">
          <flood-station-list :options="options" :tabData="allData" ref="floodStationRef"></flood-station-list>
        </el-tab-pane>




      </el-tabs>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import titleBox from '@/components/titleBox'
import {formatDate} from '@/assets/js/common'
import StationList from '../comp/stationList'
import RiverStationList from '../comp/riverStationList'
import ReservoirStationList from '../comp/reservoirStationList'
import FloodStationList from '../comp/floodStationList'
import HydrologyStationList from '../comp/hydrologyStationList'
import SedimentList from '../comp/sediment'
import dayjs from 'dayjs'
import WS from "@/utils/socket_service"

let et = new Date()
let shortList = [
  {
    text: '昨天8时到现在',
    onClick(picker) {
      let y = new Date(new Date().setDate(new Date().getDate() - 1))
      picker.$emit('pick', [new Date(formatDate(y, 'yyyy-MM-dd 08:00:00')), et])
    }
  }
]
if (new Date().getHours() > 8) {
  shortList.push({
    text: '今天8时到现在',
    onClick(picker) {
      picker.$emit('pick', [new Date(formatDate(new Date(), 'yyyy-MM-dd 08:00:00')), et])
    }
  })
}
let arr = [3, 6, 12, 24, 48, 72]
for (let i = 0; i < arr.length; i++) {
  shortList.push({
    text: '最近' + arr[i] + '小时',
    onClick(picker) {
      picker.$emit('pick', [new Date(et.getTime() - 60 * 60 * 1000 * arr[i]), et])
    }
  })
}

export default {
  components: {
    HydrologyStationList,
    FloodStationList,
    ReservoirStationList,
    RiverStationList,
    StationList,
    titleBox,
    SedimentList
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
      SocketService:null,
      options: {startDate: '', endDate: ''},
      type: 1002,
      activeName: 'all',
      search: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [...shortList],
        onPick: (time) => {
            if (time.maxDate) {
              const end = new Date()
              const end1 = new Date(time.maxDate)
              if (dayjs(end).format('YYYY-MM-DD') === dayjs(end1).format('YYYY-MM-DD')) {
                setTimeout(() => {
                  this.$refs.dateTime.picker.maxDate = new Date()
                }, 15)
              }else{
                setTimeout(() => {
                  this.$refs.dateTime.picker.maxDate = new Date(dayjs(end1).format('YYYY-MM-DD 23:59:59'))
                }, 15)
              }
            }
        }
      },
      
      formData: {
        date: []
      },
      queryData: {}
    }
  },
  created() {

    let e = new Date()
    let y = new Date(new Date().setDate(new Date().getDate() - 1))
    this.formData['date'] = [formatDate(y, 'yyyy-MM-dd 08:00:00'), formatDate(e, 'yyyy-MM-dd hh:mm:ss')]


      this.SocketService = new WS({url:process.env.WS_HOST+'/websocket/1'})
    this.SocketService.registerCallBack('productivity', this.getAllList)
  },
  beforeDestroy(){

    this.SocketService.unRegisterCallBack('productivity')
    this.SocketService.ws.close()
  },
  mounted() {
    this.handleTabClick()
  },
  methods: {

    getAllList(res){
      if(res.type == 'water'){
        switch (this.activeName){
          case 'all':
            this.allData = res.data
          break;
          case 'hydrology':
            this.allData = res.data.filter(item=> ['DD','ZQ'].includes(item.sttp))
          break;
          case 'river':
          this.allData = res.data.filter(item=> ['ZZ','ZP'].includes(item.sttp))
          break;
          case 'reservoir':
          this.allData = res.data.filter(item=> ['RR'].includes(item.sttp))
          break;
          case 'flood':
          this.allData = res.data.filter(item=> ['ZC', 'ZD'].includes(item.sttp))
          break;
        }
      }
    },
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
      switch (this.activeName) {
        case 'all' :
          this.$refs.allStationRef.search = this.search
          break
        case 'river':
          this.$refs.riverStationRef.search = this.search
          break
        case 'reservoir':
          this.$refs.reservoirStationRef.search = this.search
          break
        case 'flood':
          this.$refs.floodStationRef.search = this.search
          break
        case 'hydrology':
          this.$refs.hydrologyStationRef.search = this.search
          break
        case 'sediment':
          this.$refs.sedimentRef.search = this.search
          break
      }
    },
    handleTabClick() {
      this.clearLayers()
      const startDate = this.formData['date'][0]
      const endDate = this.formData['date'][1]
      switch (this.activeName) {
        case 'all':
          this.$refs.allStationRef.getWaterList({
            startDate,
            endDate
          })
          break
        case 'river':
          this.$refs.riverStationRef.getWaterList({
            startDate,
            endDate
          })
          break
        case 'reservoir':
          this.$refs.reservoirStationRef.init({
            startDate,
            endDate
          })
          break
        case 'flood':
          this.$refs.floodStationRef.getWaterList({
            startDate,
            endDate
          })
          break
        case 'hydrology':
          this.$refs.hydrologyStationRef.getWaterList({
            startDate,
            endDate
          })
          break
        case 'sediment':
          this.$refs.sedimentRef.getSedimentList({
            startDate,
            endDate
          })
          break
      }
      let option = {date: this.formData.date, activeName: this.activeName}
      this.$emit('pop', option)
    },
    clearLayers() {
      window.mpPlugin.waterPoint().clearLayer()
      window.mpPlugin.reservoirPoint().clearLayer()
      window.mpPlugin.hydrologyPoint().clearLayer()
      window.mpPlugin.dangerAreaPoint().clearLayer()
      window.mpPlugin.sedimentPoint().clearLayer()
    },
    input() {
      this.$forceUpdate()
    },
    dateChange() {
      this.options.startDate = this.formData.date[0]
      this.options.endDate = this.formData.date[1]
      this.handleTabClick()
    },
    rowClickHandler(row) {
      if (row) {
        window.mpPlugin.waterPoint().showPointPopup(row)
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.water-form {
  padding: 0 0.5rem;
  box-sizing: border-box;

  ::v-deep .el-form-item {
    margin-bottom: 0.375rem;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }

  ::v-deep .el-form-item__label {
    white-space: nowrap !important;
    float: none;
    flex-shrink: 0;
    width: auto !important;
    line-height: 2rem;
    padding-right: 0.5rem;
  }

  ::v-deep .el-form-item__content {
    min-width: 0;
    flex: 1;
    margin-left: 0 !important;
    line-height: 2rem;
  }

  ::v-deep .el-input__inner {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ::v-deep .el-range-editor.el-input__inner {
    width: 100% !important;
    max-width: 100%;
  }
}
</style>
