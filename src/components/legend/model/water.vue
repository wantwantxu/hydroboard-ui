<template>
  <div class="legend-item">
    <div class="li-title">水情监测</div>
    <div class="li-bd">
      <div class="water-wrap">
        <ul class="water-arrow">
          <li>
            <img src="/static/svg/arrow-up.svg" alt="">
            涨
          </li>
          <li>
            <img src="/static/svg/arrow-up.svg" alt="" style="transform: rotate(180deg)">
            落
          </li>
          <li>
            <span class="arrow-fx"></span>
            平
          </li>
        </ul>
        <ul class="water-list">
          <li>空</li>
          <li>正常水位</li>
          <li>接近警戒/讯限</li>
          <li>超警戒/讯限</li>
          <li>超保证/正常</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style type="text/scss" lang="scss" scoped>
  .water-wrap{
    width: 160px;
    display: flex;
    flex-direction: row;
    color: #00fff6;
    font-size: 14px;
  }
  .water-arrow{
    line-height: 24px;
    padding-right: 20px;
    img{
      width: 12px;
      vertical-align: middle;
      margin-right: 4px;
    }
    .arrow-fx{
      width: 7px;
      height: 7px;
      background: #00fff6;
      display: inline-block;
      margin: 0 4px;
    }
  }
  .water-list {

    li {
      line-height: 24px;
      padding-left: 12px;
      position: relative;

      &:before {
        content: '';
        position: absolute;
        border-radius: 50%;
      }

      &:before {
        top: 8px;
        left: 0;
        width: 8px;
        height: 8px;
      }

      &:nth-child(1) {
        &:before {
          background: rgba(255, 255, 255, .5);
        }
      }

      &:nth-child(2) {
        &:before {
          background: rgba(0, 210, 255, .9);
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
          background: rgba(255, 1, 32, .9);
        }
      }
    }
  }
</style>
