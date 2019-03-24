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
/* harmony import */ var _src_ColorShift_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/ColorShift.js */ "./src/ColorShift.js");


function getData() {
    return fetch('./chart_data.json')
        .then(s=>s.json())
        .then(data=> {
            let CS = new _src_ColorShift_js__WEBPACK_IMPORTED_MODULE_1__["default"]()
            window.g = _src_Graph_js__WEBPACK_IMPORTED_MODULE_0__["default"].initFromData(data[0]);
            //minify webpack
            // tooltips ? fuck
        })
}
getData();



/***/ }),

/***/ "./src/ColorShift.js":
/*!***************************!*\
  !*** ./src/ColorShift.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const SCHEMES = {
    DAY: {
        bg: 'transparent',
        font:'black',
    },
    NIGHT: {
        bg: '#242f3d',
        font:'white',
    }
}
class ColorShifter {
    constructor(opts={}) {
        const cntr = document.createElement('div')
        Object.assign(cntr.style, {
            textAlign: 'center',
            position: 'fixed',
            bottom: 0,
            fontSize: '24px',
            height: '40px',
            lineHeight: '40px',
            borderTop: '2px solid grey',
            width: '100%'
        })
        cntr.innerHTML = 'Switch Colors';
        document.body.appendChild(cntr);
        let theme = 'DAY';
        this.container = cntr;
        this.applyTheme(SCHEMES[theme])
        cntr.addEventListener('click', ()=> {
            if (theme == 'DAY') {
                theme = 'NIGHT'
            } else if (theme == 'NIGHT') {
                theme = 'DAY'
            }

            let cur = SCHEMES[theme];
            opts.onSwitch && opts.onSwitch(SCHEMES[theme])

            this.applyTheme(cur)
        })
    }
    applyTheme(cur){
        Object.assign(document.body.style,{
            backgroundColor:cur.bg,
            color:cur.font
        })
    }
}

/* harmony default export */ __webpack_exports__["default"] = (ColorShifter);






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
/* harmony import */ var _Legend_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Legend.js */ "./src/Legend.js");
/* harmony import */ var _ScaleBar_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ScaleBar.js */ "./src/ScaleBar.js");
/* harmony import */ var _SeriesContainer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SeriesContainer.js */ "./src/SeriesContainer.js");






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

            new _Legend_js__WEBPACK_IMPORTED_MODULE_2__["default"]({
                series: this.series.map(s=> {
                    return {
                        name: s.legendName,
                        color: s.color,
                        id: s.id
                    }
                }),
                canvas: canvas,
                onClickSerie: this.toggleSerie.bind(this)
            })
        }
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

    calcYAxis({steps, yPadding, indexRange}) {
        let limits = [];
        let count = this.series[0].values.length;
        let iRange
        if (indexRange) {
            let start =  Math.floor((count - 1) / 100 * this.xRangePercent.start);
            if(start<0) start = 0;
            iRange = {
                start: start,
                end: Math.ceil((count - 1) / 100 * this.xRangePercent.end),
            }
        } else {
            iRange = {start: 0, end: count - 1};
        }
        this.series.forEach(s=> {
            if (s.shown) {
                limits.push(Math.max.apply(null, s.values.slice(iRange.start, iRange.end)));
                limits.push(Math.min.apply(null, s.values.slice(iRange.start, iRange.end)));
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
        const seriesRect = this.getSeriesRect()
        const yData = this.calcYAxis({steps: 6, indexRange: true});
        this.drawables.scMain.updateRange(
            {
                rect: seriesRect,
                yAxisData: yData
            })
        if (updateScaleBar) {
            this.drawables.scUnderScaleBar.updateRange(
                {
                    yAxisData: this.calcYAxis({steps: 6})
                })
        }
        this.drawables.xAxis.update({x: seriesRect.x, width: seriesRect.width})
        this.drawables.yAxis.updateValues(yData)
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
        const yAxisData = this.calcYAxis({steps: 6, indexRange: true});
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
            ctx: this.ctx
        });
        this.drawables.scMain = new _SeriesContainer_js__WEBPACK_IMPORTED_MODULE_4__["default"]({
            yAxisData,
            rect: seriesRect,
            visibleRect: mainRect,
            series: this.series
        });
        this.drawables.scUnderScaleBar = new _SeriesContainer_js__WEBPACK_IMPORTED_MODULE_4__["default"]({
            yAxisData: this.calcYAxis({steps: 6}),
            rect: scaleBarRect,
            series: this.series
        });
        this.drawables.sb = new _ScaleBar_js__WEBPACK_IMPORTED_MODULE_3__["default"]({
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
            width: window.innerWidth,
            height: 400,
            xAxis,
            series: Object.values(series)
        })

    }
}

/* harmony default export */ __webpack_exports__["default"] = (Graph);

/***/ }),

/***/ "./src/Legend.js":
/*!***********************!*\
  !*** ./src/Legend.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class Legend {
    constructor({series, canvas, onClickSerie}) {
        this.onClickSerie = onClickSerie;
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
        canvas.parentElement.appendChild(legendContainer)
    }

    createLegendButton(serieInfo) {
        let butEl = document.createElement('span');
        Object.assign(butEl.style, {
            display: 'inline-block',
            border: `1px solid rgba(0,0,0,0.3)`,
            borderRadius: '10px',
            minWidth: '80px',
            padding: '10px',
            textAlign: 'center',
            marginRight: '20px',
            lineHeight:'20px'
        })
        let iconEl = document.createElement('span');
        Object.assign(iconEl.style, {
            display: 'inline-block',
            width: '20px',
            height: '20px',
            borderRadius:'20px',
            boxSizing: 'border-box',
            backgroundColor: serieInfo.color,
            border: `1px solid rgba(0,0,0,0.3)`,
            float:'left',
            color:'white'
        })
        iconEl.innerHTML='<span>&#10003;</span>'
        butEl.appendChild(iconEl);
        let text = document.createElement('span');
        text.innerText = serieInfo.name;
        butEl.appendChild(text);

        butEl.addEventListener('click', ()=> {
            let result = this.onClickSerie(serieInfo.id);
            if (result) {
                Object.assign(iconEl.style, {
                    backgroundColor: serieInfo.color,
                    border: `1px solid rgba(0,0,0,0.3)`,
                    color:'white'
                })
            } else {
                Object.assign(iconEl.style, {
                    backgroundColor: 'transparent',
                    border: `1px solid ${serieInfo.color}`,
                    color:'transparent'

                })
            }

        })
        return butEl;
    }

}
/* harmony default export */ __webpack_exports__["default"] = (Legend);

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
        ctx.globalAlpha=1;
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
        ctx.fillStyle = 'grey'
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
        this.fontColor = opts.fontColor || 'grey';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9Db2xvclNoaWZ0LmpzIiwid2VicGFjazovLy8uL3NyYy9HcmFwaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvTGVnZW5kLmpzIiwid2VicGFjazovLy8uL3NyYy9MaW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9TY2FsZUJhci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvU2VyaWVzQ29udGFpbmVyLmpzIiwid2VicGFjazovLy8uL3NyYy9VdGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMveEF4aXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3lBeGlzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQW1DO0FBQ1c7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsMERBQVk7QUFDckMsdUJBQXVCLHFEQUFLO0FBQzVCO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNaQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRWUsMkVBQVk7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakQzQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBb0M7QUFDQTtBQUNIO0FBQ0k7QUFDYzs7QUFFbkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRDtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdCQUFnQixrREFBTTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxlQUFlLDRCQUE0QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsV0FBVztBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsV0FBVztBQUM1QjtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsMkJBQTJCO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxTQUFTO0FBQ3hELGlCQUFpQjtBQUNqQjtBQUNBLHFDQUFxQyx5Q0FBeUM7QUFDOUU7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQ0FBMEMsMkJBQTJCO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUNBQW1DLGlEQUFVO0FBQzdDO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxtQ0FBbUMsaURBQVU7QUFDN0M7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULG9DQUFvQywyREFBZTtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCw2Q0FBNkMsMkRBQWU7QUFDNUQsdUNBQXVDLFNBQVM7QUFDaEQ7QUFDQTtBQUNBLFNBQVM7QUFDVCxnQ0FBZ0Msb0RBQVE7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7OztBQUdUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRkFBbUYsK0JBQStCO0FBQ2xIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFZSxvRTs7Ozs7Ozs7Ozs7O0FDNVBmO0FBQUE7QUFDQSxpQkFBaUIsNkJBQTZCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQSx5Q0FBeUMsZ0JBQWdCO0FBQ3pEOztBQUVBLGlCQUFpQjtBQUNqQjs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNlLHFFOzs7Ozs7Ozs7Ozs7QUNyRWY7QUFBQTtBQUErQjs7QUFFL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpRkFBaUYsaURBQUs7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0Esb0RBQW9ELGlEQUFLO0FBQ3pEO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsaURBQUssZ0JBQWdCLGlEQUFLO0FBQzdDLFNBQVM7QUFDVDs7QUFFQTtBQUNlLG1FOzs7Ozs7Ozs7Ozs7QUNuRmY7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4QyxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxlQUFlLDBDQUEwQztBQUN6RDtBQUNBOztBQUVBO0FBQ0E7O0FBRUEscURBQXFEO0FBQ3JELGlGQUFpRjtBQUNqRix3RkFBd0Y7QUFDeEYsZ0hBQWdIOztBQUVoSDs7QUFFQSwwREFBMEQ7QUFDMUQsb0ZBQW9GOztBQUVwRjtBQUNBOztBQUVBO0FBQ2dCLHVFOzs7Ozs7Ozs7Ozs7QUM3TWhCO0FBQUE7QUFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQ7QUFDN0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsK0JBQStCLGdEQUFJLEVBQUUscUNBQXFDO0FBQzFFLDhCQUE4QixPQUFPO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGFBQWE7QUFDYjs7QUFFQTs7QUFFQTs7QUFFQSxpQkFBaUIsZ0JBQWdCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLDBDQUEwQyxPQUFPO0FBQ2pEO0FBQ0EsU0FBUztBQUNUOztBQUVBLGVBQWUsb0JBQW9CO0FBQ25DLGFBQWEsV0FBVztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDZSw4RTs7Ozs7Ozs7Ozs7O0FDakdmO0FBQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNnQixvRTs7Ozs7Ozs7Ozs7O0FDNUNoQjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBLFlBQVksU0FBUztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOzs7QUFHQTs7QUFFZSx5RTs7Ozs7Ozs7Ozs7O0FDL0VmO0FBQUE7QUFBNkI7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixnQ0FBZ0MsZ0RBQUk7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixhQUFhO0FBQ3ZDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRWUseUUiLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vYXBwLmpzXCIpO1xuIiwiaW1wb3J0IEdyYXBoIGZyb20gXCIuL3NyYy9HcmFwaC5qc1wiO1xuaW1wb3J0IENvbG9yU2hpZnRlciBmcm9tICcuL3NyYy9Db2xvclNoaWZ0LmpzJ1xuZnVuY3Rpb24gZ2V0RGF0YSgpIHtcbiAgICByZXR1cm4gZmV0Y2goJy4vY2hhcnRfZGF0YS5qc29uJylcbiAgICAgICAgLnRoZW4ocz0+cy5qc29uKCkpXG4gICAgICAgIC50aGVuKGRhdGE9PiB7XG4gICAgICAgICAgICBsZXQgQ1MgPSBuZXcgQ29sb3JTaGlmdGVyKClcbiAgICAgICAgICAgIHdpbmRvdy5nID0gR3JhcGguaW5pdEZyb21EYXRhKGRhdGFbMF0pO1xuICAgICAgICAgICAgLy9taW5pZnkgd2VicGFja1xuICAgICAgICAgICAgLy8gdG9vbHRpcHMgPyBmdWNrXG4gICAgICAgIH0pXG59XG5nZXREYXRhKCk7XG5cbiIsImNvbnN0IFNDSEVNRVMgPSB7XG4gICAgREFZOiB7XG4gICAgICAgIGJnOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBmb250OidibGFjaycsXG4gICAgfSxcbiAgICBOSUdIVDoge1xuICAgICAgICBiZzogJyMyNDJmM2QnLFxuICAgICAgICBmb250Oid3aGl0ZScsXG4gICAgfVxufVxuY2xhc3MgQ29sb3JTaGlmdGVyIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzPXt9KSB7XG4gICAgICAgIGNvbnN0IGNudHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICBPYmplY3QuYXNzaWduKGNudHIuc3R5bGUsIHtcbiAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICAgIGZvbnRTaXplOiAnMjRweCcsXG4gICAgICAgICAgICBoZWlnaHQ6ICc0MHB4JyxcbiAgICAgICAgICAgIGxpbmVIZWlnaHQ6ICc0MHB4JyxcbiAgICAgICAgICAgIGJvcmRlclRvcDogJzJweCBzb2xpZCBncmV5JyxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgfSlcbiAgICAgICAgY250ci5pbm5lckhUTUwgPSAnU3dpdGNoIENvbG9ycyc7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY250cik7XG4gICAgICAgIGxldCB0aGVtZSA9ICdEQVknO1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNudHI7XG4gICAgICAgIHRoaXMuYXBwbHlUaGVtZShTQ0hFTUVTW3RoZW1lXSlcbiAgICAgICAgY250ci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT4ge1xuICAgICAgICAgICAgaWYgKHRoZW1lID09ICdEQVknKSB7XG4gICAgICAgICAgICAgICAgdGhlbWUgPSAnTklHSFQnXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoZW1lID09ICdOSUdIVCcpIHtcbiAgICAgICAgICAgICAgICB0aGVtZSA9ICdEQVknXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjdXIgPSBTQ0hFTUVTW3RoZW1lXTtcbiAgICAgICAgICAgIG9wdHMub25Td2l0Y2ggJiYgb3B0cy5vblN3aXRjaChTQ0hFTUVTW3RoZW1lXSlcblxuICAgICAgICAgICAgdGhpcy5hcHBseVRoZW1lKGN1cilcbiAgICAgICAgfSlcbiAgICB9XG4gICAgYXBwbHlUaGVtZShjdXIpe1xuICAgICAgICBPYmplY3QuYXNzaWduKGRvY3VtZW50LmJvZHkuc3R5bGUse1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOmN1ci5iZyxcbiAgICAgICAgICAgIGNvbG9yOmN1ci5mb250XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb2xvclNoaWZ0ZXJcblxuXG5cblxuIiwiaW1wb3J0IFlBeGlzU2NlbmUgZnJvbSBcIi4veUF4aXMuanNcIjtcbmltcG9ydCBYQXhpc1NjZW5lIGZyb20gXCIuL3hBeGlzLmpzXCI7XG5pbXBvcnQgTGVnZW5kIGZyb20gXCIuL0xlZ2VuZC5qc1wiO1xuaW1wb3J0IFNjYWxlQmFyIGZyb20gXCIuL1NjYWxlQmFyLmpzXCI7XG5pbXBvcnQgU2VyaWVzQ29udGFpbmVyIGZyb20gXCIuL1Nlcmllc0NvbnRhaW5lci5qc1wiO1xuXG5jb25zdCBwYWRkaW5nVG9wID0gMjA7XG5jb25zdCBTY2FsZUJhckhlaWdodCA9IDgwO1xuY29uc3QgeEF4aXNIZWlnaHQgPSAyMDtcblxuY2xhc3MgR3JhcGgge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgbGV0IGNhbnZhcyA9IG9wdHMuZWw7XG4gICAgICAgIHRoaXMuc2VyaWVzID0gb3B0cy5zZXJpZXMubWFwKHM9PiB7XG4gICAgICAgICAgICBzLnNob3duID0gdHJ1ZTtcbiAgICAgICAgICAgIHMuaWQgPSBNYXRoLnJhbmRvbSgpICsgRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy54QXhpc0RhdGEgPSBvcHRzLnhBeGlzO1xuICAgICAgICB0aGlzLmRyYXdhYmxlcyA9IHt9O1xuICAgICAgICB0aGlzLnNob3dMZWdlbmQgPSBvcHRzLnNob3dMZWdlbmQgfHwgdHJ1ZTtcbiAgICAgICAgdGhpcy54UmFuZ2VQZXJjZW50ID0gb3B0cy5kZWZhdWx0WFJhbmdlUGVyY2VudCB8fCB7c3RhcnQ6IDAsIGVuZDogMzB9O1xuICAgICAgICB0aGlzLnNjZW5lT2JqZWN0R3JvdXBzID0gW107XG4gICAgICAgIGlmIChjYW52YXMpIHtcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSBwYXJzZUludChjYW52YXMud2lkdGgpO1xuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBwYXJzZUludChjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgY2FudmFzLmlkID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGggPSBvcHRzLndpZHRoO1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0ID0gb3B0cy5oZWlnaHQ7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgdGhpcy5jdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLnBpeGVsUGVyUGVyY2VudCA9IHRoaXMud2lkdGggLyAxMDA7XG4gICAgICAgIHRoaXMuc2V0dXBSZW5kZXJlcigpO1xuICAgICAgICB0aGlzLmFkZFNjZW5lT2JqZWN0cygpO1xuICAgICAgICBpZiAodGhpcy5zaG93TGVnZW5kKSB7XG5cbiAgICAgICAgICAgIG5ldyBMZWdlbmQoe1xuICAgICAgICAgICAgICAgIHNlcmllczogdGhpcy5zZXJpZXMubWFwKHM9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzLmxlZ2VuZE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogcy5jb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBzLmlkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBjYW52YXM6IGNhbnZhcyxcbiAgICAgICAgICAgICAgICBvbkNsaWNrU2VyaWU6IHRoaXMudG9nZ2xlU2VyaWUuYmluZCh0aGlzKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZVNlcmllKGlkKSB7XG4gICAgICAgIHZhciBzZXJpZSA9IHRoaXMuc2VyaWVzLmZpbmQocz0+IHMuaWQgPT0gaWQpO1xuICAgICAgICBzZXJpZS5zaG93biA9ICFzZXJpZS5zaG93bjtcbiAgICAgICAgdGhpcy5kcmF3YWJsZXMuc2NNYWluLnRvZ2dsZVNlcmllKGlkKTtcbiAgICAgICAgdGhpcy5kcmF3YWJsZXMuc2NVbmRlclNjYWxlQmFyLnRvZ2dsZVNlcmllKGlkKTtcbiAgICAgICAgdGhpcy51cGRhdGVSYW5nZSh0aGlzLnhSYW5nZVBlcmNlbnQsIHRydWUpO1xuICAgICAgICByZXR1cm4gc2VyaWUuc2hvd247XG4gICAgfVxuXG4gICAgc2V0dXBSZW5kZXJlcigpIHtcblxuICAgICAgICBpZiAodGhpcy5yZW5kZXJpbmcpIHJldHVybjtcbiAgICAgICAgdGhpcy5yZW5kZXJpbmcgPSB0cnVlXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCBuZXh0RnJhbWVIYW5kbGVyID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXG4gICAgICAgIGxldCBzdGFsZUZyYW1lcyA9IDA7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVuZGVyZXIodGZEaWZmKSB7XG4gICAgICAgICAgICBzdGFsZUZyYW1lcysrO1xuICAgICAgICAgICAgc2VsZi5zY2VuZU9iamVjdEdyb3Vwcy5mb3JFYWNoKChncm91cCwgaSk9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGFueVVwZGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBncm91cC5mb3JFYWNoKG9iaj0+IHtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnVwZGF0aW5nKHRmRGlmZikgJiYgKGFueVVwZGF0ZXMgPSB0cnVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoYW55VXBkYXRlcykge1xuICAgICAgICAgICAgICAgICAgICBzdGFsZUZyYW1lcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY3R4LmNsZWFyUmVjdChncm91cFswXS5yZWN0LngsIGdyb3VwWzBdLnJlY3QueSwgZ3JvdXBbMF0ucmVjdC53aWR0aCwgZ3JvdXBbMF0ucmVjdC5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICBncm91cC5mb3JFYWNoKG9iaj0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iai5kcmF3KHNlbGYuY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChzdGFsZUZyYW1lcyA8IDQpIHtcbiAgICAgICAgICAgICAgICBuZXh0RnJhbWVIYW5kbGVyKHJlbmRlcmVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5yZW5kZXJpbmcgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dEZyYW1lSGFuZGxlcihyZW5kZXJlcik7XG4gICAgfVxuXG4gICAgY2FsY1lBeGlzKHtzdGVwcywgeVBhZGRpbmcsIGluZGV4UmFuZ2V9KSB7XG4gICAgICAgIGxldCBsaW1pdHMgPSBbXTtcbiAgICAgICAgbGV0IGNvdW50ID0gdGhpcy5zZXJpZXNbMF0udmFsdWVzLmxlbmd0aDtcbiAgICAgICAgbGV0IGlSYW5nZVxuICAgICAgICBpZiAoaW5kZXhSYW5nZSkge1xuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gIE1hdGguZmxvb3IoKGNvdW50IC0gMSkgLyAxMDAgKiB0aGlzLnhSYW5nZVBlcmNlbnQuc3RhcnQpO1xuICAgICAgICAgICAgaWYoc3RhcnQ8MCkgc3RhcnQgPSAwO1xuICAgICAgICAgICAgaVJhbmdlID0ge1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgICAgICAgICBlbmQ6IE1hdGguY2VpbCgoY291bnQgLSAxKSAvIDEwMCAqIHRoaXMueFJhbmdlUGVyY2VudC5lbmQpLFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaVJhbmdlID0ge3N0YXJ0OiAwLCBlbmQ6IGNvdW50IC0gMX07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXJpZXMuZm9yRWFjaChzPT4ge1xuICAgICAgICAgICAgaWYgKHMuc2hvd24pIHtcbiAgICAgICAgICAgICAgICBsaW1pdHMucHVzaChNYXRoLm1heC5hcHBseShudWxsLCBzLnZhbHVlcy5zbGljZShpUmFuZ2Uuc3RhcnQsIGlSYW5nZS5lbmQpKSk7XG4gICAgICAgICAgICAgICAgbGltaXRzLnB1c2goTWF0aC5taW4uYXBwbHkobnVsbCwgcy52YWx1ZXMuc2xpY2UoaVJhbmdlLnN0YXJ0LCBpUmFuZ2UuZW5kKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIHlNYXg6IE1hdGgubWF4LmFwcGx5KG51bGwsIGxpbWl0cyksXG4gICAgICAgICAgICB5TWluOiBNYXRoLm1pbi5hcHBseShudWxsLCBsaW1pdHMpLFxuICAgICAgICAgICAgbGFiZWxzOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCB5U3RlcCA9IChyZXN1bHQueU1heCAtIHJlc3VsdC55TWluKSAvIChzdGVwcyAtIDEpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ZXBzOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdC5sYWJlbHMucHVzaChNYXRoLnJvdW5kKHJlc3VsdC55TWF4IC0geVN0ZXAgKiBpKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHVwZGF0ZVJhbmdlKHtzdGFydCwgZW5kfSwgdXBkYXRlU2NhbGVCYXIpIHtcbiAgICAgICAgdGhpcy54UmFuZ2VQZXJjZW50LnN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMueFJhbmdlUGVyY2VudC5lbmQgPSBlbmQ7XG4gICAgICAgIGNvbnN0IHNlcmllc1JlY3QgPSB0aGlzLmdldFNlcmllc1JlY3QoKVxuICAgICAgICBjb25zdCB5RGF0YSA9IHRoaXMuY2FsY1lBeGlzKHtzdGVwczogNiwgaW5kZXhSYW5nZTogdHJ1ZX0pO1xuICAgICAgICB0aGlzLmRyYXdhYmxlcy5zY01haW4udXBkYXRlUmFuZ2UoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVjdDogc2VyaWVzUmVjdCxcbiAgICAgICAgICAgICAgICB5QXhpc0RhdGE6IHlEYXRhXG4gICAgICAgICAgICB9KVxuICAgICAgICBpZiAodXBkYXRlU2NhbGVCYXIpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd2FibGVzLnNjVW5kZXJTY2FsZUJhci51cGRhdGVSYW5nZShcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHlBeGlzRGF0YTogdGhpcy5jYWxjWUF4aXMoe3N0ZXBzOiA2fSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJhd2FibGVzLnhBeGlzLnVwZGF0ZSh7eDogc2VyaWVzUmVjdC54LCB3aWR0aDogc2VyaWVzUmVjdC53aWR0aH0pXG4gICAgICAgIHRoaXMuZHJhd2FibGVzLnlBeGlzLnVwZGF0ZVZhbHVlcyh5RGF0YSlcbiAgICAgICAgdGhpcy5zZXR1cFJlbmRlcmVyKCk7XG5cbiAgICB9XG5cbiAgICBnZXRTZXJpZXNSZWN0KCkge1xuICAgICAgICBjb25zdCBzY2FsZUZhY3RvciA9IDEgLyAoKHRoaXMueFJhbmdlUGVyY2VudC5lbmQgLSB0aGlzLnhSYW5nZVBlcmNlbnQuc3RhcnQgKSAvIDEwMCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHRoaXMucGl4ZWxQZXJQZXJjZW50ICogdGhpcy54UmFuZ2VQZXJjZW50LnN0YXJ0ICogc2NhbGVGYWN0b3IgKiAtMSxcbiAgICAgICAgICAgIHk6IHBhZGRpbmdUb3AsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCAqIHNjYWxlRmFjdG9yLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCAtIFNjYWxlQmFySGVpZ2h0IC0gcGFkZGluZ1RvcCAqIDIsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYWRkU2NlbmVPYmplY3RzKCkge1xuICAgICAgICB0aGlzLnNjZW5lT2JqZWN0R3JvdXBzID0gW107XG4gICAgICAgIGNvbnN0IHlBeGlzRGF0YSA9IHRoaXMuY2FsY1lBeGlzKHtzdGVwczogNiwgaW5kZXhSYW5nZTogdHJ1ZX0pO1xuICAgICAgICBsZXQgc2VyaWVzUmVjdCA9IHRoaXMuZ2V0U2VyaWVzUmVjdCgpO1xuICAgICAgICBsZXQgbWFpblJlY3QgPSB7XG4gICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgeTogcGFkZGluZ1RvcCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCAtIFNjYWxlQmFySGVpZ2h0IC0gcGFkZGluZ1RvcCAtIHhBeGlzSGVpZ2h0LFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCB4QXhpc1JlY3QgPSB7XG4gICAgICAgICAgICB4OiBzZXJpZXNSZWN0LngsXG4gICAgICAgICAgICB5OiB0aGlzLmhlaWdodCAtIFNjYWxlQmFySGVpZ2h0IC0geEF4aXNIZWlnaHQsXG4gICAgICAgICAgICB3aWR0aDogc2VyaWVzUmVjdC53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogeEF4aXNIZWlnaHRcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgc2NhbGVCYXJSZWN0ID0ge1xuICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgIHk6IHRoaXMuaGVpZ2h0IC0gU2NhbGVCYXJIZWlnaHQsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogU2NhbGVCYXJIZWlnaHRcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRyYXdhYmxlcy55QXhpcyA9IG5ldyBZQXhpc1NjZW5lKHtcbiAgICAgICAgICAgIHJlY3Q6IG1haW5SZWN0LFxuICAgICAgICAgICAgZGF0YTogeUF4aXNEYXRhLFxuICAgICAgICAgICAgb3JpZW50YXRpb246ICdsZWZ0JywgLy90b2RvXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRyYXdhYmxlcy54QXhpcyA9IG5ldyBYQXhpc1NjZW5lKHtcbiAgICAgICAgICAgIHJlY3Q6IHhBeGlzUmVjdCxcbiAgICAgICAgICAgIGRhdGE6IHRoaXMueEF4aXNEYXRhLFxuICAgICAgICAgICAgY3R4OiB0aGlzLmN0eFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kcmF3YWJsZXMuc2NNYWluID0gbmV3IFNlcmllc0NvbnRhaW5lcih7XG4gICAgICAgICAgICB5QXhpc0RhdGEsXG4gICAgICAgICAgICByZWN0OiBzZXJpZXNSZWN0LFxuICAgICAgICAgICAgdmlzaWJsZVJlY3Q6IG1haW5SZWN0LFxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kcmF3YWJsZXMuc2NVbmRlclNjYWxlQmFyID0gbmV3IFNlcmllc0NvbnRhaW5lcih7XG4gICAgICAgICAgICB5QXhpc0RhdGE6IHRoaXMuY2FsY1lBeGlzKHtzdGVwczogNn0pLFxuICAgICAgICAgICAgcmVjdDogc2NhbGVCYXJSZWN0LFxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kcmF3YWJsZXMuc2IgPSBuZXcgU2NhbGVCYXIoe1xuICAgICAgICAgICAgYmc6ICdyZ2JhKDIyNSwyMjUsMjI1LDAuNSknLFxuICAgICAgICAgICAgcmVjdDogc2NhbGVCYXJSZWN0LFxuICAgICAgICAgICAgcmFuZ2U6IHRoaXMueFJhbmdlUGVyY2VudCxcbiAgICAgICAgICAgIG9uUmFuZ2VDaGFuZ2U6IHRoaXMudXBkYXRlUmFuZ2UuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGNhbnZhczogdGhpcy5jYW52YXNcbiAgICAgICAgfSk7XG5cblxuICAgICAgICB0aGlzLnNjZW5lT2JqZWN0R3JvdXBzLnB1c2goW3RoaXMuZHJhd2FibGVzLnlBeGlzLCB0aGlzLmRyYXdhYmxlcy5zY01haW5dKTtcbiAgICAgICAgdGhpcy5zY2VuZU9iamVjdEdyb3Vwcy5wdXNoKFt0aGlzLmRyYXdhYmxlcy54QXhpc10pO1xuICAgICAgICB0aGlzLnNjZW5lT2JqZWN0R3JvdXBzLnB1c2goW3RoaXMuZHJhd2FibGVzLnNjVW5kZXJTY2FsZUJhciwgdGhpcy5kcmF3YWJsZXMuc2JdKTtcblxuICAgIH1cblxuICAgIHN0YXRpYyBpbml0RnJvbURhdGEoZGF0YSkge1xuICAgICAgICBsZXQgc2VyaWVzID0ge307XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBkYXRhLnR5cGVzKSB7XG4gICAgICAgICAgICBzZXJpZXNba2V5XSA9IHtcbiAgICAgICAgICAgICAgICBpZDoga2V5LFxuICAgICAgICAgICAgICAgIHR5cGU6IGRhdGEudHlwZXNba2V5XSxcbiAgICAgICAgICAgICAgICBsZWdlbmROYW1lOiBkYXRhLm5hbWVzW2tleV0sXG4gICAgICAgICAgICAgICAgY29sb3I6IGRhdGEuY29sb3JzW2tleV0sXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBkYXRhLmNvbHVtbnMuZmluZChjb2w9PmNvbFswXSA9PSBrZXkpLnNsaWNlKDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHhBeGlzID0gc2VyaWVzWyd4J107XG4gICAgICAgIC8veEF4aXMudmFsdWVzID0geEF4aXMudmFsdWVzLm1hcCh2PT4gbmV3IERhdGUodikudG9Mb2NhbGVTdHJpbmcoJ2VuLXVzJywge2RheTogJzItZGlnaXQnLCBtb250aDogJ3Nob3J0J30pKVxuICAgICAgICBkZWxldGUgc2VyaWVzWyd4J107XG4gICAgICAgIHJldHVybiBuZXcgR3JhcGgoe1xuICAgICAgICAgICAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgICAgICAgICB4QXhpcyxcbiAgICAgICAgICAgIHNlcmllczogT2JqZWN0LnZhbHVlcyhzZXJpZXMpXG4gICAgICAgIH0pXG5cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyYXBoIiwiY2xhc3MgTGVnZW5kIHtcbiAgICBjb25zdHJ1Y3Rvcih7c2VyaWVzLCBjYW52YXMsIG9uQ2xpY2tTZXJpZX0pIHtcbiAgICAgICAgdGhpcy5vbkNsaWNrU2VyaWUgPSBvbkNsaWNrU2VyaWU7XG4gICAgICAgIGxldCBsZWdlbmRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihsZWdlbmRDb250YWluZXIuc3R5bGUsIHtcbiAgICAgICAgICAgIG92ZXJmbG93WDogJ3Njcm9sbCcsXG4gICAgICAgICAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcbiAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgICBwYWRkaW5nOiAnMjBweCAxMHB4JyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoICsgJ3B4J1xuICAgICAgICB9KVxuICAgICAgICBzZXJpZXMuZm9yRWFjaCgocyk9PiB7XG4gICAgICAgICAgICBsZWdlbmRDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVMZWdlbmRCdXR0b24ocykpO1xuICAgICAgICB9KVxuICAgICAgICBjYW52YXMucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChsZWdlbmRDb250YWluZXIpXG4gICAgfVxuXG4gICAgY3JlYXRlTGVnZW5kQnV0dG9uKHNlcmllSW5mbykge1xuICAgICAgICBsZXQgYnV0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oYnV0RWwuc3R5bGUsIHtcbiAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4zKWAsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMHB4JyxcbiAgICAgICAgICAgIG1pbldpZHRoOiAnODBweCcsXG4gICAgICAgICAgICBwYWRkaW5nOiAnMTBweCcsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgbWFyZ2luUmlnaHQ6ICcyMHB4JyxcbiAgICAgICAgICAgIGxpbmVIZWlnaHQ6JzIwcHgnXG4gICAgICAgIH0pXG4gICAgICAgIGxldCBpY29uRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oaWNvbkVsLnN0eWxlLCB7XG4gICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICAgIHdpZHRoOiAnMjBweCcsXG4gICAgICAgICAgICBoZWlnaHQ6ICcyMHB4JyxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czonMjBweCcsXG4gICAgICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogc2VyaWVJbmZvLmNvbG9yLFxuICAgICAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4zKWAsXG4gICAgICAgICAgICBmbG9hdDonbGVmdCcsXG4gICAgICAgICAgICBjb2xvcjond2hpdGUnXG4gICAgICAgIH0pXG4gICAgICAgIGljb25FbC5pbm5lckhUTUw9JzxzcGFuPiYjMTAwMDM7PC9zcGFuPidcbiAgICAgICAgYnV0RWwuYXBwZW5kQ2hpbGQoaWNvbkVsKTtcbiAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHRleHQuaW5uZXJUZXh0ID0gc2VyaWVJbmZvLm5hbWU7XG4gICAgICAgIGJ1dEVsLmFwcGVuZENoaWxkKHRleHQpO1xuXG4gICAgICAgIGJ1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5vbkNsaWNrU2VyaWUoc2VyaWVJbmZvLmlkKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGljb25FbC5zdHlsZSwge1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHNlcmllSW5mby5jb2xvcixcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4zKWAsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOid3aGl0ZSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGljb25FbC5zdHlsZSwge1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke3NlcmllSW5mby5jb2xvcn1gLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjondHJhbnNwYXJlbnQnXG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBidXRFbDtcbiAgICB9XG5cbn1cbmV4cG9ydCBkZWZhdWx0IExlZ2VuZCIsImltcG9ydCBVdGlscyBmcm9tIFwiLi9VdGlscy5qc1wiO1xuXG5jb25zdCBERUZBVUxUX0FOSU1BVElPTl9EVVJBVElPTiA9IDMwMDtcbmNsYXNzIExpbmUge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgdGhpcy5kcmF3biA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBvaW50cyA9IG9wdHMucG9pbnRzO1xuICAgICAgICB0aGlzLmNvbG9yID0gb3B0cy5jb2xvcjtcbiAgICAgICAgdGhpcy5vcGFjaXR5PTE7XG4gICAgICAgIHRoaXMubGluZVdpZHRoID0gb3B0cy5saW5lV2lkdGggfHwgMjtcbiAgICB9XG5cbiAgICB1cGRhdGluZyhUSU1FKSB7XG4gICAgICAgIHRoaXMudXBkYXRlKFRJTUUpO1xuICAgICAgICByZXR1cm4gIXRoaXMuZHJhd24gfHwgdGhpcy5hbmltYXRpbmc7XG4gICAgfVxuXG4gICAgZHJhdyhjdHgpIHtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgICAgICBjdHgubGluZVdpZHRoID0gdGhpcy5saW5lV2lkdGg7XG4gICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IHRoaXMub3BhY2l0eTtcbiAgICAgICAgdGhpcy5wb2ludHMuZm9yRWFjaCgocG9pbnQsIGkpPT4ge1xuICAgICAgICAgICAgY3R4Lm1vdmVUby5hcHBseShjdHgsIHBvaW50KTtcbiAgICAgICAgICAgIGN0eC5saW5lVG8uYXBwbHkoY3R4LCB0aGlzLnBvaW50c1tpICsgMV0gfHwgcG9pbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIGN0eC5nbG9iYWxBbHBoYT0xO1xuICAgICAgICB0aGlzLmRyYXduID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYW5pbWF0ZShvcHRzKSB7XG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGluZykge1xuICAgICAgICAgICAgLy9jb250aW51ZSBjdXJyZW50IGFuaW1hdGlvbiBkdXJpbmcgcmFuZ2UgY2hhbmdlLCBtYWtlcyBpdCBzbW9vdGhcbiAgICAgICAgICAgIHRoaXMuYW5pbU9wdHMuZGlyLnBvaW50cyA9IHRoaXMuYW5pbU9wdHMub3JpZy5wb2ludHMubWFwKChwb2ludCwgaSk9PlV0aWxzLnN1YkFBKG9wdHMucG9pbnRzW2ldLCBwb2ludCkpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuaW1PcHRzID0ge1xuICAgICAgICAgICAgb3JpZzoge1xuICAgICAgICAgICAgICAgIHBvaW50czogdGhpcy5wb2ludHMubWFwKHY9PnYpLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IHRoaXMub3BhY2l0eVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpcjoge1xuICAgICAgICAgICAgICAgIHBvaW50czogdGhpcy5wb2ludHMubWFwKChwb2ludCwgaSk9PlV0aWxzLnN1YkFBKG9wdHMucG9pbnRzW2ldLCBwb2ludCkpLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6KG9wdHMub3BhY2l0eT09PXVuZGVmaW5lZD8gMTpvcHRzLm9wYWNpdHkpIC0gdGhpcy5vcGFjaXR5LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiBvcHRzLmR1cmF0aW9uIHx8IERFRkFVTFRfQU5JTUFUSU9OX0RVUkFUSU9OLFxuICAgICAgICAgICAgcHJvZ3Jlc3M6IG51bGwsXG4gICAgICAgICAgICBzdGFydDogbnVsbFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVwZGF0ZShUSU1FKSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmFuaW1hdGluZykgcmV0dXJuIGZhbHNlO1xuICAgICAgICBsZXQgb3B0cyA9IHRoaXMuYW5pbU9wdHM7XG4gICAgICAgIGlmIChvcHRzLnByb2dyZXNzID09IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5hbmltT3B0cztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGluZyAmJiAhb3B0cy5zdGFydCkge1xuICAgICAgICAgICAgb3B0cy5zdGFydCA9IFRJTUU7XG4gICAgICAgIH1cblxuICAgICAgICBvcHRzLnByb2dyZXNzID0gKChUSU1FIC0gb3B0cy5zdGFydCkgLyBvcHRzLmR1cmF0aW9uKTtcbiAgICAgICAgaWYgKG9wdHMucHJvZ3Jlc3MgPiAxKSB7XG4gICAgICAgICAgICBvcHRzLnByb2dyZXNzID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0cy5kaXIub3BhY2l0eSAhPSAwKSB7XG4gICAgICAgICAgICB0aGlzLm9wYWNpdHkgPSBvcHRzLm9yaWcub3BhY2l0eSsgb3B0cy5kaXIub3BhY2l0eSAqIG9wdHMucHJvZ3Jlc3M7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wb2ludHMgPSBvcHRzLm9yaWcucG9pbnRzLm1hcCgob3Jwb2ludCwgaSk9PiB7XG4gICAgICAgICAgICByZXR1cm4gVXRpbHMuYWRkQUEob3Jwb2ludCwgVXRpbHMubXVsdGlBVihvcHRzLmRpci5wb2ludHNbaV0sIG9wdHMucHJvZ3Jlc3MpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5leHBvcnQgZGVmYXVsdCBMaW5lIiwiY2xhc3MgSGl0UmVjdCB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICB0aGlzLmltbXV0YWJsZSA9IG9wdHMuaW1tdXRhYmxlIHx8IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5pbW11dGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMucmVjdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdHMucmVjdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlY3QgPSBvcHRzLnJlY3Q7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYW52YXMgPSBvcHRzLmNhbnZhcztcbiAgICAgICAgdGhpcy5uYW1lID0gb3B0cy5uYW1lO1xuICAgICAgICB0aGlzLm9uTW92ZSA9IG9wdHMub25Nb3ZlIHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIH07XG4gICAgICAgIHRoaXMub25Nb3ZlWCA9IG9wdHMub25Nb3ZlWCB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB9O1xuICAgICAgICB0aGlzLm9uQ2xpY2tTdGFydCA9IG9wdHMub25DbGlja1N0YXJ0IHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIH07XG4gICAgICAgIC8vQHRvZG8gcHJvYmFibHkgZG8gdGhlIGZ1bGxmZWF0dXJlZCBkb3duLXVwIGNsaWNrXG5cbiAgICAgICAgY29uc3QgbW92ZUhhbmRsZXIgPSB0aGlzLm1vdmUuYmluZCh0aGlzKVxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZSk9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0hpdChlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMub25DbGlja1N0YXJ0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZUhhbmRsZXIpXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LCBmYWxzZSlcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChlKT0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVIYW5kbGVyKVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKGUpPT4ge1xuICAgICAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZUhhbmRsZXIpXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChlKT0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzSGl0KGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNsaWNrU3RhcnQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBtb3ZlSGFuZGxlcilcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgKGUpPT4ge1xuICAgICAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgbW92ZUhhbmRsZXIpXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBtb3ZlKGUpIHtcbiAgICAgICAgbGV0IGVYID0gZS5sYXllclggfHwgZS5vZmZzZXRYLFxuICAgICAgICAgICAgZVkgPSBlLmxheWVyWSB8fCBlLm9mZnNldFksXG4gICAgICAgICAgICB4RGlmZiA9IGVYIC0gdGhpcy5zWDtcblxuICAgICAgICB0aGlzLnJlY3QueCArPSB4RGlmZjtcbiAgICAgICAgdGhpcy5vbk1vdmVYKHhEaWZmKVxuICAgICAgICB0aGlzLnNYID0gZVg7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5vbk1vdmUodGhpcy5yZWN0KTtcbiAgICB9XG5cbiAgICBpc0hpdChlKSB7XG4gICAgICAgIGxldCByID0gdGhpcy5yZWN0LFxuICAgICAgICAgICAgZVggPSBlLmxheWVyWCB8fCBlLm9mZnNldFgsXG4gICAgICAgICAgICBlWSA9IGUubGF5ZXJZIHx8IGUub2Zmc2V0WSxcbiAgICAgICAgICAgIGhpdFggPSByLnggPCBlWCAmJiBlWCA8IHIueCArIHIud2lkdGgsXG4gICAgICAgICAgICBoaXRZID0gci55IDwgZVkgJiYgZVkgPCByLnkgKyByLmhlaWdodDtcblxuXG4gICAgICAgIHRoaXMuc1ggPSBlWDtcbiAgICAgICAgdGhpcy5zWSA9IGVZO1xuICAgICAgICByZXR1cm4gaGl0WSAmJiBoaXRYXG4gICAgfVxufVxuXG5cbmNvbnN0IERSQUdfQk9YX1dJRFRIID0gMTA7XG5jb25zdCBMSU5FX1dJRFRIID0gMztcbmNvbnN0IERSQUdfQk9YX0NPTE9SID0gJ3JnYmEoMTUwLDE1MCwxNTAsMC43KSc7XG5jb25zdCBCRyA9ICdyZ2JhKDE1MCwxNTAsMTUwLDAuMyknO1xuXG5jbGFzcyBTY2FsZUJhciB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICB0aGlzLmRyYXduID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVjdCA9IG9wdHMucmVjdDtcbiAgICAgICAgdGhpcy5iZyA9IG9wdHMuYmcgfHwgQkc7XG4gICAgICAgIHRoaXMuZHJhZ0JveENvbG9yID0gb3B0cy5kcmFnQm94Q29sb3IgfHwgRFJBR19CT1hfQ09MT1I7XG4gICAgICAgIHRoaXMuZHJhZ0JveFdpZHRoID0gb3B0cy5kcmFnQm94V2lkdGggfHwgRFJBR19CT1hfV0lEVEg7XG4gICAgICAgIHRoaXMucmFuZ2UgPSBPYmplY3QuYXNzaWduKG9wdHMucmFuZ2UpO1xuICAgICAgICB0aGlzLm9uUmFuZ2VDaGFuZ2UgPSBvcHRzLm9uUmFuZ2VDaGFuZ2UgfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmlzaWJsZVJlY3QgPSB7fTtcbiAgICAgICAgdGhpcy5yaWdodEJveFJlY3QgPSB7fTtcbiAgICAgICAgdGhpcy5sZWZ0Qm94UmVjdCA9IHt9O1xuXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUmVjdCgpO1xuICAgICAgICB0aGlzLmxpbmVXaWR0aCA9IG9wdHMubGluZVdpZHRoIHx8IExJTkVfV0lEVEg7XG5cbiAgICAgICAgbmV3IEhpdFJlY3Qoe1xuICAgICAgICAgICAgbmFtZTogJ2xlZnQnLFxuICAgICAgICAgICAgcmVjdDogdGhpcy5sZWZ0Qm94UmVjdCxcbiAgICAgICAgICAgIG9uTW92ZVg6IHRoaXMub25Nb3ZlTGVmdEJhci5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgY2FudmFzOiBvcHRzLmNhbnZhc1xuICAgICAgICB9KVxuICAgICAgICBuZXcgSGl0UmVjdCh7XG4gICAgICAgICAgICBuYW1lOiAncmlnaHQnLFxuICAgICAgICAgICAgcmVjdDogdGhpcy5yaWdodEJveFJlY3QsXG4gICAgICAgICAgICBvbk1vdmVYOiB0aGlzLm9uTW92ZVJpZ2h0QmFyLmJpbmQodGhpcyksXG4gICAgICAgICAgICBjYW52YXM6IG9wdHMuY2FudmFzXG4gICAgICAgIH0pXG4gICAgICAgIG5ldyBIaXRSZWN0KHtcbiAgICAgICAgICAgIG5hbWU6ICd0cmFucycsXG4gICAgICAgICAgICByZWN0OiB0aGlzLnZpc2libGVSZWN0LFxuICAgICAgICAgICAgb25Nb3ZlOiB0aGlzLm9uTW92ZVZpc2libGVBcmVhLmJpbmQodGhpcyksXG4gICAgICAgICAgICBjYW52YXM6IG9wdHMuY2FudmFzXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy9AdG9kbyBsaW1pdCBsZWZ0LXJpZ2h0IGJhcnMgY3Jvc3NpbmcuIEZ1bm55IG1pcnJvciBlZmZlY3QgbG9sXG5cblxuICAgIH1cblxuICAgIG9uTW92ZUxlZnRCYXIoZGlmZlgpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlUmVjdC54ICs9IGRpZmZYO1xuICAgICAgICB0aGlzLnZpc2libGVSZWN0LndpZHRoIC09IGRpZmZYO1xuICAgICAgICB0aGlzLm9uTW92ZVZpc2libGVBcmVhKHRoaXMudmlzaWJsZVJlY3QpXG4gICAgfVxuXG4gICAgb25Nb3ZlUmlnaHRCYXIoZGlmZlgpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlUmVjdC53aWR0aCArPSBkaWZmWDtcbiAgICAgICAgdGhpcy5vbk1vdmVWaXNpYmxlQXJlYSh0aGlzLnZpc2libGVSZWN0KVxuICAgIH1cblxuICAgIG9uTW92ZVZpc2libGVBcmVhKHZyKSB7XG4gICAgICAgIHRoaXMuZHJhd24gPSBmYWxzZTtcbiAgICAgICAgdnIueCA8IHRoaXMucmVjdC54ICYmICh2ci54ID0gdGhpcy5yZWN0LngpO1xuICAgICAgICB2ci54ID4gKHRoaXMucmVjdC53aWR0aCArIHRoaXMucmVjdC54IC0gdnIud2lkdGgpICYmICh2ci54ID0gdGhpcy5yZWN0LndpZHRoICsgdGhpcy5yZWN0LnggLSB2ci53aWR0aCk7XG5cbiAgICAgICAgdGhpcy5yYW5nZS5zdGFydCA9ICgodnIueCAtIHRoaXMucmVjdC54KSAvIHRoaXMucmVjdC53aWR0aCkgKiAxMDBcbiAgICAgICAgdGhpcy5yYW5nZS5lbmQgPSAoKHZyLnggLSB0aGlzLnJlY3QueCArIHZyLndpZHRoKSAvIHRoaXMucmVjdC53aWR0aCkgKiAxMDBcblxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVJlY3QoKTtcbiAgICAgICAgdGhpcy5vblJhbmdlQ2hhbmdlKHRoaXMucmFuZ2UpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZVJlY3QoKSB7XG5cbiAgICAgICAgLy90aGlzIGxvZ2ljIGlzIGJhc2VkIG9uIHJlZmVyZW5jZSBwYXNzaW5nIHRvIEhpdFJlY3QgY2xhc3MuIFNvIHdlIGFyZSBrZWVwaW5nIHNhbWUgb2JqZWN0cyByZWZlcmVuY2VzIChtYXRhdGluZyBwYXJhbXMpLlxuICAgICAgICAvL290aGVyd2lzZSBjYWxjdWxhdGUgZWFjaCBoaXQgYm94ICBjaGFuZ2VzIHNlcGFyYXRlbHkuXG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnZpc2libGVSZWN0LCB7XG4gICAgICAgICAgICB4OiB0aGlzLnJlY3QueCArICgodGhpcy5yZWN0LndpZHRoIC8gMTAwKSAqIHRoaXMucmFuZ2Uuc3RhcnQpLFxuICAgICAgICAgICAgeTogdGhpcy5yZWN0LnksXG4gICAgICAgICAgICB3aWR0aDogKCh0aGlzLnJhbmdlLmVuZCAtIHRoaXMucmFuZ2Uuc3RhcnQpIC8gMTAwKSAqIHRoaXMucmVjdC53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5yZWN0LmhlaWdodFxuICAgICAgICB9KTtcblxuICAgICAgICAvL3RyaXBwbGUgaGl0IGJveCBmb3IgQmFyc1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMubGVmdEJveFJlY3QsIHtcbiAgICAgICAgICAgIHg6IHRoaXMudmlzaWJsZVJlY3QueCAtIHRoaXMuZHJhZ0JveFdpZHRoLFxuICAgICAgICAgICAgeTogdGhpcy52aXNpYmxlUmVjdC55LFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZHJhZ0JveFdpZHRoICogMyxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy52aXNpYmxlUmVjdC5oZWlnaHRcbiAgICAgICAgfSlcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnJpZ2h0Qm94UmVjdCwge1xuICAgICAgICAgICAgeDogdGhpcy52aXNpYmxlUmVjdC54ICsgdGhpcy52aXNpYmxlUmVjdC53aWR0aCAtIHRoaXMuZHJhZ0JveFdpZHRoICogMixcbiAgICAgICAgICAgIHk6IHRoaXMudmlzaWJsZVJlY3QueSxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmRyYWdCb3hXaWR0aCAqIDMsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMudmlzaWJsZVJlY3QuaGVpZ2h0XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdXBkYXRpbmcoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5kcmF3bjtcbiAgICB9XG5cbiAgICBkcmF3KGN0eCkge1xuXG4gICAgICAgIGNvbnN0IHtkcmFnQm94V2lkdGgsIGxpbmVXaWR0aCwgZHJhZ0JveENvbG9yLCBiZ30gPSB0aGlzO1xuICAgICAgICBjb25zdCByID0gdGhpcy5yZWN0O1xuICAgICAgICBjb25zdCB2ciA9IHRoaXMudmlzaWJsZVJlY3Q7XG5cbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGJnO1xuICAgICAgICBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xuXG4gICAgICAgIGN0eC5maWxsUmVjdChyLngsIHIueSwgdnIueCAtIHIueCwgci5oZWlnaHQpOyAvL2xlZnQgZ3JheW91dFxuICAgICAgICBjdHguZmlsbFJlY3QodnIueCArIHZyLndpZHRoLCByLnksIHIud2lkdGggLSB2ci54IC0gdnIud2lkdGgsIHZyLmhlaWdodCk7IC8vcmlnaHQgZ3JheW91dFxuICAgICAgICBjdHguZmlsbFJlY3QodnIueCArIGRyYWdCb3hXaWR0aCwgdnIueSwgdnIud2lkdGggLSBkcmFnQm94V2lkdGggKiAyLCBsaW5lV2lkdGgpOyAvL3Zpc2libGUgYm94IHRvcCBsaW5lXG4gICAgICAgIGN0eC5maWxsUmVjdCh2ci54ICsgZHJhZ0JveFdpZHRoLCB2ci55ICsgdnIuaGVpZ2h0IC0gbGluZVdpZHRoLCB2ci53aWR0aCAtIGRyYWdCb3hXaWR0aCAqIDIsIGxpbmVXaWR0aCk7IC8vdmlzaWJsZSBib3ggYm90dG9tIGxpbmVcblxuICAgICAgICBjdHguZmlsbFN0eWxlID0gZHJhZ0JveENvbG9yO1xuXG4gICAgICAgIGN0eC5maWxsUmVjdCh2ci54LCB2ci55LCBkcmFnQm94V2lkdGgsIHZyLmhlaWdodCk7ICAvL2xlZnREcmFnQmFyXG4gICAgICAgIGN0eC5maWxsUmVjdCh2ci54ICsgdnIud2lkdGggLSBkcmFnQm94V2lkdGgsIHZyLnksIGRyYWdCb3hXaWR0aCwgdnIuaGVpZ2h0KTsgIC8vcmlnaHREcmFnQmFyXG5cbiAgICAgICAgdGhpcy5kcmF3biA9IHRydWU7XG4gICAgfVxuXG59XG5leHBvcnQgZGVmYXVsdCAgU2NhbGVCYXIiLCJpbXBvcnQgTGluZSBmcm9tIFwiLi9MaW5lLmpzXCI7XG5jbGFzcyBTZXJpZXNDb250YWluZXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgdGhpcy5yZWN0ID0gb3B0cy5yZWN0O1xuICAgICAgICB0aGlzLnZpc2libGVSZWN0ID0gb3B0cy52aXNpYmxlUmVjdCB8fCB0aGlzLnJlY3Q7XG4gICAgICAgIHRoaXMuc2VyaWVzID0gb3B0cy5zZXJpZXMubWFwKHNlciA9PiBPYmplY3QuYXNzaWduKHt9LCBzZXIpKTtcbiAgICAgICAgdGhpcy55QXhpc0RhdGEgPSBvcHRzLnlBeGlzRGF0YVxuICAgICAgICB0aGlzLmRyYXdhYmxlcyA9IFtdXG5cbiAgICAgICAgdGhpcy5zZXJpZXMuZm9yRWFjaChzZXI9PiB7XG4gICAgICAgICAgICBpZiAoc2VyLnR5cGUgPT0gJ2xpbmUnKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBvaW50cyA9IHRoaXMuY2FsY3VsYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgeUF4aXM6IHRoaXMueUF4aXNEYXRhLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IHNlci52YWx1ZXMsXG4gICAgICAgICAgICAgICAgICAgIHJlY3Q6IHRoaXMucmVjdCxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGxldCBpbml0UG9pbnRzID0gcG9pbnRzLm1hcChwPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3BbMF0sIHRoaXMucmVjdC5oZWlnaHQgLyAyICsgdGhpcy5yZWN0LnldXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGV0IGxpbmUgPSBuZXcgTGluZSh7cG9pbnRzOiBpbml0UG9pbnRzLCBjb2xvcjogc2VyLmNvbG9yfSlcbiAgICAgICAgICAgICAgICBsaW5lLmFuaW1hdGUoe3BvaW50c30pO1xuICAgICAgICAgICAgICAgIHNlci5kcmF3YWJsZUxpbmUgPSBsaW5lO1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd2FibGVzLnB1c2gobGluZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdG9nZ2xlU2VyaWUoaWQpIHtcbiAgICAgICAgdmFyIHNlciA9IHRoaXMuc2VyaWVzLmZpbmQocz0+IHMuaWQgPT0gaWQpO1xuICAgICAgICBzZXIuc2hvd24gPSAhc2VyLnNob3duO1xuICAgICAgICBpZiAoIXNlci5zaG93bikge1xuICAgICAgICAgICAgc2VyLmRyYXdhYmxlTGluZS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBwb2ludHM6IHNlci5kcmF3YWJsZUxpbmUucG9pbnRzLm1hcChwPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3BbMF0sIHRoaXMucmVjdC55XVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6MFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL3NlcmllLmRyYXdhYmxlTGluZS5kcmF3biA9IGZhbHNlO1xuXG4gICAgfVxuXG4gICAgdXBkYXRlUmFuZ2Uoe3JlY3QsIHlBeGlzRGF0YX0pIHtcbiAgICAgICAgaWYgKHJlY3QpIHtcbiAgICAgICAgICAgIHRoaXMucmVjdCA9IHJlY3Q7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy55QXhpc0RhdGEgPSB5QXhpc0RhdGE7XG4gICAgICAgIHRoaXMuc2VyaWVzLmZvckVhY2goc2VyPT4ge1xuICAgICAgICAgICAgaWYgKHNlci50eXBlID09ICdsaW5lJyAmJiBzZXIuc2hvd24pIHtcbiAgICAgICAgICAgICAgICBsZXQgcG9pbnRzID0gdGhpcy5jYWxjdWxhdGUoe1xuICAgICAgICAgICAgICAgICAgICB5QXhpczogdGhpcy55QXhpc0RhdGEsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyLnZhbHVlcyxcbiAgICAgICAgICAgICAgICAgICAgcmVjdDogdGhpcy5yZWN0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHNlci5kcmF3YWJsZUxpbmUuYW5pbWF0ZSh7cG9pbnRzfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY2FsY3VsYXRlKHt2YWx1ZXMsIHJlY3QsIHlBeGlzfSkge1xuICAgICAgICBsZXQge3lNYXgsIHlNaW59ID0geUF4aXM7XG4gICAgICAgIGxldCB4U3RlcCA9IHJlY3Qud2lkdGggLyAodmFsdWVzLmxlbmd0aCAtIDEpO1xuICAgICAgICByZXR1cm4gdmFsdWVzLm1hcCgodmFsdWUsIGkpPT4ge1xuICAgICAgICAgICAgbGV0IG5ld1kgPSBNYXRoLmFicygoKHZhbHVlIC0geU1pbikgLyAoeU1heCAtIHlNaW4pKSAqIHJlY3QuaGVpZ2h0IC0gcmVjdC5oZWlnaHQpICsgcmVjdC55O1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBpICogeFN0ZXAgKyByZWN0LngsXG4gICAgICAgICAgICAgICAgbmV3WVxuICAgICAgICAgICAgXVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgdXBkYXRpbmcoVElNRSkge1xuICAgICAgICBsZXQgYW55VXBkYXRlcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNlcmllcy5mb3JFYWNoKHM9PiB7XG4gICAgICAgICAgICBsZXQgZCA9IHMuZHJhd2FibGVMaW5lO1xuICAgICAgICAgICAgbGV0IHJlcyA9IGQudXBkYXRpbmcoVElNRSlcbiAgICAgICAgICAgIGlmICghYW55VXBkYXRlcykge1xuICAgICAgICAgICAgICAgIGFueVVwZGF0ZXMgPSByZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGFueVVwZGF0ZXM7XG4gICAgfVxuXG4gICAgZHJhdyhjdHgpIHtcbiAgICAgICAgdGhpcy5zZXJpZXMuZm9yRWFjaChzPT4ge1xuICAgICAgICAgICAgaWYgKHMuc2hvd24gfHwgcy5kcmF3YWJsZUxpbmUuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICBsZXQgZCA9IHMuZHJhd2FibGVMaW5lXG4gICAgICAgICAgICBkLmRyYXcoY3R4KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgU2VyaWVzQ29udGFpbmVyIiwiY2xhc3MgVXRpbHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHN0YXRpYyBuZXdEZWZlcnJlZCgpIHtcbiAgICAgICAgbGV0IHJlc29sdmUsIHJlamVjdDtcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzLCByZWopPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSA9IHJlcztcbiAgICAgICAgICAgIHJlamVjdCA9IHJlajtcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHByb21pc2UsXG4gICAgICAgICAgICByZXNvbHZlLFxuICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMga2V5QnlWYWx1ZShvYmosIHZhbHVlKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmpba2V5XSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdWJBQShhMSwgYTIpIHtcbiAgICAgICAgcmV0dXJuIGExLm1hcCgodiwgaSk9PiB7XG4gICAgICAgICAgICByZXR1cm4gdiAtIGEyW2ldO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXRpYyBhZGRBQShhMSwgYTIpIHtcbiAgICAgICAgcmV0dXJuIGExLm1hcCgodiwgaSk9PiB7XG4gICAgICAgICAgICByZXR1cm4gdiArIGEyW2ldO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXRpYyBtdWx0aUFWKGExLCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIGExLm1hcCgodiwgaSk9PiB7XG4gICAgICAgICAgICByZXR1cm4gdiAqIHZhbDtcbiAgICAgICAgfSlcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCAgVXRpbHMiLCJjb25zdCBNT05USFMgPSBbXG4gICAgJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJyxcbiAgICAnSnVsJywgJ0F1ZycsICdTZXAnLCAnT2N0JywgJ05vdicsICdEZWMnXG5dXG5jbGFzcyBYQXhpc1NjZW5lIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHRoaXMuZHJhd24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yZWN0ID0gb3B0cy5yZWN0O1xuICAgICAgICB0aGlzLnBvaW50cyA9IFtdO1xuXG4gICAgICAgIHRoaXMuY29scyA9IG9wdHMuZGF0YS52YWx1ZXMubWFwKCh2LCBpKT0+IHtcbiAgICAgICAgICAgIGxldCBkID0gbmV3IERhdGUodik7XG4gICAgICAgICAgICBsZXQgdGEgPSAnY2VudGVyJ1xuICAgICAgICAgICAgaWYgKGkgPT0gMCkge1xuICAgICAgICAgICAgICAgIHRhID0gJ2xlZnQnXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gb3B0cy5kYXRhLnZhbHVlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgdGEgPSAncmlnaHQnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdGV4dCAgPSBkLmdldERhdGUoKSArICcgJyArIE1PTlRIU1tkLmdldE1vbnRoKCldO1xuICAgICAgICAgICAgb3B0cy5jdHguZmlsbFN0eWxlID0gJ2JsYWNrJ1xuICAgICAgICAgICAgb3B0cy5jdHguZm9udCA9ICcxNHB4IEFyaWFsJ1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IHRhLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2LFxuICAgICAgICAgICAgICAgIHRleHQ6dGV4dCxcbiAgICAgICAgICAgICAgICB3aWR0aDogb3B0cy5jdHgubWVhc3VyZVRleHQodGV4dCkud2lkdGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmNhbGN1bGF0ZSgpO1xuICAgIH1cblxuXG4gICAgY2FsY3VsYXRlKCkge1xuICAgICAgICBsZXQgeFN0ZXAgPSB0aGlzLnJlY3Qud2lkdGggLyAodGhpcy5jb2xzLmxlbmd0aCAtIDEpO1xuICAgICAgICB0aGlzLmxhYmVscyA9IHRoaXMuY29scy5tYXAoKGNvbCwgaSk9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHg6IHRoaXMucmVjdC54ICsgKGkgKiB4U3RlcCksXG4gICAgICAgICAgICAgICAgeTogdGhpcy5yZWN0LnkgKyB0aGlzLnJlY3QuaGVpZ2h0IC0gNSxcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IGNvbC50ZXh0QWxpZ24sXG4gICAgICAgICAgICAgICAgdGV4dDogY29sLnRleHQsXG4gICAgICAgICAgICAgICAgd2lkdGg6Y29sLndpZHRoXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdXBkYXRlKHt4LCB3aWR0aH0pIHtcbiAgICAgICAgdGhpcy5yZWN0LnggPSB4O1xuICAgICAgICB0aGlzLnJlY3Qud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGUoKTtcbiAgICAgICAgdGhpcy5kcmF3biA9IGZhbHNlO1xuICAgIH1cblxuICAgIHVwZGF0aW5nKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuZHJhd247XG4gICAgfVxuXG4gICAgZHJhdyhjdHgpIHtcbiAgICAgICAgY29uc3QgciA9IHRoaXMucmVjdFxuICAgICAgICAvLyBjdHguZmlsbFN0eWxlID0gJ3JlZCc7XG4gICAgICAgIC8vY3R4LmZpbGxSZWN0KHIueCwgci55LCByLndpZHRoLCByLmhlaWdodClcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdncmV5J1xuICAgICAgICBjdHguZm9udCA9ICcxNHB4IEFyaWFsJ1xuXG4gICAgICAgIGxldCB0YWtlblggPSB0aGlzLmxhYmVsc1swXS54O1xuICAgICAgICB0aGlzLmxhYmVscy5mb3JFYWNoKChsYiwgaSk9PiB7XG4gICAgICAgICAgICBpZiAoaSA+IDAgJiYgbGIueCAtIGxiLndpZHRoIC8gMiA8IHRha2VuWCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN0eC50ZXh0QWxpZ24gPSBsYi50ZXh0QWxpZ247XG4gICAgICAgICAgICB0YWtlblggKz0gbGIud2lkdGggKyAyMFxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGxiLnRleHQsIGxiLngsIGxiLnkpO1xuICAgICAgICB9KVxuICAgICAgICB0aGlzLmRyYXduID0gdHJ1ZTtcbiAgICB9XG5cblxufVxuXG5leHBvcnQgZGVmYXVsdCBYQXhpc1NjZW5lIiwiaW1wb3J0IExpbmUgZnJvbSBcIi4vTGluZS5qc1wiO1xuXG5jbGFzcyBZQXhpc1NjZW5lIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHRoaXMuZHJhd24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kYXRhID0gb3B0cy5kYXRhO1xuXG4gICAgICAgIHRoaXMubGFiZWxzID0gW107XG4gICAgICAgIHRoaXMubGluZXMgPSBbXTtcblxuICAgICAgICB0aGlzLnJlY3QgPSBvcHRzLnJlY3Q7XG4gICAgICAgIHRoaXMuYmcgPSBvcHRzLmJnO1xuICAgICAgICB0aGlzLnBhZGRpbmcgPSBvcHRzLnBhZGRpbmcgfHwgNTtcbiAgICAgICAgdGhpcy5saW5lQ29sb3IgPSBvcHRzLmxpbmVDb2xvciB8fCAnZ3JleSc7XG4gICAgICAgIHRoaXMubGluZVdpZHRoID0gb3B0cy5saW5lV2lkdGggfHwgMC4zO1xuICAgICAgICB0aGlzLmZvbnRDb2xvciA9IG9wdHMuZm9udENvbG9yIHx8ICdncmV5JztcbiAgICAgICAgdGhpcy5mb250U2l6ZSA9IG9wdHMuZm9udFNpemUgfHwgMTQ7XG4gICAgICAgIHRoaXMubGFiZWxGb3JtYXRGbiA9IG9wdHMubGFiZWxGb3JtYXRGbiB8fCB0aGlzLmxhYmVsRm9ybWF0Rm5EZWZhdWx0O1xuXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlKCk7XG4gICAgfVxuICAgIHVwZGF0ZVZhbHVlcyhkYXRhKXtcbiAgICAgICAgdGhpcy5kYXRhPWRhdGE7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlKCk7XG4gICAgICAgIHRoaXMuZHJhd24gPSBmYWxzZTtcbiAgICB9XG4gICAgbGFiZWxGb3JtYXRGbkRlZmF1bHQodmFsdWUpIHtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUludCh2YWx1ZSlcbiAgICAgICAgaWYgKHZhbHVlIC8gMWU5ID49IDEpIHtcbiAgICAgICAgICAgIHZhbHVlID0gKHZhbHVlIC8gMWU5KS50b0ZpeGVkKDIpICsgJ2InXG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgLyAxZTYgPj0gMSkge1xuICAgICAgICAgICAgdmFsdWUgPSAodmFsdWUgLyAxZTYpLnRvRml4ZWQoMikgKyAnbSdcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAvIDFlMyA+PSAxKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICh2YWx1ZSAvIDFlMykudG9GaXhlZCgyKSArICdrJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cblxuICAgIGNhbGN1bGF0ZSgpIHtcbiAgICAgICAgLy90b3AgdG8gYm90dG9tXG4gICAgICAgIGxldCBzdGFydFkgPSB0aGlzLnJlY3QueTtcbiAgICAgICAgbGV0IHlQaXhlbFN0ZXAgPSB0aGlzLnJlY3QuaGVpZ2h0IC8gKHRoaXMuZGF0YS5sYWJlbHMubGVuZ3RoIC0gMSk7XG4gICAgICAgIHRoaXMubGFiZWxzID0gW107XG4gICAgICAgIHRoaXMubGluZXMgPSBbXTtcbiAgICAgICAgdGhpcy5kYXRhLmxhYmVscy5mb3JFYWNoKGxibD0+IHtcblxuICAgICAgICAgICAgdGhpcy5sYWJlbHMucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogbGJsLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IHRoaXMuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgZm9udENvbG9yOiB0aGlzLmZvbnRDb2xvcixcbiAgICAgICAgICAgICAgICB4OiB0aGlzLnJlY3QueCArIHRoaXMucGFkZGluZyxcbiAgICAgICAgICAgICAgICB5OiBzdGFydFkgLSB0aGlzLnBhZGRpbmdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLmxpbmVzLnB1c2gobmV3IExpbmUoe1xuICAgICAgICAgICAgICAgIHBvaW50czogW1xuICAgICAgICAgICAgICAgICAgICBbdGhpcy5yZWN0LngsIHN0YXJ0WV0sXG4gICAgICAgICAgICAgICAgICAgIFt0aGlzLnJlY3Qud2lkdGgsIHN0YXJ0WV1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogdGhpcy5saW5lV2lkdGgsXG4gICAgICAgICAgICAgICAgY29sb3I6IHRoaXMubGluZUNvbG9yXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIHN0YXJ0WSArPSB5UGl4ZWxTdGVwO1xuICAgICAgICB9KVxuICAgICAgICAvL2hvdGZpeCBmb3Igbm90IGRyYXdpbmcgdG9wIGxpbmUgPyBpcyBpdCBldmVuIG5lZWRlZD9cbiAgICAgICAgLy90aGlzLmxpbmVzLnNwbGljZSgwLDEpXG4gICAgICAgIC8vdGhpcy5sYWJlbHMuc3BsaWNlKDAsMSlcbiAgICB9XG5cbiAgICB1cGRhdGluZygpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmRyYXduO1xuICAgIH1cblxuICAgIGRyYXcoY3R4KSB7XG4gICAgICAgIGxldCByID0gdGhpcy5yZWN0O1xuXG4gICAgICAgIGlmICh0aGlzLmJnKSB7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5iZztcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdChyLngsIHIueSwgci53aWR0aCwgci5oZWlnaHQpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5saW5lcy5mb3JFYWNoKGxpbmU9PmxpbmUuZHJhdyhjdHgpKTtcbiAgICAgICAgdGhpcy5sYWJlbHMuZm9yRWFjaCgobGJsLCBpKT0+IHtcbiAgICAgICAgICAgIGN0eC5mb250ID0gYCR7bGJsLmZvbnRTaXplfXB4IEFyaWFsYDtcbiAgICAgICAgICAgIGN0eC50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gbGJsLmZvbnRDb2xvcjtcblxuICAgICAgICAgICAgbGV0IHkgPSBpID09IDAgPyBsYmwueSArIGxibC5mb250U2l6ZSArIHRoaXMucGFkZGluZyA6IGxibC55O1xuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMubGFiZWxGb3JtYXRGbkRlZmF1bHQobGJsLnRleHQpLCBsYmwueCwgeSlcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5kcmF3biA9IHRydWU7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBZQXhpc1NjZW5lIl0sInNvdXJjZVJvb3QiOiIifQ==