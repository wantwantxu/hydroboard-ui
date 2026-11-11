<template>
  <li class="sub-item" :class="{active:isActive}">
    <div class="sub-con" @click="toClick">
      <img :src="`/static/svg/svg_${type}.svg`" alt="">
      <span>{{ typeToName }}</span>
    </div>
    <span class="sub-close" @click="toClose">
      <i class="el-icon-error"></i>
    </span>
  </li>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    type: {
      type: Number,
      default() {
        return 1001
      }
    },
    isActive: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      nameList: {
        1001: '实时雨情',
        1002: '实时水情',
        1003: '天气实况',
        1004: '卫星云图',
        1005: '气象雷达',
        1006: '雨量等值面',
        1007: '水情预警',
        2001: '气象预警',
        2002: '雷达测雨',
        2003: '24h降雨',
        2004: '48h降雨',
        2005: '72h降雨',
        2006: '降雨落区',
        2007: '风场',
        2008: '浪场',
        2009: '副高',
        3001: '山洪灾害点',
        3002: '内涝点',
        3003: '水库',
        3004: '水电站',
        3005: '河心州岛',
        3006: '船舶停靠点',
        3007: '湿地公园',
        3008: '医疗',
        3009: '学校',
        3010: '商超',
        3011: '车站',
        3012: '加油站',
        3013: '银行',
        3014: '餐馆',
        3015: '住宿',
        3016: '景点',
        3017: '充电站',
        3018: '港口码头',
        3022: '采砂船',
        3023: '山洪测站',
        3024: '水文站',
        4001: '人口普查',
        7001: '洪水淹没',

      }
    }
  },
  computed: {
    typeToName() {
      const type = Number(this.type)
      const tree = window.layerTree || []
      for (let i = 0; i < tree.length; i++) {
        const children = tree[i].children || []
        for (let j = 0; j < children.length; j++) {
          if (Number(children[j].value) === type) {
            return children[j].label || this.nameList[type] || ''
          }
        }
      }
      return this.nameList[type] || ''
    }
  },
  methods: {
    toClose() {
      this.$emit('close', this.type)
    },
    toClick() {
      this.$emit('click', this.type)
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.sub-item {
  padding: 8px;
  margin-bottom: 5px;
  background: rgba(0, 16, 30, .5);
  border: 1px solid rgba(255, 247, 0, .5);
  cursor: pointer;
  border-radius: 5px;
  position: relative;
  opacity: 0.3;
  transition: all .5s;

  &.active {
    opacity: 1;
  }

  .sub-close {
    position: absolute;
    right: 1px;
    top: 1px;
    line-height: 0;
    font-size: 16px;
    color: #fff;
  }

  &:last-child {
    margin-bottom: 0;
  }

  .sub-con {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }

  span {
    white-space: nowrap;
    font-size: 15px;
    color: #fff700;
    line-height: 26px;
    display: none;
  }

  img {
    width: 1.625rem;
    height: 1.625rem;
    flex-shrink: 0;
    display: block;
    object-fit: contain;
  }

  &:hover {
    span {
      display: inline-block;
    }
  }
}
</style>
