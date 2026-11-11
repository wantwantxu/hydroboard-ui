<template>
  <div ref="fullscreenTarget" class="water-report-container">
    <div class="toolbar">
      <div class="left-tools">
        <span class="fullscreen-btn" :title="isFullscreen ? '退出全屏' : '全屏显示'" @click="handleToggleFullscreen">
          <i class="el-icon-full-screen"></i>
        </span>
        <div class="query-item">
          <span class="label">查询年份：</span>
          <el-date-picker
            v-model="queryYear"
            type="year"
            placeholder="选择年份"
            value-format="yyyy"
            @change="handleYearChange"
          />
        </div>
      </div>
      <div class="actions">
        <el-button type="primary" size="mini" @click="handleInit">刷新数据</el-button>
        <el-button type="success" size="mini" @click="exportExcel">导出报表</el-button>
      </div>
    </div>

    <div ref="reportTable" class="table-box scroll">
      <table class="water-table">
        <colgroup>
          <col class="col-stat" />
          <col class="col-date" />
          <col v-for="m in 12" :key="'gpq-col-' + m" class="col-month" />
        </colgroup>
        <thead>
          <tr>
            <th colspan="14" class="table-title">{{ options.stnm || options.gpName || '-' }} 流量日报表 ({{ queryYear }}年)</th>
          </tr>
          <tr class="info-row">
            <th colspan="2">年份：{{ queryYear }}</th>
            <th colspan="3">对象编码：{{ options.gpId || options.stcd || '-' }}</th>
            <th colspan="5">表内流量 (立方米每秒)</th>
            <th colspan="4">基面：假定基面</th>
          </tr>
          <tr class="header-row">
            <th colspan="2">日期 \ 月份</th>
            <th v-for="m in 12" :key="m" class="month-col">{{ m }}月</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="day in 31" :key="day">
            <td colspan="2" class="date-label">{{ formatDayLabel(day) }}</td>
            <td v-for="month in 12" :key="month">{{ getDayValue(month, day) }}</td>
          </tr>

          <tr class="stats-row">
            <td rowspan="5" class="stats-label">月统计</td>
            <td class="sub-label">平均</td>
            <td v-for="m in 12" :key="'avg-' + m">{{ getMonthStat(m, 'monthAvg') }}</td>
          </tr>
          <tr class="stats-row">
            <td class="sub-label">最大</td>
            <td v-for="m in 12" :key="'max-' + m">{{ getMonthStat(m, 'monthMax') }}</td>
          </tr>
          <tr class="stats-row date-row">
            <td class="sub-label">日期</td>
            <td v-for="m in 12" :key="'max-date-' + m"><span class="date-val">{{ getMonthStat(m, 'monthMaxDate') }}</span></td>
          </tr>
          <tr class="stats-row">
            <td class="sub-label">最小</td>
            <td v-for="m in 12" :key="'min-' + m">{{ getMonthStat(m, 'monthMin') }}</td>
          </tr>
          <tr class="stats-row date-row">
            <td class="sub-label">日期</td>
            <td v-for="m in 12" :key="'min-date-' + m"><span class="date-val">{{ getMonthStat(m, 'monthMinDate') }}</span></td>
          </tr>

          <tr class="yearly-row">
            <td colspan="2">年统计</td>
            <td colspan="4">最高流量：{{ getYearStat('yearMax') }}</td>
            <td colspan="4">最低流量：{{ getYearStat('yearMin') }}</td>
            <td colspan="4">平均流量：{{ getYearStat('yearAvg') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Api from '../../../api'
import dayjs from 'dayjs'

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
      queryYear: dayjs().format('YYYY'),
      isFullscreen: false,
      resultData: {
        monthlyData: {},
        monthlyStats: {},
        yearlyStats: {}
      },
      legacyRows: []
    }
  },
  methods: {
    handleInit() {
      const year = String(this.queryYear)
      const startDate = year + '-01-01 00:00:00'
      const endDate = year + '-12-31 23:59:59'

      Api.listGpFlowYear({ gpId: this.options.gpId, year, startDate, endDate }).then((res) => {
        if (!res || res.code !== 200) {
          this.$message.error((res && res.message) || '获取数据失败')
          return
        }

        const result = res.result
        if (Array.isArray(result)) {
          this.legacyRows = result
          this.resultData = { monthlyData: {}, monthlyStats: {}, yearlyStats: {} }
        } else {
          this.legacyRows = []
          this.resultData = {
            monthlyData: (result && result.monthlyData) || {},
            monthlyStats: (result && result.monthlyStats) || {},
            yearlyStats: (result && result.yearlyStats) || {}
          }
        }
      }).catch(() => {
        this.$message.error('获取数据失败')
      })
    },

    getLegacyFieldByMonth(month) {
      const fields = {
        1: 'dataOfJan',
        2: 'dataOfFeb',
        3: 'dataOfMar',
        4: 'dataOfApr',
        5: 'dataOfMay',
        6: 'dataOfJune',
        7: 'dataOfJuly',
        8: 'dataOfAug',
        9: 'dataOfSept',
        10: 'dataOfOct',
        11: 'dataOfNov',
        12: 'dataOfDec'
      }
      return fields[month]
    },

    getDayValue(month, day) {
      const monthData = this.resultData.monthlyData[String(month)]
      if (monthData && Array.isArray(monthData)) {
        const dayItem = monthData.find((item) => item.day === day)
        if (!dayItem) return '-'
        const qVal = dayItem.avgQ !== undefined ? dayItem.avgQ : dayItem.avgZ
        if (qVal === null || qVal === undefined) return '-'
        return Number(qVal).toFixed(2)
      }

      if (!this.legacyRows.length) return '-'
      const row = this.legacyRows[day - 1]
      if (!row) return '-'
      const field = this.getLegacyFieldByMonth(month)
      const val = row[field]
      if (val === null || val === undefined || val === '') return '-'
      return Number(val).toFixed(2)
    },

    formatDayLabel(day) {
      return String(day).padStart(2, '0') + '日'
    },

    formatStatDate(val) {
      if (Array.isArray(val)) {
        const year = val[0]
        const month = val[1]
        const day = val[2]
        if (!year || !month || !day) return '-'
        const parsed = dayjs(year + '-' + month + '-' + day)
        if (parsed.isValid()) return parsed.format('MM-DD')
        return String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0')
      }

      const parsed = dayjs(val)
      return parsed.isValid() ? parsed.format('MM-DD') : '-'
    },

    getLegacyMonthValues(month) {
      const field = this.getLegacyFieldByMonth(month)
      const result = []
      for (let i = 0; i < this.legacyRows.length; i++) {
        const row = this.legacyRows[i]
        const raw = row[field]
        if (raw === null || raw === undefined || raw === '') continue
        const num = Number(raw)
        if (Number.isNaN(num)) continue
        result.push({ day: i + 1, value: num })
      }
      return result
    },

    getMonthStat(month, field) {
      const stats = this.resultData.monthlyStats[String(month)]
      if (stats) {
        const val = stats[field]
        if (val === null || val === undefined) return '-'
        if (field.endsWith('Date')) return this.formatStatDate(val)
        return typeof val === 'number' ? val.toFixed(2) : val
      }

      const vals = this.getLegacyMonthValues(month)
      if (!vals.length) return '-'

      const numbers = vals.map((v) => v.value)
      const max = Math.max.apply(null, numbers)
      const min = Math.min.apply(null, numbers)
      const avg = numbers.reduce((sum, v) => sum + v, 0) / numbers.length

      if (field === 'monthAvg') return avg.toFixed(2)
      if (field === 'monthMax') return max.toFixed(2)
      if (field === 'monthMin') return min.toFixed(2)
      if (field === 'monthMaxDate') {
        const item = vals.find((v) => v.value === max)
        return String(month).padStart(2, '0') + '-' + String(item.day).padStart(2, '0')
      }
      if (field === 'monthMinDate') {
        const item = vals.find((v) => v.value === min)
        return String(month).padStart(2, '0') + '-' + String(item.day).padStart(2, '0')
      }
      return '-'
    },

    getYearStat(field) {
      const yearly = this.resultData.yearlyStats || {}
      if (yearly[field] !== null && yearly[field] !== undefined) {
        const val = yearly[field]
        return typeof val === 'number' ? val.toFixed(2) : val
      }

      const all = []
      for (let m = 1; m <= 12; m++) {
        const vals = this.getLegacyMonthValues(m)
        vals.forEach((v) => all.push(v.value))
      }
      if (!all.length) return '-'

      if (field === 'yearMax') return Math.max.apply(null, all).toFixed(2)
      if (field === 'yearMin') return Math.min.apply(null, all).toFixed(2)
      if (field === 'yearAvg') return (all.reduce((sum, v) => sum + v, 0) / all.length).toFixed(2)
      return '-'
    },

    handleYearChange() {
      this.handleInit()
    },

    handleFullscreenChange() {
      const d = document
      this.isFullscreen = !!(d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement || d.msFullscreenElement)
    },

    handleToggleFullscreen() {
      const d = document
      const el = this.$refs.fullscreenTarget
      if (!el) return

      const active = d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement || d.msFullscreenElement
      if (!active) {
        const request = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen
        request && request.call(el)
      } else {
        const exit = d.exitFullscreen || d.webkitExitFullscreen || d.mozCancelFullScreen || d.msExitFullscreen
        exit && exit.call(d)
      }
    },

    exportExcel() {
      if (!this.$refs.reportTable) return
      const table = this.$refs.reportTable.querySelector('table')
      if (!table) return

      const html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"/></head><body>' + table.outerHTML + '</body></html>'
      const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = (this.options.stnm || this.options.gpName || '对象') + '流量日表_' + this.queryYear + '.xls'
      a.click()
      URL.revokeObjectURL(url)
    }
  },
  mounted() {
    document.addEventListener('fullscreenchange', this.handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange)
  },
  beforeDestroy() {
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange)
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange)
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange)
  },
  watch: {
    options: {
      handler() {
        this.handleInit()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.water-report-container {
  padding: 12px;
  background: #041b3a;
  color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .toolbar {
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    padding: 10px 14px;
    border-radius: 4px;

    .left-tools {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .fullscreen-btn {
      width: 28px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      border: 1px solid rgba(65, 132, 255, 0.45);
      color: #9ec5ff;
      cursor: pointer;
      transition: all .2s;

      &:hover {
        color: #fff;
        border-color: #409eff;
        background: rgba(64, 158, 255, 0.2);
      }

      i {
        font-size: 16px;
      }
    }

    .query-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .label {
        color: #d9e7ff;
        font-size: 13px;
      }
    }

    .actions {
      display: flex;
      gap: 8px;
    }
  }

  .table-box {
    flex: 1;
    overflow: auto;
    background: #fff;
    padding: 14px;
    border-radius: 8px;
  }

  .water-table {
    width: 100%;
    min-width: 1040px;
    table-layout: fixed;
    border-collapse: collapse;
    color: #333;
    font-family: 'SimSun', 'STSong', serif;

    .col-stat {
      width: 48px;
    }

    .col-date {
      width: 72px;
    }

    .col-month {
      width: 76px;
    }

    th,
    td {
      border: 1px solid #333;
      padding: 6px 2px;
      text-align: center;
      font-size: 12px;
    }

    .table-title {
      font-size: 20px;
      border: none;
      padding-bottom: 15px;
    }

    .info-row th {
      border: none;
      text-align: left;
      font-weight: normal;
    }

    .header-row th {
      background: #f2f2f2;
    }

    .stats-label {
      background: #f9f9f9;
      font-weight: bold;
      width: 40px;
    }

    .sub-label {
      background: #fcfcfc;
      font-weight: bold;
      width: 60px;
    }

    .date-val {
      color: #2979ff;
    }

    .yearly-row td {
      background: #f2f7ff;
      font-weight: bold;
      padding: 10px;
    }
  }
}

.scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scroll::-webkit-scrollbar-thumb {
  background: #2979ff;
  border-radius: 3px;
}
</style>
