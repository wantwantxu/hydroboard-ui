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
  import Api from '@/api'
  import ReservoirStationList from '../comp/reservoirStationList'
  import FloodStationList from '../comp/floodStationList'
  import HydrologyStationList from '../comp/hydrologyStationList'
  import StationList from '../comp/stationList'

  export default {
    components: {
      titleBox,
      HydrologyStationList,
      FloodStationList,
      ReservoirStationList,
      StationList
    },
    props:['tabData'],
    data() {
      return {
        type: 1001,
        sttp: '',
        search: '',
        formData: {
          date: [],
          type: ''
        },
        queryData: {},
        tableData: [],
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
      console.log('22222')
    },
    methods: {
      init(date) {
        console.log(date,'1111')

        this.queryParam = date
        this.changeHandle(date)
      },
      changeHandle(date) {
        this.getRainSumList(date)
      },
      changeTr(row) {
        if (row) {
          window.mpPlugin.rainPoint().showPointPopup(row)
        }
      },
      getRainSumList(date) {
        Api.getRainSumList({
          startDate: date.startDate,
          endDate: date.endDate,
          sttpList: date.sttpList
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

  .rainfall-real {
    margin-bottom: 10px;
    padding-top: 15px;

    .el-form {
      padding: 0 10px;
    }

    .el-form-item {
      margin-bottom: 1px;
    }
  }



  .cl_0 {
    color: rgba(255, 255, 255, .5);
  }

  .cl_1 {
    color: rgba(0, 210, 255, .9);
  }

  .cl_2 {
    color: rgba(0, 255, 141, .9);
  }

  .cl_3 {
    color: rgba(255, 238, 77, .9);
  }

  .cl_4 {
    color: rgba(255, 153, 74, .9);
  }

  .cl_5 {
    color: rgba(255, 83, 47, .9);
  }

  .cl_6 {
    color: rgba(255, 1, 32, .9);
  }
</style>
