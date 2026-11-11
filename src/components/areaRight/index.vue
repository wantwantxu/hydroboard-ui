<template>
  <transition name="slide-fade-right">
    <div class="area-right" :class="{min: isMin}" v-if="componentName">
        <components :is="componentName" :key="panelKey" :comVal="comVal" :popupShowData="popupShowData"
                  :isMin="isMin" @sizeChange="sizeChange" @timeUpdate="timeUpdate" @pop="popShow"/>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import eventBus from '@/eventBus'

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
  provide() {
    return {
      getAreaPanelMin: () => this.isMin
    }
  },
  props: {
    areaShow: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      componentName: '',
      isMin: false,
      comVal: 0,
      popupShowData: {},
      panelKey: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      eventBus.$on('popupShowWithID', (data) => {
        this.popupShowData = data
      })
    })
  },
  methods: {
    toggle(type) {
      if (type === 'max' && !this.isMin) return
      this.sizeChange(!this.isMin)
    },
    set(val) {
      let alone = [1001, 1002, 1007, 2002, 3001, 3003, 3004, 3005, 3022, 3023, 3024, 4001, 5001, 6001,3006]
      let name = ''
      if (alone.includes(val)) {
        name = 'd_' + val
      } else {
        name = 'd_com'
        this.comVal = val
      }
      this.isMin = false
      this.panelKey += 1
      this.componentName = name
      this.$emit('sizeChange', false)
    },
    sizeChange(isMin) {
      this.isMin = isMin
      this.$emit('sizeChange', isMin)
    },
    popShow(data) {
      this.$emit('pop', data)
    },
    timeUpdate(data) {
      console.log(data)
      this.$emit('timeUpdate', data)
    }
  },
  watch: {
    areaShow(v) {
      if (!v) {
        this.componentName = ''
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.area-right {
  position: absolute;
  right: var(--panel-gap, 1.25rem);
  top: var(--panel-top, 6.25rem);
  bottom: var(--panel-gap, 1.25rem);
  z-index: 506;
  width: var(--area-right-w-full, clamp(18.75rem, 28vw, 26.25rem));
  min-width: 0;
  max-width: none;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  
  > div {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
  }

  &.min {
    width: var(--area-right-w-min, 11.875rem);
  }

  .title {
    display: none;
  }
}


.slide-fade-right-enter-active {
  transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
}
.slide-fade-right-leave-active {
  transition: all 0.5s cubic-bezier(0.755, 0.05, 0.855, 0.06);
}
.slide-fade-right-enter, .slide-fade-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
