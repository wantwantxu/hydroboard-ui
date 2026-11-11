
export default class SocketService {


    config = {
      url:''
    }

    constructor(ops){
      Object.assign(this.config, ops)

      this.connect()
    }

    ws = null

    callBackMapping = {}

    lockReconnect = false

    reconnectCount = 0

    that = this


    heartCheck = {
      timeout: 30000,
      timeoutObj: null,
      serverTimeoutObj: null,
      reset: function(){
          clearTimeout(this.timeoutObj);
          clearTimeout(this.serverTimeoutObj);
          return this;
      },
      start: function(WS){
          var self = this;
          this.timeoutObj = setTimeout(function(){

              WS.send("ping");
              console.log("ping!")
              self.serverTimeoutObj = setTimeout(function(){
                WS.close();
              }, self.timeout)
          }, this.timeout)
      }
    }

    reconnect() {
      this.reconnectCount++
      if(this.lockReconnect) return;
      this.lockReconnect = true;
      setTimeout(()=> {
          this.connect();
          this.lockReconnect = false;
      }, 60000)
    }
    connect() {
      const self = this;
      if (!window.WebSocket) {
        return alert('您的浏览器不支持websocket!')
      }
      this.ws = new WebSocket(this.config.url)
      this.ws.onopen = () => {
        console.log('连接服务端成功')
        this.heartCheck.reset().start(this.ws);
      }
      this.ws.onclose = () => {
        console.log('连接服务端失败')
        self.reconnect()
      }
      this.ws.onmessage = (msg) => {
        console.log('从服务端获取到的数据' + msg.data)
        this.heartCheck.reset().start(this.ws);
        const recvData = JSON.parse(msg.data)
        if (!recvData.ping) {
          const socketType = 'productivity'
          this.callBackMapping[socketType].call(this, recvData)
        }
      }
    }

    registerCallBack(socketType, callBack) {
      this.callBackMapping[socketType] = callBack
    }

    unRegisterCallBack(socketType) {
      this.callBackMapping[socketType] = null
    }

}
