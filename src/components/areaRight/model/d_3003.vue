<template>
  <div class="wrap" :class="{'bg-com':!isMin}">
    <title-box title="水库" second isVariable @change="toggle"/>
    <el-form :model="formData" label-width="3rem">
      <el-form-item label="时间">
        <el-date-picker v-model="formData.date" :picker-options="pickerOptions" ref="dateTime" @input="input()" type="datetimerange" range-separator="至"
                        format="MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss" :editable="false" :clearable="false" @change="dateChange"/>
      </el-form-item>
      <el-form-item label="筛选">
        <el-input v-model="search"  @input="handleSearch" placeholder="请输入名称" />
      </el-form-item>
    </el-form>
    <ul style="height: 390px;" v-if="!isMin">
      <reservoir-station-list :options="options" :tabData="allData" ref="reservoirStationRef"></reservoir-station-list>
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
      SocketService:null,
      options: {startDate: '', endDate: ''},
      type: 3003,
      activeName: 'river',
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
    this.$refs.reservoirStationRef.init({startDate: this.formData['date'][0], endDate: this.formData['date'][1]})
  },
  methods: {

    getAllList(res){
      if(res.type == 'reservoir'){
        this.allData = res.data
      }
    },
    handleSearch() {
      this.$refs.reservoirStationRef.search = this.search
    },
    toggle(type) {
      if (type === 'max' && !this.isMin) return
      this.$emit('sizeChange', !this.isMin)

      if(!type){
        this.$nextTick(()=>{
          this.$refs.reservoirStationRef.init({startDate: this.formData['date'][0], endDate: this.formData['date'][1]})
        })
      }
    },
    init(data) {

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
        window.mpPlugin.reservoirPoint().showPointPopup(row)
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
</style>
