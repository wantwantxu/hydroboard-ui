<template>
  <div class="wrap" :class="{'bg-com':!isMin}">
    <title-box :title="keyVal[comVal]" second isVariable @change="toggle"/>
    <el-form :model="formData" label-width="50px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" @change="getData"/>
      </el-form-item>
      <el-form-item label="区划" prop="type">
        <el-select v-model="formData.type" style="width: 100%" @change="getData">
          <el-option v-for="item in areaList" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-form>
    <ul class="tab">
      <li class="active">
        类型：{{typeLen}}个
      </li>
      <li class="active">
        共计：{{tableData.length}}条
      </li>
    </ul>
    <el-table ref="table" :data="tableData" height="450px" stripe highlight-current-row @row-click="changeTr">
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="名称" prop="name" align="center" show-overflow-tooltip/>
      <el-table-column label="类型" prop="type" align="center" width="75" show-overflow-tooltip/>
      <el-table-column label="区划" prop="area" align="center" width="80" show-overflow-tooltip/>
    </el-table>
    <div class="bg-border"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import titleBox from '@/components/titleBox'
  import Api from '@/api/index'
  export default {
    components: {
      titleBox
    },
    props: {
      comVal: {
        type: Number,
        default() {
          return 0
        }
      },
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
          return {}
        }
      }
    },
    data() {
      return {
        keyVal: {

          3001: '山洪危险区',
          3002: '内涝点',
          3003: '水库',
          3005: '河心州岛',
          3006: '船舶停靠点',
          3007: '湿地公园',
          3008: '医疗',
          3009: '学校',
          3010: '商超',
          3011: '车站',
          3012: '加油站',
          3013: '银行',
          3014: '餐馆',
          3015: '住宿',
          3016: '景点',
          3017: '充电站',
          3018: '港口码头'
        },
        formData: {
          name: '',
          type: ''
        },
        tableData: [],
        areaList: [
          {
            label: '全市',
            value: ''
          },
          {
            label: '船山区',
            value: '1'
          },
          {
            label: '安居区',
            value: '2'
          },
          {
            label: '蓬溪县',
            value: '3'
          },
          {
            label: '大英县',
            value: '4'
          },
          {
            label: '射洪市',
            value: '5'
          }
        ],
        typeLen: 1
      }
    },
    created() {
      this.getData()
    },
    methods: {
      toggle(type) {
        if (type === 'max' && !this.isMin) return
        this.$emit('sizeChange', !this.isMin)
      },
      toEmit(data) {

        let json = {
          type: this.comVal,
          data: data
        }
        this.$emit('change', json)
      },
      async getData() {

        console.log('获取', this.keyVal[this.comVal], '数据')
        let data
        if (this.comVal === 3001) {
          data = await Api.getFloodDangerArea()
        }
        this.showData(data)
      },
      showData(data) {
        if (this.comVal === 3001) {
          let typeName = []
          let dataList = []
          data.features.forEach((itm, index) => {
            let it = {
              name: itm.properties.name,
              type: '危险区',
              area: '示范市',
              id: index,
              lttd: itm.geometry.coordinates[1],
              lgtd: itm.geometry.coordinates[0]
            }
            dataList.push(it)
              if (typeName.indexOf(it.type) === -1) {
                typeName.push(it.type)
              }
              itm.properties.id = index
          })
          this.typeLen = typeName.length
          this.tableData = dataList
          this.toEmit(data)
        } else if (this.comVal === 3002) {

        }
      },
      changeTr(row) {

        if (row) {

          this.$emit('pop', {data: row, type: this.comVal})
        }
      },

      setCurrentRow(data) {
        let scrollHeight = this.$refs.table.bodyWrapper.scrollHeight
        let len = this.tableData.length
        for (let i = 0; i < len; i++) {
          let row = this.tableData[i]
          if (row.id === data.id) {
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
    watch: {
      comVal(v) {
        if (v) {
          this.toEmit()
        }
      },
      isPopShow(v) {
        if (!v && this.$refs.table) {
          this.$refs.table.setCurrentRow()
        }
      },
      popupShowData(v) {
        if (v.type === this.comVal) {
          this.setCurrentRow(v.data)
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
</style>
