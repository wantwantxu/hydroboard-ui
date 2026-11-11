<template>
  <div class="legend-item">
    <div class="li-title">雷达预警</div>
    <div class="li-bd">
      <ul class="rain-list">
        <li>无雨</li>
        <li>小雨</li>
        <li>中雨</li>
        <li>大雨</li>
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

    li {
      line-height: 24px;
      padding-left: 24px;
      position: relative;

      &:before, &:after {
        content: '';
        position: absolute;
        border-radius: 50%;
      }

      &:before {
        top: 7px;
        left: 4px;
        width: 10px;
        height: 10px;
      }

      &:after {
        top: 3px;
        left: 0;
        width: 14px;
        height: 14px;
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
          background: rgba(255, 238, 77, .9);
        }

        &:after {
          border-color: rgba(255, 238, 77, .9);
        }
      }

      &:nth-child(3) {
        &:before {
          background: rgba(255, 153, 74, .9);
        }

        &:after {
          border-color: rgba(255, 153, 74, .9);
        }
      }

      &:nth-child(4) {
        &:before {
          background: rgba(255, 1, 32, .9);
        }

        &:after {
          border-color: rgba(255, 1, 32, .9);
        }
      }
    }
  }
</style>
