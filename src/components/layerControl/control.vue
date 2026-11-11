<template>
  <div class="control-item" :class="{isPackUp:isPackUp}">
    <div class="ci-title" @click="isPackUp=!isPackUp">
      <span/>
      {{data.label}}
    </div>
    <ul class="ci-list">
      <li v-for="item in data.children" :key="item.value" :class="{checked:item.checked}"
          @click="toCheck(item.value,item.checked)">
        <span/>
        {{item.label}}
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      data: {
        type: Object,
        default() {
          return null
        }
      }
    },
    data() {
      return {
        isPackUp: false
      }
    },
    methods: {
      toCheck(val, checked) {

        this.$emit('change', val, !!checked)
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .control-item {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    .ci-title {
      color: #fff;
      height: 20px;
      line-height: 20px;
      margin-bottom: 10px;
      font-size: 16px;
      padding-left: 18px;
      position: relative;
      cursor: pointer;

      span {
        position: absolute;
        border-radius: 2px;
        left: 0;
        top: 3px;
        width: 14px;
        height: 14px;
        box-sizing: border-box;
        background: rgba(255, 255, 255, .8);
        border: 1px solid #fff;

        &:before {
          content: '';
          position: absolute;
          width: 8px;
          height: 2px;
          background: #003452;
          left: 2px;
          top: 5px;
        }

        &:after {
          display: none;
          content: '';
          position: absolute;
          height: 8px;
          width: 2px;
          background: #003452;
          left: 5px;
          top: 2px;
        }
      }
    }

    .ci-list {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      padding-left: 18px;

      li {

        color: #00fff6;
        font-size: 15px;
        line-height: 25px;
        padding-left: 20px;
        padding-top: 5px;
        position: relative;
        box-sizing: border-box;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        margin: 0px 7px;

        span {
          position: absolute;
          width: 14px;
          height: 14px;
          left: 0;
          top: 10px;
          background: rgba(0, 255, 246, .06);
          border: 1px solid rgba(0, 255, 246, .15);
          box-sizing: border-box;
          border-radius: 2px;
        }

        &.checked {
          color: #fff700;
          span{
            border-color: rgba(255,255,0,.4);
            &:after{
              box-sizing: content-box;
              content: '';
              border: 1px solid #fff700;
              border-left: 0;
              border-top: 0;
              height: 7px;
              left: 4px;
              position: absolute;
              top: 1px;
              transform: rotate(45deg) scaleY(1);
              width: 3px;
              transition: transform .15s ease-in .05s;
              transform-origin: center;
            }
          }
        }
      }
    }

    &.isPackUp {
      .ci-title {
        span {
          &:after {
            display: block;
          }
        }
      }

      .ci-list {
        display: none;
      }
    }
  }
</style>
