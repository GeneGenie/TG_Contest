!function(t){var e={};function i(s){if(e[s])return e[s].exports;var a=e[s]={i:s,l:!1,exports:{}};return t[s].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)i.d(s,a,function(e){return t[e]}.bind(null,a));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";i.r(e);var s=class{constructor(){}static newDeferred(){let t,e;return{promise:new Promise((i,s)=>{t=i,e=s}),resolve:t,reject:e}}static keyByValue(t,e){for(let i in t)if(t[i]===e)return i;return null}static subAA(t,e){return t.map((t,i)=>t-e[i])}static addAA(t,e){return t.map((t,i)=>t+e[i])}static multiAV(t,e){return t.map((t,i)=>t*e)}};const a=300;var n=class{constructor(t){this.drawn=!1,this.animating=!1,this.points=t.points,this.color=t.color,this.opacity=1,this.lineWidth=t.lineWidth||2}updating(t){return this.update(t),!this.drawn||this.animating}draw(t){return t.beginPath(),t.strokeStyle=this.color,t.lineWidth=this.lineWidth,t.globalAlpha=this.opacity,this.points.forEach((e,i)=>{t.moveTo.apply(t,e),t.lineTo.apply(t,this.points[i+1]||e)}),t.stroke(),t.globalAlpha=1,this.drawn=!0,this}animate(t){return this.animating?(this.animOpts.dir.points=this.animOpts.orig.points.map((e,i)=>s.subAA(t.points[i],e)),this):(this.animOpts={orig:{points:this.points.map(t=>t),opacity:this.opacity},dir:{points:this.points.map((e,i)=>s.subAA(t.points[i],e)),opacity:(void 0===t.opacity?1:t.opacity)-this.opacity},duration:t.duration||a,progress:null,start:null},this.animating=!0,this)}update(t){if(!this.animating)return!1;let e=this.animOpts;if(1==e.progress)return this.animating=!1,delete this.animOpts,this;this.animating&&!e.start&&(e.start=t),e.progress=(t-e.start)/e.duration,e.progress>1&&(e.progress=1),0!=e.dir.opacity&&(this.opacity=e.orig.opacity+e.dir.opacity*e.progress),this.points=e.orig.points.map((t,i)=>s.addAA(t,s.multiAV(e.dir.points[i],e.progress)))}};var r=class{constructor(t){this.drawn=!1,this.data=t.data,this.labels=[],this.lines=[],this.rect=t.rect,this.bg=t.bg,this.padding=t.padding||5,this.lineColor=t.lineColor||"grey",this.lineWidth=t.lineWidth||.3,this.fontColor=t.fontColor||"grey",this.fontSize=t.fontSize||14,this.labelFormatFn=t.labelFormatFn||this.labelFormatFnDefault,this.calculate()}updateValues(t){this.data=t,this.calculate(),this.drawn=!1}labelFormatFnDefault(t){return(t=parseInt(t))/1e9>=1?t=(t/1e9).toFixed(2)+"b":t/1e6>=1?t=(t/1e6).toFixed(2)+"m":t/1e3>=1&&(t=(t/1e3).toFixed(2)+"k"),t}calculate(){let t=this.rect.y,e=this.rect.height/(this.data.labels.length-1);this.labels=[],this.lines=[],this.data.labels.forEach(i=>{this.labels.push({text:i.toString(),fontSize:this.fontSize,fontColor:this.fontColor,x:this.rect.x+this.padding,y:t-this.padding}),this.lines.push(new n({points:[[this.rect.x,t],[this.rect.width,t]],lineWidth:this.lineWidth,color:this.lineColor})),t+=e})}updating(){return!this.drawn}draw(t){let e=this.rect;this.bg&&(t.fillStyle=this.bg,t.fillRect(e.x,e.y,e.width,e.height)),this.lines.forEach(e=>e.draw(t)),this.labels.forEach((e,i)=>{t.font=`${e.fontSize}px Arial`,t.textAlign="left",t.fillStyle=e.fontColor;let s=0==i?e.y+e.fontSize+this.padding:e.y;t.fillText(this.labelFormatFnDefault(e.text),e.x,s)}),this.drawn=!0}};const h=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];var o=class{constructor(t){this.drawn=!1,this.rect=t.rect,this.points=[],this.cols=t.data.values.map((e,i)=>{let s=new Date(e),a="center";0==i?a="left":i==t.data.values.length-1&&(a="right");let n=s.getDate()+" "+h[s.getMonth()];return t.ctx.fillStyle="black",t.ctx.font="14px Arial",{textAlign:a,value:e,text:n,width:t.ctx.measureText(n).width}}),this.calculate()}calculate(){let t=this.rect.width/(this.cols.length-1);this.labels=this.cols.map((e,i)=>({x:this.rect.x+i*t,y:this.rect.y+this.rect.height-5,textAlign:e.textAlign,text:e.text,width:e.width}))}update({x:t,width:e}){this.rect.x=t,this.rect.width=e,this.calculate(),this.drawn=!1}updating(){return!this.drawn}draw(t){this.rect,t.fillStyle="grey",t.font="14px Arial";let e=this.labels[0].x;this.labels.forEach((i,s)=>{s>0&&i.x-i.width/2<e||(t.textAlign=i.textAlign,e+=i.width+20,t.fillText(i.text,i.x,i.y))}),this.drawn=!0}};var l=class{constructor({series:t,canvas:e,onClickSerie:i}){this.onClickSerie=i;let s=document.createElement("div");Object.assign(s.style,{overflowX:"scroll",whiteSpace:"nowrap",textAlign:"center",padding:"20px 10px",width:this.width+"px"}),t.forEach(t=>{s.appendChild(this.createLegendButton(t))}),e.parentElement.appendChild(s)}createLegendButton(t){let e=document.createElement("span");Object.assign(e.style,{display:"inline-block",border:"1px solid rgba(0,0,0,0.3)",borderRadius:"10px",minWidth:"80px",padding:"10px",textAlign:"center",marginRight:"20px",lineHeight:"20px"});let i=document.createElement("span");Object.assign(i.style,{display:"inline-block",width:"20px",height:"20px",borderRadius:"20px",boxSizing:"border-box",backgroundColor:t.color,border:"1px solid rgba(0,0,0,0.3)",float:"left",color:"white"}),i.innerHTML="<span>&#10003;</span>",e.appendChild(i);let s=document.createElement("span");return s.innerText=t.name,e.appendChild(s),e.addEventListener("click",()=>{this.onClickSerie(t.id)?Object.assign(i.style,{backgroundColor:t.color,border:"1px solid rgba(0,0,0,0.3)",color:"white"}):Object.assign(i.style,{backgroundColor:"transparent",border:`1px solid ${t.color}`,color:"transparent"})}),e}};class c{constructor(t){this.immutable=t.immutable||!1,this.immutable?this.rect=Object.assign({},t.rect):this.rect=t.rect,this.canvas=t.canvas,this.name=t.name,this.onMove=t.onMove||function(){},this.onMoveX=t.onMoveX||function(){},this.onClickStart=t.onClickStart||function(){};const e=this.move.bind(this);this.canvas.addEventListener("mousedown",t=>{this.isHit(t)&&(this.onClickStart(),this.canvas.addEventListener("mousemove",e),t.stopPropagation(),t.preventDefault(),t.stopImmediatePropagation())},!1),this.canvas.addEventListener("mouseup",t=>{this.canvas.removeEventListener("mousemove",e)}),this.canvas.addEventListener("mouseleave",t=>{this.canvas.removeEventListener("mousemove",e)}),this.canvas.addEventListener("touchstart",t=>{this.isHit(t)&&(this.onClickStart(),this.canvas.addEventListener("touchmove",e),t.stopPropagation(),t.preventDefault(),t.stopImmediatePropagation())}),this.canvas.addEventListener("touchend",t=>{this.canvas.removeEventListener("touchmove",e)}),this.canvasOffset={x:this.canvas.offsetLeft,y:this.canvas.offsetTop}}getRelativeTouchX(t){return t.touches[0].pageX-this.canvasOffset.x}getRelativeTouchY(t){return t.touches[0].pageY-this.canvasOffset.y}move(t){let e=t.layerX||t.offsetX||this.getRelativeTouchX(t),i=(t.layerY||t.offsetY||this.getRelativeTouchY(t),e-this.sX);this.rect.x+=i,this.onMoveX(i),this.sX=e,t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),this.onMove(this.rect)}isHit(t){let e=this.rect,i=t.layerX||t.offsetX||this.getRelativeTouchX(t),s=t.layerY||t.offsetY||this.getRelativeTouchY(t),a=e.x<i&&i<e.x+e.width,n=e.y<s&&s<e.y+e.height;return this.sX=i,this.sY=s,n&&a}}const d=10,g=3,p="rgba(150,150,150,0.7)",u="rgba(150,150,150,0.3)";var x=class{constructor(t){this.drawn=!1,this.rect=t.rect,this.bg=t.bg||u,this.dragBoxColor=t.dragBoxColor||p,this.dragBoxWidth=t.dragBoxWidth||d,this.range=Object.assign(t.range),this.onRangeChange=t.onRangeChange||function(){},this.visibleRect={},this.rightBoxRect={},this.leftBoxRect={},this.calculateRect(),this.lineWidth=t.lineWidth||g,new c({name:"left",rect:this.leftBoxRect,onMoveX:this.onMoveLeftBar.bind(this),canvas:t.canvas}),new c({name:"right",rect:this.rightBoxRect,onMoveX:this.onMoveRightBar.bind(this),canvas:t.canvas}),new c({name:"trans",rect:this.visibleRect,onMove:this.onMoveVisibleArea.bind(this),canvas:t.canvas})}onMoveLeftBar(t){this.visibleRect.x+=t,this.visibleRect.width-=t,this.onMoveVisibleArea(this.visibleRect)}onMoveRightBar(t){this.visibleRect.width+=t,this.onMoveVisibleArea(this.visibleRect)}onMoveVisibleArea(t){this.drawn=!1,t.x<this.rect.x&&(t.x=this.rect.x),t.x>this.rect.width+this.rect.x-t.width&&(t.x=this.rect.width+this.rect.x-t.width),this.range.start=(t.x-this.rect.x)/this.rect.width*100,this.range.end=(t.x-this.rect.x+t.width)/this.rect.width*100,this.calculateRect(),this.onRangeChange(this.range)}calculateRect(){Object.assign(this.visibleRect,{x:this.rect.x+this.rect.width/100*this.range.start,y:this.rect.y,width:(this.range.end-this.range.start)/100*this.rect.width,height:this.rect.height}),Object.assign(this.leftBoxRect,{x:this.visibleRect.x-this.dragBoxWidth,y:this.visibleRect.y,width:3*this.dragBoxWidth,height:this.visibleRect.height}),Object.assign(this.rightBoxRect,{x:this.visibleRect.x+this.visibleRect.width-2*this.dragBoxWidth,y:this.visibleRect.y,width:3*this.dragBoxWidth,height:this.visibleRect.height})}updating(){return!this.drawn}draw(t){const{dragBoxWidth:e,lineWidth:i,dragBoxColor:s,bg:a}=this,n=this.rect,r=this.visibleRect;t.fillStyle=a,t.lineWidth=i,t.fillRect(n.x,n.y,r.x-n.x,n.height),t.fillRect(r.x+r.width,n.y,n.width-r.x-r.width,r.height),t.fillRect(r.x+e,r.y,r.width-2*e,i),t.fillRect(r.x+e,r.y+r.height-i,r.width-2*e,i),t.fillStyle=s,t.fillRect(r.x,r.y,e,r.height),t.fillRect(r.x+r.width-e,r.y,e,r.height),this.drawn=!0}};var b=class{constructor(t){this.rect=t.rect,this.visibleRect=t.visibleRect||this.rect,this.series=t.series.map(t=>Object.assign({},t)),this.yAxisData=t.yAxisData,this.drawables=[],this.series.forEach(t=>{if("line"==t.type){let e=this.calculate({yAxis:this.yAxisData,values:t.values,rect:this.rect}),i=e.map(t=>[t[0],this.rect.height/2+this.rect.y]),s=new n({points:i,color:t.color});s.animate({points:e}),t.drawableLine=s,this.drawables.push(s)}})}toggleSerie(t){var e=this.series.find(e=>e.id==t);e.shown=!e.shown,e.shown||e.drawableLine.animate({points:e.drawableLine.points.map(t=>[t[0],this.rect.y]),opacity:0})}updateRange({rect:t,yAxisData:e}){t&&(this.rect=t),this.yAxisData=e,this.series.forEach(t=>{if("line"==t.type&&t.shown){let e=this.calculate({yAxis:this.yAxisData,values:t.values,rect:this.rect});t.drawableLine.animate({points:e})}})}calculate({values:t,rect:e,yAxis:i}){let{yMax:s,yMin:a}=i,n=e.width/(t.length-1);return t.map((t,i)=>{let r=Math.abs((t-a)/(s-a)*e.height-e.height)+e.y;return[i*n+e.x,r]})}updating(t){let e=!1;return this.series.forEach(i=>{let s=i.drawableLine.updating(t);e||(e=s)}),e}draw(t){this.series.forEach(e=>{(e.shown||e.drawableLine.animating)&&e.drawableLine.draw(t)})}};const w=20,v=80,f=20;class m{constructor(t){let e=t.el;this.series=t.series.map(t=>(t.shown=!0,t.id=Math.random()+Date.now(),t)),this.xAxisData=t.xAxis,this.drawables={},this.showLegend=t.showLegend||!0,this.xRangePercent=t.defaultXRangePercent||{start:0,end:30},this.sceneObjectGroups=[],e?(this.width=parseInt(e.width),this.height=parseInt(e.height)):((e=document.createElement("canvas")).id=Math.random(),e.width=this.width=t.width,e.height=this.height=t.height,document.body.appendChild(e)),this.canvas=e,this.ctx=e.getContext("2d"),this.pixelPerPercent=this.width/100,this.setupRenderer(),this.addSceneObjects(),this.showLegend&&new l({series:this.series.map(t=>({name:t.legendName,color:t.color,id:t.id})),canvas:e,onClickSerie:this.toggleSerie.bind(this)})}toggleSerie(t){var e=this.series.find(e=>e.id==t);return e.shown=!e.shown,this.drawables.scMain.toggleSerie(t),this.drawables.scUnderScaleBar.toggleSerie(t),this.updateRange(this.xRangePercent,!0),e.shown}setupRenderer(){if(this.rendering)return;this.rendering=!0;const t=this,e=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;let i=0;e(function s(a){i++,t.sceneObjectGroups.forEach((e,s)=>{let n=!1;e.forEach(t=>{t.updating(a)&&(n=!0)}),n&&(i=0,t.ctx.clearRect(e[0].rect.x,e[0].rect.y,e[0].rect.width,e[0].rect.height),e.forEach(e=>{e.draw(t.ctx)}))}),i<4?e(s):t.rendering=!1})}calcYAxis({steps:t,yPadding:e,indexRange:i}){let s,a=[],n=this.series[0].values.length;if(i){let t=Math.floor((n-1)/100*this.xRangePercent.start);t<0&&(t=0),s={start:t,end:Math.ceil((n-1)/100*this.xRangePercent.end)}}else s={start:0,end:n-1};this.series.forEach(t=>{t.shown&&(a.push(Math.max.apply(null,t.values.slice(s.start,s.end))),a.push(Math.min.apply(null,t.values.slice(s.start,s.end))))});let r={yMax:Math.max.apply(null,a),yMin:Math.min.apply(null,a),labels:[]},h=(r.yMax-r.yMin)/(t-1);for(let e=0;e<t;e++)r.labels.push(Math.round(r.yMax-h*e));return r}updateRange({start:t,end:e},i){this.xRangePercent.start=t,this.xRangePercent.end=e;const s=this.getSeriesRect(),a=this.calcYAxis({steps:6,indexRange:!0});this.drawables.scMain.updateRange({rect:s,yAxisData:a}),i&&this.drawables.scUnderScaleBar.updateRange({yAxisData:this.calcYAxis({steps:6})}),this.drawables.xAxis.update({x:s.x,width:s.width}),this.drawables.yAxis.updateValues(a),this.setupRenderer()}getSeriesRect(){const t=1/((this.xRangePercent.end-this.xRangePercent.start)/100);return{x:this.pixelPerPercent*this.xRangePercent.start*t*-1,y:w,width:this.width*t,height:this.height-v-2*w}}addSceneObjects(){this.sceneObjectGroups=[];const t=this.calcYAxis({steps:6,indexRange:!0});let e=this.getSeriesRect(),i={x:0,y:w,width:this.width,height:this.height-v-w-f},s={x:e.x,y:this.height-v-f,width:e.width,height:f},a={x:0,y:this.height-v,width:this.width,height:v};this.drawables.yAxis=new r({rect:i,data:t,orientation:"left"}),this.drawables.xAxis=new o({rect:s,data:this.xAxisData,ctx:this.ctx}),this.drawables.scMain=new b({yAxisData:t,rect:e,visibleRect:i,series:this.series}),this.drawables.scUnderScaleBar=new b({yAxisData:this.calcYAxis({steps:6}),rect:a,series:this.series}),this.drawables.sb=new x({bg:"rgba(225,225,225,0.5)",rect:a,range:this.xRangePercent,onRangeChange:this.updateRange.bind(this),canvas:this.canvas}),this.sceneObjectGroups.push([this.drawables.yAxis,this.drawables.scMain]),this.sceneObjectGroups.push([this.drawables.xAxis]),this.sceneObjectGroups.push([this.drawables.scUnderScaleBar,this.drawables.sb])}static initFromData(t){let e={};for(let i in t.types)e[i]={id:i,type:t.types[i],legendName:t.names[i],color:t.colors[i],values:t.columns.find(t=>t[0]==i).slice(1)};let i=e.x;return delete e.x,new m({width:window.innerWidth,height:400,xAxis:i,series:Object.values(e)})}}var y=m;const R={DAY:{bg:"transparent",font:"black"},NIGHT:{bg:"#242f3d",font:"white"}};var A=class{constructor(t={}){const e=document.createElement("div");Object.assign(e.style,{textAlign:"center",position:"fixed",bottom:0,fontSize:"24px",height:"40px",lineHeight:"40px",borderTop:"2px solid grey",width:"100%"}),e.innerHTML="Switch Colors",document.body.appendChild(e);let i="DAY";this.container=e,this.applyTheme(R[i]),e.addEventListener("click",()=>{"DAY"==i?i="NIGHT":"NIGHT"==i&&(i="DAY");let e=R[i];t.onSwitch&&t.onSwitch(R[i]),this.applyTheme(e)})}applyTheme(t){Object.assign(document.body.style,{backgroundColor:t.bg,color:t.font})}};fetch("./chart_data.json").then(t=>t.json()).then(t=>{new A,t.reverse().forEach(t=>{y.initFromData(t)})})}]);