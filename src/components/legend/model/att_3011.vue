<template>
  <div class="legend-item">
    <div class="li-title">车站</div>
    <div class="li-bd">
      <ul class="att-box">
        <li>
          <img src="/static/icon/30111.png" alt="">
          机场
        </li>
        <li>
          <img src="/static/icon/30112.png" alt="">
          汽车站
        </li>
        <li>
          <img src="/static/icon/30113.png" alt="">
          火车站
        </li>
        <li>
          <img src="/static/icon/30114.png" alt="">
          客运站
        </li>
        <li>
          <img src="/static/icon/30115.png" alt="">
          公交站
        </li>
        <li>
          <img src="/static/icon/30116.png" alt="">
          停车场
        </li>
        <li>
          <img src="/static/icon/30117.png" alt="">
          地铁站
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
