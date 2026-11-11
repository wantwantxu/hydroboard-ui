<template>
  <el-table ref="table" :data="list.filter(data => !search || data.stnm.toLowerCase().includes(search.toLowerCase()))" style="width: 100%;" height="420" stripe highlight-current-row
    max-height="390px"  @row-click="rowClickHandler">
    <el-table-column label="序号" width="50" align="center">
      <template slot-scope="scope">{{ scope.$index + 1 }}</template>
    </el-table-column>
    <el-table-column label="站名" prop="stnm" align="center" show-overflow-tooltip/>
    <el-table-column label="5分钟泥沙量" width="100px" prop="value1" align="center"/>
  </el-table>
</template>

<script type="text/ecmascript-6">
  import Api from '../../../api'
  import dayjs from 'dayjs'
  export default {
    components: {
    },
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
        search: '',
        list: []
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      fmt(text) {
        if (!text) {
          return '无'
        }
        return dayjs(text).format('DD HH:mm')
      },
      rowClickHandler(row) {
        if (row) {
          window.mpPlugin.sedimentPoint().showPointPopup({...row,
            formData: {
              type: this.type

            }})


        }
      },
      tabClickHandler(row, index) {
        this.tabCur = index
        this.$refs.table.setCurrentRow()
        this.getWaterList()
      },
      getSedimentList(queryParam) {
        Api.listSsdimentNew(queryParam).then(response => {
          console.log(response)

          if (response.code === 200) {
            this.list = response.result
            window.mpPlugin.sedimentPoint().showPoint(this.list, queryParam)
          }
        })
      },

      setCurrentRow(data) {
        let scrollHeight = this.$refs.table.bodyWrapper.scrollHeight
        let tableData = this.waterList
        let len = tableData.length
        for (let i = 0; i < len; i++) {
          let row = tableData[i]
          if (row.stcd === data.stcd) {
            console.log((scrollHeight / len))
            console.log((scrollHeight / len) * i)
            this.$refs.table.setCurrentRow(row)
            if (i < 10) {
              this.$refs.table.bodyWrapper.scrollTo({top: 0, behavior: 'smooth'})
            } else {
              this.$refs.table.bodyWrapper.scrollTo({top: (scrollHeight / len) * (i - 15), behavior: 'smooth'})
            }
          }
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
</style>
