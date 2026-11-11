<template>
  <div class="wrap" :class="{'bg-com':!isMin}">
    <title-box title="山洪危险区" second isVariable @change="toggle"/>
    <el-table ref="table" :data="list" height="390px" max-height="390px"  stripe highlight-current-row
              @row-click="changeTr">
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="站名" prop="name" align="center" show-overflow-tooltip/>
      <el-table-column label="区划" prop="addvnm" align="center" />
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
import titleBox from '@/components/titleBox'
import Api from '@/api/index'

export default {
  name: 'd_3001',
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
          type: 3001,
          data: {
            stnm: ''
          }
        }
      }
    }
  },
  data() {
    return {
      type: 3001,
      options: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      formData: {
        date: []
      },
      queryData: {},
      list: []
    }
  },
  methods: {
    toEmit() {
      let json = {
        type: this.type,
        startTime: this.formData.date[0],
        endTime: this.formData.date[1],
        data: this.shList
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
      this.getShList()
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
      this.getShList()
    },
    getList() {
      this.timeUpdate()
      this.queryData.sttp = this.sttp
      Api.listDangerArea({}).then(response => {
        if (response.code === 200) {
          this.list = response.result
          let dangerAreaPoint = []
          this.list.forEach((item) => {
            let point = {
              id: item.id,
              stnm: item.name,
              lttd: item.lttd,
              lgtd: item.lgtd
            }
            dangerAreaPoint.push(point)
          })
          window.mpPlugin.dangerAreaPoint().showPoint(dangerAreaPoint)
        }
      })
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
    this.getList()
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
