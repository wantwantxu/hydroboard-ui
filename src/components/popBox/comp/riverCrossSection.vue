<template>
    <div class="profile">
      <div class="profile-top">
        <div class="tit-center">
          <div class="metric-item">
            <p class="metric-label">当前水位</p>
            <p class="metric-value">{{newRiver.z}} m</p>
          </div>
          <div class="border"></div>
          <div class="metric-item">
            <p class="metric-label">当前流量</p>
            <p class="metric-value">{{newRiver.q}}m³/s</p>
          </div>
          <div class="border"></div>
          <div class="metric-item">
            <p class="metric-label">警戒水位</p>
            <p class="metric-value">{{listStRvfcchB.wrz}} m</p>
          </div>
          <div class="border"></div>
          <div class="metric-item">
            <p class="metric-label">保证水位</p>
            <p class="metric-value">{{listStRvfcchB.grz}} m</p>
          </div>
        </div>






      </div>
      <div class="profile-hd">
        <div class="profile-water" :style="getDynamicWater(newRiver.z,listStRvfcchB.wrz,listStRvfcchB.grz)">
          <div class="line"><span>当前水位：{{newRiver.z}}m</span></div>
        </div>
        <div class="line1">
          <span>警戒水位：{{listStRvfcchB.wrz}}m</span>
        </div>
        <div class="line2">
          <span>保证水位：{{listStRvfcchB.grz}}m</span>
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
      listStRvfcchB: []
    }
  },
  methods: {
    getNew() {
      Api.listStRvfcchB({stcd: this.options.stcd}).then((res) => {
        if (res.result.length === 0) {
          this.listStRvfcchB = []
        }
        if (res.result.length > 0) {
          this.listStRvfcchB = res.result[0] || []
          if (this.listStRvfcchB.wrz === 0 || this.listStRvfcchB.grz === 0) {
              this.listStRvfcchB.wrz = null
              this.listStRvfcchB.grz = null
          }
        }
      })
      Api.getNewRiver({stcdList: [this.options.stcd]}).then((res) => {
        this.newRiver = res.result || {}
      })
    },

    getDynamicWater(z, wrz, grz) {

      let rate = ((z - wrz) / wrz) * 100

      let top = 0

      if (rate >= 0 && z - grz > 0) {
        top = 4

      } else if (rate >= 0 && z - grz < 0) {
         top = 15
      } else {

        top = rate * -1.8
        if (top < 27) {
          top = 27
        }
        if (top >= 55) {
          top = 55
        }
      }
      if (isNaN(top)) {
        return null
      }
      console.log('top:' + top + '%')
      return 'top:' + top + '%'
    }

  },
  watch: {
    options: {
      handler(v) {
        this.getNew()
      },
      immediate: true
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.profile {
  background-size: cover;
  width: 100%;
  height: 310px;
  position: relative;

  &:after {
    background: url('/static/img/bottom.png') repeat-x center;
    content: '';
    height: 5px;
    position: absolute;
    z-index: 25;
    right: 0;
    bottom: -225px;
    left: 0;
  }

  .profile-top {
    position: absolute;
    top: 10px;
    left: 0;
    right: 0;

    .tit-center {
      width: 485px;
      height: 70px;
      background: rgba(0, 16, 30, 0.72);
      border-radius: 6px;
      border: 1px solid rgba(0, 255, 246, 0.24);
      position: absolute;
      margin-top: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: space-around;
      padding: 5px 0px;

      .metric-item {
        min-width: 88px;
      }

      .border {
        width: 1px;
        margin: 12px 0;
        background: rgba(0, 255, 246, 0.2);
      }

      .metric-label,
      .metric-value {
        margin: 0;
        text-align: center;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei, sans-serif;
      }

      .metric-label {
        font-size: 13px;
        line-height: 28px;
        color: rgba(255, 255, 255, 0.72);
        font-weight: 400;
      }

      .metric-value {
        font-size: 16px;
        line-height: 30px;
        color: #00fff6;
        font-weight: 600;
      }
    }
    .pt-tips {
      font-size: 12px;

      span {
        color: rgba(25, 220, 6, 0.95);
        margin-right: 15px;
      }
    }
  }

  .profile-main {
    height: 500px;
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
      border-bottom: 2px solid #ffffff;
      text-align: right;
      font-size: 12px;
      width: 110px;
      height: 18px;
      line-height: 18px;

      span {
        color: #ffffff;
        display: inline-block;
        transform-origin: 100% 100%;
        transform: scale(.8);
      }
    }
  }

  &-hd {
    height: 360px;
    position: absolute;
    right: 0;
    left: 0;
    bottom: -225px;

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
      height: 55px;

      span {
        right: 0;
        transform-origin: 100% 100%;
      }
    }

    .line2 {
      right: 0;
      border-color: #f00;
      color: #f00;
      height: 35px;

      span {
        left: 0;
        transform-origin: 0 100%;
      }
    }
  }
}
</style>
