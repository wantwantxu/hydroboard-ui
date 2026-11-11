<template>
  <div class="legend-item">
    <div class="li-title">位势高度</div>
    <div class="li-bd">
      <ul class="num-list">
        <li>5537</li>
        <li>5194</li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style type="text/scss" lang="scss" scoped>
  .num-list {
    color: #fff;
    font-size: 14px;
    width: 40px;
    height: 160px;
    padding-left: 26px;
    position: relative;
    &:before{
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 20px;
      background: linear-gradient(0deg, rgb(126, 141, 8), rgb(147, 47, 41), rgb(184, 38, 25), rgb(235, 50, 35), rgb(238, 118, 47), rgb(244, 173, 61));
    }

    li {
      left: 26px;
      position: absolute;
      &:nth-child(1){
        bottom: 66.6%;
      }
      &:nth-child(2){
        bottom: 33.3%;
      }
    }
  }
</style>
