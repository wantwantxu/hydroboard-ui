
L.Control.Rainviewer = L.Control.extend({
    options: {
        position: 'bottomleft',
        nextButtonText: '>',
        playStopButtonText: 'Play/Stop',
        prevButtonText: '<',
        positionSliderLabelText: "Hour:",
        opacitySliderLabelText: "Opacity:",
        animationInterval: 500,
        opacity: 0.5
    },

    onAdd: function (map) {

        this.timestamps = [];
        this.radarLayers = [];

        this.currentTimestamp;
        this.nextTimestamp;

        this.animationPosition = 0;
        this.animationTimer = false;

        this.rainviewerActive = false;

        this._map = map;

        this.container = L.DomUtil.create('div', 'leaflet-control-rainviewer leaflet-bar leaflet-control');

        this.link = L.DomUtil.create('a', 'leaflet-control-rainviewer-button leaflet-bar-part', this.container);
        this.link.href = '#';

      this.load(map)
        return this.container;

    },

    load: function(map) {

		var t = this;
        this.apiRequest = new XMLHttpRequest();

        this.apiRequest.open("GET", "https://api.rainviewer.com/public/weather-maps.json", true);
        this.apiRequest.timeout = 10000;
        this.apiRequest.onload = function (e) {
            try {
                var data = JSON.parse(t.apiRequest.response);
                var frames = [];
                if (data && data.radar) {
                    frames = (data.radar.past || []).concat(data.radar.nowcast || []);
                    t.radarHost = data.host || 'https://tilecache.rainviewer.com';
                } else if (data instanceof Array) {

                    frames = data.map(function (ts) { return { time: ts, path: '/v2/radar/' + ts }; });
                    t.radarHost = 'https://tilecache.rainviewer.com';
                }
                t.radarPaths = {};
                frames.forEach(function (f) { t.radarPaths[f.time] = f.path; });
                t.timestamps = frames.map(function (f) { return f.time; });
                if (t.timestamps.length === 0) {
                    console.warn('rainviewer: 未获取到雷达帧数据');
                    return;
                }
                if (t.positionSlider) {
                    t.positionSlider.max = t.timestamps.length - 1;
                }

                t.showFrame(-1);
            } catch (err) {
                console.error('rainviewer: 雷达数据解析失败', err);
            }
        };
        this.apiRequest.onerror = function () {
            console.error('rainviewer: 雷达数据请求失败（可能无法访问外网）');
        };
        this.apiRequest.ontimeout = function () {
            console.error('rainviewer: 雷达数据请求超时');
        };
        this.apiRequest.send();

        L.DomUtil.addClass(this.container, 'leaflet-control-rainviewer-active bg-com');

        this.controlContainer = L.DomUtil.create('div', 'leaflet-control-rainviewer-container', this.container);

        this.prevButton = L.DomUtil.create('input', 'leaflet-control-rainviewer-prev leaflet-bar-part btn', this.controlContainer);
        this.prevButton.type = "button";
        this.prevButton.value = this.options.prevButtonText;
        L.DomEvent.on(this.prevButton, 'click', t.prev, this);
        L.DomEvent.disableClickPropagation(this.prevButton);

        this.startstopButton = L.DomUtil.create('input', 'leaflet-control-rainviewer-startstop leaflet-bar-part btn', this.controlContainer);
        this.startstopButton.type = "button";
        this.startstopButton.value = this.options.playStopButtonText;
        L.DomEvent.on(this.startstopButton, 'click', t.startstop, this);
        L.DomEvent.disableClickPropagation(this.startstopButton);

        this.nextButton = L.DomUtil.create('input', 'leaflet-control-rainviewer-next leaflet-bar-part btn', this.controlContainer);
        this.nextButton.type = "button";
        this.nextButton.value = this.options.nextButtonText;
        L.DomEvent.on(this.nextButton, 'click', t.next, this);
        L.DomEvent.disableClickPropagation(this.nextButton);

        this.positionSliderLabel = L.DomUtil.create('label', 'leaflet-control-rainviewer-label leaflet-bar-part', this.controlContainer);
        this.positionSliderLabel.for = "rainviewer-positionslider";
        this.positionSliderLabel.textContent = this.options.positionSliderLabelText;

        this.positionSlider = L.DomUtil.create('input', 'leaflet-control-rainviewer-positionslider leaflet-bar-part', this.controlContainer);
        this.positionSlider.type = "range";
        this.positionSlider.id = "rainviewer-positionslider";
        this.positionSlider.min = 0;
        this.positionSlider.max = 11;
        this.positionSlider.value = this.animationPosition;
        L.DomEvent.on(this.positionSlider, 'input', t.setPosition, this);
        L.DomEvent.disableClickPropagation(this.positionSlider);

        var html = '<div id="timestamp" class="leaflet-control-rainviewer-timestamp"></div>'

        this.controlContainer.insertAdjacentHTML('beforeend', html);

        L.DomEvent.disableClickPropagation(this.controlContainer);

    },

    unload: function(e) {
        L.DomUtil.remove(this.controlContainer);

        L.DomUtil.removeClass(this.container, 'leaflet-control-rainviewer-active');
        console.log(this.radarLayers);
        var radarLayers = this.radarLayers;
        var map = this._map;
        Object.keys(radarLayers).forEach(function (key) {
            if (map.hasLayer(radarLayers[key])) {
                map.removeLayer(radarLayers[key]);
            }
         });
    },

    addLayer: function(ts) {
        var map = this._map;
        if (!this.radarLayers[ts]) {
            var path = (this.radarPaths && this.radarPaths[ts]) || ('/v2/radar/' + ts);
            var host = this.radarHost || 'https://tilecache.rainviewer.com';
            this.radarLayers[ts] = new L.TileLayer(host + path + '/256/{z}/{x}/{y}/2/1_1.png', {
                tileSize: 256,
                opacity: 0.001,
				transparent: true,
				attribution: '<a href="https://rainviewer.com" target="_blank">rainnviewer.com</a>',
                zIndex: ts
            });
        }
        if (!map.hasLayer(this.radarLayers[ts])) {
            map.addLayer(this.radarLayers[ts]);
        }
    },

    changeRadarPosition: function(position, preloadOnly) {

        if (!this.timestamps || this.timestamps.length === 0) {
            return;
        }
        while (position >= this.timestamps.length) {
            position -= this.timestamps.length;
        }
        while (position < 0) {
            position += this.timestamps.length;
        }

        this.currentTimestamp = this.timestamps[this.animationPosition];
        this.nextTimestamp = this.timestamps[position];

        this.addLayer(this.nextTimestamp);

        if (preloadOnly) {
            return;
        }

        this.animationPosition = position;
        this.positionSlider.value = position;

        if (this.radarLayers[this.currentTimestamp]) {
            this.radarLayers[this.currentTimestamp].setOpacity(0);
        }
        this.radarLayers[this.nextTimestamp].setOpacity(this.options.opacity);

        document.getElementById("timestamp").innerHTML = (new Date(this.nextTimestamp * 1000)).toLocaleString();
    },

    showFrame: function(nextPosition) {
        var preloadingDirection = nextPosition - this.animationPosition > 0 ? 1 : -1;

        this.changeRadarPosition(nextPosition);

        this.changeRadarPosition(nextPosition + preloadingDirection, true);
    },

    setOpacity: function(e){
        console.log(e.srcElement.value/100);
        if (this.radarLayers[this.currentTimestamp]) {
            this.radarLayers[this.currentTimestamp].setOpacity(e.srcElement.value/100);
        }
    },

    setPosition: function(e){
        this.showFrame(e.srcElement.value)
    },

    stop: function() {
        if (this.animationTimer) {
            clearTimeout(this.animationTimer);
            this.animationTimer = false;
            return true;
        }
        return false;
    },

    play: function() {
        this.showFrame(this.animationPosition + 1);

        this.animationTimer = setTimeout(function(){ this.play() }.bind(this), this.options.animationInterval);
    },

    playStop: function() {
        if (!this.stop()) {
           this.play();
        }
    },

    prev: function(e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        this.stop();
        this.showFrame(this.animationPosition - 1);
        return
    },

    startstop: function(e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        this.playStop()

    },

    next: function(e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        this.stop();
        this.showFrame(this.animationPosition + 1);
        return
    },

    onRemove: function (map) {

    }
});

L.control.rainviewer = function (opts) {
    return new L.Control.Rainviewer(opts);
}
