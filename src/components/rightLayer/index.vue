<template>
  <div class="right-layer" :class="{zk:isZk}">
    <div class="rl-content" @click="isZk=!isZk">
      <i class="el-icon-s-fold" v-if="!isZk"></i>
      <i class="el-icon-s-unfold" v-else></i>
      <p>图层</p>
    </div>
    <ul class="rl-more">
      <li @click="toClick('yj')" :class="{active:options.yj}">
        <div class="svg svg1"></div>
        <div class="text">预警</div>
      </li>
      <li @click="toClick('yt','ld')" :class="{active:options.yt}">
        <div class="svg svg2"></div>
        <div class="text">云图</div>
      </li>
      <li @click="toClick('ld','yt')" :class="{active:options.ld}">
        <div class="svg svg3"></div>
        <div class="text">雷达</div>
      </li>
      <li @click="toClick('wl','gq')" :class="{active:options.wl}">
        <div class="svg svg4"></div>
        <div class="text">未来降雨</div>
      </li>
      <li @click="toClick('gq','wl')" :class="{active:options.gq}">
        <div class="svg svg5"></div>
        <div class="text">过去降雨</div>
      </li>
      <li @click="toRefresh">
        <div class="svg svg6"></div>
        <div class="text">刷新</div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        isZk: false,
        options: {
          yj: false,
          ld: false,
          yt: false,
          wl: false,
          gq: false
        }
      }
    },
    methods: {
      toClick(key, toFalse) {
        if (toFalse) {
          if (!this.options[key]) {
            this.options[key] = true
            this.options[toFalse] = false
          } else {
            this.options[key] = false
          }
        } else {
          this.options[key] = !this.options[key]
        }
        this.toRefresh()
      },
      toRefresh() {
        this.$emit('change', this.options)
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .right-layer {
    position: absolute;
    z-index: 5000;
    right: 90px;
    bottom: 20px;
    background: rgba(0, 16, 30, .6);
    border: 1px solid rgba(0, 255, 246, .5);
    border-radius: 6px;

    &.zk {
      .rl-more {
        border: 1px solid rgba(0, 255, 246, .5);
        border-radius: 6px 0 0 6px;
        background: rgba(0, 16, 30, .6);
        box-shadow: 0 0 5px rgba(0, 255, 246, .8);
        width: auto;
        margin-right: 15px;
      }

      .rl-content {
        color: #ffe04f;
      }
    }

    .rl-content {
      color: #00fff6;
      font-size: 14px;
      padding: 7px 10px;
      text-align: center;
      cursor: pointer;

      i {
        font-size: 18px;
      }

      &.show {
        color: #fff700;
      }
    }

    .rl-more {
      position: absolute;
      height: 50px;
      right: 48px;
      top: 0;
      width: 0;
      display: flex;
      overflow: hidden;
      transition: width .5s;

      li {
        padding: 0 10px;
        white-space: nowrap;
        color: #00fff6;
        font-size: 14px;
        line-height: 20px;
        border-right: 1px solid rgba(0, 255, 246, .5);
        cursor: pointer;

        &:last-child {
          border-right: none;
        }
      }

      .svg {
        width: 26px;
        height: 26px;
        margin: 0 auto;
      }

      .svg1 {
        background: url('/static/svg/csyj.svg') no-repeat center;
        background-size: 100%;
      }

      .svg2 {
        background: url('/static/svg/yt.svg') no-repeat center;
        background-size: 100%;
      }

      .svg3 {
        background: url('/static/svg/ld.svg') no-repeat center;
        background-size: 100%;
      }

      .svg4 {
        background: url('/static/svg/weilaijiangyu.svg') no-repeat center;
        background-size: 100%;
      }

      .svg5 {
        background: url('/static/svg/guoqujiangyu.svg') no-repeat center;
        background-size: 100%;
      }

      .svg6 {
        background: url('/static/svg/refresh.svg') no-repeat center;
        background-size: 100%;
      }

      li.active {
        color: #ffe04f;

        .svg1 {
          background: url('/static/svg/csyj_hover.svg') no-repeat center;
          background-size: 100%;
        }

        .svg2 {
          background: url('/static/svg/yt_hover.svg') no-repeat center;
          background-size: 100%;
        }

        .svg3 {
          background: url('/static/svg/ld_hover.svg') no-repeat center;
          background-size: 100%;
        }

        .svg4 {
          background: url('/static/svg/weilaijiangyu_hover.svg') no-repeat center;
          background-size: 100%;
        }

        .svg5 {
          background: url('/static/svg/guoqujiangyu_hover.svg') no-repeat center;
          background-size: 100%;
        }
      }
    }
  }
</style>
