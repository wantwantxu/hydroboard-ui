<template>
  <div class="wrap bg-com rain-warn-panel" style="height: 150px">
    <h2><img src="/static/icon/icon_yj.png" alt="">雨量超警</h2>
    <ul class="content">
      <li>
        <div class="r-bar">
          <img src="/static/icon/icon_rain.png" alt="">
          <div class="bar-c">
            <div class="bar-wave"></div>
          </div>
        </div>
        <dl class="r-text">
          <dt><span>{{sum1}}</span>个</dt>
          <dd>1小时超过</dd>
          <dd>{{threshold1h}}mm</dd>
        </dl>
      </li>
      <li>
        <div class="r-bar">
          <img src="/static/icon/icon_rain.png" alt="">
          <div class="bar-c">
            <div class="bar-wave"></div>
          </div>
        </div>
        <dl class="r-text">
          <dt><span>{{sum3}}</span>个</dt>
          <dd>3小时超过</dd>
          <dd>{{threshold3h}}mm</dd>
        </dl>
      </li>
      <li>
        <div class="r-bar">
          <img src="/static/icon/icon_rain.png" alt="">
          <div class="bar-c">
            <div class="bar-wave"></div>
          </div>
        </div>
        <dl class="r-text">
          <dt><span>{{sum6}}</span>个</dt>
          <dd>6小时超过</dd>
          <dd>{{threshold6h}}mm</dd>
        </dl>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import Api from '@/api'
  import appService from '@/store/services/appService'

  export default {
    data() {
      return {
        sum1: 0,
        sum3: 0,
        sum6: 0
      }
    },
    computed: {

      threshold1h() {
        return appService.getPortalConfigValue('rainWarn_1h', '30.0')
      },
      threshold3h() {
        return appService.getPortalConfigValue('rainWarn_3h', '50.0')
      },
      threshold6h() {
        return appService.getPortalConfigValue('rainWarn_6h', '100.0')
      }
    },
    methods: {

      loadData(data) {
        this.getRainBeyondSum(1, data)
        this.getRainBeyondSum(3, data)
        this.getRainBeyondSum(6, data)
      },

      getRainBeyondSum(h, option) {
        if (option.addvcd === undefined || option.addvcd === '') {
          option.addvcd = []
        }
        const params = {
          sttpList: option.sttpList.join(),
          addvcdList: option.addvcd.join(),
          startDate: option.startDate,
          endDate: option.endDate,
          hour: h
        }

        Api.countBeyondRain(params).then(response => {
          const raw = (response && (response.result !== undefined ? response.result : response.data !== undefined ? response.data : response))
          const n = typeof raw === 'number' ? raw : (Array.isArray(raw) ? raw.length : Number(raw) || 0)
          this['sum' + h] = n
        }).catch(() => {
          this['sum' + h] = 0
        })
      }
    }

  }
</script>

<style type="text/scss" lang="scss" scoped>
  .wrap {
    padding: 15px 0 15px 20px;
    margin-bottom: 10px;

    h2 {
      font-size: 1.25rem;
      color: #fff;
      font-weight: normal;
      line-height: 1.5rem;
      margin-bottom: 0.75rem;

      img {
        width: 1.25rem;
        vertical-align: middle;
        margin: -2px 4px 0 0;
      }
    }

    .content {
      height: 105px;
      display: flex;
      flex-direction: row;
      min-width: 0;
      overflow: hidden;

      li {
        width: 33%;
        min-width: 0;
        display: flex;
        align-items: flex-end;

        &:nth-child(1) {
          .r-text span {
            color: #ffee4d;
          }

          .bar-c {
            height: 15%;
          }
        }

        &:nth-child(2) {
          .r-text span {
            color: #ff994a;
          }
          .bar-c {
            height: 40%;
          }
        }

        &:nth-child(3) {
          .r-text span {
            color: #ff532f;
          }
          .bar-c {
            height: 65%;
          }
        }
      }

      .r-bar {
        width: 20px;
        height: 103px;
        border: 1px solid #00fff6;
        margin-right: 5px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        border-radius: 5px;

        img {
          width: 18px;
          height: 18px;
          display: block;
          margin: 0 auto;
        }

        .bar-c {
          position: relative;
          margin-top: 17px;
          background: #00fff6;
        }

        .bar-wave {
          width: 100%;
          height: 27px;
          position: absolute;
          top: -27px;
          overflow: hidden;

          &:before, &:after {
            content: '';
            position: absolute;
            width: 150%;
            height: 150%;
            left: -20%;
            top: 50%;
            border-radius: 40%;

          }
          &:before{
            animation: round1 3s linear infinite;
            background: rgba(0,255,246,1);
          }
          &:after{
            border-radius: 30% 60% 40% 50%;
            background: rgba(0,255,246,.7);
            animation: round2 3s linear infinite;
          }
        }
      }

      .r-text {
        font-size: 0.75rem;
        color: #00fff6;
        line-height: 1.25rem;
        min-width: 0;
        overflow: hidden;

        span {
          font-size: 1.25rem;
          font-weight: bold;
          margin-right: 0.25rem;
        }

        dd {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  @keyframes round1 {
    0%{
      transform: rotate(0);
    }
    100% {
      transform: rotate(180deg);
    }
  }
  @keyframes round2 {
    0%{
      transform: rotate(-20deg);
    }
    100% {
      transform: rotate(120deg);
    }
  }
</style>
