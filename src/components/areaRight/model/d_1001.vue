<template>
  <div>
    <div class="wrap" :class="{'bg-com':!isMin}">
      <title-box title="实时雨情" second isVariable @change="toggle" />
      <el-form :model="formData" label-width="4.5rem" class="rain-form">
        <el-form-item label="起止时间" prop="date">
          <el-date-picker
            ref="dateTime"
            v-model="formData.date"
            :picker-options="options"
            type="datetimerange"
            range-separator="至"
            format="MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="false"
            style="width: 100%"
            popper-class="rain-date-popper"
            @change="changeHandle"
          />
        </el-form-item>
        
        <el-form-item label="区域选择" prop="type">
          <el-select v-model="addvcd" style="width: 100%" @change="changeHandle">
            <el-option
              v-for="item in addvcdList"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="筛选">
          <el-input v-model="search" clearable @input="handleSearch" placeholder="请输入名称" />
        </el-form-item>
      </el-form>
      <el-checkbox   style="color: #00fff6;margin-left: 8px"   v-model="checked">雨量等值面</el-checkbox>

      <ul class="rain-tabs" v-if="!isMin">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="全部" name="all">
            <all-rain :options="options" :tabData="allData" ref="allRainRef" @change="setChartData"></all-rain>
          </el-tab-pane>
          <el-tab-pane label="水文" name="hydrology">
            <hydrology-rain :options="options" :tabData="allData" ref="hydrologyRainRef" @change="setChartData"></hydrology-rain>
          </el-tab-pane>
          <el-tab-pane label="水位" name="water">
            <water-rain :options="options" :tabData="allData" ref="waterRainRef" @change="setChartData"></water-rain>
          </el-tab-pane>
          <el-tab-pane label="雨量" name="hyetal">
            <hyetal :options="options" :tabData="allData" ref="hyetalRef" @change="setChartData"></hyetal>
          </el-tab-pane>
          <el-tab-pane label="水库" name="reservoir">
            <reservoir-rain :options="options" :tabData="allData" ref="reservoirRainRef" @change="setChartData"></reservoir-rain>
          </el-tab-pane>
          <el-tab-pane label="山洪" name="flood">
            <flood-rain :options="options" :tabData="allData" ref="floodRainRef" @change="setChartData"></flood-rain>
          </el-tab-pane>
          <el-tab-pane label="时段" name="period">
            <rain-period ref="periodRef"/>
          </el-tab-pane>
        </el-tabs>
      </ul>
      
    </div>
    <div :class="{'bg-com':!isMin}" class="rainfall-lv">
      <h2>降雨分布</h2>
      <div class="lv-chart">
        <div ref="chart" />
      </div>
      <div class="bg-border" />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import titleBox from '@/components/titleBox'
import { formatDate } from '@/assets/js/common'
import ReservoirRain from '../comp/reservoirRain'
import FloodRain from '../comp/floodRain'
import HydrologyRain from '../comp/hydrologyRain'
import StationList from '../comp/stationList'
import AllRain from '../comp/allRain'
import WaterRain from '../comp/waterRain'
import TimeArea from '../../timeArea'
import Hyetal from '../comp/hyetal'
import RainPeriod from '../comp/rainPeriod'
import dayjs from 'dayjs'
import WS from "@/utils/socket_service"

let et = new Date()
let shortList = [
  {
    text: '昨天8时到现在',
    onClick(picker) {
      let y = new Date(new Date().setDate(new Date().getDate() - 1))
      picker.$emit('pick', [
        new Date(formatDate(y, 'yyyy-MM-dd 08:00:00')),
        et
      ])
    }
  }
]
if (new Date().getHours() > 8) {
  shortList.push({
    text: '今天8时到现在',
    onClick(picker) {
      picker.$emit('pick', [
        new Date(formatDate(new Date(), 'yyyy-MM-dd 08:00:00')),
        et
      ])
    }
  })
}
let arr = [3, 6, 12, 24, 48, 72]
for (let i = 0; i < arr.length; i++) {
  shortList.push({
    text: '最近' + arr[i] + '小时',
    onClick(picker) {
      picker.$emit('pick', [
        new Date(et.getTime() - 60 * 60 * 1000 * arr[i]),
        et
      ])
    }
  })
}

export default {
  components: {
    WaterRain,
    AllRain,
    titleBox,
    HydrologyRain,
    FloodRain,
    ReservoirRain,
    StationList,
    TimeArea,
    Hyetal,
    RainPeriod
  },
  props: {
    isPopShow: {
      type: Boolean,
      default() {
        return false
      }
    },
    popupShowData: {
      type: Object,
      default() {
        return {
          type: 1001,
          data: {
            stnm: ''
          }
        }
      }
    },
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
      checked: true,
      activeName: 'all',
      type: 1001,
      sttp: '',
      search: '',
      options: {
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

      addvcd: '',
      addvcdList: [],
      sttpList: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '雨量站',
          value: 'PP,ZP'
        },
        {
          label: '河道水文站',
          value: 'ZQ'
        },
        {
          label: '水库水文站',
          value: 'RR'
        },
        {
          label: '水位雨量站',
          value: 'ZP'
        },
        {
          label: '水库雨量站',
          value: 'RP'
        },
        {
          label: '山洪雨量站',
          value: 'PB'
        },

        {
          label: '山洪水位雨量站',
          value: 'ZD'
        }
      ],
      formData: {
        date: [],
        type: ''
      },
      queryData: {},
      tableData: [],
      rainLevel: [0, 10, 25, 50, 100, 250, 500],
      chartData: [
        { value: 0, name: '无雨' },
        { value: 0, name: '小雨' },
        { value: 0, name: '中雨' },
        { value: 0, name: '大雨' },
        { value: 0, name: '暴雨' },
        { value: 0, name: '大暴雨' },
        { value: 0, name: '特大暴雨' }
      ],
      level: ''
    }
  },
  watch: {
    checked(val) {

      console.log('checked 变化了：')

      this.changeSet(val)
    }
  },
  created() {

    let e = new Date()
    if (new Date().getHours() > 8) {

      this.formData['date'] = [
        formatDate(e, 'yyyy-MM-dd 08:00:00'),
        formatDate(e, 'yyyy-MM-dd hh:mm:ss')
      ]
    } else {
      let y = new Date(new Date().setDate(new Date().getDate() - 1))
      console.log(y)
      this.formData['date'] = [
        formatDate(y, 'yyyy-MM-dd 08:00:00'),
        formatDate(e, 'yyyy-MM-dd hh:mm:ss')
      ]
    }



    this.SocketService = new WS({url:process.env.WS_HOST+'/websocket/1'})
    this.SocketService.registerCallBack('productivity', this.getAllList)
  },
  mounted() {
    this.handleTabClick()
    this.addvcdList = [
      { label: '全部', value: '', index: 0 },
      { label: '示范市', value: [510000], index: 1 }
    ]
  },
  beforeDestroy(){

    this.SocketService.unRegisterCallBack('productivity')
    this.SocketService.ws.close()
  },
  methods: {

    getAllList(res){
      if(res.type == 'rbjointrain'){
        switch (this.activeName){
          case 'all':
            this.allData = res.data
          break;
          case 'hydrology':
            this.allData = res.data.filter(item=> item.sttp == 'ZQ')
          break;
          case 'water':
          this.allData = res.data.filter(item=> item.sttp == 'ZP')
          break;
          case 'hyetal':
          this.allData = res.data.filter(item=> item.sttp == 'PP')
          break;
          case 'reservoir':
          this.allData = res.data.filter(item=> ['RR','RP'].includes(item.sttp))
          break;
          case 'flood':
          this.allData = res.data.filter(item=> ['PB','ZD'].includes(item.sttp))
          break;
        }
      }
    },
    getChecked() {

    },
    changeSet(val) {
      console.log(val)
      if (val) {
        window.mpPlugin.isosurface().show(this.formData.date[0], this.formData.date[1])
      } else {
        window.mpPlugin.isosurface().clearLayer()
      }
    },
    toggle(type) {
      console.log(type)
      if (type === 'max' && !this.isMin) return
      this.$emit('sizeChange', !this.isMin)
      if(!type){
        this.$nextTick(()=>{
          this.handleTabClick()
        })
      }
    },
    setChartData(data) {
      for (let i = 0; i < this.chartData.length; i++) {
        this.chartData[i].value = 0
      }
      const rainLevel = this.rainLevel
      data.forEach(d => {
        const rain = d.drp
        for (let i = 0; i < rainLevel.length; i++) {
          const level = rainLevel[i]
          if (rain <= level) {
            this.chartData[i].value += 1
            break
          }
        }
      })
      this.draw(this.chartData)
    },
    draw(data) {
      console.log(data)
      let option = {
        tooltip: {
          trigger: 'item'
        },
        color: [
          'rgba(200, 230, 235, 0.55)',
          'rgba(0, 210, 255, 0.88)',
          'rgba(0, 255, 180, 0.88)',
          'rgba(80, 220, 120, 0.88)',
          'rgba(255, 220, 70, 0.90)',
          'rgba(255, 150, 70, 0.90)',
          'rgba(255, 70, 70, 0.92)'
        ],
        series: [
          {
            type: 'pie',
            radius: ['42%', '70%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderColor: 'rgba(6, 28, 40, 0.85)',
              borderWidth: 2
            },
            label: {
              color: '#9ad8e0',
              fontSize: 11
            },
            labelLine: {
              lineStyle: { color: 'rgba(0, 255, 246, 0.35)' }
            },
            data
          }
        ]
      }
      this.chart = this.$eCharts.init(this.$refs.chart)
      this.chart.setOption(option)
    },
    timeUpdate() {

      let sttpList = []
      if (this.activeName === 'all') {
        sttpList = []
      } else if (this.activeName === 'water') {
        sttpList = [this.sttpList[4].value]
      } else if (this.activeName === 'reservoir') {
        sttpList = [this.sttpList[3].value, this.sttpList[5].value]
      } else if (this.activeName === 'flood') {
        sttpList = [this.sttpList[6].value, this.sttpList[7].value]
      } else if (this.activeName === 'hyetal' || this.activeName === 'period') {
        sttpList = ['PP']
      } else {
        sttpList = [this.sttpList[2].value]
      }
      let json = {
        type: this.type,
        startDate: this.formData.date[0],
        endDate: this.formData.date[1],
        addvcd: this.addvcd,
        sttpList: sttpList
      }
      this.$emit('timeUpdate', json)
    },
    changeHandle() {
      this.queryData.sttpList = this.sttp
      this.queryData.addvcd = this.addvcd
      this.queryData.startDate = this.formData.date[0]
      this.queryData.endDate = this.formData.date[1]
      this.handleTabClick()
      this.changeSet(this.checked)
    },
    handleSearch() {
      console.log(this.activeName)
      switch (this.activeName) {
        case 'all':
          this.$refs.allRainRef.search = this.search
          break
        case 'reservoir':
          this.$refs.reservoirRainRef.search = this.search
          break
        case 'flood':
          this.$refs.floodRainRef.search = this.search
          break
        case 'hydrology':
          this.$refs.hydrologyRainRef.search = this.search
          break
        case 'water':
          this.$refs.waterRainRef.search = this.search
          break
        case 'hyetal':
          this.$refs.hyetalRef.search = this.search
      }
    },
    handleTabClick() {
      this.clearLayers()

      const startDate = this.formData['date'][0]
      const endDate = this.formData['date'][1]
      const sttpList = this.queryData.sttpList
      console.log('this.queryData',this.queryData)
      const addVcdList = this.queryData.addvcd
      const reservoirSttpList = [
        this.sttpList[3].value,
        this.sttpList[5].value
      ]
      const floodSttpList = [this.sttpList[6].value, this.sttpList[7].value]
      const hydrologySttpList = [this.sttpList[2].value]
      const waterSttpList = [this.sttpList[4].value]
      const hyetalSttpList = ['PP']
      switch (this.activeName) {
        case 'all':
          this.$refs.allRainRef.init({
            startDate,
            endDate,
            sttpList,
            addVcdList
          })
          break
        case 'reservoir':
          this.$refs.reservoirRainRef.init({
            startDate,
            endDate,
            reservoirSttpList,
            addVcdList
          })
          break
        case 'flood':
          this.$refs.floodRainRef.init({
            startDate,
            endDate,
            floodSttpList,
            addVcdList
          })
          break
        case 'hydrology':
          this.$refs.hydrologyRainRef.init({
            startDate,
            endDate,
            hydrologySttpList,
            addVcdList
          })
          break
        case 'water':
          this.$refs.waterRainRef.init({
            startDate,
            endDate,
            waterSttpList,
            addVcdList
          })
          break
        case 'hyetal':
          this.$refs.hyetalRef.init({
            startDate,
            endDate,
            hyetalSttpList,
            addVcdList
          })
          break
        case 'period':
          this.$refs.periodRef.init({
            startDate,
            endDate,
            addVcdList
          })
          break
      }

      this.timeUpdate()

    },
    clearLayers() {
      window.mpPlugin.rainPoint().clearLayer()
      window.mpPlugin.reservoirPoint().clearLayer()
      window.mpPlugin.hydrologyPoint().clearLayer()
      window.mpPlugin.dangerAreaPoint().clearLayer()
    },


    setCurrentRow(data) {
      let scrollHeight = this.$refs.table.bodyWrapper.scrollHeight
      let len = this.tableData.length
      for (let i = 0; i < len; i++) {
        let row = this.tableData[i]
        if (row.stcd === data.stcd) {
          this.$refs.table.setCurrentRow(row)
          if (i < 6) {
            this.$refs.table.bodyWrapper.scrollTo({
              top: 0,
              behavior: 'smooth'
            })
          } else {
            this.$refs.table.bodyWrapper.scrollTo({
              top: (scrollHeight / len) * (i - 2),
              behavior: 'smooth'
            })
          }
        }
      }
    }
  },
  filters: {
    level(l) {
      return ['无雨', '小雨', '中雨', '大雨', '暴雨', '大暴雨', '特大暴雨'][l]
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.rainfall-lv{
  margin-top: 0.625rem;
}

.rain-form {
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

.rain-tabs {
  height: min(27rem, 42vh);
  overflow: hidden;
  padding: 0 0.25rem;
  box-sizing: border-box;

  ::v-deep .el-tabs__header {
    margin: 0 0 0.25rem;
  }

  
  ::v-deep .el-tabs__nav-wrap.is-scrollable {
    padding: 0;
  }

  ::v-deep .el-tabs__nav-prev,
  ::v-deep .el-tabs__nav-next {
    display: none;
  }

  ::v-deep .el-tabs__nav-scroll {
    overflow: hidden;
  }

  ::v-deep .el-tabs__nav {
    display: flex;
    width: 100%;
    float: none;
    transform: none !important;
  }

  ::v-deep .el-tabs__item {
    flex: 1 1 0;
    min-width: 0;
    padding: 0 2px;
    text-align: center;
    font-size: 0.8125rem;
    height: 2.25rem;
    line-height: 2.25rem;
  }

  ::v-deep .el-tabs__content {
    height: calc(100% - 2.5rem);
    overflow: auto;
    overflow-x: hidden;
  }

  ::v-deep .el-table {
    width: 100% !important;
  }

  ::v-deep .el-table .cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ::v-deep .el-table__body-wrapper {
    overflow-x: hidden !important;
  }
}

 .el-checkbox {
    color: #606266;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-right: 1.875rem;
    position: relative;
  }

.el-checkbox__input {
    display: inline-block;
    position: absolute;
    white-space: nowrap;
    right: -2rem;
  }

  .rainfall-real {
    margin-bottom: 0.625rem;
    padding-top: 0.9375rem;

    .el-form {
      padding: 0 0.625rem;
    }

    .el-form-item {
      margin-bottom: 1px;
    }
  }
</style>
