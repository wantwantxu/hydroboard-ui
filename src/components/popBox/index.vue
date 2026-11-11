<template>
  <transition name="pop-scale">
    <div class="pop-wrap" v-show="componentName">
      <div class="pop-base bg-com">
      <span class="bg-border"></span>
      <div class="pop-hd">
        <span class="close" @click="close">
          <i class="el-icon-close"></i>
        </span>
        <h3>

          <lottie class="mainfirst" :options="mainfirst" :width="20" style="float:left;"/>
          <div class="name">{{ options.stnm || options.name || options.gpName }}</div>
        </h3>
        <lottie class="mainfirst2" :options="mainfirst2" :width="1000" style="height: 20px;opacity: 1;"/>
      </div>
      <components :is="componentName" :ref="componentName" :options="options" @close="close" @trackPop="trackPop"/>
    </div>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import mainfirst from '../../assets/json/green.json'
  import mainfirst2 from '../../assets/json/green2.json'

const models = import.meta.glob('./model/*.vue', { eager: true })
let allModels = {}
Object.keys(models).forEach(path => {
  const name = path.replace(/^\.\/model\/(.*)\.\w+$/, '$1')
  allModels[name] = models[path].default || models[path]
})
export default {
  components: {
    ...allModels
  },
  data() {
    return {
      queryParams: {},
      componentName: '',
      options: {},
      openTimer: null,

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
      }
    }
  },
  mounted() {

    if (typeof document !== 'undefined' && this.$el && this.$el.parentNode !== document.body) {
      document.body.appendChild(this.$el)
    }
  },
  beforeDestroy() {
    if (this.openTimer) {
      clearTimeout(this.openTimer)
      this.openTimer = null
    }
    if (typeof document !== 'undefined' && this.$el && this.$el.parentNode === document.body) {
      document.body.removeChild(this.$el)
    }
  },
  methods: {
    set(options) {
      if (this.openTimer) {
        clearTimeout(this.openTimer)
        this.openTimer = null
      }
      this.options = {}
      this.componentName = ''
      if (!options) {
        return
      }

      this.openTimer = setTimeout(() => {
        this.openTimer = null
        this.options = options
        if (Object.prototype.hasOwnProperty.call(options, 'typeWarn')) {
          this.componentName = 'p_' + options.typeWarn
          return
        }
        this.componentName = 'p_' + options.type
      }, 500)
    },
    close() {
      if (this.openTimer) {
        clearTimeout(this.openTimer)
        this.openTimer = null
      }
      this.options = {}
      this.componentName = ''
      this.isPopShow = false
      this.$emit('close')
    },
    trackPop(data) {
      this.$emit('trackPop', data)
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.pop-wrap {
  position: fixed !important;
  z-index: 10040 !important;
  font-size: 0.875rem;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 10, 20, 0.32);
  backdrop-filter: blur(2px);
  border-radius: 8px;
  pointer-events: auto;

  &.pop-scale-enter-active, &.pop-scale-leave-active {
    transition: opacity 0.25s ease;
  }
  &.pop-scale-enter, &.pop-scale-leave-to {
    opacity: 0;
  }
  &.pop-scale-enter-active .pop-base,
  &.pop-scale-leave-active .pop-base {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
  }
  &.pop-scale-enter .pop-base,
  &.pop-scale-leave-to .pop-base {
    transform: scale(0.96);
    opacity: 0;
  }
  .pop-base {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 0.75rem 0.75rem 0.5rem;
    background: var(--panel-bg, rgba(0, 16, 30, 0.52));
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    color: #fff;

    width: min(92vw, 1200px);
    height: min(80vh, 680px);
    max-width: calc(100vw - 24px);
    max-height: calc(100vh - 24px);
    flex-shrink: 0;
    overflow: hidden;
    border: 1px solid rgba(0, 255, 246, 0.2);

    .pop-hd {
      position: relative;
      flex: 0 0 auto;
      height: 2.8125rem;
      line-height: 1.875rem;

      .close {
        float: right;
        color: rgba(0, 252, 255, .7);
        font-size: 24px;
        cursor: pointer;
      }

      h3 {
        .name{
          font-size: 20px;
          font-family: YouSheBiaoTiHei-Regular, YouSheBiaoTiHei,sans-serif;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 27px;
          margin-left: 35px;
          letter-spacing: 0.2em;
          max-width: calc(100% - 3rem);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-background-clip: text;
        }
        color: #fff;
        font-size: 22px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        i {
          color: rgba(0, 252, 255, .7);
        }
      }
    }

    > :not(.pop-hd):not(.bg-border) {
      flex: 1 1 auto;
      min-height: 0;
      overflow-x: hidden;
      overflow-y: auto;
    }

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
        margin-right: 10px;
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
}
</style>
