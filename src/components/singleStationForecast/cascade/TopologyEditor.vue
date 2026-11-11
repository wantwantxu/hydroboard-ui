<template>
  <div class="topo-editor" v-loading="loading">
    <div class="toolbar">
      <el-radio-group v-model="mode" size="mini">
        <el-radio-button label="select">选择/拖拽</el-radio-button>
        <el-radio-button label="connect">连线</el-radio-button>
        <el-radio-button label="addNode">加点</el-radio-button>
      </el-radio-group>
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="openAddNode">从预报站添加</el-button>
      <el-button size="mini" @click="autoLayout">自动布局</el-button>
      <el-button size="mini" type="success" :loading="saving" @click="saveAll">保存拓扑</el-button>
      <el-button size="mini" type="danger" :disabled="!canDelete" @click="deleteSelected">删除选中</el-button>
      <el-button size="mini" @click="reload">刷新</el-button>
      <span class="hint">{{ hintText }}</span>
    </div>

    <div class="workspace">
      <div
        ref="canvasWrap"
        class="canvas-wrap"
        @mousedown="onCanvasMouseDown"
        @mousemove="onCanvasMouseMove"
        @mouseup="onCanvasMouseUp"
        @mouseleave="onCanvasMouseUp"
        @contextmenu.prevent
      >
        <svg
          class="topo-svg"
          :width="svgSize.w"
          :height="svgSize.h"
          :viewBox="`0 0 ${svgSize.w} ${svgSize.h}`"
        >
          <defs>
            <marker :id="'arrow-' + _uid" viewBox="0 0 10 10" refX="9" refY="5"
                    markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#34DCFF"/>
            </marker>
            <marker :id="'arrow-active-' + _uid" viewBox="0 0 10 10" refX="9" refY="5"
                    markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFB020"/>
            </marker>
          </defs>

          
          <line
            v-if="connectingFrom && connectPreview"
            :x1="connectingFrom.x"
            :y1="connectingFrom.y"
            :x2="connectPreview.x"
            :y2="connectPreview.y"
            stroke="#FFB020"
            stroke-width="2"
            stroke-dasharray="6 4"
          />

          
          <g
            v-for="edge in drawnEdges"
            :key="'e-' + edge.key"
            class="edge"
            :class="{ active: selectedEdgeKey === edge.key }"
            @mousedown.stop="onEdgeMouseDown(edge, $event)"
          >
            <line
              class="edge-hit"
              :x1="edge.geom.x1"
              :y1="edge.geom.y1"
              :x2="edge.geom.x2"
              :y2="edge.geom.y2"
            />
            <line
              class="edge-line"
              :x1="edge.geom.x1"
              :y1="edge.geom.y1"
              :x2="edge.geom.x2"
              :y2="edge.geom.y2"
              :stroke="selectedEdgeKey === edge.key ? '#FFB020' : '#34DCFF'"
              :stroke-width="selectedEdgeKey === edge.key ? 3 : 2"
              :marker-end="selectedEdgeKey === edge.key ? 'url(#arrow-active-' + _uid + ')' : 'url(#arrow-' + _uid + ')'"
            />
            <text
              :x="edge.geom.mx"
              :y="edge.geom.my - 10"
              class="edge-label"
            >{{ edgeLabel(edge) }}</text>
          </g>

          
          <g
            v-for="node in nodes"
            :key="'n-' + node.stcd"
            class="node"
            :class="{ active: selectedNodeId === node.stcd, root: node.stcd === sid(rootStcd) }"
            :transform="`translate(${node.x}, ${node.y})`"
            @mousedown.stop="onNodeMouseDown(node, $event)"
          >
            <circle r="18" />
            <text y="4" text-anchor="middle" class="node-code">{{ shortCode(node.stcd) }}</text>
            <text y="34" text-anchor="middle" class="node-name">{{ node.stnm || node.stcd }}</text>
          </g>
        </svg>
      </div>

      <div class="side-panel">
        <template v-if="selectedEdge">
          <h4>河段属性</h4>
          <el-form label-width="90px" size="mini">
            <el-form-item label="上游">{{ selectedEdge.upstreamStcd }} / {{ selectedEdge.upstreamStnm }}</el-form-item>
            <el-form-item label="下游">{{ selectedEdge.downstreamStcd }} / {{ selectedEdge.downstreamStnm }}</el-form-item>
            <el-form-item label="传递方式">
              <el-select v-model="selectedEdge.flowTransferType" style="width:100%">
                <el-option label="outflow 下泄=入流" value="outflow"/>
                <el-option label="total_out 总出流" value="total_out"/>
                <el-option label="portion 按比例" value="portion"/>
              </el-select>
            </el-form-item>
            <el-form-item label="传递比例">
              <el-input-number v-model="selectedEdge.flowTransferRatio" :min="0" :max="1" :step="0.1" style="width:100%"/>
            </el-form-item>
            <el-form-item label="传播(h)">
              <el-input-number v-model="selectedEdge.delayTimeH" :min="0" :step="0.5" style="width:100%"/>
            </el-form-item>
            <el-form-item label="距离(km)">
              <el-input-number v-model="selectedEdge.distanceKm" :min="0" :step="0.1" style="width:100%"/>
            </el-form-item>
            <el-form-item label="衰减系数">
              <el-input-number v-model="selectedEdge.attenuationCoeff" :min="0.5" :max="1.5" :step="0.05" style="width:100%"/>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input-number v-model="selectedEdge.orderIndex" :min="0" style="width:100%"/>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="selectedEdge.remark" type="textarea" :rows="2"/>
            </el-form-item>
          </el-form>
        </template>
        <template v-else-if="selectedNode">
          <h4>断面节点</h4>
          <el-form label-width="90px" size="mini">
            <el-form-item label="站码"><el-input v-model="selectedNode.stcd" disabled/></el-form-item>
            <el-form-item label="站名"><el-input v-model="selectedNode.stnm"/></el-form-item>
            <el-form-item label="坐标X"><el-input-number v-model="selectedNode.x" :step="10" style="width:100%"/></el-form-item>
            <el-form-item label="坐标Y"><el-input-number v-model="selectedNode.y" :step="10" style="width:100%"/></el-form-item>
            <el-alert v-if="selectedNode.stcd === sid(rootStcd)" title="当前为根站（梯级起算点）" type="success" :closable="false" show-icon/>
          </el-form>
        </template>
        <template v-else>
          <h4>河道拓扑图</h4>
          <p class="tips">
            1. 「选择/拖拽」可移动节点位置<br>
            2. 「连线」：先点上游站，再点下游站<br>
            3. 「加点」：在画布空白处点击放置节点<br>
            4. 选中河段后可在右侧编辑演算参数<br>
            5. 点击「保存拓扑」写入后端
          </p>
          <p class="stats">节点 {{ nodes.length }} · 河段 {{ edges.length }}</p>
        </template>
      </div>
    </div>

    <el-dialog
      title="从预报站添加节点"
      :visible.sync="addNodeVisible"
      width="480px"
      append-to-body
      modal-class="home-dialog-mask"
      custom-class="home-dialog"
    >
      <el-select v-model="pickedObjectIds" multiple filterable placeholder="选择预报断面/站" style="width:100%">
        <el-option
          v-for="o in objectOptions"
          :key="o.id"
          :label="`${o.id} - ${o.name}`"
          :value="o.id"
          :disabled="!!nodeMap[o.id]"
        />
      </el-select>
      <span slot="footer">
        <el-button @click="addNodeVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmAddNodes">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/api'

const LAYOUT_KEY = (root) => `fcst-reach-topo-layout:${root}`

export default {
  name: 'TopologyEditor',
  props: {
    rootStcd: { type: String, required: true },
    rootName: { type: String, default: '' }
  },
  data() {
    return {
      loading: false,
      saving: false,
      mode: 'select',
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeKey: null,
      dragging: null,
      connectingFrom: null,
      connectPreview: null,
      pendingDeleteIds: [],
      addNodeVisible: false,
      pickedObjectIds: [],
      objectOptions: [],
      svgSize: { w: 900, h: 520 },
      dirty: false
    }
  },
  computed: {
    nodeMap() {
      const map = {}
      this.nodes.forEach(n => { map[n.stcd] = n })
      return map
    },
    selectedNode() {
      return this.nodes.find(n => n.stcd === this.selectedNodeId) || null
    },
    selectedEdge() {
      return this.edges.find(e => e.key === this.selectedEdgeKey) || null
    },
    drawnEdges() {
      return this.edges.map(edge => {
        const geom = this.edgeGeom(edge)
        return geom ? Object.assign({}, edge, { geom }) : null
      }).filter(Boolean)
    },
    canDelete() {
      return !!(this.selectedNodeId || this.selectedEdgeKey)
    },
    hintText() {
      if (this.mode === 'connect') {
        return this.connectingFrom
          ? `已选上游 ${this.connectingFrom.stcd}，请点击下游节点完成连线`
          : '连线模式：依次点击上游节点 → 下游节点'
      }
      if (this.mode === 'addNode') return '在画布空白处点击放置自定义节点'
      return this.dirty ? '有未保存修改' : '就绪'
    }
  },
  watch: {
    rootStcd() {
      this.reload()
    }
  },
  mounted() {
    this.$nextTick(() => this.resizeCanvas())
    window.addEventListener('resize', this.resizeCanvas)
    this.reload()
    this.loadObjects()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCanvas)
  },
  methods: {
    resizeCanvas() {
      const el = this.$refs.canvasWrap
      if (!el) return
      this.svgSize = {
        w: Math.max(el.clientWidth || 800, 600),
        h: Math.max(el.clientHeight || 480, 400)
      }
    },
    shortCode(stcd) {
      const s = String(stcd || '')
      return s.length > 6 ? s.slice(-4) : s
    },
    edgeLabel(edge) {
      const delay = edge.delayTimeH != null ? `${edge.delayTimeH}h` : ''
      const ratio = edge.flowTransferType === 'portion' && edge.flowTransferRatio != null
        ? `×${edge.flowTransferRatio}` : ''
      return [delay, ratio].filter(Boolean).join(' ') || edge.flowTransferType || ''
    },
    edgeKey(up, down, id) {
      return `${id || 0}:${up}->${down}`
    },
    sid(value) {
      return value == null ? '' : String(value)
    },
    edgeGeom(edge) {
      const a = this.nodeMap[this.sid(edge.upstreamStcd)]
      const b = this.nodeMap[this.sid(edge.downstreamStcd)]
      if (!a || !b) return null
      const dx = b.x - a.x
      const dy = b.y - a.y
      const len = Math.hypot(dx, dy) || 1
      const ux = dx / len
      const uy = dy / len
      const reverse = this.edges.some(e =>
        this.sid(e.upstreamStcd) === this.sid(edge.downstreamStcd) &&
        this.sid(e.downstreamStcd) === this.sid(edge.upstreamStcd) &&
        e.key !== edge.key
      )
      const off = reverse ? 10 : 0
      const px = -uy * off
      const py = ux * off
      const r = 26
      return {
        x1: a.x + ux * r + px,
        y1: a.y + uy * r + py,
        x2: b.x - ux * (r + 6) + px,
        y2: b.y - uy * (r + 6) + py,
        mx: (a.x + b.x) / 2 + px,
        my: (a.y + b.y) / 2 + py
      }
    },
    loadObjects() {
      Api.fcstObjectsList({}).then(res => {
        this.objectOptions = res.result || []
      })
    },
    async reload() {
      this.loading = true
      this.selectedNodeId = null
      this.selectedEdgeKey = null
      this.connectingFrom = null
      this.pendingDeleteIds = []
      try {
        let reaches = []
        const byRoot = await Api.reachRelListByRoot({ rootStcd: this.rootStcd })
        reaches = (byRoot && byRoot.result) || []
        if (!reaches.length) {
          const all = await Api.reachRelList({})
          reaches = (all && all.result) || []
        }
        this.buildGraph(reaches)
        this.dirty = false
      } finally {
        this.loading = false
      }
    },
    buildGraph(reaches) {
      const layout = this.loadLayout()
      const nodeMap = {}
      const ensure = (stcd, stnm) => {
        const id = this.sid(stcd)
        if (!id) return
        if (!nodeMap[id]) {
          nodeMap[id] = {
            stcd: id,
            stnm: stnm || id,
            x: (layout[id] && layout[id].x) || 0,
            y: (layout[id] && layout[id].y) || 0
          }
        } else if (stnm && (!nodeMap[id].stnm || nodeMap[id].stnm === id)) {
          nodeMap[id].stnm = stnm
        }
      }
      ensure(this.rootStcd, this.rootName)
      const edges = []
      ;(reaches || []).forEach(r => {
        ensure(r.upstreamStcd, r.upstreamStnm)
        ensure(r.downstreamStcd, r.downstreamStnm)
        const up = this.sid(r.upstreamStcd)
        const down = this.sid(r.downstreamStcd)
        if (!up || !down) return
        edges.push({
          key: this.edgeKey(up, down, r.id),
          id: r.id || 0,
          upstreamStcd: up,
          upstreamStnm: r.upstreamStnm || up,
          downstreamStcd: down,
          downstreamStnm: r.downstreamStnm || down,
          flowTransferType: r.flowTransferType || 'outflow',
          flowTransferRatio: r.flowTransferRatio != null ? r.flowTransferRatio : 1,
          delayTimeH: r.delayTimeH != null ? r.delayTimeH : 1,
          distanceKm: r.distanceKm,
          orderIndex: r.orderIndex,
          attenuationCoeff: r.attenuationCoeff != null ? r.attenuationCoeff : 1,
          remark: r.remark || ''
        })
      })
      this.nodes = Object.values(nodeMap)
      this.edges = edges
      const needLayout = this.nodes.some(n => !n.x && !n.y)
      if (needLayout) this.autoLayout(false)
    },
    loadLayout() {
      try {
        return JSON.parse(localStorage.getItem(LAYOUT_KEY(this.rootStcd)) || '{}')
      } catch (e) {
        return {}
      }
    },
    persistLayout() {
      const layout = {}
      this.nodes.forEach(n => {
        layout[n.stcd] = { x: n.x, y: n.y }
      })
      localStorage.setItem(LAYOUT_KEY(this.rootStcd), JSON.stringify(layout))
    },
    autoLayout(markDirty = true) {
      this.resizeCanvas()
      const levels = {}
      const visited = new Set()
      const rootId = this.sid(this.rootStcd)
      const queue = [{ stcd: rootId, level: 0 }]
      levels[rootId] = 0
      visited.add(rootId)
      while (queue.length) {
        const cur = queue.shift()
        this.edges.forEach(e => {
          if (e.upstreamStcd === cur.stcd && !visited.has(e.downstreamStcd)) {
            visited.add(e.downstreamStcd)
            levels[e.downstreamStcd] = cur.level + 1
            queue.push({ stcd: e.downstreamStcd, level: cur.level + 1 })
          }
        })
      }

      let maxLv = 0
      Object.values(levels).forEach(lv => { if (lv > maxLv) maxLv = lv })
      this.nodes.forEach(n => {
        if (levels[n.stcd] == null) levels[n.stcd] = maxLv + 1
      })
      const buckets = {}
      Object.keys(levels).forEach(stcd => {
        const lv = levels[stcd]
        if (!buckets[lv]) buckets[lv] = []
        buckets[lv].push(stcd)
      })
      const padX = 100
      const padY = 60
      const usableW = this.svgSize.w - padX * 2
      const usableH = this.svgSize.h - padY * 2
      const levelKeys = Object.keys(buckets).map(Number).sort((a, b) => a - b)
      levelKeys.forEach((lv, li) => {
        const list = buckets[lv]
        list.forEach((stcd, idx) => {
          const node = this.nodeMap[this.sid(stcd)]
          if (!node) return
          node.x = padX + (levelKeys.length <= 1 ? usableW / 2 : (usableW * li) / (levelKeys.length - 1))
          node.y = padY + (list.length <= 1 ? usableH / 2 : (usableH * idx) / (list.length - 1))
        })
      })
      this.persistLayout()
      if (markDirty) this.dirty = true
      this.$forceUpdate()
    },
    openAddNode() {
      this.pickedObjectIds = []
      this.addNodeVisible = true
    },
    confirmAddNodes() {
      const startX = 120 + this.nodes.length * 20
      const startY = 80
      this.pickedObjectIds.forEach((id, i) => {
        const sid = this.sid(id)
        if (!sid || this.nodeMap[sid]) return
        const obj = this.objectOptions.find(o => this.sid(o.id) === sid) || {}
        this.nodes.push({
          stcd: sid,
          stnm: obj.name || sid,
          x: startX + (i % 4) * 120,
          y: startY + Math.floor(i / 4) * 90
        })
      })
      this.addNodeVisible = false
      this.dirty = true
      this.persistLayout()
    },
    onCanvasMouseDown(e) {
      if (this.mode === 'addNode') {
        const pt = this.toSvgPoint(e)
        const stcd = `NODE_${Date.now().toString().slice(-6)}`
        this.nodes.push({ stcd, stnm: '自定义节点', x: pt.x, y: pt.y })
        this.selectedNodeId = stcd
        this.selectedEdgeKey = null
        this.dirty = true
        this.persistLayout()
        return
      }
      this.selectedNodeId = null
      this.selectedEdgeKey = null
      if (this.mode === 'connect') {
        this.connectingFrom = null
        this.connectPreview = null
      }
    },
    onNodeMouseDown(node, e) {
      if (this.mode === 'connect') {
        if (!this.connectingFrom) {
          this.connectingFrom = node
          this.connectPreview = { x: node.x, y: node.y }
        } else if (this.connectingFrom.stcd !== node.stcd) {
          this.createEdge(this.connectingFrom, node)
          this.connectingFrom = null
          this.connectPreview = null
        }
        return
      }
      this.selectedNodeId = node.stcd
      this.selectedEdgeKey = null
      const pt = this.toSvgPoint(e)
      this.dragging = {
        stcd: node.stcd,
        ox: pt.x,
        oy: pt.y,
        nx: node.x,
        ny: node.y
      }
    },
    onEdgeMouseDown(edge) {
      this.selectedEdgeKey = edge.key
      this.selectedNodeId = null
      this.connectingFrom = null
    },
    onCanvasMouseMove(e) {
      const pt = this.toSvgPoint(e)
      if (this.mode === 'connect' && this.connectingFrom) {
        this.connectPreview = pt
        return
      }
      if (!this.dragging) return
      const node = this.nodeMap[this.dragging.stcd]
      if (!node) return
      node.x = this.dragging.nx + (pt.x - this.dragging.ox)
      node.y = this.dragging.ny + (pt.y - this.dragging.oy)
      this.dirty = true
    },
    onCanvasMouseUp() {
      if (this.dragging) {
        this.persistLayout()
        this.dragging = null
      }
    },
    toSvgPoint(e) {
      const el = this.$refs.canvasWrap
      const rect = el.getBoundingClientRect()
      return {
        x: e.clientX - rect.left + el.scrollLeft,
        y: e.clientY - rect.top + el.scrollTop
      }
    },
    createEdge(from, to) {
      const exists = this.edges.some(e => e.upstreamStcd === from.stcd && e.downstreamStcd === to.stcd)
      if (exists) {
        this.$message.warning('该河段已存在')
        return
      }
      const edge = {
        key: this.edgeKey(from.stcd, to.stcd, 0),
        id: 0,
        upstreamStcd: from.stcd,
        upstreamStnm: from.stnm,
        downstreamStcd: to.stcd,
        downstreamStnm: to.stnm,
        flowTransferType: 'outflow',
        flowTransferRatio: 1,
        delayTimeH: 1,
        distanceKm: null,
        orderIndex: this.edges.length + 1,
        attenuationCoeff: 1,
        remark: ''
      }
      this.edges.push(edge)
      this.selectedEdgeKey = edge.key
      this.dirty = true
      this.$message.success('已添加河段，请在右侧完善参数后保存')
    },
    deleteSelected() {
      if (this.selectedEdgeKey) {
        const edge = this.selectedEdge
        if (edge && edge.id) this.pendingDeleteIds.push(edge.id)
        this.edges = this.edges.filter(e => e.key !== this.selectedEdgeKey)
        this.selectedEdgeKey = null
        this.dirty = true
        return
      }
      if (this.selectedNodeId) {
        if (this.selectedNodeId === this.sid(this.rootStcd)) {
          this.$message.warning('根站不可删除')
          return
        }
        const stcd = this.selectedNodeId
        const related = this.edges.filter(e => e.upstreamStcd === stcd || e.downstreamStcd === stcd)
        related.forEach(e => { if (e.id) this.pendingDeleteIds.push(e.id) })
        this.edges = this.edges.filter(e => e.upstreamStcd !== stcd && e.downstreamStcd !== stcd)
        this.nodes = this.nodes.filter(n => n.stcd !== stcd)
        this.selectedNodeId = null
        this.dirty = true
        this.persistLayout()
      }
    },
    async saveAll() {

      this.edges.forEach(e => {
        const up = this.nodeMap[e.upstreamStcd]
        const down = this.nodeMap[e.downstreamStcd]
        if (up) e.upstreamStnm = up.stnm
        if (down) e.downstreamStnm = down.stnm
      })
      const invalid = this.edges.find(e => !e.upstreamStcd || !e.downstreamStcd)
      if (invalid) {
        this.$message.warning('存在不完整河段')
        return
      }
      this.saving = true
      try {
        for (const id of this.pendingDeleteIds) {
          await Api.reachRelRemove(id)
        }
        this.pendingDeleteIds = []
        const payload = this.edges.map(e => ({
          id: e.id || 0,
          upstreamStcd: e.upstreamStcd,
          upstreamStnm: e.upstreamStnm,
          downstreamStcd: e.downstreamStcd,
          downstreamStnm: e.downstreamStnm,
          flowTransferType: e.flowTransferType,
          flowTransferRatio: e.flowTransferRatio,
          delayTimeH: e.delayTimeH,
          distanceKm: e.distanceKm,
          orderIndex: e.orderIndex,
          attenuationCoeff: e.attenuationCoeff,
          remark: e.remark
        }))
        const res = await Api.reachRelBatchSave(payload)
        if (res.code === 200) {
          this.$message.success(`拓扑已保存（${res.result || payload.length} 条河段）`)
          this.persistLayout()
          this.dirty = false
          await this.reload()
          this.$emit('saved')
        } else {
          this.$message.error(res.message || '保存失败')
        }
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.topo-editor {
  height: 100%;
  min-height: 480px;
  display: flex;
  flex-direction: column;
  color: #e8f7ff;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  .hint {
    margin-left: 8px;
    color: #7fb4d3;
    font-size: 12px;
  }
}
.workspace {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 10px;
}
.canvas-wrap {
  flex: 1;
  min-width: 0;
  border: 1px solid rgba(52, 220, 255, 0.25);
  border-radius: 4px;
  background:
    linear-gradient(rgba(14, 193, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14, 193, 255, 0.05) 1px, transparent 1px),
    rgba(4, 24, 42, 0.9);
  background-size: 24px 24px, 24px 24px, auto;
  overflow: auto;
  cursor: crosshair;
}
.topo-svg {
  display: block;
}
.node circle {
  fill: rgba(14, 80, 120, 0.95);
  stroke: #34DCFF;
  stroke-width: 2;
  cursor: grab;
}
.node.root circle {
  fill: rgba(255, 102, 68, 0.35);
  stroke: #FF6644;
}
.node.active circle {
  stroke: #FFB020;
  stroke-width: 3;
  filter: drop-shadow(0 0 6px rgba(255, 176, 32, 0.6));
}
.node-code {
  fill: #fff;
  font-size: 10px;
  pointer-events: none;
}
.node-name {
  fill: #9ed7ef;
  font-size: 11px;
  pointer-events: none;
}
.edge {
  cursor: pointer;
}
.edge-hit {
  stroke: transparent;
  stroke-width: 14;
}
.edge-line {
  pointer-events: none;
}
.edge-label {
  fill: #8ecae6;
  font-size: 11px;
  pointer-events: none;
}
.side-panel {
  width: 280px;
  flex-shrink: 0;
  border: 1px solid rgba(52, 220, 255, 0.25);
  border-radius: 4px;
  padding: 12px;
  background: rgba(8, 30, 50, 0.85);
  overflow: auto;
  h4 {
    margin: 0 0 12px;
    color: #34DCFF;
    font-size: 15px;
  }
  .tips {
    font-size: 12px;
    line-height: 1.7;
    color: #9bb8c9;
  }
  .stats {
    margin-top: 12px;
    color: #34DCFF;
    font-size: 12px;
  }
}
</style>
