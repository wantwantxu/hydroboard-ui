<template>
  <div class="wrap" :class="{'bg-com':!isMin}">
    <title-box title="人口普查" second isVariable @change="toggle"/>
    <el-form :model="formData" label-width="50px">
      <el-form-item label="专题" prop="theme">
        <el-select v-model="formData.theme" style="width: 100%" @change="themeChange">
          <el-option v-for="item in themeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table ref="table" :data="tableData" height="250px" stripe highlight-current-row @row-click="changeTr">
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="区划" prop="name" align="center"/>
      <el-table-column v-if="formData.theme==0" label="总人口(人)" prop="total" align="center">
        <template slot-scope="{row}">{{ row.total | num }}</template>
      </el-table-column>
      <el-table-column v-if="formData.theme==1" width="170" label="人口密度(人/平方公里)" align="center">
        <template slot-scope="{row}">{{ row.density | num }}</template>
      </el-table-column>
      <el-table-column v-if="formData.theme==2" label="儿童人口(人)" prop="children" align="center">
        <template slot-scope="{row}">{{ row.children | num }}</template>
      </el-table-column>
      <el-table-column v-if="formData.theme==3" label="老年人口(人)" prop="elderly" align="center">
        <template slot-scope="{row}">{{ row.elderly | num }}</template>
      </el-table-column>
    </el-table>
    <div class="chart">
      <div ref="chart"/>
    </div>
    <div class="bg-border"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import titleBox from '@/components/titleBox'
  import {numString} from '@/assets/js/common'

  export default {
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
      }
    },
    data() {
      return {
        formData: {
          theme: 0
        },
        themeList: [
          {
            label: '人口数量',
            value: 0
          },
          {
            label: '人口密度',
            value: 1
          },
          {
            label: '儿童人口',
            value: 2
          },
          {
            label: '老年人口',
            value: 3
          }
        ],
        tableData: [
          {
            name: '示范市',
            total: 3252619,
            density: 611,
            children: 490447,
            elderly: 370487
          },
          {
            name: '船山区',
            total: 656760,
            density: 1083,
            children: 96313,
            elderly: 62483
          },
          {
            name: '安居区',
            total: 639125,
            density: 504,
            children: 102195,
            elderly: 71220
          },
          {
            name: '蓬溪县',
            total: 553239,
            density: 443,
            children: 86303,
            elderly: 71120
          },
          {
            name: '射洪县',
            total: 924531,
            density: 617,
            children: 131222,
            elderly: 112621
          },
          {
            name: '大英县',
            total: 478964,
            density: 683,
            children: 74414,
            elderly: 53043
          }
        ]
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData() {

        this.themeChange()
      },
      toggle(type) {
        if (type === 'max' && !this.isMin) return
        this.$emit('sizeChange', !this.isMin)
      },
      draw(data) {
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            top: '15px',
            left: '60px',
            right: '10px',
            bottom: '40px'
          },
          color: ['rgba(0, 210, 255, .9)'],
          xAxis: {
            type: 'category',
            data: ['船山区', '安居区', '蓬溪县', '射洪县', '大英县'],
            axisLabel: {
              textStyle: {
                color: '#00fff6'
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#00fff6',
                fontSize: '10px'
              }
            },
            splitLine: {
              show: false
            }
          },
          series: [
            {
              data,
              type: 'bar',
              barMaxWidth: '30px'
            }
          ]
        }
        this.chart = this.$eCharts.init(this.$refs.chart)
        this.chart.setOption(option)
      },
      themeChange() {
        let key = ['total', 'density', 'children', 'elderly'][this.formData.theme]
        let data = JSON.parse(JSON.stringify(this.tableData))
        data.splice(0, 1)
        data = data.map(o => {
          return o[key]
        })
        this.draw(data)
      },
      changeTr(row) {
        if (row && row.name !== '示范市') {

          this.$emit('pop', {data: row, type: 4001})
        }
      }
    },
    filters: {
      num(v) {
        return numString(v)
      }
    },
    watch: {
      isPopShow(v) {
        if (!v && this.$refs.table) {
          this.$refs.table.setCurrentRow()
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
</style>
