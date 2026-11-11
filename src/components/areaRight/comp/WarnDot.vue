<template>
  <el-tooltip
    v-if="row && row.warnColor"
    placement="top"
    effect="dark"
    :open-delay="120"
    popper-class="warn-dot-tip"
  >
    <div slot="content" class="warn-tip">
      <p class="warn-tip__type">{{ tip.type }}</p>
      <p>站名：{{ tip.stnm }}</p>
      <p>监测值：{{ tip.value }}</p>
      <p>{{ tip.thresholdLabel }}：{{ tip.threshold }}</p>
      <p v-if="tip.over">超幅：{{ tip.over }}</p>
      <p v-if="tip.time">时间：{{ tip.time }}</p>
    </div>
    <span class="warn-dot" :class="'wl-' + row.warnColor" />
  </el-tooltip>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'WarnDot',
  props: {
    row: {
      type: Object,
      default: null
    }
  },
  computed: {
    tip() {
      const row = this.row || {}
      const z = Number(row.z != null ? row.z : row.rz)
      const wrz = Number(row.wrz)
      const grz = Number(row.grz)
      const fsltdz = Number(row.fsltdz)
      const type = row.warnType || '告警'
      let thresholdLabel = '阈值'
      let threshold = '--'
      if (type === '超保证' && !Number.isNaN(grz)) {
        thresholdLabel = '保证水位'
        threshold = `${grz} m`
      } else if (type === '超警戒' && !Number.isNaN(wrz)) {
        thresholdLabel = '警戒水位'
        threshold = `${wrz} m`
      } else if (type === '超汛限' && !Number.isNaN(fsltdz)) {
        thresholdLabel = '汛限水位'
        threshold = `${fsltdz} m`
      } else if (!Number.isNaN(wrz)) {
        thresholdLabel = '警戒水位'
        threshold = `${wrz} m`
      } else if (!Number.isNaN(fsltdz)) {
        thresholdLabel = '汛限水位'
        threshold = `${fsltdz} m`
      }

      const thrNum = parseFloat(threshold)
      let over = ''
      if (!Number.isNaN(z) && !Number.isNaN(thrNum)) {
        over = `${(Math.round((z - thrNum) * 100) / 100).toFixed(2)} m`
      }

      return {
        type,
        stnm: row.stnm || '--',
        value: Number.isNaN(z) ? '--' : `${z} m`,
        thresholdLabel,
        threshold,
        over,
        time: row.tm ? dayjs(row.tm).format('YYYY-MM-DD HH:mm') : ''
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.warn-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
  cursor: help;

  &.wl-red { background: #ff1f32; box-shadow: 0 0 6px #ff1f32; }
  &.wl-orange { background: #ff994a; box-shadow: 0 0 6px #ff994a; }
  &.wl-yellow { background: #ffee4d; box-shadow: 0 0 6px #ffee4d; }
  &.wl-blue { background: #409eff; box-shadow: 0 0 6px #409eff; }
}

.warn-tip {
  line-height: 1.6;
  font-size: 12px;

  p {
    margin: 0;
  }

  &__type {
    font-weight: 700;
    color: #ffd34d;
    margin-bottom: 2px;
  }
}
</style>

<style lang="scss">

.warn-dot-tip {
  max-width: 240px;
  background: rgba(0, 16, 30, 0.96) !important;
  border: 1px solid rgba(0, 255, 246, 0.35);
  color: #e8fbff !important;
  padding: 8px 10px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);

  .popper__arrow {
    border-top-color: rgba(0, 16, 30, 0.96) !important;
    border-bottom-color: rgba(0, 16, 30, 0.96) !important;
  }

  .popper__arrow::after {
    border-top-color: rgba(0, 16, 30, 0.96) !important;
    border-bottom-color: rgba(0, 16, 30, 0.96) !important;
  }
}
</style>
