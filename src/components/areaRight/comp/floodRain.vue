<template>
  <div class="warp">
    <el-table ref="table"
              :data="tableData.filter(data => !search || data.stnm.toLowerCase().includes(search.toLowerCase()))"
              max-height="390px" stripe highlight-current-row
              @row-click="changeTr">
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="站名" prop="stnm" align="center" show-overflow-tooltip/>
      <el-table-column label="累计雨量(mm)" prop="drp" align="center" width="110"/>
      <el-table-column label="等级" width="80" align="center">
        <template slot-scope="{row}"><span :class="`cl_${row.grade}`">{{ getStatus(row.drp) }}</span></template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
  import titleBox from '@/components/titleBox'
  import {formatDate} from '@/assets/js/common'
  import Api from '@/api'
  import ReservoirStationList from '../comp/reservoirStationList'
  import FloodStationList from '../comp/floodStationList'
  import HydrologyStationList from '../comp/hydrologyStationList'
  import StationList from '../comp/stationList'

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
      titleBox,
      HydrologyStationList,
      FloodStationList,
      ReservoirStationList,
      StationList
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
      tabData:{
        type: Array,
        default: ()=> []
      }
    },
    data() {
      return {
        type: 1001,
        sttp: '',
        search: '',
        options: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [...shortList]
        },
        formData: {
          date: [],
          type: ''
        },
        queryData: {},
        tableData: [],
        rainLevel: [0, 10, 25, 50, 100, 250, 500],
        chartData: [
          {value: 0, name: '无雨'},
          {value: 0, name: '小雨'},
          {value: 0, name: '中雨'},
          {value: 0, name: '大雨'},
          {value: 0, name: '暴雨'},
          {value: 0, name: '大暴雨'},
          {value: 0, name: '特大暴雨'}
        ],
        level: '',
        queryParam: {}
      }
    },
    watch:{
      tabData:{
        handler(val){
          this.tableData = val
        },
        deep:true
      }
    },
    created() {

    },
    mounted() {
    },
    methods: {
      init(date) {
        console.log(date)

        this.queryParam = date
        this.changeHandle(date)

      },

      timeUpdate() {
        let json = {
          type: this.type,
          startDate: this.formData.date[0],
          endDate: this.formData.date[1]
        }
        this.$emit('timeUpdate', json)
      },
      changeHandle(date) {
        this.getRainSumList(date)
      },
      changeTr(row) {
        if (row) {
          console.log(row)
          console.log(this.queryParam)
          window.mpPlugin.rainPoint().showPointPopup(row)
        }
      },
      getRainSumList(date) {
        this.timeUpdate()
        Api.getRainSumList({
          startDate: date.startDate,
          endDate: date.endDate,
          sttpList: date.floodSttpList
        }).then(response => {
          if (response.code === 200) {
            const list = Array.isArray(response.result) ? response.result : []
            this.tableData = list.map(r => ({ ...r, stnm: (r.stnm || '').trim() }))
            window.mpPlugin.rainPoint().showPoint(this.tableData, {
              startDate: date.startDate,
              endDate: date.endDate
            })
            this.$emit('change', this.tableData)
          }
        })
      },

      getStatus(status) {
        if (status > 250) return '特大暴雨'
        else if (status > 0 && status < 10) return '小雨'
        else if (status < 25 && status >= 10) return '中雨'
        else if (status >= 25 && status <= 50) return '大雨'
        else if (status > 50 && status <= 100) return '暴雨'
        else if (status > 100 && status <= 250) return '大暴雨'
        else return '无雨'
      },


      setCurrentRow(data) {
        let scrollHeight = this.$refs.table.bodyWrapper.scrollHeight
        let len = this.tableData.length
        for (let i = 0; i < len; i++) {
          let row = this.tableData[i]
          if (row.stcd === data.stcd) {
            this.$refs.table.setCurrentRow(row)
            if (i < 6) {
              this.$refs.table.bodyWrapper.scrollTo({top: 0, behavior: 'smooth'})
            } else {
              this.$refs.table.bodyWrapper.scrollTo({top: (scrollHeight / len) * (i - 2), behavior: 'smooth'})
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

</style>
