<template>
  <div class="legend-item">
    <div class="li-title">降雨预报</div>
    <div class="li-bd">
      <ul class="rain-list">
        <li>小雨</li>
        <li>中雨</li>
        <li>大雨</li>
        <li>暴雨</li>
        <li>大暴雨</li>
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
    width: 80px;

    li {
      line-height: 24px;
      padding-left: 18px;
      position: relative;

      &:before{
        content: '';
        position: absolute;
        border-radius: 50%;
      }

      &:before {
        top: 8px;
        left: 4px;
        width: 8px;
        height: 8px;
      }

      &:nth-child(1) {
        &:before {
          background: rgba(0, 210, 255, .9);
        }
      }

      &:nth-child(2) {
        &:before {
          background: rgba(0, 255, 141, .9);
        }
      }

      &:nth-child(3) {
        &:before {
          background: rgba(255, 238, 77, .9);
        }
      }

      &:nth-child(4) {
        &:before {
          background: rgba(255, 153, 74, .9);
        }
      }

      &:nth-child(5) {
        &:before {
          background: rgba(255, 83, 47, .9);
        }
      }
    }
  }
</style>
