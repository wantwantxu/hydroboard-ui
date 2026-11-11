<template>
  <div class="rsvr-cross">
    <div class="tit-center">
      <div class="metric-item">
        <p class="metric-label">当前水位</p>
        <p class="metric-value">{{ formatNum(newRiver.rz) }} m</p>
      </div>
      <div class="border"></div>
      <div class="metric-item">
        <p class="metric-label">汛限水位</p>
        <p class="metric-value">{{ formatNum(getListStRsvrfsrBMsg.fsltdz) }} m</p>
      </div>
      <div class="border"></div>
      <div class="metric-item">
        <p class="metric-label">当前库容</p>
        <p class="metric-value metric-value--sm">{{ formatCapacity(newRiver.w) }}</p>
      </div>
    </div>

    <div class="profile">
      <div class="profile-main">
        <div class="profile-sk">
          <div class="sk-h">坝顶高程：{{ getStRsvrfcchMsg.damel }}m</div>
          <div class="line line4"><span>校核水位：{{ getStRsvrfcchMsg.ckflz }}m</span></div>
          <div class="line line5"><span>设计水位：{{ getStRsvrfcchMsg.dsflz }}m</span></div>
          <div class="line line3"><span>正常水位：{{ getStRsvrfcchMsg.normz }}m</span></div>
        </div>
        <div
          class="profile-water"
          :style="getTopStype(newRiver.rz, getStRsvrfcchMsg.normz, getStRsvrfcchMsg.dsflz, getStRsvrfcchMsg.ckflz)"
        >
          <div class="line"><span>当前水位：{{ newRiver.rz }}m</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Api from '@/api'
  export default {
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
      newRiver: {},
      getStRsvrfcchMsg: {},
      getListStRsvrfsrBMsg: {}
    }
  },
  methods: {
    formatNum(v) {
      if (v === null || v === undefined || v === '' || Number.isNaN(Number(v))) {
        return '--'
      }
      return Number(v)
    },
    formatCapacity(v) {
      if (v === null || v === undefined || v === '' || Number(v) === 0 || Number.isNaN(Number(v))) {
        return '--'
      }
      return `${Math.round(Number(v) * 10) / 10} 万m³`
    },
    getTopStype(z, normz, dsflz, ckflz) {
      var top = ((z - normz) * 100 / normz) * -2.5

      if (top >= 0) {
        if (top < 65) {
          top = 32
        }
        if (top > 85) {
          top = 42
        }
      } else if (top < 0 && z - dsflz < 0) {
        top = 23
      } else if (z - dsflz >= 0 && z - ckflz < 0) {
        top = 16
      } else if (z - ckflz >= 0) {
        top = 10
      }
      if (isNaN(top)) {
        top = 32
      }
      return 'top:' + top + '%'
    },
    getNew() {
      const queryParam = this.options.queryParam
      Api.listStRsvrfsrB({stcd: this.options.stcd}).then((res) => {
        if (!res.result || res.result.length === 0) {
          this.getListStRsvrfsrBMsg = {}
          return
        }
        this.getListStRsvrfsrBMsg = res.result[0] || {}
      })
      Api.listStRsvrfcchB({stcd: this.options.stcd}).then((res) => {
        if (!res.result || res.result.length === 0) {
          this.getStRsvrfcchMsg = {}
          return
        }
        this.getStRsvrfcchMsg = res.result[0] || {}
      })
      Api.getNewRsvr({stcd: this.options.stcd, ...queryParam}).then((res) => {
        const result = res.result
        this.newRiver = Array.isArray(result) ? (result[0] || {}) : (result || {})
      })
    }
  },
  watch: {
    options: {
      handler() {
        this.getNew()
      },
      immediate: true
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.rsvr-cross {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.tit-center {
  flex: 0 0 auto;
  width: 100%;
  max-width: 100%;
  height: 58px;
  box-sizing: border-box;
  background: rgba(0, 16, 30, 0.72);
  border-radius: 6px;
  border: 1px solid rgba(0, 255, 246, 0.24);
  margin: 0 0 8px;
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  padding: 4px 0;
  overflow: hidden;

  .metric-item {
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
  }

  .border {
    flex: 0 0 1px;
    width: 1px;
    margin: 10px 0;
    background: rgba(0, 255, 246, 0.2);
  }

  .metric-label,
  .metric-value {
    margin: 0;
    text-align: center;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei, sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .metric-label {
    font-size: 12px;
    line-height: 22px;
    color: rgba(255, 255, 255, 0.72);
    font-weight: 400;
  }

  .metric-value {
    font-size: 14px;
    line-height: 26px;
    color: #00fff6;
    font-weight: 600;

    &--sm {
      font-size: 12px;
    }
  }
}

.profile {
  flex: 1 1 auto;
  min-height: 0;
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

  .profile-main {
    position: absolute;
    inset: 8px 0 0;
    z-index: 10;
  }

  .profile-sk {
    background: url('/static/img/pmt_sk.png') no-repeat center bottom;
    background-size: contain;
    position: absolute;
    z-index: 15;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    height: 100%;
    width: min(100%, 420px);
    max-width: 100%;

    .sk-h {
      position: absolute;
      left: 0;
      top: 0;
      text-align: center;
      color: #ffffff;
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

      &.line3 {
        left: 52%;
        top: 28%;
        color: #0eac0e;

        span {
          left: 0;
          right: auto;
          transform-origin: 0 100%;
        }
      }

      &.line4 {
        left: 52%;
        top: 14%;
        color: #f11313;

        span {
          left: 0;
          right: auto;
          transform-origin: 0 100%;
        }
      }

      &.line5 {
        left: 52%;
        top: 20%;
        color: #f5b73c;

        span {
          left: 0;
          right: auto;
          transform-origin: 0 100%;
        }
      }
    }
  }

  .profile-water {
    background: url('/static/img/waterflow.png') no-repeat center;
    position: absolute;
    z-index: 10;
    background-size: 100% 100%;
    bottom: 0;
    right: 48%;
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
        white-space: nowrap;
      }
    }
  }
}
</style>
