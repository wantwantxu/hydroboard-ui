<template>
  <div class="water-chart bg-com">
    <el-carousel class="chartSwipe" height="100%" :autoplay="false" :indicator-position="'none'">
      <el-carousel-item v-for="(group,gi) in chartList" :key="gi">
        <div class="chart-item" v-for="(item,index) in group" :key="index">
          <div class="ci-hd">
            <i class="el-icon-location-information"></i>
            {{item.dangerAreaName}}
          </div>
          <div class="ci-tips">{{setTips(item.mean)}}</div>
          <div class="ci-chart">
            <chart-item :chartData="item"/>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script type="text/ecmascript-6">
  import chartItem from './chart'
  import Api from '@/api'
  import {rainType} from '@/assets/js/common'

  export default {
    components: {
      chartItem
    },
    data() {
      return {
        chartList: [
        ]
      }
    },
    created() {
      this.init()
    },
    methods: {
      setTips(mean) {
        let totalRain = 0
        for (var i = 0; i < mean.length; i++) {
          let rain = mean[i]
          totalRain += rain
        }
        let v = rainType(totalRain)['value']
        if (v === 0) {
          return '未来两小时不会下雨'
        } else if (v === 1) {
          return '可能有小雨'
        } else if (v === 2) {
          return '可能有中雨'
        } else if (v === 3) {
          return '可能有大雨'
        }
      },
      init() {
        Api.getDangerAreaNew({range: 3}).then(response => {
          if (response.code === 200) {
            let list = response.result || []
            let arr = []
            this.chartList = []
            for (var i = 0; i < list.length; i++) {
              arr.push(list[i])
              if (((i + 1) % 3) === 0) {
                this.chartList.push(arr)
                arr = []
              }
            }
            if (arr.length) this.chartList.push(arr)
          }
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .water-chart {
    height: calc(100vh - var(--panel-top, 6.25rem) - var(--panel-gap, 1.25rem));
    max-height: calc(100vh - var(--panel-top, 6.25rem) - var(--panel-gap, 1.25rem));
    background: rgba(0, 16, 30, .9);
    overflow: hidden;
    box-sizing: border-box;
  }

  .chartSwipe {
    height: 100% !important;
  }

  .chart-item {
    flex: 1 1 0;
    min-height: 0;
    padding: 0.5rem 0.625rem 0.375rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid rgba(0, 255, 246, .5);

    &:last-child {
      border-bottom: none;
    }

    .ci-hd {
      flex-shrink: 0;
      color: #fff;
      font-size: 1rem;
      line-height: 1.4;
      height: auto;

      .el-icon-location-information {
        margin-right: 5px;
      }
    }

    .ci-tips {
      flex-shrink: 0;
      font-size: 0.75rem;
      color: #fff;
      padding-left: 1.5rem;
      line-height: 1.2;
      margin-bottom: 0.25rem;
    }

    .ci-chart {
      flex: 1 1 0;
      min-height: 0;
    }
  }
</style>
