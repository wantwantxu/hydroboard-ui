<template>
  <div class="pop-hd">
    <ul class="pop-tab">
      <li :class="{active:tabCur==='hydroelectric-station'}" @click="toChange('hydroelectric-station')">流量</li>
      <li :class="{active:tabCur==='qtable'}" @click="toChange('qtable')">流量日表</li>
      <li :class="{active:tabCur==='table'}"  @click="toChange('table')">表格</li>
    </ul>
    <div class="left-bar">
      <hydroelectric-station v-if="tabCur==='hydroelectric-station'" :options="options"></hydroelectric-station>
      <gp-flow-year-table  v-if="tabCur==='qtable'" :options="options"></gp-flow-year-table>
      <reservoir-table v-if="tabCur==='table'" :options="options"></reservoir-table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import YsVideo from '../comp/ysVideo'
  import HydroelectricStation from '../comp/hydroelectricStation'
  import GpFlowYearTable from '../comp/gpFlowYearTable'
  import ReservoirTable from '../comp/reservoirTable'
  import QTable from '../comp/qTable'
export default {
  components: {QTable, GpFlowYearTable, YsVideo, HydroelectricStation, ReservoirTable},
  props: {
    options: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      tabCur: 'hydroelectric-station'
    }
  },
  watch: {
    options: {
      handler(v) {
        this.init()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    
    init() {
      this.tabCur = ''
      let _this = this
      setTimeout(() => {
        _this.toChange('hydroelectric-station')
      }, 500);
    },
    toChange(v) {
      this.$nextTick(() => {
        this.tabCur = v
      })
    }

  },
  watch: {
    options: {
      handler(v) {
        this.$nextTick(() => {

        })
      },
      immediate: true
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  .pop-tab {
    display: flex;
    flex-direction: row;
    margin: 10px 0 15px;

    li {
      background: rgba(0,212,255,0);
      border-radius: 2px 2px 2px 2px;
      opacity: 1;
      border: 1px solid #00FFF6;
      cursor: pointer;
      margin-right: 5px;
      height: 30px;
      
      
      color: #00fff6;
      line-height: 30px;
      padding: 0 15px;
      
      transition: all .5s;

      &.active {
        font-size: 16px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei,sans-serif;
        font-weight: bold;
        background: #fd0;
        border-color: #fd0;
        color: #333;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
.pop-base {
  padding: 15px 0 5px;
  box-shadow: 0 0 10px 0 #00fff6;
  background: rgba(0, 16, 30, .9);
  border-radius: 8px;
  color: #fff;
  width: 490px;

  .pop-hd {
    position: relative;
    height: 30px;
    line-height: 30px;
    margin: 0 15px 10px;

    span {
      float: right;
      color: rgba(0, 252, 255, .7);
      font-size: 24px;
      cursor: pointer;
    }

    h3 {
      color: #fff;
      font-size: 22px;

      i {
        color: rgba(0, 252, 255, .7);
      }
    }
  }

  .chart {
    height: 250px;
  }

  .tab {
    background: rgba(0, 255, 246, .15);
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-color: rgba(0, 255, 246, .15);
    height: 30px;
    display: flex;

    li {
      padding: 0 15px;
      color: #00fff6;
      font-size: 15px;
      line-height: 30px;
      cursor: pointer;

      &.active {
        background: rgba(0, 16, 30, .8);
      }
    }
  }

  .info {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    padding: 10px 15px 0;

    li {
      width: 50%;
      font-size: 15px;
      color: #fff;
      height: 25px;
      line-height: 25px;
    }
  }

  .tab-con {
    height: 610px;
  }

  .details {
    padding: 15px 25px;
    font-size: 15px;
    line-height: 24px;

    li {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: #00fff6;
    }

    span {
      color: #fff;
      display: inline-block;
      width: 90px;
      text-align: right;
    }
  }
}

.pd15 {
  padding: 15px;
}

.profile {
  background: url('/static/img/pmt_bg.png') no-repeat center;
  background-size: cover;
  width: 100%;
  height: 290px;
  position: relative;
  overflow: hidden;

  &:after {
    background: url('/static/img/bottom.png') repeat-x center;
    content: '';
    height: 5px;
    position: absolute;
    z-index: 25;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .profile-top {
    position: absolute;
    top: 10px;
    left: 30px;

    .pt-time {
      color: #333;
      font-family: 'hb-digit';
      line-height: 18px;
    }

    .pt-tips {
      font-size: 12px;

      span {
        color: #416fff;
        margin-right: 15px;
      }
    }
  }

  &-water {
    background: url('/static/img/waterflow.png') no-repeat center;
    position: absolute;
    z-index: 10;
    background-size: 100% 100%;
    bottom: 0;
    right: 201px;
    left: 0;

    .line {
      position: absolute;
      top: -20px;
      border-bottom: 2px solid #0000ff;
      text-align: right;
      font-size: 12px;
      width: 110px;
      height: 18px;
      line-height: 18px;

      span {
        color: #00f;
        display: inline-block;
        transform-origin: 100% 100%;
        transform: scale(.8);
      }
    }
  }

  &-hd {
    height: 160px;
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;

    .profile-mask {
      position: absolute;
      z-index: 15;
      background: url('/static/img/pmt_dz.png') no-repeat center;
      background-size: auto 100%;
      top: 0;
      bottom: 0;
      width: 30px;
      left: 68%;

      .pm-title {
        position: absolute;
        top: -25px;
        color: #333;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
      }
    }

    .profile-water {
      left: 0;
      right: 0;
      top: 50px;

      .line {
        left: 0;
        text-align: center;

        span {
          transform-origin: 50% 50%;
        }
      }

      &.w1 {
        left: 0;
        width: 70%;
      }

      &.w2 {
        left: 70%;
        right: 0;
        background-size: auto 100%;
      }
    }

    .line1, .line2, .line3 {
      position: absolute;
      border-bottom: 2px solid;
      height: 18px;
      line-height: 18px;
      width: 120px;
      z-index: 16;
      transform: translateY(-20px);

      span {
        position: absolute;
        bottom: 0;
        transform: scale(.8);
        color: inherit;
        white-space: nowrap;
      }
    }

    .line1 {
      border-color: #ae00ff;
      color: #ae00ff;
      left: -120px;

      span {
        right: 5px;
        transform-origin: 100% 100%;
      }
    }

    .line2 {
      left: 29px;
      border-color: #f00;
      color: #f00;

      span {
        left: 5px;
        transform-origin: 0 100%;
      }
    }

    .line3 {
      left: -120px;
      border-color: #f00;
      color: #f00;

      span {
        right: 5px;
        transform-origin: 100% 100%;
      }
    }
  }
}
</style>
