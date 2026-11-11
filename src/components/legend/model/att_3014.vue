<template>
  <div class="legend-item">
    <div class="li-title">餐馆</div>
    <div class="li-bd">
      <ul class="att-box">
        <li>
          <img src="/static/icon/30141.png" alt="">
          餐馆
        </li>
        <li>
          <img src="/static/icon/30142.png" alt="">
          餐厅
        </li>
        <li>
          <img src="/static/icon/30143.png" alt="">
          饭店
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
