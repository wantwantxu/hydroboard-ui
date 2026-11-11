import * as L from 'leaflet'
class FloodInundationImage {
  constructor(map) {
   this.map=map
    this.datasetId =''
    this.maxBounds = [[99999,99999],[-99999,-99999]]
    this.projectTree = {}
    this.tilesProviderArray=[]
    this.legend=null
  }


  async fetchData(url){
      try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Failed to fetch data:', error);
    }
  }


  getData(){
    if (window.dict.wmsServices == undefined && window.dict.wmsServices =='') {
      return
    }
    let wmsServices = JSON.parse(window.dict.wmsServices[0].value)
    if(wmsServices.floodIP == undefined&&wmsServices.floodIP == ''){
      return
    }
    this.clearLayer()
    this.fetchData(wmsServices.floodIP+'/api/datasets')
      .then(data => {
       if(data==undefined||data!==undefined&&data.length==0){
         return
       }
        data.forEach((dataset)=>{
          if(dataset.id ===this.datasetId){
            if (typeof this.projectTree.projectName == 'undefined') this.projectTree.projectName = dataset.project_name
            if (typeof this.projectTree.plans == 'undefined') this.projectTree.plans = []
            if (typeof this.projectTree.tables == 'undefined') this.projectTree.tables = []
            if (typeof this.projectTree.maps == 'undefined') this.projectTree.maps = []
            if (typeof this.projectTree.nodes == 'undefined') this.projectTree.nodes = []
            if (typeof this.projectTree.layers == 'undefined') this.projectTree.layers = {}
            this.tilesProviderArray=[]
            dataset.data.layers.forEach((layer)=>{
              let layerName = layer.table + ': ' + layer.time,
                layerId = layer.layerid,
                maxZoom = dataset.data.metadata[layer.table+'_maxzoom'],
                topBound = dataset.data.metadata[layer.table+'_top'],
                bottomBound = dataset.data.metadata[layer.table+'_bottom'],
                leftBound = dataset.data.metadata[layer.table+'_left'],
                rightBound = dataset.data.metadata[layer.table+'_right'],
                plan = dataset.data.metadata[layer.table+'_plan_name'],
                mapType = dataset.data.metadata[layer.table+'_map_type'],
                parentFolder = dataset.data.metadata[layer.table+'_plan_name'] + dataset.data.metadata[layer.table+'_map_type']
              let  tileLayer = L.tileLayer(wmsServices.floodIP+'/api/tiles/{layer}/{z}/{x}/{y}.png',{
                title: layer.time,
                legend: layer.table,
                layer: layer.layerid,
                maxNativeZoom: Number(maxZoom),
                zIndex:9999,
                bounds: L.latLngBounds([[bottomBound,leftBound],[topBound,rightBound]]),
                opacity: 0.5
              })
              this.tilesProviderArray.push(tileLayer)
              if (topBound > this.maxBounds[1][0]) this.maxBounds[1][0] = topBound
              if (bottomBound < this.maxBounds[0][0]) this.maxBounds[0][0] = bottomBound
              if (leftBound < this.maxBounds[0][1]) this.maxBounds[0][1] = leftBound
              if (rightBound > this.maxBounds[1][1]) this.maxBounds[1][1] = rightBound
              if(this.projectTree.tables.indexOf(layer.table) === -1){
                this.projectTree.tables.push(layer.table)
              }

              if(this.projectTree.plans.indexOf(plan) === -1){
                this.projectTree.plans.push(plan)
                this.projectTree.nodes.push({
                  id:plan,
                  parent:'#',
                  text:plan,
                  state:{
                    opened:true
                  }
                })
              }

              if(this.projectTree.maps.indexOf(parentFolder) === -1){
                this.projectTree.maps.push(parentFolder)
                this.projectTree.nodes.push({
                  id:parentFolder,
                  parent:plan,
                  text:mapType,
                  animationGroup:true
                })
              }

              this.projectTree.layers[layerId] = tileLayer

              if(layer.time == 'Max')
              {
                this.projectTree.nodes.unshift({
                  id:layerId,
                  parent:parentFolder,
                  text:layer.time,
                  icon:'fa fa-map-o',
                  mapLayer:true
                })

              }
              else
              {
                this.projectTree.nodes.push({
                  id:layerId,
                  parent:parentFolder,
                  text:layer.time,
                  icon:'fa fa-map-o',
                  mapLayer:true
                })
              }
            })

            if(typeof  legends == 'undefined') var legends = {}
            this.projectTree.tables.forEach((table)=>{
              if(typeof dataset.data.metadata[table+'_legend_values'] !== 'undefined'){
                let colors = dataset.data.metadata[table+'_legend_rgba'].split(','),
                  values = dataset.data.metadata[table+'_legend_values'].split(','),
                 legendHtml = {};


                if(colors[colors.length-1]=='') colors.pop()
                if(values[values.length-1]=='') values.pop()
                legendHtml.trad = []
                legendHtml.grad = []

                values.forEach(function(val,i){
                  var swatchColor = 'rgba('+colors[0+(i*4)]+','+colors[1+(i*4)]+','+colors[2+(i*4)]+','+colors[3+(i*4)]/255+');'
                  legendHtml.trad.push(['<li class="legend-item" style="list-style-type: none;">',
                    '<div :class="legend-item-fill legend-item-swatch" style="border-radius: 6px;width: 32px;height: 20px;border: 1px solid #91A7AF;' +
                    'display: inline-block;'+
                    'position: relative;' +
                    'top: 3px;background-color:' + swatchColor + ';"></div>',
                    '<div class="legend-item-title" style=" display: inline-block;padding-left: 10px;  font-size: 16px;' +
                    '    color: #fff;">' + val + '</div>',
                    '</li>'].join(''))
                })



                var stops = []
                values.forEach(function(val,i,arr){
                  var pct = 100 / arr.length * i;
                  var color = 'rgba('+colors[0+(i*4)]+','+colors[1+(i*4)]+','+colors[2+(i*4)]+','+colors[3+(i*4)]/255+')'
                  stops.push([pct+'%',color])
                })


                var style = [
                  'background: rgb(30,87,153);',
                  'background: -moz-linear-gradient(top, ',
                  function(){
                    var stupidString = ''
                    stops.forEach(function(stop){
                      if(typeof stop[0] !== 'undefined') stupidString += stop[1] + ' ' + stop[0] + ','
                    })
                    return stupidString.substr(0,stupidString.length-1)
                  }(),
                  ');',
                  'background: -webkit-gradient(linear, left top, left bottom, ',
                  function(){
                    var stupidString = ''
                    stops.forEach(function(stop){
                      if(typeof stop[0] !== 'undefined') stupidString += 'color-stop(' + stop[0] + ',' + stop[1] + '),'
                    })
                    return stupidString.substr(0,stupidString.length-1)
                  }(),
                  ');',
                  'background: -webkit-linear-gradient(top, ',
                  function(){
                    let stupidString = ''
                    stops.forEach(function(stop){
                      if(typeof stop[0] !== 'undefined') stupidString += stop[1] + ' ' + stop[0] + ','
                    })
                    return stupidString.substr(0,stupidString.length-1)
                  }(),
                  ');',
                  'background: -o-linear-gradient(top, ',
                  function(){
                    let stupidString = ''
                    stops.forEach(function(stop){
                      if(typeof stop[0] !== 'undefined') stupidString += stop[1] + ' ' + stop[0] + ','
                    })
                    return stupidString.substr(0,stupidString.length-1)
                  }(),
                  ');',
                  'background: -ms-linear-gradient(top, ',
                  function(){
                    let stupidString = ''
                    stops.forEach(function(stop){
                      if(typeof stop[0] !== 'undefined') stupidString += stop[1] + ' ' + stop[0] + ','
                    })
                    return stupidString.substr(0,stupidString.length-1)
                  }(),
                  ');',
                  'background: linear-gradient(to bottom, ',
                  function(){
                    let stupidString = ''
                    stops.forEach(function(stop){
                      if(typeof stop[0] !== 'undefined') stupidString += stop[1] + ' ' + stop[0] + ','
                    })
                    return stupidString.substr(0,stupidString.length-1)
                  }(),
                  ');',
                  'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='+this.rgb2hex(stops[0][1])+', endColorstr='+this.rgb2hex(stops[stops.length-1][1])+',GradientType=0 );'
                ].join('')
                legendHtml.grad.push(['<li class="legend-item">',
                  '<div class="legend-item-fill legend-item-grad" style="'+style+'"></div>',
                  '<div class="legend-item-min">'+values[0]+'</div>',
                  '<div class="legend-item-max">'+values[values.length-1]+'</div>',
                  '</li>'].join(''))

              legends[table] = legendHtml.trad.join('')
                this.legend=legends[table]
              }
            })


          }

        })
        let _this=this
        if( _this.maxBounds!==undefined) {
          _this.map.fitBounds(L.latLngBounds(_this.maxBounds))

        }
        console.log(_this.tilesProviderArray)
        console.log(_this.projectTree.layers)
        _this.updateImageryLayer()

      })
      .catch(error => {

        console.error('Error:', error);
      });


  }

  updateImageryLayer(){
    let _this=this
    const keys = Object.keys( _this.projectTree.layers);
   _this.map.addLayer( _this.tilesProviderArray[_this.tilesProviderArray.length-1])
    const lastKey = keys.pop();
    const lastValue = _this.projectTree.layers[lastKey]

    let legendList= document.getElementById('legend-list')
    let legendBox = document.getElementById('map-legend')
    if (legendList) legendList.innerHTML = _this.legend || ''
    if (legendBox) {
      if (_this.legend) legendBox.classList.remove('is-empty')
      else legendBox.classList.add('is-empty')
    }
  }

  rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
      ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  }
  clearLayer(){

    if(this.tilesProviderArray.length>0){
      this.map.removeLayer(this.tilesProviderArray[this.tilesProviderArray.length-1]);
    }
    this.tilesProviderArray=[]
    let legendList= document.getElementById('legend-list')
    let legendBox = document.getElementById('map-legend')
    if (legendList) legendList.innerHTML = ''
    if (legendBox) legendBox.classList.add('is-empty')
    this.legend=null

  }
}




export default FloodInundationImage
