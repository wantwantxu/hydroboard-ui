<template>
  <div class="station-archive">
    
    <div class="archive-head">
      <div class="archive-title">
        <h3>{{ info.stnm || '--' }}</h3>
        <span class="badge">{{ info.sttpName || sttpName }}</span>
        <span class="badge badge--muted">{{ info.stcd || '--' }}</span>
      </div>
      <p class="archive-sub">
        {{ info.locality || '--' }} · {{ info.atcunit || info.admauth || '--' }}
      </p>
    </div>

    
    <ul class="archive-tabs">
      <li
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >{{ tab.label }}</li>
    </ul>

    
    <div class="archive-body">
      
      <div v-show="activeTab === 'basic'" class="panel">
        <div class="kv-grid">
          <div class="kv"><span class="k">站名</span><span class="v">{{ info.stnm || '--' }}</span></div>
          <div class="kv"><span class="k">站码</span><span class="v">{{ info.stcd || '--' }}</span></div>
          <div class="kv"><span class="k">站类</span><span class="v">{{ info.sttpName || sttpName }}</span></div>
          <div class="kv"><span class="k">站级</span><span class="v">{{ info.frgrd || '--' }}</span></div>
          <div class="kv"><span class="k">设站年月</span><span class="v">{{ info.esstym || '--' }}</span></div>
          <div class="kv"><span class="k">始报年月</span><span class="v">{{ info.bgfrym || '--' }}</span></div>
          <div class="kv"><span class="k">所属河流</span><span class="v">{{ info.rvnm || '--' }}</span></div>
          <div class="kv"><span class="k">所属水系</span><span class="v">{{ info.hnnm || '--' }}</span></div>
          <div class="kv"><span class="k">所属流域</span><span class="v">{{ info.bsnm || '--' }}</span></div>
          <div class="kv"><span class="k">集水面积</span><span class="v">{{ fmtArea(info.drna) }}</span></div>
          <div class="kv"><span class="k">经度</span><span class="v">{{ info.lgtd || '--' }}</span></div>
          <div class="kv"><span class="k">纬度</span><span class="v">{{ info.lttd || '--' }}</span></div>
          <div class="kv"><span class="k">岸别</span><span class="v">{{ info.stbk || '--' }}</span></div>
          <div class="kv"><span class="k">至河口距离</span><span class="v">{{ info.dstrvm != null ? info.dstrvm + ' km' : '--' }}</span></div>
          <div class="kv kv--full"><span class="k">站址</span><span class="v">{{ info.stlc || '--' }}</span></div>
          <div class="kv kv--full"><span class="k">管理单位</span><span class="v">{{ info.admauth || info.atcunit || '--' }}</span></div>
        </div>
      </div>

      
      <div v-show="activeTab === 'monitor'" class="panel">
        <el-table :data="monitorItems" size="mini" stripe max-height="100%" class="archive-table">
          <el-table-column type="index" label="序号" width="50" align="center"/>
          <el-table-column prop="name" label="监测项目" min-width="80" show-overflow-tooltip/>
          <el-table-column prop="equip" label="主要仪器" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="method" label="观测方式" width="90" align="center"/>
          <el-table-column prop="freq" label="观测频次" width="90" align="center"/>
          <el-table-column prop="status" label="状态" width="70" align="center">
            <template slot-scope="{ row }">
              <span class="status-ok">{{ row.status }}</span>
            </template>
          </el-table-column>
        </el-table>
        <p v-if="!monitorItems.length" class="empty">暂无监测项目配置</p>
      </div>

      <!-- 洪水指标 -->
      <div v-show="activeTab === 'flood'" class="panel">
        <div class="index-grid">
          <div v-for="(item, idx) in floodIndex" :key="idx" class="index-card">
            <div class="index-label">{{ item.label }}</div>
            <div class="index-value">
              {{ item.value }}<em v-if="item.unit">{{ item.unit }}</em>
            </div>
          </div>
        </div>
        <p v-if="!floodIndex.length" class="empty">暂无洪水/特征指标</p>
      </div>

      <!-- 历史沿革 -->
      <div v-show="activeTab === 'history'" class="panel">
        <ul class="timeline">
          <li v-for="(item, idx) in history" :key="idx">
            <span class="year">{{ item.year }}</span>
            <span class="event">{{ item.event }}</span>
          </li>
        </ul>
        <p v-if="!history.length" class="empty">暂无沿革记录</p>
      </div>

      <!-- 站点资料 -->
      <div v-show="activeTab === 'files'" class="panel">
        <el-table :data="materials" size="mini" stripe max-height="100%" class="archive-table">
          <el-table-column type="index" label="序号" width="50" align="center"/>
          <el-table-column prop="name" label="资料名称" min-width="140" show-overflow-tooltip/>
          <el-table-column prop="type" label="格式" width="60" align="center"/>
          <el-table-column prop="size" label="大小" width="80" align="center"/>
          <el-table-column prop="date" label="归档日期" width="100" align="center"/>
        </el-table>
        <p v-if="!materials.length" class="empty">暂无归档资料</p>
      </div>

      <!-- 站址照片 -->
      <div v-show="activeTab === 'photos'" class="panel">
        <div class="photo-grid">
          <figure v-for="(p, idx) in photos" :key="idx" class="photo-card" @click="previewPhoto(p)">
            <div class="photo-thumb" :style="{ backgroundImage: `url(${p.url})` }"></div>
            <figcaption>{{ p.title }}</figcaption>
          </figure>
        </div>
        <p v-if="!photos.length" class="empty">暂无站址照片</p>
      </div>
    </div>

    <el-dialog
      :visible.sync="previewVisible"
      :title="previewTitle"
      append-to-body
      width="640px"
      custom-class="station-photo-dialog"
      @opened="liftPreviewLayer"
    >
      <img v-if="previewUrl" :src="previewUrl" alt="" class="preview-img">
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Api from '@/api'

const STTP_NAME = {
  PP: '雨量站', ZQ: '水文站', ZZ: '水位站', ZP: '水位雨量站',
  RR: '水库水文站', RP: '水库雨量站', PB: '山洪雨量站', ZC: '山洪水位站', ZD: '山洪水位雨量站'
}

export default {
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      activeTab: 'basic',
      info: {},
      floodExtra: {},
      tabs: [
        { key: 'basic', label: '基本信息' },
        { key: 'monitor', label: '监测项目' },
        { key: 'flood', label: '洪水指标' },
        { key: 'history', label: '历史沿革' },
        { key: 'files', label: '站点资料' },
        { key: 'photos', label: '站址照片' }
      ],
      previewVisible: false,
      previewUrl: '',
      previewTitle: ''
    }
  },
  computed: {
    sttpName() {
      return STTP_NAME[this.info.sttp] || STTP_NAME[this.options && this.options.sttp] || '测站'
    },
    monitorItems() {
      return this.info.monitorItems || []
    },
    floodIndex() {
      if (Array.isArray(this.info.floodIndex) && this.info.floodIndex.length) {
        return this.info.floodIndex
      }

      const e = this.floodExtra || {}
      const rows = []
      if (e.wrz != null) rows.push({ label: '警戒水位', value: e.wrz, unit: 'm' })
      if (e.grz != null) rows.push({ label: '保证水位', value: e.grz, unit: 'm' })
      if (e.hlz != null) rows.push({ label: '历史最低', value: e.hlz, unit: 'm' })
      if (e.fsltdz != null) rows.push({ label: '汛限水位', value: e.fsltdz, unit: 'm' })
      if (e.normz != null) rows.push({ label: '正常蓄水位', value: e.normz, unit: 'm' })
      if (e.dsflz != null) rows.push({ label: '设计洪水位', value: e.dsflz, unit: 'm' })
      if (e.ckflz != null) rows.push({ label: '校核洪水位', value: e.ckflz, unit: 'm' })
      return rows
    },
    history() {
      return this.info.history || []
    },
    materials() {
      return this.info.materials || []
    },
    photos() {
      return this.info.photos || []
    }
  },
  methods: {
    fmtArea(v) {
      if (v === null || v === undefined || v === '') return '--'
      return `${v} km²`
    },
    previewPhoto(p) {
      this.previewUrl = p.url
      this.previewTitle = p.title || '站址照片'
      this.previewVisible = true
    },

    liftPreviewLayer() {
      const z = 20050
      document.querySelectorAll('.el-dialog__wrapper').forEach((wrap) => {
        if (wrap.querySelector('.station-photo-dialog')) {
          wrap.style.zIndex = String(z + 1)
        }
      })
      const modals = document.querySelectorAll('body > .v-modal')
      if (modals.length) {
        modals[modals.length - 1].style.zIndex = String(z)
      }
    },
    async getInfo() {
      const stcd = this.options && this.options.stcd
      if (!stcd) {
        this.info = {}
        return
      }
      this.activeTab = 'basic'
      try {
        const res = await Api.getStationInfo({ stcd })
        this.info = (res && res.result) || {}
      } catch (e) {
        this.info = {
          stcd,
          stnm: this.options.stnm || this.options.name,
          sttp: this.options.sttp
        }
      }
      this.loadFloodExtra(stcd)
    },
    loadFloodExtra(stcd) {
      const sttp = (this.info && this.info.sttp) || (this.options && this.options.sttp)
      const isRsvr = sttp === 'RR' || sttp === 'RP'
      const req = isRsvr
        ? Promise.all([
          Api.listStRsvrfcchB({ stcd }),
          Api.listStRsvrfsrB({ stcd })
        ]).then(([a, b]) => ({
          ...(a.result && a.result[0]) || {},
          ...(b.result && b.result[0]) || {}
        }))
        : Api.listStRvfcchB({ stcd }).then((r) => (r.result && r.result[0]) || {})

      req.then((extra) => {
        this.floodExtra = extra || {}
      }).catch(() => {
        this.floodExtra = {}
      })
    }
  },
  watch: {
    options: {
      handler() {
        this.getInfo()
      },
      immediate: true
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.station-archive {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0 2px;
}

.archive-head {
  flex: 0 0 auto;
  margin-bottom: 8px;
  padding: 8px 10px;
  background: rgba(0, 16, 30, 0.55);
  border: 1px solid rgba(0, 255, 246, 0.18);
  border-radius: 6px;
}

.archive-title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.badge {
  flex: 0 0 auto;
  height: 20px;
  line-height: 20px;
  padding: 0 8px;
  border-radius: 2px;
  font-size: 11px;
  color: #00141e;
  background: #00fff6;
  white-space: nowrap;

  &--muted {
    background: rgba(0, 255, 246, 0.14);
    color: #9ad8e0;
    border: 1px solid rgba(0, 255, 246, 0.25);
  }
}

.archive-sub {
  margin: 6px 0 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.archive-tabs {
  flex: 0 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 0 0 8px;
  padding: 0;
  list-style: none;

  li {
    flex: 0 0 auto;
    height: 26px;
    line-height: 26px;
    padding: 0 8px;
    border: 1px solid rgba(0, 255, 246, 0.4);
    border-radius: 2px;
    color: #00fff6;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
    transition: all 0.2s;

    &:hover {
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

.archive-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

.panel {
  height: 100%;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 2px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 246, 0.28);
    border-radius: 4px;
  }
}

.kv-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 12px;
}

.kv {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
  padding: 4px 0;
  border-bottom: 1px dashed rgba(0, 255, 246, 0.1);

  &--full {
    grid-column: 1 / -1;
  }

  .k {
    flex: 0 0 5.5em;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    white-space: nowrap;
  }

  .v {
    flex: 1 1 auto;
    min-width: 0;
    font-size: 13px;
    color: #00fff6;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.index-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.index-card {
  padding: 10px 8px;
  background: rgba(0, 24, 36, 0.55);
  border: 1px solid rgba(0, 255, 246, 0.14);
  border-radius: 4px;
  text-align: center;
}

.index-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 4px;
}

.index-value {
  font-size: 18px;
  font-weight: 700;
  color: #00fff6;
  font-variant-numeric: tabular-nums;
  line-height: 1.2;

  em {
    margin-left: 2px;
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.45);
  }
}

.timeline {
  margin: 0;
  padding: 4px 0 4px 14px;
  list-style: none;
  border-left: 2px solid rgba(0, 255, 246, 0.25);

  li {
    position: relative;
    padding: 0 0 14px 12px;

    &:last-child {
      padding-bottom: 0;
    }

    &::before {
      content: '';
      position: absolute;
      left: -19px;
      top: 5px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #00fff6;
      box-shadow: 0 0 6px rgba(0, 255, 246, 0.6);
    }
  }

  .year {
    display: inline-block;
    min-width: 3.2em;
    margin-right: 8px;
    color: #ffd34d;
    font-weight: 600;
    font-size: 13px;
  }

  .event {
    color: rgba(255, 255, 255, 0.82);
    font-size: 13px;
    line-height: 1.5;
  }
}

.photo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.photo-card {
  margin: 0;
  cursor: pointer;
  border: 1px solid rgba(0, 255, 246, 0.16);
  border-radius: 4px;
  overflow: hidden;
  background: rgba(0, 16, 30, 0.45);
  transition: border-color 0.2s;

  &:hover {
    border-color: rgba(0, 255, 246, 0.5);
  }

  figcaption {
    padding: 6px 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
  }
}

.photo-thumb {
  height: 88px;
  background: center / cover no-repeat rgba(0, 40, 55, 0.4);
}

.status-ok {
  color: #3dff9a;
}

.empty {
  margin: 24px 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
}

.archive-table {
  width: 100%;
}

.preview-img {
  display: block;
  width: 100%;
  max-height: 420px;
  object-fit: contain;
  background: #001018;
}
</style>
