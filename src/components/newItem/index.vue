<template>
  <a :href="item.link" target="_blank" class="new-item">
    <div class="ni-image">
      <img :src="item.image" alt="">
    </div>
    <div class="ni-content">
      <div class="ni-title">{{ item.title }}</div>
      <div class="ni-con">{{ item.content }}</div>
      <div class="ni-ft">
        <span>{{ item.source }}</span>
        <span>{{ item.createTime }}</span>
      </div>
    </div>
  </a>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      item: {
        type: Object,
        default() {
          return null
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .new-item {
    height: 145px;
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px dashed rgba(0,255,246,.4);
    display: flex;
    &:last-child{
      border-bottom: none;
      margin-bottom: 0;
    }

    .ni-image {
      height: 145px;
      width: 250px;
      margin-right: 15px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .ni-content {
      flex: 1;

      .ni-title {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: rgba(255, 255, 255, .7);
        font-size: 18px;
        line-height: 30px;
        margin-bottom: 5px;
        font-weight: bold;
      }

      .ni-con {
        line-height: 25px;
        height: 75px;
        overflow: hidden;
        margin-bottom: 15px;
        color: rgba(0,255,246,.5);
        font-size: 16px;
      }

      .ni-ft {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        line-height: 20px;
        color: rgba(0,255,246,.5);
      }
    }
  }
</style>
