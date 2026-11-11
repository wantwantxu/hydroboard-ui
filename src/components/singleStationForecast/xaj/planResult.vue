<template>
  <div class="modelIndex">
    <div class="hd">
      <h3>
        <lottie class="mainfirst" :options="mainfirst" :width="20" style="float:left;"/>
        <div class="name">{{ options.fcstObjects.name }} - 洪水预报结果</div>
        <el-button
          class="close"
          type="text"
          icon="el-icon-close"
          @click="$emit('close')"
        />
      </h3>
      <lottie class="mainfirst2" :options="mainfirst2" :width="1300" style="height: 20px;opacity: 1;"/>
    </div>
    <el-row :gutter="20" style="height: calc(100% - 80px);">
      <el-col :span="12" style="height: 100%;">
        <el-row :gutter="10" style="margin-bottom: 10px;">
          <el-col :span="4">
            <el-select v-model="planId" placeholder="请选择预报方案">
              <el-option
                v-for="item in planList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
            />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="getFcstPlanResult">查询</el-button>
          </el-col>
        </el-row>

        <el-table
          height="100%"
          ref="table"
          :data="tableData"
          stripe
          v-loading="loading"
          highlight-current-row
          @row-click="rowClick">
          <el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="预报时间" prop="tm" align="center" show-overflow-tooltip/>
          <el-table-column label="预报水位" prop="z" align="center" show-overflow-tooltip/>
          <el-table-column label="预报流量" prop="q" align="" show-overflow-tooltip/>
        </el-table>
      </el-col>
      <el-col :span="12" style="height: 100%;">
        <div style="height: 100%;" ref="chart" class="chart">
          <div class="nodata">暂无数据！</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import mainfirst from '@/assets/json/green.json'
import mainfirst2 from '@/assets/json/green2.json'
import setChartOption from './chartOption';
import Api from "@/api";

export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    const start = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    end.setHours(23, 59, 59, 999);

    const formatDate = (date) => {
      const Y = date.getFullYear();
      const M = String(date.getMonth() + 1).padStart(2, '0');
      const D = String(date.getDate()).padStart(2, '0');
      const h = String(date.getHours()).padStart(2, '0');
      const m = String(date.getMinutes()).padStart(2, '0');
      const s = String(date.getSeconds()).padStart(2, '0');
      return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    };

    return {
      planList: [],
      loading: false,
      mainfirst: {
        animationData: mainfirst,
        renderer: 'svg',
        loop: true,
        autoplay: true
      },
      mainfirst2: {
        animationData: mainfirst2,
        renderer: 'svg',
        loop: true,
        autoplay: false
      },
      tableData: [],
      planId: '',
      dateRange: [
        formatDate(start),
        formatDate(end)
      ],
    }
  },
  mounted() {
    this.getFcstPlan()
  },
  methods: {
    getFcstPlan() {
      const { fcstObjects, modelId } = this.$props.options;
      Api.getPlanList({objectsId: fcstObjects.id, modelId}).then(response => {
        if (response.code === 200) {
          this.planList = response.result
          if(this.planList && this.planList.length > 0){
            this.planId = this.planList[0].id
            this.getFcstPlanResult()
          }
        }
      })
    },
    getFcstPlanResult() {
      this.loading = true
      const { fcstObjects, modelId } = this.$props.options;
      const planId = this.planId
      Api.getPlanResultList({ planId, modelId, objectsId: fcstObjects.id, stm: this.dateRange[0], etm: this.dateRange[1] }).then(response => {
        if (response.code === 200) {
          const formattedData = response.result.map(item => {
            const newItem = { ...item };
            if (item.tm) {
              const date = new Date(item.tm);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const hour = String(date.getHours()).padStart(2, '0');
              newItem.tm = year + '-' + month + '-' + day + ' ' + hour;
            }

            if (item.z) {
              newItem.z = parseFloat(item.z).toFixed(2);
            }

            if (item.rainfall) {
              newItem.rainfall = parseFloat(item.rainfall).toFixed(1);
            }

            if (item.q) {
              newItem.q = parseFloat(item.q).toFixed(3);
            }

            if (item.fq) {
              newItem.fq = parseFloat(item.fq).toFixed(3);
            }
            return newItem;
          });
          this.tableData = formattedData;

          this.initChart();
        }
        this.loading = false;
      })
      setTimeout(() => {
        this.loading = false;
      }, 10000)
    },
    rowClick() {
      this.initChart();
    },
    initChart() {
      let myChart = this.$eCharts.init(this.$refs.chart);
      const chartOption = setChartOption(this.tableData);
      myChart.setOption(chartOption);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.modelIndex {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  background: var(--panel-bg, rgba(0, 16, 30, 0.52));
  backdrop-filter: blur(8px);
  border-radius: 4px;
  color: #fff;
  border: 1px solid rgba(0, 255, 246, 0.2);
  position: relative;

  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border: 1px solid;
    z-index: 99;
  }

  &:before {
    left: 0;
    top: 0;
    border-color: #00fff6 transparent transparent #00fff6;
  }

  &:after {
    right: 0;
    top: 0;
    border-color: #00fff6 #00fff6 transparent transparent;
  }

  .hd {
    > h3 {
      overflow: hidden;

      .name {
        float: left;
        font-size: 20px;
        font-family: YouSheBiaoTiHei-Regular, YouSheBiaoTiHei, sans-serif;
        font-weight: 400;
        margin-left: 35px;
        font-size: 20px;
      }

      .tag {
        float: left;
        color: #00FFF6;
        width: 62px;
        height: 26px;
        line-height: 26px;
        font-size: 14px;
        font-weight: normal;
        text-align: center;
        margin-left: 20px;
        background: rgba(0, 255, 246, 0.1);
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #00FFF6;
      }

      .close {
        float: right;
        cursor: pointer;
      }
    }

  }

  .chart {
    position: relative;

    .nodata {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
