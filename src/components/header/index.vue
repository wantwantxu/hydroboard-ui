<template>
  <header class="header">
    <span class="header-corner is-tl" aria-hidden="true"></span>
    <span class="header-corner is-tr" aria-hidden="true"></span>
    <span class="header-corner is-bl" aria-hidden="true"></span>
    <span class="header-corner is-br" aria-hidden="true"></span>
    <div class="header-brand">
      <span class="brand-mark" aria-hidden="true"></span>
      <h1 ref="logoRef"></h1>
    </div>

    <nav class="header-nav" aria-label="主导航">
      <button
        v-for="item in menu"
        :key="item.path"
        type="button"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click="menuClick(item.path)"
      >
        {{ item.name }}
      </button>
    </nav>

    <div class="header-tools">
      <div class="header-time">
        <span v-if="nowTime.time" class="time-clock">{{ nowTime.time }}</span>
        <span v-if="nowTime.yml" class="time-date">{{ nowTime.yml }} 星期{{ week[nowTime.week] }}</span>
      </div>
      <div class="header-actions">
        <el-tooltip placement="bottom" content="刷新当前界面">
          <button type="button" class="action-btn" @click="refreshPage">
            <i class="el-icon-refresh-left"></i>
          </button>
        </el-tooltip>
        <el-tooltip placement="bottom" content="退出界面">
          <button type="button" class="action-btn is-danger" @click="logoutClick">
            <i class="el-icon-error"></i>
          </button>
        </el-tooltip>
      </div>
    </div>
  </header>
</template>

<script type="text/ecmascript-6">
import { formatDate } from '@/assets/js/common'
import AppService from '@/store/services/appService'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      routeKey: '/',
      nowTime: {},
      timer: null,
      week: ['日', '一', '二', '三', '四', '五', '六'],
      menu: [],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.refreshMenus()
      this.init()
    })
  },
  destroyed() {
    clearTimeout(this.timer)
  },
  methods: {
    refreshMenus() {
      const title = window.portalConfig?.title || '水文综合服务平台'
      if (this.$refs.logoRef) {
        this.$refs.logoRef.innerHTML = title
      }
      document.title = title
      const backendMenus = window.userMenus
      if (backendMenus && backendMenus.length > 0) {

        this.menu = backendMenus
          .filter(m => m.path !== '/flood' && m.name !== '洪水淹没')
          .map(m => ({
            name: m.name,
            path: m.path,
            meta: m.meta || {}
          }))
      }
    },
    init() {
      this.pathCheck(this.$route)
      const auto = () => {
        const time = new Date()
        this.nowTime = {
          yml: formatDate(time, 'yyyy.MM.dd'),
          week: time.getDay(),
          time: formatDate(time, 'hh:mm:ss'),
        }
        this.timer = setTimeout(() => {
          auto()
        }, 1000)
      }
      auto()
    },
    refreshPage() {
      window.location.reload()
    },
    async logoutClick() {
      AppService.clearAll()
      Message.success('演示版无需登录，已刷新本地状态')
      window.location.reload()
    },
    menuClick(path) {
      if (!path || this.isActive(path)) return

      try {
        if (window.popBox && typeof window.popBox.close === 'function') {
          window.popBox.close()
        }
      } catch (e) {  }

      try { window.mpPlugin && window.mpPlugin.clearAll() } catch (e) {  }
      this.$router.push({ path }).catch(() => {})
    },
    isActive(path) {
      const current = this.routeKey === '/' ? '/index' : this.routeKey
      return path === current
    },
    pathCheck(r) {
      if (r.params.id) {
        let nr = r.path.split('/')
        nr = nr.length ? (nr[1] ? '/' + nr[1] : r.path) : r.path
        this.routeKey = nr
      } else {
        this.routeKey = r.path
      }
    },
  },
  watch: {
    $route(r) {
      this.pathCheck(r)

      if (!this.menu.length) {
        this.refreshMenus()
      }
    },
  },
}
</script>

<style type="text/scss" lang="scss" scoped>
.header {
  height: var(--header-h, 5rem);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem 0 1.25rem;
  pointer-events: auto;

  background: linear-gradient(
    180deg,
    rgba(0, 22, 38, 0.88) 0%,
    rgba(0, 16, 30, 0.78) 100%
  );
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 255, 246, 0.4);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
}

.header-corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid #00fff6;
  pointer-events: none;
  z-index: 2;

  &.is-tl {
    left: 0;
    top: 0;
    border-right: 0;
    border-bottom: 0;
  }

  &.is-tr {
    right: 0;
    top: 0;
    border-left: 0;
    border-bottom: 0;
  }

  &.is-bl {
    left: 0;
    bottom: 0;
    border-right: 0;
    border-top: 0;
  }

  &.is-br {
    right: 0;
    bottom: 0;
    border-left: 0;
    border-top: 0;
  }
}

.header-brand {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex: 0 1 auto;
  min-width: 0;
  max-width: 28%;

  h1 {
    margin: 0;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.25rem;
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: 0.02em;
    white-space: nowrap;
    color: #fff;
    background-image: linear-gradient(180deg, #ffffff 28%, #7dfff8);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.brand-mark {
  width: 0.25rem;
  height: 1.5rem;
  border-radius: 2px;
  flex-shrink: 0;
  background: #00fff6;
  box-shadow: 0 0 10px rgba(0, 255, 246, 0.75);
}

.header-nav {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  max-width: min(52rem, calc(100% - 480px));
  margin: 0;
  padding: 0;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.nav-item {
  appearance: none;
  flex: 0 0 auto;
  border: 1px solid rgba(0, 255, 246, 0.22);
  background: rgba(0, 8, 18, 0.45);
  color: rgba(210, 255, 252, 0.92);
  font-size: 0.9375rem;
  line-height: 1;
  height: 2.25rem;
  padding: 0 0.875rem;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    color: #fff;
    background: rgba(0, 255, 246, 0.14);
    border-color: rgba(0, 255, 246, 0.45);
  }

  &.active {
    color: #fff;
    font-weight: 700;
    background: rgba(0, 255, 246, 0.28);
    border-color: rgba(0, 255, 246, 0.85);
    box-shadow:
      inset 0 -2px 0 #00fff6,
      0 0 10px rgba(0, 255, 246, 0.25);
  }
}

.header-tools {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 0 0 auto;
  margin-left: auto;
  padding-left: 0.75rem;
}

.header-time {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  color: #00fff6;
  line-height: 1;
  white-space: nowrap;
}

.time-clock {
  font-family: 'hb-digit', 'Arial', sans-serif;
  font-size: 1.125rem;
}

.time-date {
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  opacity: 0.85;
}

.header-actions {
  display: flex;
  align-items: center;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 1.125rem;
  color: #35cc4b;

  &.is-danger {
    color: #fc635e;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}
</style>
