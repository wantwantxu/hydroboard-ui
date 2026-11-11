<template>
  <div class="layer-panel">
    <div
      class="layer-shell"
      :class="{ 'is-collapsed': !tog, 'bg-com': tog, 'pt15': tog }"
    >
      <button
        class="layer-icon-btn"
        type="button"
        title="图层控制"
        :tabindex="tog ? -1 : 0"
        @click="expand"
      >
        <i class="el-icon-s-grid" />
      </button>

      <div class="layer-content" :aria-hidden="!tog">
        <title-box ref="titleBox" title="图层控制" second isVariable @change="toggle" />
        <div class="layer-scroll">
          <control
            v-for="(item, index) in list"
            :data="item"
            :key="`layer-${index}-${item.id}`"
            @change="change"
          />
        </div>
        <div class="bg-border" />
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import titleBox from '@/components/titleBox'
import control from './control'

export default {
  components: {
    titleBox,
    control
  },
  data() {
    return {
      tog: true,
      list: []
    }
  },
  mounted() {
    const tree = JSON.parse(JSON.stringify(window.layerTree || []))
    tree.forEach((group) => {
      ;(group.children || []).forEach((child) => {
        const value = Number(child.value)
        const label = child.label || ''

        if (value === 1001 || value === 1002 || label === '实时雨情' || label === '实时水情') {
          child.checked = false
        }
      })
    })
    this.list = tree
  },
  methods: {
    setCheck(val) {
      const newList = JSON.parse(JSON.stringify(this.list))
      let updated = false
      let newChecked = false

      newList.forEach((item) => {
        if (!updated && Array.isArray(item.children)) {
          item.children.forEach((child) => {
            if (!updated && child.value === val) {
              const checked = !!child.checked
              child.checked = !checked
              newChecked = child.checked
              updated = true
            }
          })
        }
      })

      if (updated) {
        this.list = newList
      }
      return newChecked
    },
    change(val, wasChecked) {

      const newChecked = this.setCheck(val)
      this.$emit('change', val, newChecked)
    },
    toggle(val) {
      this.tog = !val
    },
    expand() {
      if (this.tog) return
      this.tog = true
      this.$nextTick(() => {
        const titleBox = this.$refs.titleBox
        if (titleBox) {
          titleBox.open = false
        }
      })
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.layer-panel {
  position: absolute;
  top: var(--panel-top, 6.25rem);
  left: var(--panel-gap, 1.25rem);
  z-index: 500;
  box-sizing: border-box;
}

.layer-shell {
  position: relative;
  width: 360px;

  height: clamp(320px, 58vh, 640px);
  max-height: calc(100vh - var(--panel-top, 6.25rem) - var(--panel-gap, 1.25rem));
  overflow: hidden;
  box-sizing: border-box;
  transform: translateZ(0);
  transition:
    width 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    padding 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.24s ease,
    border-color 0.24s ease,
    box-shadow 0.24s ease;

  &.is-collapsed {
    width: 44px;
    height: 44px;
    max-height: 44px;
    padding: 0 !important;
    background: var(--panel-bg, rgba(0, 16, 30, 0.52));
    border: 1px solid rgba(0, 255, 246, 0.35);
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(8px);
    transition-delay: 0.14s, 0.14s, 0.14s, 0s, 0s, 0s;

    .layer-icon-btn {
      opacity: 1;
      pointer-events: auto;
      transition-delay: 0.22s;
    }

    .layer-content {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition-delay: 0s;
    }
  }

  &:not(.is-collapsed) {
    transition-delay: 0s, 0s, 0s, 0s, 0s, 0s;

    .layer-icon-btn {
      opacity: 0;
      pointer-events: none;
      transition-delay: 0s;
    }

    .layer-content {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transition-delay: 0.12s;
    }
  }
}

.layer-icon-btn {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00fff6;
  outline: none;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;

  i {
    font-size: 20px;
    line-height: 1;
  }

  &:hover {
    color: #7ffff8;
  }
}

.layer-content {
  opacity: 1;
  visibility: visible;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  height: 100%;
  transition: opacity 0.22s ease, visibility 0.22s ease;
}

.layer-scroll {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 10px 0 20px;
  width: 340px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 246, 0.3);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
