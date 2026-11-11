<template>
  <div class="map-source" >
    <div class="ms-content" @click="isShow=!isShow">
      <img src="/static/svg/mapSource.svg" alt="">
      <p>地图图源</p>
      <div class="ms-dialog bg-com " v-if="isShow" @mouseleave="isShow=false">
        <ul>
          <li v-for="(item,index) in list" :key="index" :class="{active:checked==index}" @click="toCheck(index,item)">
            <img :src="`/static/mapSource/${index + 1}.png`" alt="">
            <p>{{item}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BaseMap from '../../map/leaflet/BaseMap'
export default {
    data() {
      return {
        isShow: false,

        list: BaseMap.getBaseMaps().map((b) => b.name),
        checked: 0
      }
    },
    mounted() {

      setTimeout(() => {
        this.list = BaseMap.getBaseMaps().map((b) => b.name)
      }, 2000)
    },
    methods: {
      toCheck(idx, name) {
        this.checked = idx

        BaseMap.changeBaseMap(name)
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .map-source {


    .ms-content {
      text-align: center;
      padding: 5px 10px;
      color: #00fff6;
      font-size: 12px;
      cursor: pointer;
      position: relative;
      height: 46px;
    }

    .ms-dialog {
      position: absolute;
      top: 68px;
      right: -28px;
      padding: 15px 15px 5px;

      ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 310px;
        justify-content: space-between;

        li {
          width: 96px;
          height: 70px;
          margin-bottom: 10px;
          position: relative;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #003452;
          color: #fff;

          &.active {
            border-color: #00fff6;
            color: #00fff6;
          }

          img {
            width: 100%;
            display: block;
            height: 100%;
          }

          p {
            position: absolute;
            background: rgba(0, 0, 0, .8);
            height: 20px;
            bottom: 0;
            left: 0;
            right: 0;
            line-height: 20px;
            font-size: 12px;
          }
        }
      }
    }

  }
</style>
