<template>
  <div class="pop-body">
    <ul class="pop-tab">
      <li :class="{active:tabCur==='Zline'}" @click="toChange('Zline')">水位过程线</li>
      <li :class="{active:tabCur==='QLine'}" @click="toChange('QLine')">流量过程线</li>
      <li :class="{active:tabCur==='RiverCrossSection'}"  @click="toChange('RiverCrossSection')">剖面图</li>
      <li :class="{active:tabCur==='ZTable'}" @click="toChange('ZTable')">水位日表</li>
      <li :class="{active:tabCur==='QTable'}" @click="toChange('QTable')">流量日表</li>
      <li :class="{active:tabCur==='BaseInfo'}" @click="toChange('BaseInfo')">基础信息</li>
    </ul>
    <div class="pop-main">
      <div class="left-bar">
        <components :is="tabCur" :ref="tabCur" :options="options"/>
      </div>
      <div class="right-bar">
        <ys-video ref="snVideo" :options="options"></ys-video>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Zline from '../comp/zline'
import QLine from '../comp/qLine'
import RiverCrossSection from '../comp/riverCrossSection'
import ThreeDimension from '../comp/threeDimension'
import Zvlist from '../comp/zvlist'
import BaseInfo from '../comp/baseInfo'
import YsVideo from '../comp/ysVideo'
import ZTable from '../comp/zTable'
import QTable from '../comp/qTable'

export default {
  components: {YsVideo, BaseInfo, Zvlist, ThreeDimension, RiverCrossSection, Zline, ZTable, QTable, QLine},
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
        _this.toChange('Zline')
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
    overflow-x: hidden;
    overflow-y: auto;
  }

  .right-bar {
    flex: 0 0 40%;
    width: 40%;
    min-width: 260px;
    max-width: 42%;
    min-height: 0;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
