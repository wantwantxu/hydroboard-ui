<template>
  <div class="title-box" :class="{ second: second, open: open }">
    <h2>{{ title }}</h2>
    <button
      v-if="isVariable"
      class="title-arrow"
      type="button"
      :title="open ? '展开面板' : '收起面板'"
      @click.stop="change"
    >
      <svg class="title-arrow__icon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.6" />
        <path d="M15 4.5v15" fill="none" stroke="currentColor" stroke-width="1.6" />
        <path d="M7.2 9.1L10.4 12l-3.2 2.9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  inject: {
    getAreaPanelMin: { default: null }
  },
  props: {
    title: {
      type: String,
      default() {
        return '标题'
      }
    },
    second: {
      type: Boolean,
      default() {
        return false
      }
    },
    isVariable: {
      type: Boolean,
      default() {
        return false
      }
    },
    
    collapsed: {
      type: Boolean,
      default: undefined
    }
  },
  data() {
    return {
      open: false
    }
  },
  watch: {
    collapsed: {
      immediate: true,
      handler(v) {
        if (typeof v === 'boolean') {
          this.open = v
        }
      }
    }
  },
  created() {

    if (typeof this.getAreaPanelMin === 'function' && typeof this.collapsed !== 'boolean') {
      this.$watch(
        () => this.getAreaPanelMin(),
        (v) => { this.open = !!v },
        { immediate: true }
      )
    }
  },
  methods: {
    change() {
      this.open = !this.open
      this.$emit('change', this.open)
    },
    toMax() {
      this.$emit('change', 'max')
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.title-box {
  text-align: center;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding-right: 2.75rem;

  .title-arrow {
    position: absolute;
    right: 0.4rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.75rem;
    height: 1.75rem;
    box-sizing: border-box;
    flex-shrink: 0;
    padding: 0;
    text-align: center;
    border: 1px solid rgba(0, 255, 246, 0.55);
    border-radius: 8px;
    background: rgba(0, 24, 38, 0.88);
    color: #00fff6;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

    &__icon {
      width: 1.05rem;
      height: 1.05rem;
      display: block;
      flex-shrink: 0;
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover {
      border-color: #00fff6;
      background: rgba(0, 255, 246, 0.16);
      color: #ffffff;
    }
  }

  &.open {
    h2 {
      &:before,
      &:after {
        display: none;
      }
    }

    .title-arrow {
      .title-arrow__icon {
        transform: rotate(180deg);
      }
    }
  }

  &.second {
    h2 {
      color: #00fff6;
    }
  }

  h2 {
    padding: 0.625rem 2.5rem 0.625rem 1.5rem;
    line-height: 1.5625rem;
    font-size: 1.375rem;
    color: #fff;
    display: inline-block;
    vertical-align: top;
    border: 1px solid rgba(0, 255, 255, 0.15);
    border-radius: 6px;
    position: relative;
    margin: 0;
  }
}
</style>
