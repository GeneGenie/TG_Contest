/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_Graph_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/Graph.js */ "./src/Graph.js");

function getData() {
    return fetch('./chart_data.json')
        .then(s=>s.json())
        .then(data=> {
            window.g = _src_Graph_js__WEBPACK_IMPORTED_MODULE_0__["default"].initFromData(data[0]);

            //minify webpack
            //y on scale  /animate / on legend
            // recalculate x on scale / animate / on legend
            //night shift

            // tooltips ? fuck


            //multiseries
        })
}
getData();



/***/ }),

/***/ "./src/Graph.js":
/*!**********************!*\
  !*** ./src/Graph.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _yAxis_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./yAxis.js */ "./src/yAxis.js");
/* harmony import */ var _xAxis_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xAxis.js */ "./src/xAxis.js");
/* harmony import */ var _ScaleBar_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ScaleBar.js */ "./src/ScaleBar.js");
/* harmony import */ var _SeriesContainer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SeriesContainer.js */ "./src/SeriesContainer.js");





const paddingTop = 20;
const ScaleBarHeight = 80;
const xAxisHeight = 20;

class Graph {
    constructor(opts) {
        let canvas = opts.el;
        this.series = opts.series.map(s=> {
            s.shown = true;
            s.id = Math.random() + Date.now();
            return s;
        });
        this.xAxisData = opts.xAxis;
        this.drawables = {};
        this.showLegend = opts.showLegend || true;
        this.xRangePercent = opts.defaultXRangePercent || {start: 0, end: 30};
        this.sceneObjectGroups = [];
        if (canvas) {
            this.width = parseInt(canvas.width);
            this.height = parseInt(canvas.height);
        } else {
            canvas = document.createElement('canvas');
            canvas.id = Math.random();
            canvas.width = this.width = opts.width;
            canvas.height = this.height = opts.height;
            document.body.appendChild(canvas);
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.pixelPerPercent = this.width / 100;
        this.setupRenderer();
        this.addSceneObjects();
        if (this.showLegend) {
            this.initLegend(this.series.map(s=> {
                return {
                    name: s.legendName,
                    color: s.color,
                    id: s.id
                }
            }));
        }
    }

    initLegend(series) {
        let legendContainer = document.createElement('div');
        Object.assign(legendContainer.style, {
            overflowX: 'scroll',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            padding: '20px 10px',
            width: this.width + 'px'
        })
        series.forEach((s)=> {
            legendContainer.appendChild(this.createLegendButton(s));
        })
        this.canvas.parentElement.appendChild(legendContainer)
    }

    createLegendButton(serieInfo) {
        let butEl = document.createElement('span');
        Object.assign(butEl.style, {
            display: 'inline-block',
            backgroundColor: serieInfo.color,
            border: `1px solid ${serieInfo.color}`,
            borderRadius: '10px',
            minWidth: '80px',
            padding: '10px',
            textAlign: 'center',
            marginRight: '20px',
            color: 'white'
        })
        // let iconEl = document.createElement('i');
        // iconEl.innerText = 'icon';
        // butEl.appendChild(iconEl);
        let text = document.createElement('span');
        text.innerText = serieInfo.name;
        butEl.appendChild(text);

        butEl.addEventListener('click', ()=> {
            let result = this.toggleSerie(serieInfo.id);
            if (result) {
                Object.assign(butEl.style, {
                    backgroundColor: serieInfo.color,
                    color: 'white'
                })
            } else {
                Object.assign(butEl.style, {
                    backgroundColor: 'transparent',
                    color: 'black'
                })
            }

        })
        return butEl;
    }

    toggleSerie(id) {
        var serie = this.series.find(s=> s.id == id);
        serie.shown = !serie.shown;
        this.drawables.scMain.toggleSerie(id);
        this.drawables.scUnderScaleBar.toggleSerie(id);
        this.updateRange(this.xRangePercent, true);
        return serie.shown;
    }

    setupRenderer() {

        if (this.rendering) return;
        this.rendering = true
        const self = this;
        const nextFrameHandler = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;

        let staleFrames = 0;

        function renderer(tfDiff) {
            staleFrames++;
            self.sceneObjectGroups.forEach((group, i)=> {
                let anyUpdates = false;
                group.forEach(obj=> {
                    obj.updating(tfDiff) && (anyUpdates = true);
                });
                if (anyUpdates) {
                    staleFrames = 0;
                    self.ctx.clearRect(group[0].rect.x, group[0].rect.y, group[0].rect.width, group[0].rect.height);
                    group.forEach(obj=> {
                        obj.draw(self.ctx);
                    })
                }
            });
            if (staleFrames < 4) {
                nextFrameHandler(renderer);
            } else {
                self.rendering = false
            }
        }

        nextFrameHandler(renderer);
    }

    calcYAxis({steps, yPadding}) {
        let limits = [];
        this.series.forEach(s=> {
            if (s.shown) {
                limits.push(Math.max.apply(null, s.values));
                limits.push(Math.min.apply(null, s.values));
            }
        });
        let result = {
            yMax: Math.max.apply(null, limits),
            yMin: Math.min.apply(null, limits),
            labels: []
        };

        let yStep = (result.yMax - result.yMin) / (steps - 1);
        for (let i = 0; i < steps; i++) {
            result.labels.push(Math.round(result.yMax - yStep * i))
        }
        return result;
    }

    updateRange({start, end}, updateScaleBar) {
        this.xRangePercent.start = start;
        this.xRangePercent.end = end;
        const yAxisData = this.calcYAxis({steps: 6});
        const seriesRect = this.getSeriesRect()
        this.drawables.scMain.updateRange(
            {
                rect: seriesRect,
                yAxisData: yAxisData
            })
        if (updateScaleBar) {
            this.drawables.scUnderScaleBar.updateRange(
                {
                    yAxisData: yAxisData
                })
        }
        this.drawables.xAxis.update({x:seriesRect.x,width:seriesRect.width})
        this.drawables.yAxis.updateValues(yAxisData)
        this.setupRenderer();

    }

    getSeriesRect() {
        const scaleFactor = 1 / ((this.xRangePercent.end - this.xRangePercent.start ) / 100);

        return {
            x: this.pixelPerPercent * this.xRangePercent.start * scaleFactor * -1,
            y: paddingTop,
            width: this.width * scaleFactor,
            height: this.height - ScaleBarHeight - paddingTop * 2,
        };
    }

    addSceneObjects() {
        this.sceneObjectGroups = [];

        const yAxisData = this.calcYAxis({steps: 6});


        let seriesRect = this.getSeriesRect();
        let mainRect = {
            x: 0,
            y: paddingTop,
            width: this.width,
            height: this.height - ScaleBarHeight - paddingTop - xAxisHeight,
        };

        let xAxisRect = {
            x: seriesRect.x,
            y: this.height - ScaleBarHeight - xAxisHeight,
            width: seriesRect.width,
            height: xAxisHeight
        };

        let scaleBarRect = {
            x: 0,
            y: this.height - ScaleBarHeight,
            width: this.width,
            height: ScaleBarHeight
        };

        this.drawables.yAxis = new _yAxis_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
            rect: mainRect,
            data: yAxisData,
            orientation: 'left', //todo
        });
        this.drawables.xAxis = new _xAxis_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
            rect: xAxisRect,
            data: this.xAxisData,
            ctx:this.ctx
        });
        this.drawables.scMain = new _SeriesContainer_js__WEBPACK_IMPORTED_MODULE_3__["default"]({
            yAxisData,
            rect: seriesRect,
            visibleRect: mainRect,
            series: this.series
        });
        this.drawables.scUnderScaleBar = new _SeriesContainer_js__WEBPACK_IMPORTED_MODULE_3__["default"]({
            yAxisData,
            rect: scaleBarRect,
            series: this.series
        });
        this.drawables.sb = new _ScaleBar_js__WEBPACK_IMPORTED_MODULE_2__["default"]({
            bg: 'rgba(225,225,225,0.5)',
            rect: scaleBarRect,
            range: this.xRangePercent,
            onRangeChange: this.updateRange.bind(this),
            canvas: this.canvas
        });


        this.sceneObjectGroups.push([this.drawables.yAxis, this.drawables.scMain]);
        this.sceneObjectGroups.push([this.drawables.xAxis]);
        this.sceneObjectGroups.push([this.drawables.scUnderScaleBar, this.drawables.sb]);

    }

    static initFromData(data) {
        let series = {};
        for (let key in data.types) {
            series[key] = {
                id: key,
                type: data.types[key],
                legendName: data.names[key],
                color: data.colors[key],
                values: data.columns.find(col=>col[0] == key).slice(1)
            }
        }
        let xAxis = series['x'];
        //xAxis.values = xAxis.values.map(v=> new Date(v).toLocaleString('en-us', {day: '2-digit', month: 'short'}))
        delete series['x'];
        return new Graph({
            width: 360,//window.innerWidth,
            height: 400,
            xAxis,
            series: Object.values(series)
        })

    }
}

/* harmony default export */ __webpack_exports__["default"] = (Graph);

/***/ }),

/***/ "./src/Line.js":
/*!*********************!*\
  !*** ./src/Line.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils.js */ "./src/Utils.js");


const DEFAULT_ANIMATION_DURATION = 300;
class Line {
    constructor(opts) {
        this.drawn = false;
        this.animating = false;
        this.points = opts.points;
        this.color = opts.color;
        this.opacity=1;
        this.lineWidth = opts.lineWidth || 2;
    }

    updating(TIME) {
        this.update(TIME);
        return !this.drawn || this.animating;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.globalAlpha = this.opacity;
        this.points.forEach((point, i)=> {
            ctx.moveTo.apply(ctx, point);
            ctx.lineTo.apply(ctx, this.points[i + 1] || point);
        });

        ctx.stroke();
        //ctx.globalAlpha=1;
        this.drawn = true;
        return this;
    }

    animate(opts) {
        if (this.animating) {
            //continue current animation during range change, makes it smooth
            this.animOpts.dir.points = this.animOpts.orig.points.map((point, i)=>_Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].subAA(opts.points[i], point))
            return this;
        }
        this.animOpts = {
            orig: {
                points: this.points.map(v=>v),
                opacity: this.opacity
            },
            dir: {
                points: this.points.map((point, i)=>_Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].subAA(opts.points[i], point)),
                opacity:(opts.opacity===undefined? 1:opts.opacity) - this.opacity,
            },
            duration: opts.duration || DEFAULT_ANIMATION_DURATION,
            progress: null,
            start: null
        };
        this.animating = true;
        return this;
    }

    update(TIME) {

        if (!this.animating) return false;
        let opts = this.animOpts;
        if (opts.progress == 1) {
            this.animating = false;
            delete this.animOpts;
            return this;
        }
        if (this.animating && !opts.start) {
            opts.start = TIME;
        }

        opts.progress = ((TIME - opts.start) / opts.duration);
        if (opts.progress > 1) {
            opts.progress = 1;
        }
        if (opts.dir.opacity != 0) {
            console.log(this.opacity)
            this.opacity = opts.orig.opacity+ opts.dir.opacity * opts.progress;
        }
        this.points = opts.orig.points.map((orpoint, i)=> {
            return _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].addAA(orpoint, _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].multiAV(opts.dir.points[i], opts.progress));
        });
    }

}
/* harmony default export */ __webpack_exports__["default"] = (Line);

/***/ }),

/***/ "./src/ScaleBar.js":
/*!*************************!*\
  !*** ./src/ScaleBar.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class HitRect {
    constructor(opts) {
        this.immutable = opts.immutable || false;
        if (this.immutable) {
            this.rect = Object.assign({}, opts.rect);
        } else {
            this.rect = opts.rect;
        }
        this.canvas = opts.canvas;
        this.name = opts.name;
        this.onMove = opts.onMove || function () {
            };
        this.onMoveX = opts.onMoveX || function () {
            };
        this.onClickStart = opts.onClickStart || function () {
            };
        //@todo probably do the fullfeatured down-up click

        const moveHandler = this.move.bind(this)
        this.canvas.addEventListener('mousedown', (e)=> {
            if (this.isHit(e)) {
                this.onClickStart();
                this.canvas.addEventListener('mousemove', moveHandler)
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
            }

        }, false)
        this.canvas.addEventListener('mouseup', (e)=> {
            this.canvas.removeEventListener('mousemove', moveHandler)
        })
        this.canvas.addEventListener('mouseleave', (e)=> {
            this.canvas.removeEventListener('mousemove', moveHandler)
        })

        this.canvas.addEventListener('touchstart', (e)=> {
            if (this.isHit(e)) {
                this.onClickStart();
                this.canvas.addEventListener('touchmove', moveHandler)
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
            }

        })
        this.canvas.addEventListener('touchend', (e)=> {
            this.canvas.removeEventListener('touchmove', moveHandler)
        })

    }

    move(e) {
        let eX = e.layerX || e.offsetX,
            eY = e.layerY || e.offsetY,
            xDiff = eX - this.sX;

        this.rect.x += xDiff;
        this.onMoveX(xDiff)
        this.sX = eX;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.onMove(this.rect);
    }

    isHit(e) {
        let r = this.rect,
            eX = e.layerX || e.offsetX,
            eY = e.layerY || e.offsetY,
            hitX = r.x < eX && eX < r.x + r.width,
            hitY = r.y < eY && eY < r.y + r.height;


        this.sX = eX;
        this.sY = eY;
        return hitY && hitX
    }
}


const DRAG_BOX_WIDTH = 10;
const LINE_WIDTH = 3;
const DRAG_BOX_COLOR = 'rgba(150,150,150,0.7)';
const BG = 'rgba(150,150,150,0.3)';

class ScaleBar {
    constructor(opts) {
        this.drawn = false;
        this.rect = opts.rect;
        this.bg = opts.bg || BG;
        this.dragBoxColor = opts.dragBoxColor || DRAG_BOX_COLOR;
        this.dragBoxWidth = opts.dragBoxWidth || DRAG_BOX_WIDTH;
        this.range = Object.assign(opts.range);
        this.onRangeChange = opts.onRangeChange || function () {
            }

        this.visibleRect = {};
        this.rightBoxRect = {};
        this.leftBoxRect = {};

        this.calculateRect();
        this.lineWidth = opts.lineWidth || LINE_WIDTH;

        new HitRect({
            name: 'left',
            rect: this.leftBoxRect,
            onMoveX: this.onMoveLeftBar.bind(this),
            canvas: opts.canvas
        })
        new HitRect({
            name: 'right',
            rect: this.rightBoxRect,
            onMoveX: this.onMoveRightBar.bind(this),
            canvas: opts.canvas
        })
        new HitRect({
            name: 'trans',
            rect: this.visibleRect,
            onMove: this.onMoveVisibleArea.bind(this),
            canvas: opts.canvas
        })

        //@todo limit left-right bars crossing. Funny mirror effect lol


    }

    onMoveLeftBar(diffX) {
        this.visibleRect.x += diffX;
        this.visibleRect.width -= diffX;
        this.onMoveVisibleArea(this.visibleRect)
    }

    onMoveRightBar(diffX) {
        this.visibleRect.width += diffX;
        this.onMoveVisibleArea(this.visibleRect)
    }

    onMoveVisibleArea(vr) {
        this.drawn = false;
        vr.x < this.rect.x && (vr.x = this.rect.x);
        vr.x > (this.rect.width + this.rect.x - vr.width) && (vr.x = this.rect.width + this.rect.x - vr.width);

        this.range.start = ((vr.x - this.rect.x) / this.rect.width) * 100
        this.range.end = ((vr.x - this.rect.x + vr.width) / this.rect.width) * 100

        this.calculateRect();
        this.onRangeChange(this.range);
    }

    calculateRect() {

        //this logic is based on reference passing to HitRect class. So we are keeping same objects references (matating params).
        //otherwise calculate each hit box  changes separately.

        Object.assign(this.visibleRect, {
            x: this.rect.x + ((this.rect.width / 100) * this.range.start),
            y: this.rect.y,
            width: ((this.range.end - this.range.start) / 100) * this.rect.width,
            height: this.rect.height
        });

        //tripple hit box for Bars
        Object.assign(this.leftBoxRect, {
            x: this.visibleRect.x - this.dragBoxWidth,
            y: this.visibleRect.y,
            width: this.dragBoxWidth * 3,
            height: this.visibleRect.height
        })
        Object.assign(this.rightBoxRect, {
            x: this.visibleRect.x + this.visibleRect.width - this.dragBoxWidth * 2,
            y: this.visibleRect.y,
            width: this.dragBoxWidth * 3,
            height: this.visibleRect.height
        })
    }

    updating() {
        return !this.drawn;
    }

    draw(ctx) {

        const {dragBoxWidth, lineWidth, dragBoxColor, bg} = this;
        const r = this.rect;
        const vr = this.visibleRect;

        ctx.fillStyle = bg;
        ctx.lineWidth = lineWidth;

        ctx.fillRect(r.x, r.y, vr.x - r.x, r.height); //left grayout
        ctx.fillRect(vr.x + vr.width, r.y, r.width - vr.x - vr.width, vr.height); //right grayout
        ctx.fillRect(vr.x + dragBoxWidth, vr.y, vr.width - dragBoxWidth * 2, lineWidth); //visible box top line
        ctx.fillRect(vr.x + dragBoxWidth, vr.y + vr.height - lineWidth, vr.width - dragBoxWidth * 2, lineWidth); //visible box bottom line

        ctx.fillStyle = dragBoxColor;

        ctx.fillRect(vr.x, vr.y, dragBoxWidth, vr.height);  //leftDragBar
        ctx.fillRect(vr.x + vr.width - dragBoxWidth, vr.y, dragBoxWidth, vr.height);  //rightDragBar

        this.drawn = true;
    }

}
/* harmony default export */ __webpack_exports__["default"] = (ScaleBar);

/***/ }),

/***/ "./src/SeriesContainer.js":
/*!********************************!*\
  !*** ./src/SeriesContainer.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Line_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Line.js */ "./src/Line.js");

class SeriesContainer {
    constructor(opts) {
        this.rect = opts.rect;
        this.visibleRect = opts.visibleRect || this.rect;
        this.series = opts.series.map(ser => Object.assign({}, ser));
        this.yAxisData = opts.yAxisData
        this.drawables = []

        this.series.forEach(ser=> {
            if (ser.type == 'line') {
                let points = this.calculate({
                    yAxis: this.yAxisData,
                    values: ser.values,
                    rect: this.rect,
                });

                let initPoints = points.map(p=> {
                    return [p[0], this.rect.height / 2 + this.rect.y]
                });
                let line = new _Line_js__WEBPACK_IMPORTED_MODULE_0__["default"]({points: initPoints, color: ser.color})
                line.animate({points});
                ser.drawableLine = line;
                this.drawables.push(line);
            }
        })
    }

    toggleSerie(id) {
        var ser = this.series.find(s=> s.id == id);
        ser.shown = !ser.shown;
        if (!ser.shown) {
            ser.drawableLine.animate({
                points: ser.drawableLine.points.map(p=> {
                    return [p[0], this.rect.y]
                }),
                opacity:0
            });
        }

        //serie.drawableLine.drawn = false;

    }

    updateRange({rect, yAxisData}) {
        if (rect) {
            this.rect = rect;
        }
        this.yAxisData = yAxisData;
        this.series.forEach(ser=> {
            if (ser.type == 'line' && ser.shown) {
                let points = this.calculate({
                    yAxis: this.yAxisData,
                    values: ser.values,
                    rect: this.rect,
                });
                ser.drawableLine.animate({points});
            }
        })
    }

    calculate({values, rect, yAxis}) {
        let {yMax, yMin} = yAxis;
        let xStep = rect.width / (values.length - 1);
        return values.map((value, i)=> {
            let newY = Math.abs(((value - yMin) / (yMax - yMin)) * rect.height - rect.height) + rect.y;
            return [
                i * xStep + rect.x,
                newY
            ]
        })

    }

    updating(TIME) {
        let anyUpdates = false;
        this.series.forEach(s=> {
            let d = s.drawableLine;
            let res = d.updating(TIME)
            if (!anyUpdates) {
                anyUpdates = res;
            }

        })
        return anyUpdates;
    }

    draw(ctx) {
        this.series.forEach(s=> {
            if (s.shown || s.drawableLine.animating) {
            let d = s.drawableLine
            d.draw(ctx)
            }
        })

    }
}
/* harmony default export */ __webpack_exports__["default"] = (SeriesContainer);

/***/ }),

/***/ "./src/Utils.js":
/*!**********************!*\
  !*** ./src/Utils.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class Utils {
    constructor() {
    }

    static newDeferred() {
        let resolve, reject;
        let promise = new Promise((res, rej)=> {
            resolve = res;
            reject = rej;
        })
        return {
            promise,
            resolve,
            reject
        }
    }

    static keyByValue(obj, value) {
        for (let key in obj) {
            if (obj[key] === value) {
                return key;
            }
        }
        return null;
    }

    static subAA(a1, a2) {
        return a1.map((v, i)=> {
            return v - a2[i];
        })
    }

    static addAA(a1, a2) {
        return a1.map((v, i)=> {
            return v + a2[i];
        })
    }

    static multiAV(a1, val) {
        return a1.map((v, i)=> {
            return v * val;
        })
    }
}
/* harmony default export */ __webpack_exports__["default"] = (Utils);

/***/ }),

/***/ "./src/xAxis.js":
/*!**********************!*\
  !*** ./src/xAxis.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]
class XAxisScene {
    constructor(opts) {
        this.drawn = false;
        this.rect = opts.rect;
        this.points = [];

        this.cols = opts.data.values.map((v, i)=> {
            let d = new Date(v);
            let ta = 'center'
            if (i == 0) {
                ta = 'left'
            } else if (i == opts.data.values.length - 1) {
                ta = 'right'
            }
            let text  = d.getDate() + ' ' + MONTHS[d.getMonth()];
            opts.ctx.fillStyle = 'black'
            opts.ctx.font = '14px Arial'
            return {
                textAlign: ta,
                value: v,
                text:text,
                width: opts.ctx.measureText(text).width
            }
        })

        this.calculate();
    }


    calculate() {
        let xStep = this.rect.width / (this.cols.length - 1);
        this.labels = this.cols.map((col, i)=> {
            return {
                x: this.rect.x + (i * xStep),
                y: this.rect.y + this.rect.height - 5,
                textAlign: col.textAlign,
                text: col.text,
                width:col.width
            }
        })
    }

    update({x, width}) {
        this.rect.x = x;
        this.rect.width = width;
        this.calculate();
        this.drawn = false;
    }

    updating() {
        return !this.drawn;
    }

    draw(ctx) {
        const r = this.rect
        // ctx.fillStyle = 'red';
        //ctx.fillRect(r.x, r.y, r.width, r.height)
        ctx.fillStyle = 'black'
        ctx.font = '14px Arial'

        let takenX = this.labels[0].x;
        this.labels.forEach((lb, i)=> {
            if (i > 0 && lb.x - lb.width / 2 < takenX) {
                return;
            }
            ctx.textAlign = lb.textAlign;
            takenX += lb.width + 20
            ctx.fillText(lb.text, lb.x, lb.y);
        })
        this.drawn = true;
    }


}

/* harmony default export */ __webpack_exports__["default"] = (XAxisScene);

/***/ }),

/***/ "./src/yAxis.js":
/*!**********************!*\
  !*** ./src/yAxis.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Line_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Line.js */ "./src/Line.js");


class YAxisScene {
    constructor(opts) {
        this.drawn = false;
        this.data = opts.data;

        this.labels = [];
        this.lines = [];

        this.rect = opts.rect;
        this.bg = opts.bg;
        this.padding = opts.padding || 5;
        this.lineColor = opts.lineColor || 'grey';
        this.lineWidth = opts.lineWidth || 0.3;
        this.fontColor = opts.fontColor || 'black';
        this.fontSize = opts.fontSize || 14;
        this.labelFormatFn = opts.labelFormatFn || this.labelFormatFnDefault;

        this.calculate();
    }
    updateValues(data){
        this.data=data;
        this.calculate();
        this.drawn = false;
    }
    labelFormatFnDefault(value) {
        value = parseInt(value)
        if (value / 1e9 >= 1) {
            value = (value / 1e9).toFixed(2) + 'b'
        } else if (value / 1e6 >= 1) {
            value = (value / 1e6).toFixed(2) + 'm'
        } else if (value / 1e3 >= 1) {
            value = (value / 1e3).toFixed(2) + 'k'
        }
        return value
    }

    calculate() {
        //top to bottom
        let startY = this.rect.y;
        let yPixelStep = this.rect.height / (this.data.labels.length - 1);
        this.labels = [];
        this.lines = [];
        this.data.labels.forEach(lbl=> {

            this.labels.push({
                text: lbl.toString(),
                fontSize: this.fontSize,
                fontColor: this.fontColor,
                x: this.rect.x + this.padding,
                y: startY - this.padding
            })
            this.lines.push(new _Line_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
                points: [
                    [this.rect.x, startY],
                    [this.rect.width, startY]
                ],
                lineWidth: this.lineWidth,
                color: this.lineColor
            }))
            startY += yPixelStep;
        })
        //hotfix for not drawing top line ? is it even needed?
        //this.lines.splice(0,1)
        //this.labels.splice(0,1)
    }

    updating() {
        return !this.drawn;
    }

    draw(ctx) {
        let r = this.rect;

        if (this.bg) {
            ctx.fillStyle = this.bg;
            ctx.fillRect(r.x, r.y, r.width, r.height)
        }
        this.lines.forEach(line=>line.draw(ctx));
        this.labels.forEach((lbl, i)=> {
            ctx.font = `${lbl.fontSize}px Arial`;
            ctx.textAlign = 'left';
            ctx.fillStyle = lbl.fontColor;

            let y = i == 0 ? lbl.y + lbl.fontSize + this.padding : lbl.y;
            ctx.fillText(this.labelFormatFnDefault(lbl.text), lbl.x, y)
        })
        this.drawn = true;
    }
}

/* harmony default export */ __webpack_exports__["default"] = (YAxisScene);

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9HcmFwaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvTGluZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvU2NhbGVCYXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Nlcmllc0NvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvVXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3hBeGlzLmpzIiwid2VicGFjazovLy8uL3NyYy95QXhpcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIscURBQUs7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBLFNBQVM7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QUVlLHlFOzs7Ozs7Ozs7Ozs7QUMvRWY7QUFBQTtBQUE2Qjs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLGdDQUFnQyxnREFBSTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGFBQWE7QUFDdkM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFZSx5RSIsImZpbGUiOiJhcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9hcHAuanNcIik7XG4iLCJpbXBvcnQgR3JhcGggZnJvbSBcIi4vc3JjL0dyYXBoLmpzXCI7XG5mdW5jdGlvbiBnZXREYXRhKCkge1xuICAgIHJldHVybiBmZXRjaCgnLi9jaGFydF9kYXRhLmpzb24nKVxuICAgICAgICAudGhlbihzPT5zLmpzb24oKSlcbiAgICAgICAgLnRoZW4oZGF0YT0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5nID0gR3JhcGguaW5pdEZyb21EYXRhKGRhdGFbMF0pO1xuXG4gICAgICAgICAgICAvL21pbmlmeSB3ZWJwYWNrXG4gICAgICAgICAgICAvL3kgb24gc2NhbGUgIC9hbmltYXRlIC8gb24gbGVnZW5kXG4gICAgICAgICAgICAvLyByZWNhbGN1bGF0ZSB4IG9uIHNjYWxlIC8gYW5pbWF0ZSAvIG9uIGxlZ2VuZFxuICAgICAgICAgICAgLy9uaWdodCBzaGlmdFxuXG4gICAgICAgICAgICAvLyB0b29sdGlwcyA/IGZ1Y2tcblxuXG4gICAgICAgICAgICAvL211bHRpc2VyaWVzXG4gICAgICAgIH0pXG59XG5nZXREYXRhKCk7XG5cbiIsImltcG9ydCBZQXhpc1NjZW5lIGZyb20gXCIuL3lBeGlzLmpzXCI7XG5pbXBvcnQgWEF4aXNTY2VuZSBmcm9tIFwiLi94QXhpcy5qc1wiO1xuaW1wb3J0IFNjYWxlQmFyIGZyb20gXCIuL1NjYWxlQmFyLmpzXCI7XG5pbXBvcnQgU2VyaWVzQ29udGFpbmVyIGZyb20gXCIuL1Nlcmllc0NvbnRhaW5lci5qc1wiO1xuXG5jb25zdCBwYWRkaW5nVG9wID0gMjA7XG5jb25zdCBTY2FsZUJhckhlaWdodCA9IDgwO1xuY29uc3QgeEF4aXNIZWlnaHQgPSAyMDtcblxuY2xhc3MgR3JhcGgge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgbGV0IGNhbnZhcyA9IG9wdHMuZWw7XG4gICAgICAgIHRoaXMuc2VyaWVzID0gb3B0cy5zZXJpZXMubWFwKHM9PiB7XG4gICAgICAgICAgICBzLnNob3duID0gdHJ1ZTtcbiAgICAgICAgICAgIHMuaWQgPSBNYXRoLnJhbmRvbSgpICsgRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy54QXhpc0RhdGEgPSBvcHRzLnhBeGlzO1xuICAgICAgICB0aGlzLmRyYXdhYmxlcyA9IHt9O1xuICAgICAgICB0aGlzLnNob3dMZWdlbmQgPSBvcHRzLnNob3dMZWdlbmQgfHwgdHJ1ZTtcbiAgICAgICAgdGhpcy54UmFuZ2VQZXJjZW50ID0gb3B0cy5kZWZhdWx0WFJhbmdlUGVyY2VudCB8fCB7c3RhcnQ6IDAsIGVuZDogMzB9O1xuICAgICAgICB0aGlzLnNjZW5lT2JqZWN0R3JvdXBzID0gW107XG4gICAgICAgIGlmIChjYW52YXMpIHtcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSBwYXJzZUludChjYW52YXMud2lkdGgpO1xuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBwYXJzZUludChjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgY2FudmFzLmlkID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGggPSBvcHRzLndpZHRoO1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0ID0gb3B0cy5oZWlnaHQ7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgdGhpcy5jdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLnBpeGVsUGVyUGVyY2VudCA9IHRoaXMud2lkdGggLyAxMDA7XG4gICAgICAgIHRoaXMuc2V0dXBSZW5kZXJlcigpO1xuICAgICAgICB0aGlzLmFkZFNjZW5lT2JqZWN0cygpO1xuICAgICAgICBpZiAodGhpcy5zaG93TGVnZW5kKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRMZWdlbmQodGhpcy5zZXJpZXMubWFwKHM9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogcy5sZWdlbmROYW1lLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogcy5jb2xvcixcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHMuaWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0TGVnZW5kKHNlcmllcykge1xuICAgICAgICBsZXQgbGVnZW5kQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24obGVnZW5kQ29udGFpbmVyLnN0eWxlLCB7XG4gICAgICAgICAgICBvdmVyZmxvd1g6ICdzY3JvbGwnLFxuICAgICAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgcGFkZGluZzogJzIwcHggMTBweCcsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCArICdweCdcbiAgICAgICAgfSlcbiAgICAgICAgc2VyaWVzLmZvckVhY2goKHMpPT4ge1xuICAgICAgICAgICAgbGVnZW5kQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlTGVnZW5kQnV0dG9uKHMpKTtcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5jYW52YXMucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChsZWdlbmRDb250YWluZXIpXG4gICAgfVxuXG4gICAgY3JlYXRlTGVnZW5kQnV0dG9uKHNlcmllSW5mbykge1xuICAgICAgICBsZXQgYnV0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oYnV0RWwuc3R5bGUsIHtcbiAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBzZXJpZUluZm8uY29sb3IsXG4gICAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtzZXJpZUluZm8uY29sb3J9YCxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgICAgICAgICAgbWluV2lkdGg6ICc4MHB4JyxcbiAgICAgICAgICAgIHBhZGRpbmc6ICcxMHB4JyxcbiAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgICBtYXJnaW5SaWdodDogJzIwcHgnLFxuICAgICAgICAgICAgY29sb3I6ICd3aGl0ZSdcbiAgICAgICAgfSlcbiAgICAgICAgLy8gbGV0IGljb25FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcbiAgICAgICAgLy8gaWNvbkVsLmlubmVyVGV4dCA9ICdpY29uJztcbiAgICAgICAgLy8gYnV0RWwuYXBwZW5kQ2hpbGQoaWNvbkVsKTtcbiAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHRleHQuaW5uZXJUZXh0ID0gc2VyaWVJbmZvLm5hbWU7XG4gICAgICAgIGJ1dEVsLmFwcGVuZENoaWxkKHRleHQpO1xuXG4gICAgICAgIGJ1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy50b2dnbGVTZXJpZShzZXJpZUluZm8uaWQpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oYnV0RWwuc3R5bGUsIHtcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBzZXJpZUluZm8uY29sb3IsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihidXRFbC5zdHlsZSwge1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnYmxhY2snXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gYnV0RWw7XG4gICAgfVxuXG4gICAgdG9nZ2xlU2VyaWUoaWQpIHtcbiAgICAgICAgdmFyIHNlcmllID0gdGhpcy5zZXJpZXMuZmluZChzPT4gcy5pZCA9PSBpZCk7XG4gICAgICAgIHNlcmllLnNob3duID0gIXNlcmllLnNob3duO1xuICAgICAgICB0aGlzLmRyYXdhYmxlcy5zY01haW4udG9nZ2xlU2VyaWUoaWQpO1xuICAgICAgICB0aGlzLmRyYXdhYmxlcy5zY1VuZGVyU2NhbGVCYXIudG9nZ2xlU2VyaWUoaWQpO1xuICAgICAgICB0aGlzLnVwZGF0ZVJhbmdlKHRoaXMueFJhbmdlUGVyY2VudCwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBzZXJpZS5zaG93bjtcbiAgICB9XG5cbiAgICBzZXR1cFJlbmRlcmVyKCkge1xuXG4gICAgICAgIGlmICh0aGlzLnJlbmRlcmluZykgcmV0dXJuO1xuICAgICAgICB0aGlzLnJlbmRlcmluZyA9IHRydWVcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IG5leHRGcmFtZUhhbmRsZXIgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cbiAgICAgICAgbGV0IHN0YWxlRnJhbWVzID0gMDtcblxuICAgICAgICBmdW5jdGlvbiByZW5kZXJlcih0ZkRpZmYpIHtcbiAgICAgICAgICAgIHN0YWxlRnJhbWVzKys7XG4gICAgICAgICAgICBzZWxmLnNjZW5lT2JqZWN0R3JvdXBzLmZvckVhY2goKGdyb3VwLCBpKT0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYW55VXBkYXRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGdyb3VwLmZvckVhY2gob2JqPT4ge1xuICAgICAgICAgICAgICAgICAgICBvYmoudXBkYXRpbmcodGZEaWZmKSAmJiAoYW55VXBkYXRlcyA9IHRydWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChhbnlVcGRhdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWxlRnJhbWVzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jdHguY2xlYXJSZWN0KGdyb3VwWzBdLnJlY3QueCwgZ3JvdXBbMF0ucmVjdC55LCBncm91cFswXS5yZWN0LndpZHRoLCBncm91cFswXS5yZWN0LmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwLmZvckVhY2gob2JqPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmRyYXcoc2VsZi5jdHgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHN0YWxlRnJhbWVzIDwgNCkge1xuICAgICAgICAgICAgICAgIG5leHRGcmFtZUhhbmRsZXIocmVuZGVyZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLnJlbmRlcmluZyA9IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBuZXh0RnJhbWVIYW5kbGVyKHJlbmRlcmVyKTtcbiAgICB9XG5cbiAgICBjYWxjWUF4aXMoe3N0ZXBzLCB5UGFkZGluZ30pIHtcbiAgICAgICAgbGV0IGxpbWl0cyA9IFtdO1xuICAgICAgICB0aGlzLnNlcmllcy5mb3JFYWNoKHM9PiB7XG4gICAgICAgICAgICBpZiAocy5zaG93bikge1xuICAgICAgICAgICAgICAgIGxpbWl0cy5wdXNoKE1hdGgubWF4LmFwcGx5KG51bGwsIHMudmFsdWVzKSk7XG4gICAgICAgICAgICAgICAgbGltaXRzLnB1c2goTWF0aC5taW4uYXBwbHkobnVsbCwgcy52YWx1ZXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgICAgICB5TWF4OiBNYXRoLm1heC5hcHBseShudWxsLCBsaW1pdHMpLFxuICAgICAgICAgICAgeU1pbjogTWF0aC5taW4uYXBwbHkobnVsbCwgbGltaXRzKSxcbiAgICAgICAgICAgIGxhYmVsczogW11cbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgeVN0ZXAgPSAocmVzdWx0LnlNYXggLSByZXN1bHQueU1pbikgLyAoc3RlcHMgLSAxKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGVwczsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHQubGFiZWxzLnB1c2goTWF0aC5yb3VuZChyZXN1bHQueU1heCAtIHlTdGVwICogaSkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICB1cGRhdGVSYW5nZSh7c3RhcnQsIGVuZH0sIHVwZGF0ZVNjYWxlQmFyKSB7XG4gICAgICAgIHRoaXMueFJhbmdlUGVyY2VudC5zdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLnhSYW5nZVBlcmNlbnQuZW5kID0gZW5kO1xuICAgICAgICBjb25zdCB5QXhpc0RhdGEgPSB0aGlzLmNhbGNZQXhpcyh7c3RlcHM6IDZ9KTtcbiAgICAgICAgY29uc3Qgc2VyaWVzUmVjdCA9IHRoaXMuZ2V0U2VyaWVzUmVjdCgpXG4gICAgICAgIHRoaXMuZHJhd2FibGVzLnNjTWFpbi51cGRhdGVSYW5nZShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZWN0OiBzZXJpZXNSZWN0LFxuICAgICAgICAgICAgICAgIHlBeGlzRGF0YTogeUF4aXNEYXRhXG4gICAgICAgICAgICB9KVxuICAgICAgICBpZiAodXBkYXRlU2NhbGVCYXIpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd2FibGVzLnNjVW5kZXJTY2FsZUJhci51cGRhdGVSYW5nZShcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHlBeGlzRGF0YTogeUF4aXNEYXRhXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyYXdhYmxlcy54QXhpcy51cGRhdGUoe3g6c2VyaWVzUmVjdC54LHdpZHRoOnNlcmllc1JlY3Qud2lkdGh9KVxuICAgICAgICB0aGlzLmRyYXdhYmxlcy55QXhpcy51cGRhdGVWYWx1ZXMoeUF4aXNEYXRhKVxuICAgICAgICB0aGlzLnNldHVwUmVuZGVyZXIoKTtcblxuICAgIH1cblxuICAgIGdldFNlcmllc1JlY3QoKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlRmFjdG9yID0gMSAvICgodGhpcy54UmFuZ2VQZXJjZW50LmVuZCAtIHRoaXMueFJhbmdlUGVyY2VudC5zdGFydCApIC8gMTAwKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5waXhlbFBlclBlcmNlbnQgKiB0aGlzLnhSYW5nZVBlcmNlbnQuc3RhcnQgKiBzY2FsZUZhY3RvciAqIC0xLFxuICAgICAgICAgICAgeTogcGFkZGluZ1RvcCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoICogc2NhbGVGYWN0b3IsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0IC0gU2NhbGVCYXJIZWlnaHQgLSBwYWRkaW5nVG9wICogMixcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhZGRTY2VuZU9iamVjdHMoKSB7XG4gICAgICAgIHRoaXMuc2NlbmVPYmplY3RHcm91cHMgPSBbXTtcblxuICAgICAgICBjb25zdCB5QXhpc0RhdGEgPSB0aGlzLmNhbGNZQXhpcyh7c3RlcHM6IDZ9KTtcblxuXG4gICAgICAgIGxldCBzZXJpZXNSZWN0ID0gdGhpcy5nZXRTZXJpZXNSZWN0KCk7XG4gICAgICAgIGxldCBtYWluUmVjdCA9IHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiBwYWRkaW5nVG9wLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0IC0gU2NhbGVCYXJIZWlnaHQgLSBwYWRkaW5nVG9wIC0geEF4aXNIZWlnaHQsXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IHhBeGlzUmVjdCA9IHtcbiAgICAgICAgICAgIHg6IHNlcmllc1JlY3QueCxcbiAgICAgICAgICAgIHk6IHRoaXMuaGVpZ2h0IC0gU2NhbGVCYXJIZWlnaHQgLSB4QXhpc0hlaWdodCxcbiAgICAgICAgICAgIHdpZHRoOiBzZXJpZXNSZWN0LndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB4QXhpc0hlaWdodFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBzY2FsZUJhclJlY3QgPSB7XG4gICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgeTogdGhpcy5oZWlnaHQgLSBTY2FsZUJhckhlaWdodCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBTY2FsZUJhckhlaWdodFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZHJhd2FibGVzLnlBeGlzID0gbmV3IFlBeGlzU2NlbmUoe1xuICAgICAgICAgICAgcmVjdDogbWFpblJlY3QsXG4gICAgICAgICAgICBkYXRhOiB5QXhpc0RhdGEsXG4gICAgICAgICAgICBvcmllbnRhdGlvbjogJ2xlZnQnLCAvL3RvZG9cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZHJhd2FibGVzLnhBeGlzID0gbmV3IFhBeGlzU2NlbmUoe1xuICAgICAgICAgICAgcmVjdDogeEF4aXNSZWN0LFxuICAgICAgICAgICAgZGF0YTogdGhpcy54QXhpc0RhdGEsXG4gICAgICAgICAgICBjdHg6dGhpcy5jdHhcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZHJhd2FibGVzLnNjTWFpbiA9IG5ldyBTZXJpZXNDb250YWluZXIoe1xuICAgICAgICAgICAgeUF4aXNEYXRhLFxuICAgICAgICAgICAgcmVjdDogc2VyaWVzUmVjdCxcbiAgICAgICAgICAgIHZpc2libGVSZWN0OiBtYWluUmVjdCxcbiAgICAgICAgICAgIHNlcmllczogdGhpcy5zZXJpZXNcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZHJhd2FibGVzLnNjVW5kZXJTY2FsZUJhciA9IG5ldyBTZXJpZXNDb250YWluZXIoe1xuICAgICAgICAgICAgeUF4aXNEYXRhLFxuICAgICAgICAgICAgcmVjdDogc2NhbGVCYXJSZWN0LFxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kcmF3YWJsZXMuc2IgPSBuZXcgU2NhbGVCYXIoe1xuICAgICAgICAgICAgYmc6ICdyZ2JhKDIyNSwyMjUsMjI1LDAuNSknLFxuICAgICAgICAgICAgcmVjdDogc2NhbGVCYXJSZWN0LFxuICAgICAgICAgICAgcmFuZ2U6IHRoaXMueFJhbmdlUGVyY2VudCxcbiAgICAgICAgICAgIG9uUmFuZ2VDaGFuZ2U6IHRoaXMudXBkYXRlUmFuZ2UuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGNhbnZhczogdGhpcy5jYW52YXNcbiAgICAgICAgfSk7XG5cblxuICAgICAgICB0aGlzLnNjZW5lT2JqZWN0R3JvdXBzLnB1c2goW3RoaXMuZHJhd2FibGVzLnlBeGlzLCB0aGlzLmRyYXdhYmxlcy5zY01haW5dKTtcbiAgICAgICAgdGhpcy5zY2VuZU9iamVjdEdyb3Vwcy5wdXNoKFt0aGlzLmRyYXdhYmxlcy54QXhpc10pO1xuICAgICAgICB0aGlzLnNjZW5lT2JqZWN0R3JvdXBzLnB1c2goW3RoaXMuZHJhd2FibGVzLnNjVW5kZXJTY2FsZUJhciwgdGhpcy5kcmF3YWJsZXMuc2JdKTtcblxuICAgIH1cblxuICAgIHN0YXRpYyBpbml0RnJvbURhdGEoZGF0YSkge1xuICAgICAgICBsZXQgc2VyaWVzID0ge307XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBkYXRhLnR5cGVzKSB7XG4gICAgICAgICAgICBzZXJpZXNba2V5XSA9IHtcbiAgICAgICAgICAgICAgICBpZDoga2V5LFxuICAgICAgICAgICAgICAgIHR5cGU6IGRhdGEudHlwZXNba2V5XSxcbiAgICAgICAgICAgICAgICBsZWdlbmROYW1lOiBkYXRhLm5hbWVzW2tleV0sXG4gICAgICAgICAgICAgICAgY29sb3I6IGRhdGEuY29sb3JzW2tleV0sXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBkYXRhLmNvbHVtbnMuZmluZChjb2w9PmNvbFswXSA9PSBrZXkpLnNsaWNlKDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHhBeGlzID0gc2VyaWVzWyd4J107XG4gICAgICAgIC8veEF4aXMudmFsdWVzID0geEF4aXMudmFsdWVzLm1hcCh2PT4gbmV3IERhdGUodikudG9Mb2NhbGVTdHJpbmcoJ2VuLXVzJywge2RheTogJzItZGlnaXQnLCBtb250aDogJ3Nob3J0J30pKVxuICAgICAgICBkZWxldGUgc2VyaWVzWyd4J107XG4gICAgICAgIHJldHVybiBuZXcgR3JhcGgoe1xuICAgICAgICAgICAgd2lkdGg6IDM2MCwvL3dpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgICAgICAgICB4QXhpcyxcbiAgICAgICAgICAgIHNlcmllczogT2JqZWN0LnZhbHVlcyhzZXJpZXMpXG4gICAgICAgIH0pXG5cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyYXBoIiwiaW1wb3J0IFV0aWxzIGZyb20gXCIuL1V0aWxzLmpzXCI7XG5cbmNvbnN0IERFRkFVTFRfQU5JTUFUSU9OX0RVUkFUSU9OID0gMzAwO1xuY2xhc3MgTGluZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICB0aGlzLmRyYXduID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMucG9pbnRzID0gb3B0cy5wb2ludHM7XG4gICAgICAgIHRoaXMuY29sb3IgPSBvcHRzLmNvbG9yO1xuICAgICAgICB0aGlzLm9wYWNpdHk9MTtcbiAgICAgICAgdGhpcy5saW5lV2lkdGggPSBvcHRzLmxpbmVXaWR0aCB8fCAyO1xuICAgIH1cblxuICAgIHVwZGF0aW5nKFRJTUUpIHtcbiAgICAgICAgdGhpcy51cGRhdGUoVElNRSk7XG4gICAgICAgIHJldHVybiAhdGhpcy5kcmF3biB8fCB0aGlzLmFuaW1hdGluZztcbiAgICB9XG5cbiAgICBkcmF3KGN0eCkge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuY29sb3I7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmxpbmVXaWR0aDtcbiAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gdGhpcy5vcGFjaXR5O1xuICAgICAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwb2ludCwgaSk9PiB7XG4gICAgICAgICAgICBjdHgubW92ZVRvLmFwcGx5KGN0eCwgcG9pbnQpO1xuICAgICAgICAgICAgY3R4LmxpbmVUby5hcHBseShjdHgsIHRoaXMucG9pbnRzW2kgKyAxXSB8fCBwb2ludCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgLy9jdHguZ2xvYmFsQWxwaGE9MTtcbiAgICAgICAgdGhpcy5kcmF3biA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGFuaW1hdGUob3B0cykge1xuICAgICAgICBpZiAodGhpcy5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgIC8vY29udGludWUgY3VycmVudCBhbmltYXRpb24gZHVyaW5nIHJhbmdlIGNoYW5nZSwgbWFrZXMgaXQgc21vb3RoXG4gICAgICAgICAgICB0aGlzLmFuaW1PcHRzLmRpci5wb2ludHMgPSB0aGlzLmFuaW1PcHRzLm9yaWcucG9pbnRzLm1hcCgocG9pbnQsIGkpPT5VdGlscy5zdWJBQShvcHRzLnBvaW50c1tpXSwgcG9pbnQpKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmltT3B0cyA9IHtcbiAgICAgICAgICAgIG9yaWc6IHtcbiAgICAgICAgICAgICAgICBwb2ludHM6IHRoaXMucG9pbnRzLm1hcCh2PT52KSxcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiB0aGlzLm9wYWNpdHlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXI6IHtcbiAgICAgICAgICAgICAgICBwb2ludHM6IHRoaXMucG9pbnRzLm1hcCgocG9pbnQsIGkpPT5VdGlscy5zdWJBQShvcHRzLnBvaW50c1tpXSwgcG9pbnQpKSxcbiAgICAgICAgICAgICAgICBvcGFjaXR5OihvcHRzLm9wYWNpdHk9PT11bmRlZmluZWQ/IDE6b3B0cy5vcGFjaXR5KSAtIHRoaXMub3BhY2l0eSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkdXJhdGlvbjogb3B0cy5kdXJhdGlvbiB8fCBERUZBVUxUX0FOSU1BVElPTl9EVVJBVElPTixcbiAgICAgICAgICAgIHByb2dyZXNzOiBudWxsLFxuICAgICAgICAgICAgc3RhcnQ6IG51bGxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1cGRhdGUoVElNRSkge1xuXG4gICAgICAgIGlmICghdGhpcy5hbmltYXRpbmcpIHJldHVybiBmYWxzZTtcbiAgICAgICAgbGV0IG9wdHMgPSB0aGlzLmFuaW1PcHRzO1xuICAgICAgICBpZiAob3B0cy5wcm9ncmVzcyA9PSAxKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuYW5pbU9wdHM7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hbmltYXRpbmcgJiYgIW9wdHMuc3RhcnQpIHtcbiAgICAgICAgICAgIG9wdHMuc3RhcnQgPSBUSU1FO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0cy5wcm9ncmVzcyA9ICgoVElNRSAtIG9wdHMuc3RhcnQpIC8gb3B0cy5kdXJhdGlvbik7XG4gICAgICAgIGlmIChvcHRzLnByb2dyZXNzID4gMSkge1xuICAgICAgICAgICAgb3B0cy5wcm9ncmVzcyA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdHMuZGlyLm9wYWNpdHkgIT0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5vcGFjaXR5KVxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5ID0gb3B0cy5vcmlnLm9wYWNpdHkrIG9wdHMuZGlyLm9wYWNpdHkgKiBvcHRzLnByb2dyZXNzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG9pbnRzID0gb3B0cy5vcmlnLnBvaW50cy5tYXAoKG9ycG9pbnQsIGkpPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmFkZEFBKG9ycG9pbnQsIFV0aWxzLm11bHRpQVYob3B0cy5kaXIucG9pbnRzW2ldLCBvcHRzLnByb2dyZXNzKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuZXhwb3J0IGRlZmF1bHQgTGluZSIsImNsYXNzIEhpdFJlY3Qge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgdGhpcy5pbW11dGFibGUgPSBvcHRzLmltbXV0YWJsZSB8fCBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuaW1tdXRhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLnJlY3QgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRzLnJlY3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZWN0ID0gb3B0cy5yZWN0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FudmFzID0gb3B0cy5jYW52YXM7XG4gICAgICAgIHRoaXMubmFtZSA9IG9wdHMubmFtZTtcbiAgICAgICAgdGhpcy5vbk1vdmUgPSBvcHRzLm9uTW92ZSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB9O1xuICAgICAgICB0aGlzLm9uTW92ZVggPSBvcHRzLm9uTW92ZVggfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vbkNsaWNrU3RhcnQgPSBvcHRzLm9uQ2xpY2tTdGFydCB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB9O1xuICAgICAgICAvL0B0b2RvIHByb2JhYmx5IGRvIHRoZSBmdWxsZmVhdHVyZWQgZG93bi11cCBjbGlja1xuXG4gICAgICAgIGNvbnN0IG1vdmVIYW5kbGVyID0gdGhpcy5tb3ZlLmJpbmQodGhpcylcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNIaXQoZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tTdGFydCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVIYW5kbGVyKVxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSwgZmFsc2UpXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZSk9PiB7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlSGFuZGxlcilcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIChlKT0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVIYW5kbGVyKVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZSk9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0hpdChlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMub25DbGlja1N0YXJ0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgbW92ZUhhbmRsZXIpXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIChlKT0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG1vdmVIYW5kbGVyKVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgbW92ZShlKSB7XG4gICAgICAgIGxldCBlWCA9IGUubGF5ZXJYIHx8IGUub2Zmc2V0WCxcbiAgICAgICAgICAgIGVZID0gZS5sYXllclkgfHwgZS5vZmZzZXRZLFxuICAgICAgICAgICAgeERpZmYgPSBlWCAtIHRoaXMuc1g7XG5cbiAgICAgICAgdGhpcy5yZWN0LnggKz0geERpZmY7XG4gICAgICAgIHRoaXMub25Nb3ZlWCh4RGlmZilcbiAgICAgICAgdGhpcy5zWCA9IGVYO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMub25Nb3ZlKHRoaXMucmVjdCk7XG4gICAgfVxuXG4gICAgaXNIaXQoZSkge1xuICAgICAgICBsZXQgciA9IHRoaXMucmVjdCxcbiAgICAgICAgICAgIGVYID0gZS5sYXllclggfHwgZS5vZmZzZXRYLFxuICAgICAgICAgICAgZVkgPSBlLmxheWVyWSB8fCBlLm9mZnNldFksXG4gICAgICAgICAgICBoaXRYID0gci54IDwgZVggJiYgZVggPCByLnggKyByLndpZHRoLFxuICAgICAgICAgICAgaGl0WSA9IHIueSA8IGVZICYmIGVZIDwgci55ICsgci5oZWlnaHQ7XG5cblxuICAgICAgICB0aGlzLnNYID0gZVg7XG4gICAgICAgIHRoaXMuc1kgPSBlWTtcbiAgICAgICAgcmV0dXJuIGhpdFkgJiYgaGl0WFxuICAgIH1cbn1cblxuXG5jb25zdCBEUkFHX0JPWF9XSURUSCA9IDEwO1xuY29uc3QgTElORV9XSURUSCA9IDM7XG5jb25zdCBEUkFHX0JPWF9DT0xPUiA9ICdyZ2JhKDE1MCwxNTAsMTUwLDAuNyknO1xuY29uc3QgQkcgPSAncmdiYSgxNTAsMTUwLDE1MCwwLjMpJztcblxuY2xhc3MgU2NhbGVCYXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgdGhpcy5kcmF3biA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlY3QgPSBvcHRzLnJlY3Q7XG4gICAgICAgIHRoaXMuYmcgPSBvcHRzLmJnIHx8IEJHO1xuICAgICAgICB0aGlzLmRyYWdCb3hDb2xvciA9IG9wdHMuZHJhZ0JveENvbG9yIHx8IERSQUdfQk9YX0NPTE9SO1xuICAgICAgICB0aGlzLmRyYWdCb3hXaWR0aCA9IG9wdHMuZHJhZ0JveFdpZHRoIHx8IERSQUdfQk9YX1dJRFRIO1xuICAgICAgICB0aGlzLnJhbmdlID0gT2JqZWN0LmFzc2lnbihvcHRzLnJhbmdlKTtcbiAgICAgICAgdGhpcy5vblJhbmdlQ2hhbmdlID0gb3B0cy5vblJhbmdlQ2hhbmdlIHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB0aGlzLnZpc2libGVSZWN0ID0ge307XG4gICAgICAgIHRoaXMucmlnaHRCb3hSZWN0ID0ge307XG4gICAgICAgIHRoaXMubGVmdEJveFJlY3QgPSB7fTtcblxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVJlY3QoKTtcbiAgICAgICAgdGhpcy5saW5lV2lkdGggPSBvcHRzLmxpbmVXaWR0aCB8fCBMSU5FX1dJRFRIO1xuXG4gICAgICAgIG5ldyBIaXRSZWN0KHtcbiAgICAgICAgICAgIG5hbWU6ICdsZWZ0JyxcbiAgICAgICAgICAgIHJlY3Q6IHRoaXMubGVmdEJveFJlY3QsXG4gICAgICAgICAgICBvbk1vdmVYOiB0aGlzLm9uTW92ZUxlZnRCYXIuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGNhbnZhczogb3B0cy5jYW52YXNcbiAgICAgICAgfSlcbiAgICAgICAgbmV3IEhpdFJlY3Qoe1xuICAgICAgICAgICAgbmFtZTogJ3JpZ2h0JyxcbiAgICAgICAgICAgIHJlY3Q6IHRoaXMucmlnaHRCb3hSZWN0LFxuICAgICAgICAgICAgb25Nb3ZlWDogdGhpcy5vbk1vdmVSaWdodEJhci5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgY2FudmFzOiBvcHRzLmNhbnZhc1xuICAgICAgICB9KVxuICAgICAgICBuZXcgSGl0UmVjdCh7XG4gICAgICAgICAgICBuYW1lOiAndHJhbnMnLFxuICAgICAgICAgICAgcmVjdDogdGhpcy52aXNpYmxlUmVjdCxcbiAgICAgICAgICAgIG9uTW92ZTogdGhpcy5vbk1vdmVWaXNpYmxlQXJlYS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgY2FudmFzOiBvcHRzLmNhbnZhc1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vQHRvZG8gbGltaXQgbGVmdC1yaWdodCBiYXJzIGNyb3NzaW5nLiBGdW5ueSBtaXJyb3IgZWZmZWN0IGxvbFxuXG5cbiAgICB9XG5cbiAgICBvbk1vdmVMZWZ0QmFyKGRpZmZYKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZVJlY3QueCArPSBkaWZmWDtcbiAgICAgICAgdGhpcy52aXNpYmxlUmVjdC53aWR0aCAtPSBkaWZmWDtcbiAgICAgICAgdGhpcy5vbk1vdmVWaXNpYmxlQXJlYSh0aGlzLnZpc2libGVSZWN0KVxuICAgIH1cblxuICAgIG9uTW92ZVJpZ2h0QmFyKGRpZmZYKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZVJlY3Qud2lkdGggKz0gZGlmZlg7XG4gICAgICAgIHRoaXMub25Nb3ZlVmlzaWJsZUFyZWEodGhpcy52aXNpYmxlUmVjdClcbiAgICB9XG5cbiAgICBvbk1vdmVWaXNpYmxlQXJlYSh2cikge1xuICAgICAgICB0aGlzLmRyYXduID0gZmFsc2U7XG4gICAgICAgIHZyLnggPCB0aGlzLnJlY3QueCAmJiAodnIueCA9IHRoaXMucmVjdC54KTtcbiAgICAgICAgdnIueCA+ICh0aGlzLnJlY3Qud2lkdGggKyB0aGlzLnJlY3QueCAtIHZyLndpZHRoKSAmJiAodnIueCA9IHRoaXMucmVjdC53aWR0aCArIHRoaXMucmVjdC54IC0gdnIud2lkdGgpO1xuXG4gICAgICAgIHRoaXMucmFuZ2Uuc3RhcnQgPSAoKHZyLnggLSB0aGlzLnJlY3QueCkgLyB0aGlzLnJlY3Qud2lkdGgpICogMTAwXG4gICAgICAgIHRoaXMucmFuZ2UuZW5kID0gKCh2ci54IC0gdGhpcy5yZWN0LnggKyB2ci53aWR0aCkgLyB0aGlzLnJlY3Qud2lkdGgpICogMTAwXG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVSZWN0KCk7XG4gICAgICAgIHRoaXMub25SYW5nZUNoYW5nZSh0aGlzLnJhbmdlKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVSZWN0KCkge1xuXG4gICAgICAgIC8vdGhpcyBsb2dpYyBpcyBiYXNlZCBvbiByZWZlcmVuY2UgcGFzc2luZyB0byBIaXRSZWN0IGNsYXNzLiBTbyB3ZSBhcmUga2VlcGluZyBzYW1lIG9iamVjdHMgcmVmZXJlbmNlcyAobWF0YXRpbmcgcGFyYW1zKS5cbiAgICAgICAgLy9vdGhlcndpc2UgY2FsY3VsYXRlIGVhY2ggaGl0IGJveCAgY2hhbmdlcyBzZXBhcmF0ZWx5LlxuXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy52aXNpYmxlUmVjdCwge1xuICAgICAgICAgICAgeDogdGhpcy5yZWN0LnggKyAoKHRoaXMucmVjdC53aWR0aCAvIDEwMCkgKiB0aGlzLnJhbmdlLnN0YXJ0KSxcbiAgICAgICAgICAgIHk6IHRoaXMucmVjdC55LFxuICAgICAgICAgICAgd2lkdGg6ICgodGhpcy5yYW5nZS5lbmQgLSB0aGlzLnJhbmdlLnN0YXJ0KSAvIDEwMCkgKiB0aGlzLnJlY3Qud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucmVjdC5oZWlnaHRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy90cmlwcGxlIGhpdCBib3ggZm9yIEJhcnNcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmxlZnRCb3hSZWN0LCB7XG4gICAgICAgICAgICB4OiB0aGlzLnZpc2libGVSZWN0LnggLSB0aGlzLmRyYWdCb3hXaWR0aCxcbiAgICAgICAgICAgIHk6IHRoaXMudmlzaWJsZVJlY3QueSxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmRyYWdCb3hXaWR0aCAqIDMsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMudmlzaWJsZVJlY3QuaGVpZ2h0XG4gICAgICAgIH0pXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5yaWdodEJveFJlY3QsIHtcbiAgICAgICAgICAgIHg6IHRoaXMudmlzaWJsZVJlY3QueCArIHRoaXMudmlzaWJsZVJlY3Qud2lkdGggLSB0aGlzLmRyYWdCb3hXaWR0aCAqIDIsXG4gICAgICAgICAgICB5OiB0aGlzLnZpc2libGVSZWN0LnksXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5kcmFnQm94V2lkdGggKiAzLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnZpc2libGVSZWN0LmhlaWdodFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHVwZGF0aW5nKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuZHJhd247XG4gICAgfVxuXG4gICAgZHJhdyhjdHgpIHtcblxuICAgICAgICBjb25zdCB7ZHJhZ0JveFdpZHRoLCBsaW5lV2lkdGgsIGRyYWdCb3hDb2xvciwgYmd9ID0gdGhpcztcbiAgICAgICAgY29uc3QgciA9IHRoaXMucmVjdDtcbiAgICAgICAgY29uc3QgdnIgPSB0aGlzLnZpc2libGVSZWN0O1xuXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBiZztcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcblxuICAgICAgICBjdHguZmlsbFJlY3Qoci54LCByLnksIHZyLnggLSByLngsIHIuaGVpZ2h0KTsgLy9sZWZ0IGdyYXlvdXRcbiAgICAgICAgY3R4LmZpbGxSZWN0KHZyLnggKyB2ci53aWR0aCwgci55LCByLndpZHRoIC0gdnIueCAtIHZyLndpZHRoLCB2ci5oZWlnaHQpOyAvL3JpZ2h0IGdyYXlvdXRcbiAgICAgICAgY3R4LmZpbGxSZWN0KHZyLnggKyBkcmFnQm94V2lkdGgsIHZyLnksIHZyLndpZHRoIC0gZHJhZ0JveFdpZHRoICogMiwgbGluZVdpZHRoKTsgLy92aXNpYmxlIGJveCB0b3AgbGluZVxuICAgICAgICBjdHguZmlsbFJlY3QodnIueCArIGRyYWdCb3hXaWR0aCwgdnIueSArIHZyLmhlaWdodCAtIGxpbmVXaWR0aCwgdnIud2lkdGggLSBkcmFnQm94V2lkdGggKiAyLCBsaW5lV2lkdGgpOyAvL3Zpc2libGUgYm94IGJvdHRvbSBsaW5lXG5cbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGRyYWdCb3hDb2xvcjtcblxuICAgICAgICBjdHguZmlsbFJlY3QodnIueCwgdnIueSwgZHJhZ0JveFdpZHRoLCB2ci5oZWlnaHQpOyAgLy9sZWZ0RHJhZ0JhclxuICAgICAgICBjdHguZmlsbFJlY3QodnIueCArIHZyLndpZHRoIC0gZHJhZ0JveFdpZHRoLCB2ci55LCBkcmFnQm94V2lkdGgsIHZyLmhlaWdodCk7ICAvL3JpZ2h0RHJhZ0JhclxuXG4gICAgICAgIHRoaXMuZHJhd24gPSB0cnVlO1xuICAgIH1cblxufVxuZXhwb3J0IGRlZmF1bHQgIFNjYWxlQmFyIiwiaW1wb3J0IExpbmUgZnJvbSBcIi4vTGluZS5qc1wiO1xuY2xhc3MgU2VyaWVzQ29udGFpbmVyIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHRoaXMucmVjdCA9IG9wdHMucmVjdDtcbiAgICAgICAgdGhpcy52aXNpYmxlUmVjdCA9IG9wdHMudmlzaWJsZVJlY3QgfHwgdGhpcy5yZWN0O1xuICAgICAgICB0aGlzLnNlcmllcyA9IG9wdHMuc2VyaWVzLm1hcChzZXIgPT4gT2JqZWN0LmFzc2lnbih7fSwgc2VyKSk7XG4gICAgICAgIHRoaXMueUF4aXNEYXRhID0gb3B0cy55QXhpc0RhdGFcbiAgICAgICAgdGhpcy5kcmF3YWJsZXMgPSBbXVxuXG4gICAgICAgIHRoaXMuc2VyaWVzLmZvckVhY2goc2VyPT4ge1xuICAgICAgICAgICAgaWYgKHNlci50eXBlID09ICdsaW5lJykge1xuICAgICAgICAgICAgICAgIGxldCBwb2ludHMgPSB0aGlzLmNhbGN1bGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHlBeGlzOiB0aGlzLnlBeGlzRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBzZXIudmFsdWVzLFxuICAgICAgICAgICAgICAgICAgICByZWN0OiB0aGlzLnJlY3QsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgaW5pdFBvaW50cyA9IHBvaW50cy5tYXAocD0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtwWzBdLCB0aGlzLnJlY3QuaGVpZ2h0IC8gMiArIHRoaXMucmVjdC55XVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxldCBsaW5lID0gbmV3IExpbmUoe3BvaW50czogaW5pdFBvaW50cywgY29sb3I6IHNlci5jb2xvcn0pXG4gICAgICAgICAgICAgICAgbGluZS5hbmltYXRlKHtwb2ludHN9KTtcbiAgICAgICAgICAgICAgICBzZXIuZHJhd2FibGVMaW5lID0gbGluZTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdhYmxlcy5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHRvZ2dsZVNlcmllKGlkKSB7XG4gICAgICAgIHZhciBzZXIgPSB0aGlzLnNlcmllcy5maW5kKHM9PiBzLmlkID09IGlkKTtcbiAgICAgICAgc2VyLnNob3duID0gIXNlci5zaG93bjtcbiAgICAgICAgaWYgKCFzZXIuc2hvd24pIHtcbiAgICAgICAgICAgIHNlci5kcmF3YWJsZUxpbmUuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgcG9pbnRzOiBzZXIuZHJhd2FibGVMaW5lLnBvaW50cy5tYXAocD0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtwWzBdLCB0aGlzLnJlY3QueV1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBvcGFjaXR5OjBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9zZXJpZS5kcmF3YWJsZUxpbmUuZHJhd24gPSBmYWxzZTtcblxuICAgIH1cblxuICAgIHVwZGF0ZVJhbmdlKHtyZWN0LCB5QXhpc0RhdGF9KSB7XG4gICAgICAgIGlmIChyZWN0KSB7XG4gICAgICAgICAgICB0aGlzLnJlY3QgPSByZWN0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMueUF4aXNEYXRhID0geUF4aXNEYXRhO1xuICAgICAgICB0aGlzLnNlcmllcy5mb3JFYWNoKHNlcj0+IHtcbiAgICAgICAgICAgIGlmIChzZXIudHlwZSA9PSAnbGluZScgJiYgc2VyLnNob3duKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBvaW50cyA9IHRoaXMuY2FsY3VsYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgeUF4aXM6IHRoaXMueUF4aXNEYXRhLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlci52YWx1ZXMsXG4gICAgICAgICAgICAgICAgICAgIHJlY3Q6IHRoaXMucmVjdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzZXIuZHJhd2FibGVMaW5lLmFuaW1hdGUoe3BvaW50c30pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGNhbGN1bGF0ZSh7dmFsdWVzLCByZWN0LCB5QXhpc30pIHtcbiAgICAgICAgbGV0IHt5TWF4LCB5TWlufSA9IHlBeGlzO1xuICAgICAgICBsZXQgeFN0ZXAgPSByZWN0LndpZHRoIC8gKHZhbHVlcy5sZW5ndGggLSAxKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlcy5tYXAoKHZhbHVlLCBpKT0+IHtcbiAgICAgICAgICAgIGxldCBuZXdZID0gTWF0aC5hYnMoKCh2YWx1ZSAtIHlNaW4pIC8gKHlNYXggLSB5TWluKSkgKiByZWN0LmhlaWdodCAtIHJlY3QuaGVpZ2h0KSArIHJlY3QueTtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgaSAqIHhTdGVwICsgcmVjdC54LFxuICAgICAgICAgICAgICAgIG5ld1lcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIHVwZGF0aW5nKFRJTUUpIHtcbiAgICAgICAgbGV0IGFueVVwZGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zZXJpZXMuZm9yRWFjaChzPT4ge1xuICAgICAgICAgICAgbGV0IGQgPSBzLmRyYXdhYmxlTGluZTtcbiAgICAgICAgICAgIGxldCByZXMgPSBkLnVwZGF0aW5nKFRJTUUpXG4gICAgICAgICAgICBpZiAoIWFueVVwZGF0ZXMpIHtcbiAgICAgICAgICAgICAgICBhbnlVcGRhdGVzID0gcmVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBhbnlVcGRhdGVzO1xuICAgIH1cblxuICAgIGRyYXcoY3R4KSB7XG4gICAgICAgIHRoaXMuc2VyaWVzLmZvckVhY2gocz0+IHtcbiAgICAgICAgICAgIGlmIChzLnNob3duIHx8IHMuZHJhd2FibGVMaW5lLmFuaW1hdGluZykge1xuICAgICAgICAgICAgbGV0IGQgPSBzLmRyYXdhYmxlTGluZVxuICAgICAgICAgICAgZC5kcmF3KGN0eClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFNlcmllc0NvbnRhaW5lciIsImNsYXNzIFV0aWxzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBzdGF0aWMgbmV3RGVmZXJyZWQoKSB7XG4gICAgICAgIGxldCByZXNvbHZlLCByZWplY3Q7XG4gICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlcywgcmVqKT0+IHtcbiAgICAgICAgICAgIHJlc29sdmUgPSByZXM7XG4gICAgICAgICAgICByZWplY3QgPSByZWo7XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgIHJlamVjdFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGtleUJ5VmFsdWUob2JqLCB2YWx1ZSkge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqW2tleV0gPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBzdGF0aWMgc3ViQUEoYTEsIGEyKSB7XG4gICAgICAgIHJldHVybiBhMS5tYXAoKHYsIGkpPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHYgLSBhMltpXTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGF0aWMgYWRkQUEoYTEsIGEyKSB7XG4gICAgICAgIHJldHVybiBhMS5tYXAoKHYsIGkpPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHYgKyBhMltpXTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGF0aWMgbXVsdGlBVihhMSwgdmFsKSB7XG4gICAgICAgIHJldHVybiBhMS5tYXAoKHYsIGkpPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHYgKiB2YWw7XG4gICAgICAgIH0pXG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgIFV0aWxzIiwiY29uc3QgTU9OVEhTID0gW1xuICAgICdKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsXG4gICAgJ0p1bCcsICdBdWcnLCAnU2VwJywgJ09jdCcsICdOb3YnLCAnRGVjJ1xuXVxuY2xhc3MgWEF4aXNTY2VuZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICB0aGlzLmRyYXduID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVjdCA9IG9wdHMucmVjdDtcbiAgICAgICAgdGhpcy5wb2ludHMgPSBbXTtcblxuICAgICAgICB0aGlzLmNvbHMgPSBvcHRzLmRhdGEudmFsdWVzLm1hcCgodiwgaSk9PiB7XG4gICAgICAgICAgICBsZXQgZCA9IG5ldyBEYXRlKHYpO1xuICAgICAgICAgICAgbGV0IHRhID0gJ2NlbnRlcidcbiAgICAgICAgICAgIGlmIChpID09IDApIHtcbiAgICAgICAgICAgICAgICB0YSA9ICdsZWZ0J1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpID09IG9wdHMuZGF0YS52YWx1ZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIHRhID0gJ3JpZ2h0J1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHRleHQgID0gZC5nZXREYXRlKCkgKyAnICcgKyBNT05USFNbZC5nZXRNb250aCgpXTtcbiAgICAgICAgICAgIG9wdHMuY3R4LmZpbGxTdHlsZSA9ICdibGFjaydcbiAgICAgICAgICAgIG9wdHMuY3R4LmZvbnQgPSAnMTRweCBBcmlhbCdcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGV4dEFsaWduOiB0YSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdixcbiAgICAgICAgICAgICAgICB0ZXh0OnRleHQsXG4gICAgICAgICAgICAgICAgd2lkdGg6IG9wdHMuY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGUoKTtcbiAgICB9XG5cblxuICAgIGNhbGN1bGF0ZSgpIHtcbiAgICAgICAgbGV0IHhTdGVwID0gdGhpcy5yZWN0LndpZHRoIC8gKHRoaXMuY29scy5sZW5ndGggLSAxKTtcbiAgICAgICAgdGhpcy5sYWJlbHMgPSB0aGlzLmNvbHMubWFwKChjb2wsIGkpPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB4OiB0aGlzLnJlY3QueCArIChpICogeFN0ZXApLFxuICAgICAgICAgICAgICAgIHk6IHRoaXMucmVjdC55ICsgdGhpcy5yZWN0LmhlaWdodCAtIDUsXG4gICAgICAgICAgICAgICAgdGV4dEFsaWduOiBjb2wudGV4dEFsaWduLFxuICAgICAgICAgICAgICAgIHRleHQ6IGNvbC50ZXh0LFxuICAgICAgICAgICAgICAgIHdpZHRoOmNvbC53aWR0aFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHVwZGF0ZSh7eCwgd2lkdGh9KSB7XG4gICAgICAgIHRoaXMucmVjdC54ID0geDtcbiAgICAgICAgdGhpcy5yZWN0LndpZHRoID0gd2lkdGg7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlKCk7XG4gICAgICAgIHRoaXMuZHJhd24gPSBmYWxzZTtcbiAgICB9XG5cbiAgICB1cGRhdGluZygpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmRyYXduO1xuICAgIH1cblxuICAgIGRyYXcoY3R4KSB7XG4gICAgICAgIGNvbnN0IHIgPSB0aGlzLnJlY3RcbiAgICAgICAgLy8gY3R4LmZpbGxTdHlsZSA9ICdyZWQnO1xuICAgICAgICAvL2N0eC5maWxsUmVjdChyLngsIHIueSwgci53aWR0aCwgci5oZWlnaHQpXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snXG4gICAgICAgIGN0eC5mb250ID0gJzE0cHggQXJpYWwnXG5cbiAgICAgICAgbGV0IHRha2VuWCA9IHRoaXMubGFiZWxzWzBdLng7XG4gICAgICAgIHRoaXMubGFiZWxzLmZvckVhY2goKGxiLCBpKT0+IHtcbiAgICAgICAgICAgIGlmIChpID4gMCAmJiBsYi54IC0gbGIud2lkdGggLyAyIDwgdGFrZW5YKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3R4LnRleHRBbGlnbiA9IGxiLnRleHRBbGlnbjtcbiAgICAgICAgICAgIHRha2VuWCArPSBsYi53aWR0aCArIDIwXG4gICAgICAgICAgICBjdHguZmlsbFRleHQobGIudGV4dCwgbGIueCwgbGIueSk7XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuZHJhd24gPSB0cnVlO1xuICAgIH1cblxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFhBeGlzU2NlbmUiLCJpbXBvcnQgTGluZSBmcm9tIFwiLi9MaW5lLmpzXCI7XG5cbmNsYXNzIFlBeGlzU2NlbmUge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgdGhpcy5kcmF3biA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRhdGEgPSBvcHRzLmRhdGE7XG5cbiAgICAgICAgdGhpcy5sYWJlbHMgPSBbXTtcbiAgICAgICAgdGhpcy5saW5lcyA9IFtdO1xuXG4gICAgICAgIHRoaXMucmVjdCA9IG9wdHMucmVjdDtcbiAgICAgICAgdGhpcy5iZyA9IG9wdHMuYmc7XG4gICAgICAgIHRoaXMucGFkZGluZyA9IG9wdHMucGFkZGluZyB8fCA1O1xuICAgICAgICB0aGlzLmxpbmVDb2xvciA9IG9wdHMubGluZUNvbG9yIHx8ICdncmV5JztcbiAgICAgICAgdGhpcy5saW5lV2lkdGggPSBvcHRzLmxpbmVXaWR0aCB8fCAwLjM7XG4gICAgICAgIHRoaXMuZm9udENvbG9yID0gb3B0cy5mb250Q29sb3IgfHwgJ2JsYWNrJztcbiAgICAgICAgdGhpcy5mb250U2l6ZSA9IG9wdHMuZm9udFNpemUgfHwgMTQ7XG4gICAgICAgIHRoaXMubGFiZWxGb3JtYXRGbiA9IG9wdHMubGFiZWxGb3JtYXRGbiB8fCB0aGlzLmxhYmVsRm9ybWF0Rm5EZWZhdWx0O1xuXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlKCk7XG4gICAgfVxuICAgIHVwZGF0ZVZhbHVlcyhkYXRhKXtcbiAgICAgICAgdGhpcy5kYXRhPWRhdGE7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlKCk7XG4gICAgICAgIHRoaXMuZHJhd24gPSBmYWxzZTtcbiAgICB9XG4gICAgbGFiZWxGb3JtYXRGbkRlZmF1bHQodmFsdWUpIHtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUludCh2YWx1ZSlcbiAgICAgICAgaWYgKHZhbHVlIC8gMWU5ID49IDEpIHtcbiAgICAgICAgICAgIHZhbHVlID0gKHZhbHVlIC8gMWU5KS50b0ZpeGVkKDIpICsgJ2InXG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgLyAxZTYgPj0gMSkge1xuICAgICAgICAgICAgdmFsdWUgPSAodmFsdWUgLyAxZTYpLnRvRml4ZWQoMikgKyAnbSdcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAvIDFlMyA+PSAxKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICh2YWx1ZSAvIDFlMykudG9GaXhlZCgyKSArICdrJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cblxuICAgIGNhbGN1bGF0ZSgpIHtcbiAgICAgICAgLy90b3AgdG8gYm90dG9tXG4gICAgICAgIGxldCBzdGFydFkgPSB0aGlzLnJlY3QueTtcbiAgICAgICAgbGV0IHlQaXhlbFN0ZXAgPSB0aGlzLnJlY3QuaGVpZ2h0IC8gKHRoaXMuZGF0YS5sYWJlbHMubGVuZ3RoIC0gMSk7XG4gICAgICAgIHRoaXMubGFiZWxzID0gW107XG4gICAgICAgIHRoaXMubGluZXMgPSBbXTtcbiAgICAgICAgdGhpcy5kYXRhLmxhYmVscy5mb3JFYWNoKGxibD0+IHtcblxuICAgICAgICAgICAgdGhpcy5sYWJlbHMucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogbGJsLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IHRoaXMuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgZm9udENvbG9yOiB0aGlzLmZvbnRDb2xvcixcbiAgICAgICAgICAgICAgICB4OiB0aGlzLnJlY3QueCArIHRoaXMucGFkZGluZyxcbiAgICAgICAgICAgICAgICB5OiBzdGFydFkgLSB0aGlzLnBhZGRpbmdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLmxpbmVzLnB1c2gobmV3IExpbmUoe1xuICAgICAgICAgICAgICAgIHBvaW50czogW1xuICAgICAgICAgICAgICAgICAgICBbdGhpcy5yZWN0LngsIHN0YXJ0WV0sXG4gICAgICAgICAgICAgICAgICAgIFt0aGlzLnJlY3Qud2lkdGgsIHN0YXJ0WV1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogdGhpcy5saW5lV2lkdGgsXG4gICAgICAgICAgICAgICAgY29sb3I6IHRoaXMubGluZUNvbG9yXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIHN0YXJ0WSArPSB5UGl4ZWxTdGVwO1xuICAgICAgICB9KVxuICAgICAgICAvL2hvdGZpeCBmb3Igbm90IGRyYXdpbmcgdG9wIGxpbmUgPyBpcyBpdCBldmVuIG5lZWRlZD9cbiAgICAgICAgLy90aGlzLmxpbmVzLnNwbGljZSgwLDEpXG4gICAgICAgIC8vdGhpcy5sYWJlbHMuc3BsaWNlKDAsMSlcbiAgICB9XG5cbiAgICB1cGRhdGluZygpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmRyYXduO1xuICAgIH1cblxuICAgIGRyYXcoY3R4KSB7XG4gICAgICAgIGxldCByID0gdGhpcy5yZWN0O1xuXG4gICAgICAgIGlmICh0aGlzLmJnKSB7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5iZztcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdChyLngsIHIueSwgci53aWR0aCwgci5oZWlnaHQpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5saW5lcy5mb3JFYWNoKGxpbmU9PmxpbmUuZHJhdyhjdHgpKTtcbiAgICAgICAgdGhpcy5sYWJlbHMuZm9yRWFjaCgobGJsLCBpKT0+IHtcbiAgICAgICAgICAgIGN0eC5mb250ID0gYCR7bGJsLmZvbnRTaXplfXB4IEFyaWFsYDtcbiAgICAgICAgICAgIGN0eC50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gbGJsLmZvbnRDb2xvcjtcblxuICAgICAgICAgICAgbGV0IHkgPSBpID09IDAgPyBsYmwueSArIGxibC5mb250U2l6ZSArIHRoaXMucGFkZGluZyA6IGxibC55O1xuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMubGFiZWxGb3JtYXRGbkRlZmF1bHQobGJsLnRleHQpLCBsYmwueCwgeSlcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5kcmF3biA9IHRydWU7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBZQXhpc1NjZW5lIl0sInNvdXJjZVJvb3QiOiIifQ==