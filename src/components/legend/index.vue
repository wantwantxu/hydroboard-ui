<template>
  <div class="legend-box">
    <div class="lb-content" :class="{show:isShow}" @click="toShow">
      <i class="el-icon-info"></i>
      <p>图例</p>
    </div>
    <div class="legend-dialog" v-show="isShow">
      <div class="ld-hd">
        <span @click="isShow=false"><i class="el-icon-close"></i></span>
        图例说明
      </div>
      <div class="ld-bd">
        <components v-for="(item,index) in list" :key="index" :is="item"/>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

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
  props: {
    checked: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isShow: false,
      keyVal: {
        1001: 'rain',
        1002: 'water',

        2002: 'radar',
        2003: 'rainfall',
        2004: 'rainfall',
        2005: 'rainfall',
        2006: 'fallArea',
        2007: 'wind',
        2008: 'wave',
        2009: 'potential',
        3001: 'att_3001',
        3002: 'att_3002',
        3003: 'att_3003',
        3004: 'att_3004',
        3005: 'att_3005',
        3006: 'att_3006',
        3008: 'att_3008',
        3009: 'att_3009',
        3010: 'att_3010',
        3011: 'att_3011',
        3012: 'att_3012',
        3013: 'att_3013',
        3014: 'att_3014',
        3015: 'att_3015',
        3016: 'att_3016',
        3017: 'att_3017',
        3018: 'att_3018',
        3022: 'att_3022',
        3023: 'att_3023',
        3024: 'att_3024',
        4001: 'people'
      },
      list: []
    }
  },
  methods: {
    toShow() {
      if (this.list.length) {
        this.isShow = !this.isShow
      }
    },
    set(val, isJoin) {
      let name = this.keyVal[val]
      let idx = this.list.indexOf(name)
      if (val === 2003 || val === 2004 || val === 2005) {
        if (isJoin) {
          if (idx === -1) {
            this.list.unshift(name)
          } else {
            if (idx > 0) {
              this.list.splice(idx, 1)
              this.list.unshift(name)
            }
          }
        } else {
          if (this.checked.indexOf(2003) === -1 && this.checked.indexOf(2004) === -1 && this.checked.indexOf(2005) === -1) {
            this.list.splice(idx, 1)
          }
        }
      } else {
        if (idx !== -1) {
          this.list.splice(idx, 1)
        } else {
          this.list.unshift(name)
        }
      }

      if (isJoin && !this.isShow) {
        this.isShow = true
      }
      if (this.list.length === 0) {
        this.isShow = false
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.legend-box {
  position: absolute;
  right: 30px;
  bottom: 20px;
  z-index: 6000;
  background: rgba(0, 16, 30, .6);
  border: 1px solid rgba(0, 255, 246, .5);
  border-radius: 6px;

  .lb-content {
    color: #00fff6;
    font-size: 14px;
    padding: 7px 10px;
    text-align: center;
    cursor: pointer;

    .el-icon-info {
      font-size: 18px;
    }

    &.show {
      color: #fff700;
    }
  }

  .legend-dialog {
    right: 0;
    bottom: 50px;
    position: absolute;
    z-index: 999;
    width: auto;
    background: rgba(0, 16, 30, .8);
    border-radius: 8px;
    border: 1px solid rgba(0, 255, 246, .4);

    .ld-hd {
      min-width: 90px;
      height: 42px;
      background: rgba(0, 255, 246, .1);
      font-size: 14px;
      color: #fff;
      padding: 0 15px;
      line-height: 42px;
      white-space: nowrap;

      span {
        float: right;
        color: #00fff6;
        opacity: .7;
        cursor: pointer;
        font-size: 18px;
      }
    }

    .ld-bd {
      max-width: 600px;
      overflow-x: auto;
      white-space: nowrap;
      display: flex;
    }
  }
}
</style>
