

L.tileLayerPixelFilter = function (url, options) {
    return new L.TileLayer.PixelFilter(url, options);
};

L.TileLayer.PixelFilter = L.TileLayer.extend({

    initialize: function (url, options) {
        options = L.extend({}, L.TileLayer.prototype.options, {
            matchRGBA: null,
            missRGBA: null,
            pixelCodes: [],
            crossOrigin: true
        }, options);
        L.TileLayer.prototype.initialize.call(this, url, options);
        L.setOptions(this, options);


        this.setMatchRGBA(this.options.matchRGBA);
        this.setMissRGBA(this.options.missRGBA);
        this.setPixelCodes(this.options.pixelCodes);


        this.on('tileload', function (event) {
            this.applyFiltersToTile(event.tile);
        });
    },


    setMatchRGBA: function (rgba) {

        if (rgba !== null && (typeof rgba !== 'object' || typeof rgba.length !== 'number' || rgba.length !== 4) ) throw "L.TileLayer.PixelSwap expected matchRGBA to be RGBA [r,g,b,a] array or else null";
        this.options.matchRGBA = rgba;


        this.redraw(true);
    },
    setMissRGBA: function (rgba) {

        if (rgba !== null && (typeof rgba !== 'object' || typeof rgba.length !== 'number' || rgba.length !== 4) ) throw "L.TileLayer.PixelSwap expected missRGBA to be RGBA [r,g,b,a] array or else null";
        this.options.missRGBA = rgba;


        this.redraw(true);
    },
    setPixelCodes: function (pixelcodes) {

        if (typeof pixelcodes !== 'object' || typeof pixelcodes.length !== 'number') throw "L.TileLayer.PixelSwap expected pixelCodes to be a list of triplets: [ [r,g,b], [r,g,b], ... ]";
        this.options.pixelCodes = pixelcodes;


        this.redraw(true);
    },


    _createTile: function () {
        var tile = L.TileLayer.prototype._createTile.call(this);
        tile.crossOrigin = "Anonymous";
        return tile;
    },


    applyFiltersToTile: function (imgelement) {

        if (imgelement.getAttribute('data-PixelFilterDone')) return;


        var width  = imgelement.width;
        var height = imgelement.height;
        var canvas    = document.createElement("canvas");
        canvas.width  = width;
        canvas.height = height;
        var context = canvas.getContext("2d");
        context.drawImage(imgelement, 0, 0);


        var output = context.createImageData(width, height);


        var match_r, match_g, match_b, match_a;
        var matchRGBA = this.options.matchRGBA;
        var missRGBA  = this.options.missRGBA;
        if (matchRGBA !== null) {
            match_r = matchRGBA[0];
            match_g = matchRGBA[1];
            match_b = matchRGBA[2];
            match_a = matchRGBA[3];
        }
        if (missRGBA !== null) {
            miss_r = missRGBA[0];
            miss_g = missRGBA[1];
            miss_b = missRGBA[2];
            miss_a = missRGBA[3];
        }


        var pixelcodes = [];
        for (var ii = 0, il = this.options.pixelCodes.length; ii < il; ii++) {
            var value = 1000000 * this.options.pixelCodes[ii][0] + 1000 * this.options.pixelCodes[ii][1] + this.options.pixelCodes[ii][2];
            pixelcodes.push(value);
        }


        var pixels;
        try {
            pixels = context.getImageData(0, 0, width, height).data;
        } catch(e) {
            throw "L.TileLayer.PixelFilter getImageData() failed. Likely a cross-domain issue?";
        }
        for(var pi = 0, pn = pixels.length; pi < pn; pi += 4) {
            var r = pixels[pi];
            var g = pixels[pi+1];
            var b = pixels[pi+2];
            var a = pixels[pi+3];


            if (a == 0) {
                output.data[pi  ] = 255;
                output.data[pi+1] = 255;
                output.data[pi+2] = 255;
                output.data[pi+3] = 0;
                continue;
            }


            var match = true;
            if (pixelcodes.length) {
                var sum = 1000000 * r + 1000 * g + b;
                if (-1 === pixelcodes.indexOf(sum)) match = false;
            }


            output.data[pi  ] = match ? (matchRGBA === null ? r : match_r) : (missRGBA === null ? r : miss_r);
            output.data[pi+1] = match ? (matchRGBA === null ? g : match_g) : (missRGBA === null ? g : miss_g);
            output.data[pi+2] = match ? (matchRGBA === null ? b : match_b) : (missRGBA === null ? b : miss_b);
            output.data[pi+3] = match ? (matchRGBA === null ? a : match_a) : (missRGBA === null ? a : miss_a);

          output.data[pi  ] = output.data[pi  ]
          output.data[pi+1] =  output.data[pi+1]
          output.data[pi+2] = output.data[pi+2]
          output.data[pi+3] =  output.data[pi+3]
        }


        context.putImageData(output, 0, 0);
        imgelement.setAttribute('data-PixelFilterDone', true);
        imgelement.src = canvas.toDataURL();
    }
});
