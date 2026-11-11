<template>
  <div class="wrap bg-com rain-area-panel">
    <div class="panel-hd">
      <h2><img src="/static/icon/icon_rain.png" alt="">面雨量</h2>
      <ul class="dim-tabs">
        <li
          v-for="item in dimOptions"
          :key="item.value"
          :class="{ active: dim === item.value }"
          @click="switchDim(item.value)"
        >{{ item.label }}</li>
      </ul>
    </div>
    <div class="table-wrap">
      <el-table :data="tableData" stripe max-height="100%" size="mini" highlight-current-row>
        <el-table-column type="index" label="序号" width="50" align="center"/>
        <el-table-column prop="name" :label="nameLabel" align="center" show-overflow-tooltip/>
        <el-table-column prop="drp" label="雨量(mm)" width="90" align="center"/>
      </el-table>
    </div>
  </div>
</template>

<script>
import Api from '@/api'

const DIM_OPTIONS = [
  { label: '行政区', value: 'addvcd' },
  { label: '河流', value: 'rvnm' },
  { label: '流域', value: 'basin' }
]

const NAME_LABEL = {
  addvcd: '行政区',
  rvnm: '河流',
  basin: '流域'
}

export default {
  data() {
    return {
      tableData: [],
      dim: 'addvcd',
      dimOptions: DIM_OPTIONS,
      queryOption: {}
    }
  },
  computed: {
    nameLabel() {
      return NAME_LABEL[this.dim] || '名称'
    }
  },
  mounted() {
    this.loadData({})
  },
  methods: {
    switchDim(dim) {
      if (this.dim === dim) return
      this.dim = dim
      this.fetchList()
    },
    loadData(option = {}) {
      this.queryOption = {
        startDate: option.startDate,
        endDate: option.endDate
      }
      if (option.dim) {
        this.dim = option.dim
      }
      this.fetchList()
    },
    fetchList() {
      Api.listAreaRainfall({
        startDate: this.queryOption.startDate,
        endDate: this.queryOption.endDate,
        dim: this.dim
      }).then((response) => {
        const list = (response && (response.result || response.data)) || response || []
        this.tableData = Array.isArray(list) ? list : []
      }).catch(() => {
        this.tableData = []
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 0.5rem 0.75rem 0.75rem;
  box-sizing: border-box;
  min-height: 0;
}

.panel-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  min-width: 0;
}

h2 {
  margin: 0;
  font-size: 0.95rem;
  color: #cfefff;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
  flex: 0 0 auto;

  img {
    width: 1rem;
    height: 1rem;
  }
}

.dim-tabs {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
  min-width: 0;

  li {
    flex: 0 0 auto;
    height: 1.5rem;
    line-height: 1.5rem;
    padding: 0 0.5rem;
    border: 1px solid rgba(0, 255, 246, 0.45);
    border-radius: 2px;
    color: #00fff6;
    font-size: 0.75rem;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
    transition: all 0.2s;

    &:hover {
      border-color: #00fff6;
      background: rgba(0, 255, 246, 0.08);
    }

    &.active {
      background: #fd0;
      border-color: #fd0;
      color: #333;
      font-weight: 600;
    }
  }
}

.table-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
