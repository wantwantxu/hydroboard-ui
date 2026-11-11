
let L = window.L
L.Path.mergeOptions({

  dashSpeed: 0
})

var _originalBeforeAdd = L.Path.prototype.beforeAdd

L.Path.include({

  beforeAdd: function (map) {
    _originalBeforeAdd.bind(this)(map)

    if (this.options.dashSpeed) {
      this._lastDashFrame = performance.now()
      this._dashFrame = L.Util.requestAnimFrame(this._onDashFrame.bind(this))
    }
  },

  _onDashFrame: function() {
    if (!this._renderer) {
      return
    }

    var now = performance.now()
    var dashOffsetDelta = (now - this._lastDashFrame) * this.options.dashSpeed / 1000

    this.options.dashOffset = Number(this.options.dashOffset || 0) + dashOffsetDelta
    this._renderer._updateStyle(this)

    this._lastDashFrame = performance.now()

    this._dashFrame = L.Util.requestAnimFrame(this._onDashFrame.bind(this))
  }

})
