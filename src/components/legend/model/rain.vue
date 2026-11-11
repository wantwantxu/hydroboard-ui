<template>
  <div class="legend-item">
    <div class="li-title">实时雨情</div>
    <div class="li-bd">
      <ul class="rain-list">
        <li>无雨(0)</li>
        <li>小雨(0.1-9.9)</li>
        <li>中雨(10-24.9)</li>
        <li>大雨(25-49.9)</li>
        <li>暴雨(50-99.9)</li>
        <li>大暴雨(100-249.9)</li>
        <li>特大暴雨(>250)</li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style type="text/scss" lang="scss" scoped>
  .rain-list {
    color: #00fff6;
    font-size: 14px;
    width: 140px;

    li {
      line-height: 24px;
      padding-left: 18px;
      position: relative;

      &:before, &:after {
        content: '';
        position: absolute;
        border-radius: 50%;
      }

      &:before {
        top: 9px;
        left: 4px;
        width: 6px;
        height: 6px;
      }

      &:after {
        top: 5px;
        left: 0;
        width: 10px;
        height: 10px;
        border: 2px solid;
      }

      &:nth-child(1) {
        &:before {
          background: rgba(255, 255, 255, .5);
        }

        &:after {
          border-color: rgba(255, 255, 255, .5);
        }
      }

      &:nth-child(2) {
        &:before {
          background: rgba(0, 210, 255, .9);
        }

        &:after {
          border-color: rgba(0, 210, 255, .9);
        }
      }

      &:nth-child(3) {
        &:before {
          background: rgba(0, 255, 141, .9);
        }

        &:after {
          border-color: rgba(0, 255, 141, .9);
        }
      }

      &:nth-child(4) {
        &:before {
          background: rgba(255, 238, 77, .9);
        }

        &:after {
          border-color: rgba(255, 238, 77, .9);
        }
      }

      &:nth-child(5) {
        &:before {
          background: rgba(255, 153, 74, .9);
        }

        &:after {
          border-color: rgba(255, 153, 74, .9);
        }
      }

      &:nth-child(6) {
        &:before {
          background: rgba(255, 83, 47, .9);
        }

        &:after {
          border-color: rgba(255, 83, 47, .9);
        }
      }

      &:nth-child(7) {
        &:before {
          background: #A11818;
        }

        &:after {
          border-color: #A11818;
        }
      }
    }
  }
</style>
