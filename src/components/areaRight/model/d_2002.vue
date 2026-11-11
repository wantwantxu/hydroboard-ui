<template>
  <div class="water-wrap" :class="{'bg-com':!isMin}">
    <title-box title="降雨预测" second isVariable @change="toggle"/>
    <el-table ref="table" :data="tableData" class="radar-table"
                stripe highlight-current-row @row-click="changeTr">
      <el-table-column label="地区" prop="dangerAreaName" align="center"  show-overflow-tooltip/>
      <el-table-column label="现在" align="center" width="80">
        <template slot-scope="{row}"><span :class="cName(row.mean[0])">{{ getRainLevel(row.mean[0]) }}</span></template>
      </el-table-column>
      <el-table-column label="1小时" width="80" align="center">
        <template slot-scope="{row}"><span :class="cName(row.mean[1])">{{ getRainLevel(row.mean[1]) }}</span></template>
      </el-table-column>
      <el-table-column label="2小时" width="80" align="center">
        <template slot-scope="{row}"><span :class="cName(row.mean[2])">{{ getRainLevel(row.mean[2]) }}</span></template>
      </el-table-column>
    </el-table>
<!--    <div class="scan" v-if="!isOver"/>-->
    <div class="bg-border"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import titleBox from '@/components/titleBox'
  import {rainType} from '@/assets/js/common'
  import Api from '@/api'

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
        type: 3001,
        tableData: [],
        isOver: false
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {

        Api.getDangerAreaNew({range: 3}).then(response => {
          if (response.code === 200) {
            let list = response.result
            this.tableData = list
            let dangerAreaPoint = []
            list.forEach((item) => {
                let point = {
                  id: item.id,
                  stnm: item.dangerAreaName,
                  lttd: item.y,
                  lgtd: item.x,
                  type: this.type
                }
                dangerAreaPoint.push(point)
            })
            window.mpPlugin.dangerAreaPoint().showPoint(dangerAreaPoint)

          }
        })
      },
      cName(v) {
        return 'c_' + ((v || v === 0) ? rainType(v)['value'] : '')
      },
      toggle(type) {
        if (type === 'max' && !this.isMin) return
        this.$emit('sizeChange', !this.isMin)
      },
      getRainLevel(rain) {
        if (rain === 0) {
          return '无雨'
        } else if (rain > 0 && rain <= 10) {
          return '小雨'
        } else if (rain > 10 && rain <= 25) {
          return '中雨'
        } else if (rain > 25 && rain <= 50) {
          return '大雨'
        } else if (rain > 50 && rain <= 100) {
          return '暴雨'
        }
      },
      changeTr(row) {

        if (row) {
          let data = {
            id: row.id,
            stnm: row.dangerAreaName,
            lttd: row.y,
            lgtd: row.x
          }
          window.mpPlugin.dangerAreaPoint().showPointPopup(data)

        }
      }
    },
    filters: {
      type(t) {
        return (t || t === 0) ? rainType(t)['name'] : '-'
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
  .water-wrap {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - var(--panel-top, 6.25rem) - var(--panel-gap, 1.25rem));
    overflow: hidden;
    box-sizing: border-box;

    .el-table {
      display: none;
    }

    &.bg-com {
      padding-top: 15px;

      .el-form, .el-table {
        display: block;
      }

      .tab {
        display: flex;
      }
    }

    ::v-deep .radar-table {
      flex: 1 1 auto;
      min-height: 0;
      max-height: calc(100vh - var(--panel-top, 6.25rem) - 5rem);
    }
  }

  .water-box {
    position: relative;
    overflow: hidden;
    padding-left: 14px;

    img {
      width: 12px;
      position: absolute;
      left: -12px;
      top: 4px;
    }

    &.t_2 {
      img {
        transform: scaleY(-1);
      }
    }
  }

  .scan {
    width: 580px;
    height: 580px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url('/static/img/scan-bg.png') no-repeat;
    background-size: cover;
    z-index: 998;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: url('/static/img/scan-axis.png') no-repeat;
      background-size: cover;
      animation: round 3s linear infinite;
    }
  }

  .c_0 {
    color: rgba(255, 255, 255, .5);
  }

  .c_1 {
    color: rgba(255, 238, 77, .9);
  }

  .c_2 {
    color: rgba(255, 153, 74, .9);
  }

  .c_3 {
    color: rgba(255, 1, 32, .9);
  }

  @keyframes round {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
