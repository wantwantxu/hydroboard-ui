<template>
  <div class="wrap bg-com water-warn-panel">
    <h2><img src="/static/icon/icon_yj.png" alt="">水情超警</h2>
    <ul class="content">
      <li>
        <dl>
          <dt><span>{{ riverWarn }}</span>站</dt>
          <dd>河道超警戒</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt><span>{{ riverGuard }}</span>站</dt>
          <dd>河道超保证</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt><span>{{ rsvrWarn }}</span>座</dt>
          <dd>水库超汛限</dd>
        </dl>
      </li>
    </ul>
  </div>
</template>

<script>
import Api from '@/api'

export default {
  data() {
    return {
      riverWarn: 0,
      riverGuard: 0,
      rsvrWarn: 0
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      Api.listOut({}).then((res) => {
        const list = (res && (res.result || res.data)) || res || []
        this.riverWarn = Array.isArray(list) ? list.length : 0
      }).catch(() => { this.riverWarn = 0 })

      Api.listOutOfGrz({}).then((res) => {
        const list = (res && (res.result || res.data)) || res || []
        this.riverGuard = Array.isArray(list) ? list.length : 0
      }).catch(() => { this.riverGuard = 0 })

      Api.listOutReservoir({}).then((res) => {
        const list = (res && (res.result || res.data)) || res || []
        this.rsvrWarn = Array.isArray(list) ? list.length : 0
      }).catch(() => { this.rsvrWarn = 0 })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 0.5rem 0.75rem 0.75rem;
}
h2 {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  color: #cfefff;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  img { width: 1rem; height: 1rem; }
}
.content {
  display: flex;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    flex: 1;
    text-align: center;
    background: rgba(0, 140, 255, 0.08);
    border: 1px solid rgba(0, 180, 255, 0.2);
    padding: 0.5rem 0.25rem;
  }
  dt span {
    font-size: 1.25rem;
    color: #00fcff;
  }
  dd {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    color: #9ec9e8;
  }
}
</style>
