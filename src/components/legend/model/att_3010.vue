<template>
  <div class="legend-item">
    <div class="li-title">商超</div>
    <div class="li-bd">
      <ul class="att-box">
        <li>
          <img src="/static/icon/30101.png" alt="">
          超市
        </li>
        <li>
          <img src="/static/icon/30102.png" alt="">
          商场
        </li>
        <li>
          <img src="/static/icon/30103.png" alt="">
          便利店
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style type="text/scss" lang="scss" scoped>
  .att-box {
    color: #00fff6;
    font-size: 14px;

    li {
      line-height: 24px;

      img {
        width: 16px;
        vertical-align: middle;
        margin-right: 4px;
      }
    }
  }
</style>
