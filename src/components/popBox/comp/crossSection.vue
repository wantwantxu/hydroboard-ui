<template>
    <div class="profile">
      <div class="profile-top">
        <div class="pt-time"> 同步</div>
        <div class="pt-tips">
          <span>当前水位：{{newRiver.z}}(m)</span>
          <span>警戒水位(m)</span>
          <span>保证水位(m)</span>
        </div>
      </div>
      <div class="profile-hd">
        <div class="profile-water">
          <div class="line"><span>当前水位：{{newRiver.z}}m</span></div>
        </div>
        <div class="line1">
          <span>警戒水位：m</span>
        </div>
        <div class="line2">
          <span>保证水位：m</span>
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
      newRiver: {}
    }
  },
  methods: {
    getNew() {
      Api.getNewRiver({stcdList: [this.options.stcd]}).then((res) => {
        this.newRiver = res.result || {}
      })
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
