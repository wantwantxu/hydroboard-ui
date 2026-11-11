<template>
  <div class="station-forecast-panel bg-com pt15" style="height: 100%;" >
    <title-box title="单站预报" second/>
    <div class="card card-list" >
      <div class="title"><span>预报站列表</span><el-button
        type="text"
        style="float: right; margin-right: 10px; color: #67C23A;"
        @click="showAdminPanel">
        <i class="el-icon-setting"></i> 管理
      </el-button></div>
      <div class="warp" style="height: calc(100% - 66px);" >
        <el-table
          height="100%"
          ref="table"
          :data="tableData"
          stripe
          :row-class-name="tableRowClassName"
          highlight-current-row
          @row-click="rowClick">
          <el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="预报站码" width="100" prop="id" align="center"/>
          <el-table-column label="预报站名"  prop="name" align="center"/>
          <!-- <el-table-column label="所在河流" prop="" align="center" show-overflow-tooltip/>
          <el-table-column label="汇入站数" align="center" show-overflow-tooltip/>
          <el-table-column label="雨量站数" align="center" show-overflow-tooltip/> -->
        </el-table>
      </div>
    </div>
    <div class="card card-plan">
      <div class="title"><span>预报方案计算</span></div>
      <div class="plan-body">
        <div class="meta-row model-row">
          <span class="meta-label">模型预报</span>
          <div class="model-chips">
            <button
              v-for="(model, index) in modelList"
              :key="index"
              type="button"
              class="chip"
              :class="{ active: current.modelId && current.modelId === model.id }"
              @click="showModel(model)"
            >{{ model.name }}</button>
            <button
              type="button"
              class="chip"
              :class="{ active: current.panel === 'cascade' }"
              @click="showCascade"
            >梯级预报</button>
          </div>
        </div>
        <ul class="meta-list">
          <li>
            <span class="meta-label">集水面积</span>
            <span class="meta-value">{{ current.fcstObjects.area || '—' }}<em v-if="current.fcstObjects.area"> k㎡</em></span>
          </li>
          <li>
            <span class="meta-label">当前模型</span>
            <span class="meta-value" :class="{ muted: !current.modelName }">{{ current.modelName || '未选择' }}</span>
          </li>
          <li>
            <span class="meta-label">预报站码</span>
            <span class="meta-value">{{ current.fcstObjects.id || '—' }}</span>
          </li>
          <li>
            <span class="meta-label">类型</span>
            <span class="meta-value">{{ current.fcstObjects.type || '—' }}</span>
          </li>
          <li class="full">
            <span class="meta-label">预报站名</span>
            <span class="meta-value accent">{{ current.fcstObjects.name || '—' }}</span>
          </li>
        </ul>
      </div>
      <div class="ybfajs" @click="showResult">
        <span>预报方案计算</span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>
import titleBox from '@/components/titleBox'
import Api from '@/api'

export default {
  components: {
    titleBox,
  },
  data() {
    return {
      current: {
        modelId: '',
        modelName: '',
        fcstObjects:{
          id: '',
          name:''
        }
      },
      planId: '',
      tableData: [],

      modelList: [
        { id: 1, name: '新安江' },
        { id: 2, name: 'API' },
        { id: 3, name: '上下游预报' }
      ]
    }
  },
  methods: {

    handlePlanChange(value) {
      this.planId = value
    },
    showModel(model) {
      if (!this.current.fcstObjects || !this.current.fcstObjects.id) {
        this.$message.warning('请先选择预报站')
        return
      }
      this.current.modelId = Number(model.id)
      this.current.modelName = model.name
      this.current.planId = this.planId
      this.current.panel = ''

      this.$emit('modelShow', { ...this.current })
    },
    showCascade() {
      if (!this.current.fcstObjects || !this.current.fcstObjects.id) {
        this.$message.warning('请先选择预报站')
        return
      }
      this.current.panel = 'cascade'
      this.current.modelId = 'cascade'
      this.current.modelName = '梯级预报'
      this.$emit('modelShow', { ...this.current, panel: 'cascade', modelId: 'cascade' })
    },
    showResult(){
      if (!this.current.modelId && this.current.panel !== 'cascade') {
        this.$message.warning('请先选择模型预报');
        return;
      }

      this.$emit('resultShow', {
        ...this.current,
        modelId: this.current.modelId
      });
    },
    showAdminPanel(){
      this.$emit('adminPanelShow', this.current)
    },

    gettableList() {

      Api.fcstObjectsList({}).then(response => {
        if (response.code === 200) {
          let list = response.result
          this.tableData = list

          if(list.length > 0){
            this.rowClick(list[0])
          }
        }
      }).catch(() => {
        this.$message.error('预报站列表加载失败')
      })
    },

    mergeModelList(list) {
      const defaults = [
        { id: 1, name: '新安江' },
        { id: 2, name: 'API' },
        { id: 3, name: '上下游预报' }
      ]
      const map = new Map()
      defaults.forEach((m) => map.set(Number(m.id), { ...m }))
      ;(list || []).forEach((m) => {
        const id = Number(m.id)
        if (!id && id !== 0) return
        const prev = map.get(id) || {}
        map.set(id, { ...prev, ...m, id, name: m.name || prev.name || ('模型' + id) })
      })

      const core = [1, 2, 3].map((id) => map.get(id)).filter(Boolean)
      const rest = Array.from(map.values()).filter((m) => ![1, 2, 3].includes(Number(m.id)))
      return core.concat(rest)
    },

    getFcstModel() {
      Api.getModelList({}).then(response => {
        if (response.code === 200) {
          this.modelList = this.mergeModelList(response.result || [])
        } else {
          this.modelList = this.mergeModelList([])
        }
      }).catch(() => {
        this.modelList = this.mergeModelList([])
      })
    },

    rowClick(row) {
        this.current.fcstObjects = row
        this.getGeom(row.id)

    },

    tableRowClassName({ row, rowIndex }) {
      if(row.id === this.current.fcstObjects.id){
        return 'current-row'
      }else{
        return ''
      }
    },
    getGeom(objects_id) {
      Api.getObjectsGeom({objectsId: objects_id}).then(response => {
        if (response.code !== 200) return
        const list = response.result
        if (!list || !list.length || !list[0].geom) return
        try {
          const jsonObject = typeof list[0].geom === 'string'
            ? JSON.parse(list[0].geom)
            : list[0].geom
          const plugin = window.mpPlugin && window.mpPlugin.szyAnalysis && window.mpPlugin.szyAnalysis()
          if (plugin && typeof plugin.showObjectsGeom === 'function') {
            plugin.showObjectsGeom(jsonObject)
          }
        } catch (e) {  }
      }).catch(() => {})
    },

    init() {
      this.gettableList()
      this.getFcstModel()
    }
  },
  mounted() {
    console.log(Api)
    this.init()
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.station-forecast-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  gap: 10px;
  overflow: hidden;
  background: rgba(1, 16, 30, 0.96) !important;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.55);

  > .card {
    padding: 0 10px 10px;
  }

  .card-list {
    flex: 1 1 auto;
    min-height: 120px;
    overflow: hidden;
  }

  .card-plan {
    flex: 0 1 auto;
    max-height: min(42%, 320px);
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  ::v-deep .el-table,
  ::v-deep .el-table__expanded-cell,
  ::v-deep .el-table th,
  ::v-deep .el-table tr,
  ::v-deep .el-table td {
    background-color: transparent !important;
  }

  ::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: rgba(0, 255, 246, 0.06) !important;
  }

  ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: rgba(0, 255, 246, 0.12) !important;
  }
}

.card {
  .title {
    color: #fff;
    position: relative;
    flex: 0 0 auto;
    background: url(../../assets

    > span {
      display: inline-block;
      margin: 12px 0 10px;
      min-width: 110px;
      line-height: 26px;
      font-size: 14px;
      text-indent: 20px;
      background: linear-gradient(90deg, rgba(250, 162, 26, 0) 0%, rgba(250, 162, 26, 0.5) 51%, rgba(250, 162, 26, 0) 100%);
    }
  }

  .title .el-button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    padding: 0;
  }
}

.plan-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 6px;
}

.meta-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 6px;
}

.model-row .meta-label {
  padding-top: 3px;
}

.meta-label {
  flex: 0 0 4.2em;
  color: rgba(155, 190, 205, 0.78);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  white-space: nowrap;
}

.meta-value {
  flex: 1 1 auto;
  min-width: 0;
  color: #f2fdff;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  em {
    font-style: normal;
    font-weight: 400;
    color: rgba(0, 255, 246, 0.75);
    font-size: 11px;
  }

  &.accent {
    color: #00fff6;
  }

  &.muted {
    color: rgba(255, 255, 255, 0.42);
    font-weight: 400;
  }
}

.meta-list {
  margin: 0;
  padding: 6px 8px;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 8px;
  background: rgba(0, 255, 246, 0.05);
  border: 1px solid rgba(0, 255, 246, 0.16);
  border-radius: 4px;

  li {
    display: flex;
    align-items: baseline;
    gap: 6px;
    min-width: 0;
    min-height: 24px;
    padding: 2px 0;

    &.full {
      grid-column: 1 / -1;
      border-top: 1px dashed rgba(0, 255, 246, 0.14);
      margin-top: 2px;
      padding-top: 4px;
    }
  }
}

.model-chips {
  flex: 1 1 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-width: 0;
}

.chip {
  margin: 0;
  padding: 0 7px;
  line-height: 22px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.88);
  background: rgba(0, 255, 246, 0.08);
  border: 1px solid rgba(0, 255, 246, 0.28);
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    color: #ccff00;
    border-color: rgba(204, 255, 0, 0.55);
  }

  &.active {
    color: #01101e;
    font-weight: 600;
    background: #00fff6;
    border-color: #00fff6;
  }
}

.ybfajs {
  flex: 0 0 auto;
  margin-top: 6px;
  line-height: 34px;
  text-align: center;
  color: #00fff6;
  background: rgba(0, 255, 246, 0.14);
  border: 1px solid rgba(0, 255, 246, 0.55);
  border-radius: 4px;
  cursor: pointer;

  span {
    display: inline-block;
    margin: 0 5px;
    vertical-align: middle;
  }

  span:last-child {
    width: 12px;
    height: 12px;
    background: url(../../assets/images/js1.png) 0 0 no-repeat;
    background-size: cover;
  }

  &:hover {
    color: #ccff00;
    background: rgba(0, 255, 246, 0.24);
    border-color: #00fff6;

    span:last-child {
      background: url(../../assets/images/js2.png) 0 0 no-repeat;
      background-size: cover;
    }
  }
}
</style>
