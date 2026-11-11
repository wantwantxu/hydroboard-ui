<template>
  <div class="legend-item">
    <div class="li-title">降水分布图(mm)</div>
    <div class="li-bd">
      <div class="area-wrap">
        <ul class="area-num">
          <li>250 - 500</li>
          <li>100 - 250</li>
          <li>50 - 100</li>
          <li>25 - 50</li>
          <li>10 - 25</li>
          <li>0 - 10</li>
          <li>0</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style type="text/scss" lang="scss" scoped>
  .area-wrap{
    width: 130px;
    color: #fff;
    font-size: 16px;
  }
  .area-num {
    li {
      line-height: 20px;
      padding-left: 26px;
      position: relative;

      &:before {
        content: '';
        position: absolute;
      }

      &:before {
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
      }

      &:nth-child(1) {
        &:before {
          background: rgba(255, 0, 0, .5);
        }
      }

      &:nth-child(2) {
        &:before {
          background: rgba(250, 0, 250, .5);
        }
      }

      &:nth-child(3) {
        &:before {
          background: rgba(1, 0, 252, .5);
        }
      }

      &:nth-child(4) {
        &:before {
          background: rgba(97, 184, 255, .5);
        }
      }

      &:nth-child(5) {
        &:before {
          background: rgba(56, 168, 1, .5);
        }
      }

      &:nth-child(6) {
        &:before {
          background: rgba(169, 241, 141, .5);
        }
      }

      &:nth-child(7) {
        &:before {
          background: rgba(255, 255, 255, .5);
        }
      }
    }
  }
</style>
