<template>
  <div class="tab-con">
    <div class="tit-center">
      <div class="metric-item">
        <p class="metric-label">当前水位</p>
        <p class="metric-value">{{ formatNum(newRiver.rz) }} m</p>
      </div>
      <div class="border"></div>
      <div class="metric-item">
        <p class="metric-label">当前库容</p>
        <p class="metric-value">{{ formatCapacity(w) }}</p>
      </div>
      <div class="border"></div>
      <div class="metric-item">
        <p class="metric-label">汛限水位</p>
        <p class="metric-value">{{ formatNum(getListStRsvrfsrBMsg.fsltdz) }} m</p>
      </div>
      <div class="border"></div>
      <div class="metric-item">
        <p class="metric-label">设计 / 校核</p>
        <p class="metric-value metric-value--sm">
          {{ formatNum(getStRsvrfcchMsg.dsflz) }} / {{ formatNum(getStRsvrfcchMsg.ckflz) }} m
        </p>
      </div>
    </div>

    <div class="chart-row">
      <div class="chart-box">
        <div class="chart" ref="rsvrLineChartRef"></div>
      </div>
      <aside class="rain-side" title="至特征水位尚可承接的流域面雨量">
        <div class="rain-side__title">可纳面雨量</div>
        <div class="rain-row rain-row--flood">
          <span class="rain-row__label">至汛限</span>
          <span class="rain-row__value">{{ fsltdzRain }}<em>mm</em></span>
        </div>
        <div class="rain-row rain-row--design">
          <span class="rain-row__label">至设计</span>
          <span class="rain-row__value">{{ desRain }}<em>mm</em></span>
        </div>
        <div class="rain-row rain-row--check">
          <span class="rain-row__label">至校核</span>
          <span class="rain-row__value">{{ checkRain }}<em>mm</em></span>
        </div>
      </aside>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Api from '@/api'
import dayjs from 'dayjs'
import SimpleChart from '@/components/charts/SimpleChart'

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
      newRiver: {},
      getStRsvrfcchMsg: {},
      getListStRsvrfsrBMsg: {},
      fsltdzRain: '--',
      desRain: '--',
      checkRain: '--',
      drna: null,
      runoffRatio: null,
      w: null,
      fsltdW: null,
      desW: null,
      checkW: null,
      rsvrLineChart: null
    }
  },
  methods: {
    formatNum(v) {
      if (v === null || v === undefined || v === '' || Number.isNaN(Number(v))) {
        return '--'
      }
      return Number(v)
    },
    formatCapacity(v) {
      if (v === null || v === undefined || v === '' || Number(v) === 0 || Number.isNaN(Number(v))) {
        return '--'
      }
      return `${Math.round(Number(v) * 10) / 10} 万m³`
    },
    pickOne(result) {
      if (Array.isArray(result)) {
        return result[0] || {}
      }
      return result || {}
    },
    
    sortByTimeAsc(rows) {
      if (!Array.isArray(rows) || rows.length < 2) {
        return rows || []
      }
      return [...rows].sort((a, b) => dayjs(a.tm).valueOf() - dayjs(b.tm).valueOf())
    },
    buildQuery() {
      const stcd = this.options.stcd
      const queryParam = this.options.queryParam || {}
      return {
        stcd,

        stcdList: stcd ? [stcd] : undefined,
        ...queryParam
      }
    },
    async getNew() {
      const query = this.buildQuery()
      const res = await Api.getNewRsvr(query)
      this.newRiver = this.pickOne(res.result)
      if (this.newRiver.rz === null || this.newRiver.rz === undefined || this.newRiver.rz === '') {
        this.w = null
        return null
      }
      const wRes = await Api.getRsvrRw({ stcd: this.options.stcd, rz: this.newRiver.rz })
      this.w = wRes.result
      return this.w
    },
    async addDsflzCkflz(waterChart) {
      let dsflz = null
      let ckflz = null
      let fsltdz = null

      try {
        const oneRes = await Api.getOneReservoir({ stcd: this.options.stcd })
        if (oneRes.result) {
          this.runoffRatio = oneRes.result.runoffRatio
          this.drna = oneRes.result.drna
        } else {
          this.runoffRatio = null
          this.drna = null
        }
      } catch (e) {
        this.runoffRatio = null
        this.drna = null
      }

      const fcchRes = await Api.listStRsvrfcchB({ stcd: this.options.stcd })
      if (fcchRes.result && fcchRes.result.length > 0) {
        this.getStRsvrfcchMsg = fcchRes.result[0] || {}
        dsflz = this.getStRsvrfcchMsg.dsflz || null
        ckflz = this.getStRsvrfcchMsg.ckflz || null
        dsflz && waterChart.addDsflz(dsflz)
        ckflz && waterChart.addCkflz(ckflz)
      } else {
        this.getStRsvrfcchMsg = {}
      }

      const fsrRes = await Api.listStRsvrfsrB({ stcd: this.options.stcd })
      if (fsrRes.result && fsrRes.result.length > 0) {
        this.getListStRsvrfsrBMsg = fsrRes.result[0] || {}
        fsltdz = this.getListStRsvrfsrBMsg.fsltdz || null
        fsltdz && waterChart.addFsltdz(fsltdz)
      } else {
        this.getListStRsvrfsrBMsg = {}
      }

      const dataMin = waterChart.y && waterChart.y.length
        ? Math.min(...waterChart.y.filter((v) => v !== null && v !== undefined && v !== ''))
        : null
      const dataMax = waterChart.y && waterChart.y.length
        ? Math.max(...waterChart.y.filter((v) => v !== null && v !== undefined && v !== ''))
        : null

      let minZ = dataMin
      let maxZ = dataMax
      try {
        const mmRes = await Api.getMinMax({ stcd: this.options.stcd, queryType: 'RESERVOIR' })
        if (mmRes && mmRes.result) {
          minZ = Math.min(...[dsflz, ckflz, fsltdz, mmRes.result.minZ, mmRes.result.maxZ, dataMin].filter((v) => v !== null && v !== undefined && v !== ''))
          maxZ = Math.max(...[dsflz, ckflz, fsltdz, mmRes.result.minZ, mmRes.result.maxZ, dataMax].filter((v) => v !== null && v !== undefined && v !== ''))
        }
      } catch (e) {
        const vals = [dsflz, ckflz, fsltdz, dataMin, dataMax].filter((v) => v !== null && v !== undefined && v !== '')
        if (vals.length) {
          minZ = Math.min(...vals)
          maxZ = Math.max(...vals)
        }
      }
      if (minZ !== null && maxZ !== null && !Number.isNaN(minZ) && !Number.isNaN(maxZ)) {
        waterChart.setMaxMin({ minZ, maxZ })
      }

      const tasks = []
      if (fsltdz) {
        tasks.push(Api.getRsvrRw({ stcd: this.options.stcd, rz: fsltdz }).then((r) => { this.fsltdW = r.result }))
      }
      if (dsflz) {
        tasks.push(Api.getRsvrRw({ stcd: this.options.stcd, rz: dsflz }).then((r) => { this.desW = r.result }))
      }
      if (ckflz) {
        tasks.push(Api.getRsvrRw({ stcd: this.options.stcd, rz: ckflz }).then((r) => { this.checkW = r.result }))
      }
      await Promise.all(tasks)
      await this.getRain()
    },
    getZList() {
      const query = this.buildQuery()
      Api.listRsvr(query).then((res) => {
        if (this.rsvrLineChart) {
          this.rsvrLineChart.dispose()
        }
        this.rsvrLineChart = this.$eCharts.init(this.$refs.rsvrLineChartRef)
        const result = this.sortByTimeAsc(res.result || [])
        const rz = []
        const tm = []
        for (let i = 0; i < result.length; i++) {
          const data = result[i]
          rz.push(data.rz)
          tm.push(dayjs(data.tm).format('MM-DD HH:mm'))
        }
        const waterChart = new SimpleChart(rz, tm, this.rsvrLineChart)
        const legendconf = {
          legend: {
            data: ['水位', '校核水位', '设计水位', '汛限水位']
          }
        }
        waterChart.init('时间', '水位', legendconf)
        this.addDsflzCkflz(waterChart)
        this.$nextTick(() => {
          this.rsvrLineChart && this.rsvrLineChart.resize()
        })
      })
    },
    calcRain(targetW, currentW) {
      const drna = Number(this.drna)
      const ratio = Number(this.runoffRatio)
      if (
        targetW === null || targetW === undefined ||
        currentW === null || currentW === undefined ||
        !drna || !ratio ||
        Number.isNaN(drna) || Number.isNaN(ratio)
      ) {
        return '--'
      }
      const rain = ((Number(targetW) - Number(currentW)) * 10000) / (drna * 1000000) / ratio * 1000
      if (!Number.isFinite(rain)) {
        return '--'
      }
      if (rain < 0) {
        return '0.0'
      }
      if (Math.abs(rain) < 0.05) {
        return '--'
      }
      return this.toDecimal(rain)
    },
    async getRain() {
      const currentW = await this.getNew()
      this.fsltdzRain = this.calcRain(this.fsltdW, currentW)
      this.desRain = this.calcRain(this.desW, currentW)
      this.checkRain = this.calcRain(this.checkW, currentW)
    },
    toDecimal(x) {
      const f = Math.round(Number(x) * 10) / 10
      let s = f.toString()
      const rs = s.indexOf('.')
      if (rs < 0) {
        s += '.0'
      }
      return s
    }
  },
  watch: {
    options: {
      handler() {
        this.getNew()
        this.getZList()
      },
      immediate: true
    }
  },
  beforeDestroy() {
    if (this.rsvrLineChart) {
      this.rsvrLineChart.dispose()
      this.rsvrLineChart = null
    }
  }
}
</script>
<style type="text/scss" lang="scss" scoped>
.tab-con {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;

  .tit-center {
    flex: 0 0 auto;
    width: 100%;
    max-width: 100%;
    height: 58px;
    box-sizing: border-box;
    background: rgba(0, 16, 30, 0.72);
    border-radius: 6px;
    border: 1px solid rgba(0, 255, 246, 0.24);
    margin: 0 0 8px;
    display: flex;
    justify-content: space-around;
    align-items: stretch;
    padding: 4px 0;
    overflow: hidden;

    .metric-item {
      flex: 1 1 0;
      min-width: 0;
      overflow: hidden;
    }

    .border {
      flex: 0 0 1px;
      width: 1px;
      margin: 10px 0;
      background: rgba(0, 255, 246, 0.2);
    }

    .metric-label,
    .metric-value {
      margin: 0;
      text-align: center;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei, sans-serif;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .metric-label {
      font-size: 12px;
      line-height: 22px;
      color: rgba(255, 255, 255, 0.72);
      font-weight: 400;
    }

    .metric-value {
      font-size: 14px;
      line-height: 26px;
      color: #00fff6;
      font-weight: 600;

      &--sm {
        font-size: 12px;
      }
    }
  }

  .chart-row {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 8px;
  }

  .chart-box {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    position: relative;

    .chart {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  }
}

.rain-side {
  flex: 0 0 auto;
  align-self: center;
  width: auto;
  min-width: 72px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 2px 0 2px 4px;
  box-sizing: border-box;
  background: none;
  border: none;

  &__title {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.55);
    font-weight: 500;
    white-space: nowrap;
    letter-spacing: 0.02em;
  }
}

.rain-row {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 0;
  background: none;
  border: none;

  &__label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.45);
    line-height: 1.2;
    white-space: nowrap;
  }

  &__value {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.2;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;

    em {
      margin-left: 2px;
      font-size: 10px;
      font-style: normal;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.4);
    }
  }

  &--flood .rain-row__value { color: #3dff9a; }
  &--design .rain-row__value { color: #ffd34d; }
  &--check .rain-row__value { color: #ff7b7b; }
}
</style>
