


(function (window, document, undefined) {
if (L.Browser.svg) {
    L.SVG.include({
        _updateStyle: function (layer) {
            var path = layer._path,
                options = layer.options

            if (!path) { return }

            if (options.stroke) {
                path.setAttribute('stroke', options.color)
                path.setAttribute('stroke-opacity', options.opacity)
                path.setAttribute('stroke-width', options.weight)
                path.setAttribute('stroke-linecap', options.lineCap)
                path.setAttribute('stroke-linejoin', options.lineJoin)

                if (options.dashArray) {
                    path.setAttribute('stroke-dasharray', options.dashArray)
                } else {
                    path.removeAttribute('stroke-dasharray')
                }

                if (options.dashOffset) {
                    path.setAttribute('stroke-dashoffset', options.dashOffset)
                } else {
                    path.removeAttribute('stroke-dashoffset')
                }
            } else {
                path.setAttribute('stroke', 'none')
            }

            if (options.fill) {
                if (typeof (options.fill) === 'string' &&
                        options.fill.match(/^url\(/)) {

                    this.__fillPattern(layer)
                } else {
                    path.setAttribute('fill', options.fillColor || options.color)
                }
                path.setAttribute('fill-opacity', options.fillOpacity)
                path.setAttribute('fill-rule', options.fillRule || 'evenodd')
            } else {
                path.setAttribute('fill', 'none')
            }
        },

        __fillPattern: function(layer) {
            var values = '0;-200;-400;-600;-800;-1000;-1200;-1400;-1600;-1800;-2000;-2200;-2400;-2600;-2800'
            var height = '200'
            var width = '200'

            var path = layer._path,
                options = layer.options

            if (!this._defs) {
                this._defs = L.SVG.create('defs')
                this._container.appendChild(this._defs)
            }
            var _img_url = options.fill.substring(4, options.fill.length - 1)
            var _ref_id = _img_url + (Math.random() * Math.pow(10, 17) + Math.random() * Math.pow(10, 17))
            _ref_id += new Date().getUTCMilliseconds()
            var _p = document.getElementById(_ref_id)
            if (!_p) {
                var _im = new Image()
                _im.src = _img_url

                _p = L.SVG.create('pattern')
                _p.setAttribute('id', _ref_id)
                _p.setAttribute('x', '0')
                _p.setAttribute('y', '0')
                _p.setAttribute('patternUnits', 'userSpaceOnUse')
                _p.setAttribute('width', width)
                _p.setAttribute('height', height)
                var _rect = L.SVG.create('rect')
                _rect.setAttribute('width', width)
                _rect.setAttribute('height', height)
                _rect.setAttribute('x', 0)
                _rect.setAttribute('y', 0)
                _rect.setAttribute('fill', options.fillColor || options.color)

                _p.appendChild(_rect)
                this._defs.appendChild(_p)

                var _img = L.SVG.create('image')
                _img.setAttribute('x', '0')
                _img.setAttribute('y', '0')
                _img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', _img_url)
                _img.setAttribute('width', width)
                _img.setAttribute('height', height)

                var_animate = L.SVG.create('animate')
                var_animate.setAttribute('attributeType', 'XML')
                var_animate.setAttribute('attributeName', 'x')
                var_animate.setAttribute('calcMode', 'discrete')
                var_animate.setAttribute('values', values)
                var_animate.setAttribute('dur', '1s')
                var_animate.setAttribute('repeatCount', 'indefinite')
                _img.appendChild(var_animate)
                _p.appendChild(_img)

                _im.onload = function() {
                    _p.setAttribute('width', width)
                    _p.setAttribute('height', height)
                    _img.setAttribute('width', '3000')
                    _img.setAttribute('height', height)
                }
            }
            path.setAttribute('fill', 'url(#' + _ref_id + ')')
        }
    })
}
}(this, document))
