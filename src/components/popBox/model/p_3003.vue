<template>
  <div class="pop-body">
    <ul class="pop-tab">
      <li :class="{active:tabCur==='zLine'}" @click="toChange('zLine')">水位过程线</li>
      <li :class="{active:tabCur==='rsvrCross'}" @click="toChange('rsvrCross')">剖面图</li>
      <li :class="{active:tabCur==='zvlist'}" @click="toChange('zvlist')">库容曲线</li>
      <li :class="{active:tabCur==='baseInfo'}" @click="toChange('baseInfo')">基础信息</li>
    </ul>
    <div class="pop-main">
      <div class="left-bar">
        <rsvr-line ref="zLineRef" v-if="tabCur==='zLine'" :options="options"></rsvr-line>
        <rsvr-cross-section v-if="tabCur==='rsvrCross'" :options="options"></rsvr-cross-section>
        <zvlist v-if="tabCur==='zvlist'" :options="options"></zvlist>
        <base-info v-if="tabCur==='baseInfo'"  :options="options"></base-info>
      </div>
      <div class="right-bar">
        <ys-video ref="snVideo" :options="options" ></ys-video>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BaseInfo from '../comp/baseInfo'
import Zvlist from '../comp/zvlist'
import ThreeDimension from '../comp/threeDimension'
import RsvrCrossSection from '../comp/rsvrCrossSection'
import RsvrLine from '../comp/rsvrLine'
import YsVideo from '../comp/ysVideo'

export default {
  components: {YsVideo, BaseInfo, Zvlist, ThreeDimension, RsvrCrossSection, RsvrLine},
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
      tabCur: ''
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
        _this.toChange('zLine')
      }, 500);
    },
    
    toChange(v) {
      this.$nextTick(() => {
        this.tabCur = v
      })
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  .pop-body {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }

  .pop-tab {
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.375rem;
    margin: 0.5rem 0 0.625rem;

    li {
      background: rgba(0,212,255,0);
      border-radius: 2px;
      border: 1px solid #00FFF6;
      cursor: pointer;
      height: 1.875rem;
      color: #00fff6;
      line-height: 1.875rem;
      padding: 0 0.75rem;
      font-size: 0.8125rem;
      white-space: nowrap;
      transition: all .5s;

      &.active {
        font-size: 0.875rem;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei,sans-serif;
        font-weight: bold;
        background: #fd0;
        border-color: #fd0;
        color: #333;
      }
    }
  }

  .pop-main {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 1.25%;
    overflow: hidden;
  }

  .left-bar {
    flex: 1 1 58%;
    min-width: 0;
    min-height: 0;
    position: relative;
    overflow: hidden;

    > * {
      height: 100%;
      min-height: 0;
      box-sizing: border-box;
    }
  }

  .right-bar {
    flex: 0 0 40%;
    width: 40%;
    min-width: 260px;
    max-width: 42%;
    min-height: 0;
    position: relative;
    overflow: hidden;
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
    height: 100%;
    min-height: 0;
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

  .profile-main {
    height: 145px;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    z-index: 10;
  }

  &-sk {
    background: url('/static/img/pmt_sk.png') no-repeat center bottom;
    background-size: 100% 100%;
    position: absolute;
    z-index: 15;
    right: 0;
    bottom: 0;
    height: 145px;
    width: 417px;

    .sk-h {
      position: absolute;
      left: 0;
      top: -30px;
      text-align: center;
      color: #333;
      font-size: 12px;
      right: 0;
    }

    .line {
      position: absolute;
      border-bottom: 2px solid;
      height: 18px;
      line-height: 18px;
      width: 110px;
      transform: translateY(-20px);

      span {
        position: absolute;
        right: 0;
        bottom: 0;
        transform: scale(.8);
        color: inherit;
        white-space: nowrap;
      }

      &.line1 {
        border-color: #ae00ff;
        color: #ae00ff;
      }

      &.line2, &.line3 {
        border-color: #f00;
        color: #f00;
      }

      &.line1, &.line2 {
        right: 201px;
        text-align: right;

        span {
          transform-origin: 100% 100%;
        }
      }

      &.line3 {
        border-color: #f00;
        color: #f00;
        left: 217px;

        span {
          left: 0;
          right: auto;
          transform-origin: 0 100%;
        }
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

    &:before {
      content: '';
      position: absolute;
      z-index: 15;
      background: url('/static/img/pmt_hl.png') no-repeat center;
      background-size: 100% 100%;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .profile-water {
      left: 0;
      right: 0;
      top: 50px;

      .line {
        left: 50%;
        transform: translateX(-50%);
        text-align: center;

        span {
          transform-origin: 50% 50%;
        }
      }
    }

    .line1, .line2 {
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
      left: 0;

      span {
        right: 0;
        transform-origin: 100% 100%;
      }
    }

    .line2 {
      right: 0;
      border-color: #f00;
      color: #f00;

      span {
        left: 0;
        transform-origin: 0 100%;
      }
    }
  }
}
</style>
