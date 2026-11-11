<template>
  <div class="sub-icon" :class="{moreSub:checkedList.length>10}">
    <div class="sub-pre" @click="_pre">
      <img src="/static/svg/sub_pre.svg" alt="">
    </div>
    <div class="sub-scroll" ref="subScroll">
      <ul>
        <sub-item v-for="(item,index) in checkedList" :key="index" :type="item" :isActive="activeChecked['ac_'+item]"
                  @close="_close" @click="_show"/>
      </ul>
    </div>
    <div class="sub-next" @click="_next">
      <img src="/static/svg/sub_next.svg" alt="">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subItem from './model'

export default {
  components: {
    subItem
  },
  data() {
    return {
      checkedList: [],
      alwaysList: [1004, 1005, 2001],
      radioList1: [2003, 2004, 2005],
      radioList2: [2007, 2008, 2009],
      radioList3: [1001, 1002, 1003, 1006, 1007, 2002, 2006, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010, 3011, 3012, 3013, 3014, 3015, 3016, 3017, 3018, 3022, 3023, 3024, 4001, 5001, 6001],
      activeChecked: {},
      dataChecked: []
    }
  },
  methods: {
    _close(type) {
      this.$emit('close', type)
    },
    mrw(key, value) {
      this.$set(this.activeChecked, 'ac_' + key, value)
      let idx = this.alwaysList.indexOf(key)
      let json = {}
      json[['moon', 'radar', 'weather'][idx]] = value
      this.$emit('change', json)
    },
    hours(key) {
      let idx = this.radioList1.indexOf(key)
      this.$emit('change', {hours: [24, 48, 72][idx]})
    },
    wwp(key) {
      let idx = this.radioList2.indexOf(key)
      this.$emit('change', {windWavePot: ['wind', 'wave', 'potential'][idx]})
    },
    _show(val, isAdd = false) {

      if (this.alwaysList.indexOf(val) !== -1) {
        this.mrw(val, true)
      } else if (this.radioList1.indexOf(val) !== -1) {

        this.hours(val)
        this.radioList1.forEach(o => {
          this.$set(this.activeChecked, 'ac_' + o, o === val)
        })
      } else if (this.radioList2.indexOf(val) !== -1) {

        this.wwp(val)
        this.radioList2.forEach(o => {
          this.$set(this.activeChecked, 'ac_' + o, o === val)
        })
      } else if (this.radioList3.indexOf(val) !== -1) {
        if (isAdd) {
          this.dataChecked.push(val)
          this.$emit('change', {potList: this.dataChecked})
        }

        this.$emit('changeArea', val)
        this.radioList3.forEach(o => {
          this.$set(this.activeChecked, 'ac_' + o, o === val)
        })
      }
    },
    _hide(val) {
      if (this.alwaysList.indexOf(val) !== -1) {
        this.mrw(val, false)
      } else if (this.radioList1.indexOf(val) !== -1) {
        if (!this.activeChecked['ac_' + val]) return
        this.$set(this.activeChecked, 'ac_' + val, false)
        for (let i = 0; i < this.checkedList.length; i++) {
          if (this.radioList1.indexOf(this.checkedList[i]) !== -1) {
            this.$set(this.activeChecked, 'ac_' + this.checkedList[i], true)
            this.hours(this.checkedList[i])
            return false
          }
        }
      } else if (this.radioList2.indexOf(val) !== -1) {
        if (!this.activeChecked['ac_' + val]) return
        this.$set(this.activeChecked, 'ac_' + val, false)
        for (let i = 0; i < this.checkedList.length; i++) {
          if (this.radioList2.indexOf(this.checkedList[i]) !== -1) {
            this.$set(this.activeChecked, 'ac_' + this.checkedList[i], true)
            this.wwp(this.checkedList[i])
            return false
          }
        }
      } else if (this.radioList3.indexOf(val) !== -1) {
        let idx = this.dataChecked.indexOf(val)
        this.dataChecked.splice(idx, 1)
        this.$emit('change', {potList: this.dataChecked})
        if (!this.activeChecked['ac_' + val]) return
        this.$set(this.activeChecked, 'ac_' + val, false)
        let isFlag = false
        for (let i = 0; i < this.checkedList.length; i++) {
          if (this.radioList3.indexOf(this.checkedList[i]) !== -1) {
            isFlag = true
            this.$set(this.activeChecked, 'ac_' + this.checkedList[i], true)
            this.$emit('changeArea', this.checkedList[i])
            return false
          }
        }
        if (!isFlag) {
          this.$emit('changeArea', '')
        }
      }
    },
    set(val, isJoin) {
      if (isJoin) {
        this.checkedList.unshift(val)
        this._show(val, true)
      } else {
        let idx = this.checkedList.indexOf(val)
        this.checkedList.splice(idx, 1)
        this._hide(val)
      }
    },
    _pre() {
      let old = this.$refs.subScroll.scrollTop
      let pz = old % 49
      pz = pz > 25 ? pz : (pz + 49)
      this.$refs.subScroll.scrollTop = old - pz
    },
    _next() {
      let old = this.$refs.subScroll.scrollTop
      let pz = old % 49
      pz = pz > 25 ? pz : (pz + 49)
      this.$refs.subScroll.scrollTop = old + pz
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.sub-icon {
  
  top: calc(var(--panel-top, 6.25rem) + var(--map-tools-h, 3.5rem) + 0.75rem);
  right: var(--area-right-tools-right, var(--panel-gap, 1.25rem));
  position: absolute;
  z-index: 507;
  overflow: visible;
  transition: right 0.45s cubic-bezier(0.4, 0, 0.2, 1);

  &.moreSub {
    padding: 22px 0;

    .sub-pre, .sub-next {
      display: block;
    }

    .sub-scroll {
      padding-right: 20px;
      right: -24px;
    }
  }

  .sub-scroll {
    max-height: 490px;
    overflow-y: auto;
    position: relative;
  }

  .sub-pre, .sub-next {
    background: rgba(0, 16, 30, .8);
    height: 20px;
    text-align: center;
    width: 44px;
    line-height: 20px;
    position: absolute;
    right: 0;
    cursor: pointer;
    display: none;

    img {
      width: 16px;
    }
  }

  .sub-pre {
    border-radius: 6px 6px 0 0;
    top: 0;
  }

  .sub-next {
    bottom: 0;
    border-radius: 0 0 6px 6px;

    img {
      transform: rotate(180deg);
    }
  }

  ul {
    display: flex;
    flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    align-items: flex-end;
  }
}
</style>
