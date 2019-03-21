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
            window.g = _src_Graph_js__WEBPACK_IMPORTED_MODULE_0__["default"].initFromData(data[4]);
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
/* harmony import */ var _ScaleBar_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ScaleBar.js */ "./src/ScaleBar.js");
/* harmony import */ var _SeriesContainer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SeriesContainer.js */ "./src/SeriesContainer.js");




const paddingTopBot = 20;
const ScaleBarHeight = 80;

class Graph {
    constructor(opts) {
        var canvas = opts.el;
        this.series = opts.series;
        this.drawables = {};
        this.xRangePercent = opts.defaultXRangePercent || {start: 0, end: 20};
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
    }

    setupRenderer() {
        var self = this;
        var nextFrameHandler = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;

        function renderer(tfDiff) {
            // self.ctx.clearRect(0, 0, self.width, self.height);
            self.sceneObjectGroups.forEach((group,i)=> {
                let anyUpdates = false;
                group.forEach(obj=> {
                    obj.updating(tfDiff) && (anyUpdates = true);
                });
                if (anyUpdates) {
                    self.ctx.clearRect(group[0].rect.x, group[0].rect.y, group[0].rect.width, group[0].rect.height);
                    group.forEach(obj=> {
                        obj.draw(self.ctx);
                    })
                }
            });
            nextFrameHandler(renderer);
        }

        nextFrameHandler(renderer);
    }

    calcYAxis({serieValues, steps, yPadding}) {
        let limits = [];
        serieValues.forEach(sv=> {
            limits.push(Math.max.apply(null, sv));
            limits.push(Math.min.apply(null, sv));
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

    updateRange({start,end}) {
        this.xRangePercent.start=start;
        this.xRangePercent.end=end;
      //  const yAxisData = this.calcYAxis({serieValues: this.series.map(s=>s.values), steps: 6});
        this.drawables.scMain.updateRange({rect:this.getSeriesRect()})
    }

    getSeriesRect() {
        const scaleFactor = 1 / ((this.xRangePercent.end - this.xRangePercent.start ) / 100);

        return {
            x: this.pixelPerPercent * this.xRangePercent.start * scaleFactor * -1,
            y: paddingTopBot,
            width: this.width * scaleFactor,
            height: this.height - ScaleBarHeight - paddingTopBot * 2,
        };
    }

    addSceneObjects() {
        this.sceneObjectGroups = [];

        const yAxisData = this.calcYAxis({serieValues: this.series.map(s=>s.values), steps: 6});

        let mainRect = {
            x: 0,
            y: paddingTopBot,
            width: this.width,
            height: this.height - ScaleBarHeight - paddingTopBot * 2,
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
        this.drawables.scMain = new _SeriesContainer_js__WEBPACK_IMPORTED_MODULE_2__["default"]({
            yAxisData,
            rect: this.getSeriesRect(),
            visibleRect: mainRect,
            series:this.series
        });
        this.drawables.scUnderScaleBar = new _SeriesContainer_js__WEBPACK_IMPORTED_MODULE_2__["default"]({
            yAxisData,
            rect: scaleBarRect,
            series:this.series
        });
        this.drawables.sb = new _ScaleBar_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
            bg: 'rgba(225,225,225,0.5)',
            rect: scaleBarRect,
            range: this.xRangePercent,
            onRangeChange:this.updateRange.bind(this),
            canvas:this.canvas
        });


        this.sceneObjectGroups.push([this.drawables.yAxis, this.drawables.scMain]);
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
        this.points.forEach((point, i)=> {
            ctx.moveTo.apply(ctx, point);
            ctx.lineTo.apply(ctx, this.points[i + 1] || point);
        });

        ctx.stroke();
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
                points: this.points.map(v=>v)
            },
            dir: {
                points: this.points.map((point, i)=>_Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].subAA(opts.points[i], point)),
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
        this.onMove = opts.onMove || function () {
            };
        const moveHandler = this.move.bind(this)
        this.canvas.addEventListener('mousedown', (e)=> {
            if (this.isHit(e)) {
                this.canvas.addEventListener('mousemove', moveHandler)
            }
        })
        this.canvas.addEventListener('mouseup', (e)=> {
            this.canvas.removeEventListener('mousemove', moveHandler)
        })
        this.canvas.addEventListener('mouseleave', (e)=> {
            this.canvas.removeEventListener('mousemove', moveHandler)
        })


        this.canvas.addEventListener('touchstart', (e)=> {
            if (this.isHit(e)) {
                this.canvas.addEventListener('touchmove', moveHandler)
            }
        })
        this.canvas.addEventListener('touchend', (e)=> {
            this.canvas.removeEventListener('touchmove', moveHandler)
        })

    }

    move(e) {
        let eX = e.layerX || e.offsetX,
            eY = e.layerY || e.offsetY;

        this.rect.x += eX - this.sX;
        this.sX = eX;
        e.preventDefault();
        e.stopPropagation();
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

class ScaleBar {
    constructor(opts) {
        this.drawn = false;
        this.rect = opts.rect;
        this.bg = opts.bg;
        this.range = Object.assign(opts.range);
        this.onRangeChange = opts.onRangeChange || function () {
            }
        this.calculateRect();
        new HitRect({
            rect: this.visibleRect,
            onMove: this.onMoveVisibleArea.bind(this),
            canvas: opts.canvas
        })
    }

    onMoveVisibleArea(vr) {
        this.drawn = false;
        vr.x < this.rect.x && (vr.x = this.rect.x);
        vr.x > (this.rect.width + this.rect.x - vr.width) && (vr.x = this.rect.width + this.rect.x - vr.width);

        this.range.start = ((vr.x - this.rect.x) / this.rect.width) * 100
        this.range.end = ((vr.x - this.rect.x +  vr.width) / this.rect.width) * 100
        this.onRangeChange(this.range);
    }

    calculateRect() {
        const rect = this.rect;
        const range = this.range;
        const rectWidthPX = ((range.end - range.start) / 100) * rect.width;

        this.visibleRect = {
            x: rect.x + ((this.rect.width / 100) * range.start),
            y: rect.y,
            width: rectWidthPX,
            height: rect.height
        };
    }

    updating() {
        return !this.drawn;
    }

    draw(ctx) {
        const vr = this.visibleRect;
        ctx.fillStyle = this.bg;
        //ctx.fillRect(r.x, r.y, r.width, r.height)

        ctx.fillRect(vr.x, vr.y, vr.width, vr.height);


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
        this.series = opts.series.map(ser => Object.assign({},ser));
        this.yAxisData = opts.yAxisData
        this.drawables = []

        this.series.forEach(ser=> {
            if (ser.type == 'line') {
                let points = this.calculate({
                    yAxis: this.yAxisData,
                    values:ser.values,
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
    updateRange({rect}){
        this.rect = rect;
        this.series.forEach(ser=> {
            if (ser.type == 'line') {
                let points = this.calculate({
                    yAxis: this.yAxisData,
                    values:ser.values,
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
        this.drawables.forEach(d=> {
            let res = d.updating(TIME)
            if (!anyUpdates) {
                anyUpdates = res;
            }

        })
        return anyUpdates;
    }

    draw(ctx) {
        this.drawables.forEach(d=> {
            d.draw(ctx)
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
        var resolve, reject;
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
        for (var key in obj) {
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

        this.calculate();
    }

    calculate() {
        //top to bottom
        let startY = this.rect.y;
        let yPixelStep = this.rect.height / (this.data.labels.length - 1);
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
            ctx.fillStyle = lbl.fontColor;

            let y = i == 0 ? lbl.y + lbl.fontSize + this.padding : lbl.y;
            ctx.fillText(lbl.text, lbl.x, y)
        })
        this.drawn = true;
    }
}

/* harmony default export */ __webpack_exports__["default"] = (YAxisScene);

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9HcmFwaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvTGluZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvU2NhbGVCYXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Nlcmllc0NvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvVXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3lBeGlzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxREFBSztBQUM1QixTQUFTO0FBQ1Q7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNSQTtBQUFBO0FBQUE7QUFBQTtBQUFvQztBQUNDO0FBQ2M7O0FB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QTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNnQixvRTs7Ozs7Ozs7Ozs7O0FDNUNoQjtBQUFBO0FBQTZCOztBQUU3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsZ0NBQWdDLGdEQUFJO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsYUFBYTtBQUN2Qzs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFZSx5RSIsImZpbGUiOiJhcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9hcHAuanNcIik7XG4iLCJpbXBvcnQgR3JhcGggZnJvbSAnLi9zcmMvR3JhcGguanMnO1xuZnVuY3Rpb24gZ2V0RGF0YSgpIHtcbiAgICByZXR1cm4gZmV0Y2goJy4vY2hhcnRfZGF0YS5qc29uJylcbiAgICAgICAgLnRoZW4ocz0+cy5qc29uKCkpXG4gICAgICAgIC50aGVuKGRhdGE9PiB7XG4gICAgICAgICAgICB3aW5kb3cuZyA9IEdyYXBoLmluaXRGcm9tRGF0YShkYXRhWzRdKTtcbiAgICAgICAgfSlcbn1cbmdldERhdGEoKTtcblxuIiwiaW1wb3J0IFlBeGlzU2NlbmUgZnJvbSBcIi4veUF4aXMuanNcIjtcbmltcG9ydCBTY2FsZUJhciBmcm9tIFwiLi9TY2FsZUJhci5qc1wiO1xuaW1wb3J0IFNlcmllc0NvbnRhaW5lciBmcm9tIFwiLi9TZXJpZXNDb250YWluZXIuanNcIjtcblxuY29uc3QgcGFkZGluZ1RvcEJvdCA9IDIwO1xuY29uc3QgU2NhbGVCYXJIZWlnaHQgPSA4MDtcblxuY2xhc3MgR3JhcGgge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgdmFyIGNhbnZhcyA9IG9wdHMuZWw7XG4gICAgICAgIHRoaXMuc2VyaWVzID0gb3B0cy5zZXJpZXM7XG4gICAgICAgIHRoaXMuZHJhd2FibGVzID0ge307XG4gICAgICAgIHRoaXMueFJhbmdlUGVyY2VudCA9IG9wdHMuZGVmYXVsdFhSYW5nZVBlcmNlbnQgfHwge3N0YXJ0OiAwLCBlbmQ6IDIwfTtcbiAgICAgICAgdGhpcy5zY2VuZU9iamVjdEdyb3VwcyA9IFtdO1xuICAgICAgICBpZiAoY2FudmFzKSB7XG4gICAgICAgICAgICB0aGlzLndpZHRoID0gcGFyc2VJbnQoY2FudmFzLndpZHRoKTtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gcGFyc2VJbnQoY2FudmFzLmhlaWdodCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgIGNhbnZhcy5pZCA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSB0aGlzLndpZHRoID0gb3B0cy53aWR0aDtcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodCA9IG9wdHMuaGVpZ2h0O1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgICB0aGlzLmN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHRoaXMucGl4ZWxQZXJQZXJjZW50ID0gdGhpcy53aWR0aCAvIDEwMDtcbiAgICAgICAgdGhpcy5zZXR1cFJlbmRlcmVyKCk7XG4gICAgICAgIHRoaXMuYWRkU2NlbmVPYmplY3RzKCk7XG4gICAgfVxuXG4gICAgc2V0dXBSZW5kZXJlcigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgbmV4dEZyYW1lSGFuZGxlciA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZTtcblxuICAgICAgICBmdW5jdGlvbiByZW5kZXJlcih0ZkRpZmYpIHtcbiAgICAgICAgICAgIC8vIHNlbGYuY3R4LmNsZWFyUmVjdCgwLCAwLCBzZWxmLndpZHRoLCBzZWxmLmhlaWdodCk7XG4gICAgICAgICAgICBzZWxmLnNjZW5lT2JqZWN0R3JvdXBzLmZvckVhY2goKGdyb3VwLGkpPT4ge1xuICAgICAgICAgICAgICAgIGxldCBhbnlVcGRhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZ3JvdXAuZm9yRWFjaChvYmo9PiB7XG4gICAgICAgICAgICAgICAgICAgIG9iai51cGRhdGluZyh0ZkRpZmYpICYmIChhbnlVcGRhdGVzID0gdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGFueVVwZGF0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jdHguY2xlYXJSZWN0KGdyb3VwWzBdLnJlY3QueCwgZ3JvdXBbMF0ucmVjdC55LCBncm91cFswXS5yZWN0LndpZHRoLCBncm91cFswXS5yZWN0LmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwLmZvckVhY2gob2JqPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmRyYXcoc2VsZi5jdHgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbmV4dEZyYW1lSGFuZGxlcihyZW5kZXJlcik7XG4gICAgICAgIH1cblxuICAgICAgICBuZXh0RnJhbWVIYW5kbGVyKHJlbmRlcmVyKTtcbiAgICB9XG5cbiAgICBjYWxjWUF4aXMoe3NlcmllVmFsdWVzLCBzdGVwcywgeVBhZGRpbmd9KSB7XG4gICAgICAgIGxldCBsaW1pdHMgPSBbXTtcbiAgICAgICAgc2VyaWVWYWx1ZXMuZm9yRWFjaChzdj0+IHtcbiAgICAgICAgICAgIGxpbWl0cy5wdXNoKE1hdGgubWF4LmFwcGx5KG51bGwsIHN2KSk7XG4gICAgICAgICAgICBsaW1pdHMucHVzaChNYXRoLm1pbi5hcHBseShudWxsLCBzdikpO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIHlNYXg6IE1hdGgubWF4LmFwcGx5KG51bGwsIGxpbWl0cyksXG4gICAgICAgICAgICB5TWluOiBNYXRoLm1pbi5hcHBseShudWxsLCBsaW1pdHMpLFxuICAgICAgICAgICAgbGFiZWxzOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCB5U3RlcCA9IChyZXN1bHQueU1heCAtIHJlc3VsdC55TWluKSAvIChzdGVwcyAtIDEpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ZXBzOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdC5sYWJlbHMucHVzaChNYXRoLnJvdW5kKHJlc3VsdC55TWF4IC0geVN0ZXAgKiBpKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHVwZGF0ZVJhbmdlKHtzdGFydCxlbmR9KSB7XG4gICAgICAgIHRoaXMueFJhbmdlUGVyY2VudC5zdGFydD1zdGFydDtcbiAgICAgICAgdGhpcy54UmFuZ2VQZXJjZW50LmVuZD1lbmQ7XG4gICAgICAvLyAgY29uc3QgeUF4aXNEYXRhID0gdGhpcy5jYWxjWUF4aXMoe3NlcmllVmFsdWVzOiB0aGlzLnNlcmllcy5tYXAocz0+cy52YWx1ZXMpLCBzdGVwczogNn0pO1xuICAgICAgICB0aGlzLmRyYXdhYmxlcy5zY01haW4udXBkYXRlUmFuZ2Uoe3JlY3Q6dGhpcy5nZXRTZXJpZXNSZWN0KCl9KVxuICAgIH1cblxuICAgIGdldFNlcmllc1JlY3QoKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlRmFjdG9yID0gMSAvICgodGhpcy54UmFuZ2VQZXJjZW50LmVuZCAtIHRoaXMueFJhbmdlUGVyY2VudC5zdGFydCApIC8gMTAwKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5waXhlbFBlclBlcmNlbnQgKiB0aGlzLnhSYW5nZVBlcmNlbnQuc3RhcnQgKiBzY2FsZUZhY3RvciAqIC0xLFxuICAgICAgICAgICAgeTogcGFkZGluZ1RvcEJvdCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoICogc2NhbGVGYWN0b3IsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0IC0gU2NhbGVCYXJIZWlnaHQgLSBwYWRkaW5nVG9wQm90ICogMixcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhZGRTY2VuZU9iamVjdHMoKSB7XG4gICAgICAgIHRoaXMuc2NlbmVPYmplY3RHcm91cHMgPSBbXTtcblxuICAgICAgICBjb25zdCB5QXhpc0RhdGEgPSB0aGlzLmNhbGNZQXhpcyh7c2VyaWVWYWx1ZXM6IHRoaXMuc2VyaWVzLm1hcChzPT5zLnZhbHVlcyksIHN0ZXBzOiA2fSk7XG5cbiAgICAgICAgbGV0IG1haW5SZWN0ID0ge1xuICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgIHk6IHBhZGRpbmdUb3BCb3QsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQgLSBTY2FsZUJhckhlaWdodCAtIHBhZGRpbmdUb3BCb3QgKiAyLFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBzY2FsZUJhclJlY3QgPSB7XG4gICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgeTogdGhpcy5oZWlnaHQgLSBTY2FsZUJhckhlaWdodCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBTY2FsZUJhckhlaWdodFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZHJhd2FibGVzLnlBeGlzID0gbmV3IFlBeGlzU2NlbmUoe1xuICAgICAgICAgICAgcmVjdDogbWFpblJlY3QsXG4gICAgICAgICAgICBkYXRhOiB5QXhpc0RhdGEsXG4gICAgICAgICAgICBvcmllbnRhdGlvbjogJ2xlZnQnLCAvL3RvZG9cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZHJhd2FibGVzLnNjTWFpbiA9IG5ldyBTZXJpZXNDb250YWluZXIoe1xuICAgICAgICAgICAgeUF4aXNEYXRhLFxuICAgICAgICAgICAgcmVjdDogdGhpcy5nZXRTZXJpZXNSZWN0KCksXG4gICAgICAgICAgICB2aXNpYmxlUmVjdDogbWFpblJlY3QsXG4gICAgICAgICAgICBzZXJpZXM6dGhpcy5zZXJpZXNcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZHJhd2FibGVzLnNjVW5kZXJTY2FsZUJhciA9IG5ldyBTZXJpZXNDb250YWluZXIoe1xuICAgICAgICAgICAgeUF4aXNEYXRhLFxuICAgICAgICAgICAgcmVjdDogc2NhbGVCYXJSZWN0LFxuICAgICAgICAgICAgc2VyaWVzOnRoaXMuc2VyaWVzXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRyYXdhYmxlcy5zYiA9IG5ldyBTY2FsZUJhcih7XG4gICAgICAgICAgICBiZzogJ3JnYmEoMjI1LDIyNSwyMjUsMC41KScsXG4gICAgICAgICAgICByZWN0OiBzY2FsZUJhclJlY3QsXG4gICAgICAgICAgICByYW5nZTogdGhpcy54UmFuZ2VQZXJjZW50LFxuICAgICAgICAgICAgb25SYW5nZUNoYW5nZTp0aGlzLnVwZGF0ZVJhbmdlLmJpbmQodGhpcyksXG4gICAgICAgICAgICBjYW52YXM6dGhpcy5jYW52YXNcbiAgICAgICAgfSk7XG5cblxuICAgICAgICB0aGlzLnNjZW5lT2JqZWN0R3JvdXBzLnB1c2goW3RoaXMuZHJhd2FibGVzLnlBeGlzLCB0aGlzLmRyYXdhYmxlcy5zY01haW5dKTtcbiAgICAgICAgdGhpcy5zY2VuZU9iamVjdEdyb3Vwcy5wdXNoKFt0aGlzLmRyYXdhYmxlcy5zY1VuZGVyU2NhbGVCYXIsIHRoaXMuZHJhd2FibGVzLnNiXSk7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdEZyb21EYXRhKGRhdGEpIHtcbiAgICAgICAgbGV0IHNlcmllcyA9IHt9O1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gZGF0YS50eXBlcykge1xuICAgICAgICAgICAgc2VyaWVzW2tleV0gPSB7XG4gICAgICAgICAgICAgICAgaWQ6IGtleSxcbiAgICAgICAgICAgICAgICB0eXBlOiBkYXRhLnR5cGVzW2tleV0sXG4gICAgICAgICAgICAgICAgbGVnZW5kTmFtZTogZGF0YS5uYW1lc1trZXldLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBkYXRhLmNvbG9yc1trZXldLFxuICAgICAgICAgICAgICAgIHZhbHVlczogZGF0YS5jb2x1bW5zLmZpbmQoY29sPT5jb2xbMF0gPT0ga2V5KS5zbGljZSgxKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCB4QXhpcyA9IHNlcmllc1sneCddO1xuICAgICAgICAvL3hBeGlzLnZhbHVlcyA9IHhBeGlzLnZhbHVlcy5tYXAodj0+IG5ldyBEYXRlKHYpLnRvTG9jYWxlU3RyaW5nKCdlbi11cycsIHtkYXk6ICcyLWRpZ2l0JywgbW9udGg6ICdzaG9ydCd9KSlcbiAgICAgICAgZGVsZXRlIHNlcmllc1sneCddO1xuICAgICAgICByZXR1cm4gbmV3IEdyYXBoKHtcbiAgICAgICAgICAgIHdpZHRoOiAzNjAsLy93aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogNDAwLFxuICAgICAgICAgICAgeEF4aXMsXG4gICAgICAgICAgICBzZXJpZXM6IE9iamVjdC52YWx1ZXMoc2VyaWVzKVxuICAgICAgICB9KVxuXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHcmFwaCIsImltcG9ydCBVdGlscyBmcm9tIFwiLi9VdGlscy5qc1wiO1xuXG5jb25zdCBERUZBVUxUX0FOSU1BVElPTl9EVVJBVElPTiA9IDMwMDtcbmNsYXNzIExpbmUge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgdGhpcy5kcmF3biA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBvaW50cyA9IG9wdHMucG9pbnRzO1xuICAgICAgICB0aGlzLmNvbG9yID0gb3B0cy5jb2xvcjtcbiAgICAgICAgdGhpcy5saW5lV2lkdGggPSBvcHRzLmxpbmVXaWR0aCB8fCAyO1xuICAgIH1cblxuICAgIHVwZGF0aW5nKFRJTUUpIHtcbiAgICAgICAgdGhpcy51cGRhdGUoVElNRSk7XG4gICAgICAgIHJldHVybiAhdGhpcy5kcmF3biB8fCB0aGlzLmFuaW1hdGluZztcbiAgICB9XG5cbiAgICBkcmF3KGN0eCkge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuY29sb3I7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmxpbmVXaWR0aDtcbiAgICAgICAgdGhpcy5wb2ludHMuZm9yRWFjaCgocG9pbnQsIGkpPT4ge1xuICAgICAgICAgICAgY3R4Lm1vdmVUby5hcHBseShjdHgsIHBvaW50KTtcbiAgICAgICAgICAgIGN0eC5saW5lVG8uYXBwbHkoY3R4LCB0aGlzLnBvaW50c1tpICsgMV0gfHwgcG9pbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIHRoaXMuZHJhd24gPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhbmltYXRlKG9wdHMpIHtcbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAvL2NvbnRpbnVlIGN1cnJlbnQgYW5pbWF0aW9uIGR1cmluZyByYW5nZSBjaGFuZ2UsIG1ha2VzIGl0IHNtb290aFxuICAgICAgICAgICAgdGhpcy5hbmltT3B0cy5kaXIucG9pbnRzID0gdGhpcy5hbmltT3B0cy5vcmlnLnBvaW50cy5tYXAoKHBvaW50LCBpKT0+VXRpbHMuc3ViQUEob3B0cy5wb2ludHNbaV0sIHBvaW50KSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYW5pbU9wdHMgPSB7XG4gICAgICAgICAgICBvcmlnOiB7XG4gICAgICAgICAgICAgICAgcG9pbnRzOiB0aGlzLnBvaW50cy5tYXAodj0+dilcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXI6IHtcbiAgICAgICAgICAgICAgICBwb2ludHM6IHRoaXMucG9pbnRzLm1hcCgocG9pbnQsIGkpPT5VdGlscy5zdWJBQShvcHRzLnBvaW50c1tpXSwgcG9pbnQpKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkdXJhdGlvbjogb3B0cy5kdXJhdGlvbiB8fCBERUZBVUxUX0FOSU1BVElPTl9EVVJBVElPTixcbiAgICAgICAgICAgIHByb2dyZXNzOiBudWxsLFxuICAgICAgICAgICAgc3RhcnQ6IG51bGxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1cGRhdGUoVElNRSkge1xuXG4gICAgICAgIGlmICghdGhpcy5hbmltYXRpbmcpIHJldHVybiBmYWxzZTtcbiAgICAgICAgbGV0IG9wdHMgPSB0aGlzLmFuaW1PcHRzO1xuICAgICAgICBpZiAob3B0cy5wcm9ncmVzcyA9PSAxKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuYW5pbU9wdHM7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hbmltYXRpbmcgJiYgIW9wdHMuc3RhcnQpIHtcbiAgICAgICAgICAgIG9wdHMuc3RhcnQgPSBUSU1FO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0cy5wcm9ncmVzcyA9ICgoVElNRSAtIG9wdHMuc3RhcnQpIC8gb3B0cy5kdXJhdGlvbik7XG4gICAgICAgIGlmIChvcHRzLnByb2dyZXNzID4gMSkge1xuICAgICAgICAgICAgb3B0cy5wcm9ncmVzcyA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wb2ludHMgPSBvcHRzLm9yaWcucG9pbnRzLm1hcCgob3Jwb2ludCwgaSk9PiB7XG4gICAgICAgICAgICByZXR1cm4gVXRpbHMuYWRkQUEob3Jwb2ludCwgVXRpbHMubXVsdGlBVihvcHRzLmRpci5wb2ludHNbaV0sIG9wdHMucHJvZ3Jlc3MpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5leHBvcnQgZGVmYXVsdCBMaW5lIiwiY2xhc3MgSGl0UmVjdCB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICB0aGlzLmltbXV0YWJsZSA9IG9wdHMuaW1tdXRhYmxlIHx8IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5pbW11dGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMucmVjdCA9IE9iamVjdC5hc3NpZ24oe30sIG9wdHMucmVjdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlY3QgPSBvcHRzLnJlY3Q7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYW52YXMgPSBvcHRzLmNhbnZhcztcbiAgICAgICAgdGhpcy5vbk1vdmUgPSBvcHRzLm9uTW92ZSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjb25zdCBtb3ZlSGFuZGxlciA9IHRoaXMubW92ZS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChlKT0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzSGl0KGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZUhhbmRsZXIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZSk9PiB7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlSGFuZGxlcilcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIChlKT0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVIYW5kbGVyKVxuICAgICAgICB9KVxuXG5cbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChlKT0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzSGl0KGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgbW92ZUhhbmRsZXIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgKGUpPT4ge1xuICAgICAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgbW92ZUhhbmRsZXIpXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBtb3ZlKGUpIHtcbiAgICAgICAgbGV0IGVYID0gZS5sYXllclggfHwgZS5vZmZzZXRYLFxuICAgICAgICAgICAgZVkgPSBlLmxheWVyWSB8fCBlLm9mZnNldFk7XG5cbiAgICAgICAgdGhpcy5yZWN0LnggKz0gZVggLSB0aGlzLnNYO1xuICAgICAgICB0aGlzLnNYID0gZVg7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5vbk1vdmUodGhpcy5yZWN0KTtcbiAgICB9XG5cbiAgICBpc0hpdChlKSB7XG4gICAgICAgIGxldCByID0gdGhpcy5yZWN0LFxuICAgICAgICAgICAgZVggPSBlLmxheWVyWCB8fCBlLm9mZnNldFgsXG4gICAgICAgICAgICBlWSA9IGUubGF5ZXJZIHx8IGUub2Zmc2V0WSxcbiAgICAgICAgICAgIGhpdFggPSByLnggPCBlWCAmJiBlWCA8IHIueCArIHIud2lkdGgsXG4gICAgICAgICAgICBoaXRZID0gci55IDwgZVkgJiYgZVkgPCByLnkgKyByLmhlaWdodDtcblxuICAgICAgICB0aGlzLnNYID0gZVg7XG4gICAgICAgIHRoaXMuc1kgPSBlWTtcbiAgICAgICAgcmV0dXJuIGhpdFkgJiYgaGl0WFxuICAgIH1cbn1cblxuY2xhc3MgU2NhbGVCYXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgdGhpcy5kcmF3biA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlY3QgPSBvcHRzLnJlY3Q7XG4gICAgICAgIHRoaXMuYmcgPSBvcHRzLmJnO1xuICAgICAgICB0aGlzLnJhbmdlID0gT2JqZWN0LmFzc2lnbihvcHRzLnJhbmdlKTtcbiAgICAgICAgdGhpcy5vblJhbmdlQ2hhbmdlID0gb3B0cy5vblJhbmdlQ2hhbmdlIHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVSZWN0KCk7XG4gICAgICAgIG5ldyBIaXRSZWN0KHtcbiAgICAgICAgICAgIHJlY3Q6IHRoaXMudmlzaWJsZVJlY3QsXG4gICAgICAgICAgICBvbk1vdmU6IHRoaXMub25Nb3ZlVmlzaWJsZUFyZWEuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGNhbnZhczogb3B0cy5jYW52YXNcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBvbk1vdmVWaXNpYmxlQXJlYSh2cikge1xuICAgICAgICB0aGlzLmRyYXduID0gZmFsc2U7XG4gICAgICAgIHZyLnggPCB0aGlzLnJlY3QueCAmJiAodnIueCA9IHRoaXMucmVjdC54KTtcbiAgICAgICAgdnIueCA+ICh0aGlzLnJlY3Qud2lkdGggKyB0aGlzLnJlY3QueCAtIHZyLndpZHRoKSAmJiAodnIueCA9IHRoaXMucmVjdC53aWR0aCArIHRoaXMucmVjdC54IC0gdnIud2lkdGgpO1xuXG4gICAgICAgIHRoaXMucmFuZ2Uuc3RhcnQgPSAoKHZyLnggLSB0aGlzLnJlY3QueCkgLyB0aGlzLnJlY3Qud2lkdGgpICogMTAwXG4gICAgICAgIHRoaXMucmFuZ2UuZW5kID0gKCh2ci54IC0gdGhpcy5yZWN0LnggKyAgdnIud2lkdGgpIC8gdGhpcy5yZWN0LndpZHRoKSAqIDEwMFxuICAgICAgICB0aGlzLm9uUmFuZ2VDaGFuZ2UodGhpcy5yYW5nZSk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUmVjdCgpIHtcbiAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMucmVjdDtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJhbmdlO1xuICAgICAgICBjb25zdCByZWN0V2lkdGhQWCA9ICgocmFuZ2UuZW5kIC0gcmFuZ2Uuc3RhcnQpIC8gMTAwKSAqIHJlY3Qud2lkdGg7XG5cbiAgICAgICAgdGhpcy52aXNpYmxlUmVjdCA9IHtcbiAgICAgICAgICAgIHg6IHJlY3QueCArICgodGhpcy5yZWN0LndpZHRoIC8gMTAwKSAqIHJhbmdlLnN0YXJ0KSxcbiAgICAgICAgICAgIHk6IHJlY3QueSxcbiAgICAgICAgICAgIHdpZHRoOiByZWN0V2lkdGhQWCxcbiAgICAgICAgICAgIGhlaWdodDogcmVjdC5oZWlnaHRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB1cGRhdGluZygpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmRyYXduO1xuICAgIH1cblxuICAgIGRyYXcoY3R4KSB7XG4gICAgICAgIGNvbnN0IHZyID0gdGhpcy52aXNpYmxlUmVjdDtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuYmc7XG4gICAgICAgIC8vY3R4LmZpbGxSZWN0KHIueCwgci55LCByLndpZHRoLCByLmhlaWdodClcblxuICAgICAgICBjdHguZmlsbFJlY3QodnIueCwgdnIueSwgdnIud2lkdGgsIHZyLmhlaWdodCk7XG5cblxuICAgICAgICB0aGlzLmRyYXduID0gdHJ1ZTtcbiAgICB9XG5cbn1cbmV4cG9ydCBkZWZhdWx0ICBTY2FsZUJhciIsImltcG9ydCBMaW5lIGZyb20gXCIuL0xpbmUuanNcIjtcbmNsYXNzIFNlcmllc0NvbnRhaW5lciB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICB0aGlzLnJlY3QgPSBvcHRzLnJlY3Q7XG4gICAgICAgIHRoaXMudmlzaWJsZVJlY3QgPSBvcHRzLnZpc2libGVSZWN0IHx8IHRoaXMucmVjdDtcbiAgICAgICAgdGhpcy5zZXJpZXMgPSBvcHRzLnNlcmllcy5tYXAoc2VyID0+IE9iamVjdC5hc3NpZ24oe30sc2VyKSk7XG4gICAgICAgIHRoaXMueUF4aXNEYXRhID0gb3B0cy55QXhpc0RhdGFcbiAgICAgICAgdGhpcy5kcmF3YWJsZXMgPSBbXVxuXG4gICAgICAgIHRoaXMuc2VyaWVzLmZvckVhY2goc2VyPT4ge1xuICAgICAgICAgICAgaWYgKHNlci50eXBlID09ICdsaW5lJykge1xuICAgICAgICAgICAgICAgIGxldCBwb2ludHMgPSB0aGlzLmNhbGN1bGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHlBeGlzOiB0aGlzLnlBeGlzRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzOnNlci52YWx1ZXMsXG4gICAgICAgICAgICAgICAgICAgIHJlY3Q6IHRoaXMucmVjdCxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGxldCBpbml0UG9pbnRzID0gcG9pbnRzLm1hcChwPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3BbMF0sIHRoaXMucmVjdC5oZWlnaHQgLyAyICsgdGhpcy5yZWN0LnldXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGV0IGxpbmUgPSBuZXcgTGluZSh7cG9pbnRzOiBpbml0UG9pbnRzLCBjb2xvcjogc2VyLmNvbG9yfSlcbiAgICAgICAgICAgICAgICBsaW5lLmFuaW1hdGUoe3BvaW50c30pO1xuICAgICAgICAgICAgICAgIHNlci5kcmF3YWJsZUxpbmUgPSBsaW5lO1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd2FibGVzLnB1c2gobGluZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIHVwZGF0ZVJhbmdlKHtyZWN0fSl7XG4gICAgICAgIHRoaXMucmVjdCA9IHJlY3Q7XG4gICAgICAgIHRoaXMuc2VyaWVzLmZvckVhY2goc2VyPT4ge1xuICAgICAgICAgICAgaWYgKHNlci50eXBlID09ICdsaW5lJykge1xuICAgICAgICAgICAgICAgIGxldCBwb2ludHMgPSB0aGlzLmNhbGN1bGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHlBeGlzOiB0aGlzLnlBeGlzRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzOnNlci52YWx1ZXMsXG4gICAgICAgICAgICAgICAgICAgIHJlY3Q6IHRoaXMucmVjdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzZXIuZHJhd2FibGVMaW5lLmFuaW1hdGUoe3BvaW50c30pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICBjYWxjdWxhdGUoe3ZhbHVlcywgcmVjdCwgeUF4aXN9KSB7XG4gICAgICAgIGxldCB7eU1heCwgeU1pbn0gPSB5QXhpcztcbiAgICAgICAgbGV0IHhTdGVwID0gcmVjdC53aWR0aCAvICh2YWx1ZXMubGVuZ3RoIC0gMSk7XG4gICAgICAgIHJldHVybiB2YWx1ZXMubWFwKCh2YWx1ZSwgaSk9PiB7XG4gICAgICAgICAgICBsZXQgbmV3WSA9IE1hdGguYWJzKCgodmFsdWUgLSB5TWluKSAvICh5TWF4IC0geU1pbikpICogcmVjdC5oZWlnaHQgLSByZWN0LmhlaWdodCkgKyByZWN0Lnk7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIGkgKiB4U3RlcCArIHJlY3QueCxcbiAgICAgICAgICAgICAgICBuZXdZXG4gICAgICAgICAgICBdXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICB1cGRhdGluZyhUSU1FKSB7XG4gICAgICAgIGxldCBhbnlVcGRhdGVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZHJhd2FibGVzLmZvckVhY2goZD0+IHtcbiAgICAgICAgICAgIGxldCByZXMgPSBkLnVwZGF0aW5nKFRJTUUpXG4gICAgICAgICAgICBpZiAoIWFueVVwZGF0ZXMpIHtcbiAgICAgICAgICAgICAgICBhbnlVcGRhdGVzID0gcmVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBhbnlVcGRhdGVzO1xuICAgIH1cblxuICAgIGRyYXcoY3R4KSB7XG4gICAgICAgIHRoaXMuZHJhd2FibGVzLmZvckVhY2goZD0+IHtcbiAgICAgICAgICAgIGQuZHJhdyhjdHgpXG4gICAgICAgIH0pXG5cbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBTZXJpZXNDb250YWluZXIiLCJjbGFzcyBVdGlscyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgc3RhdGljIG5ld0RlZmVycmVkKCkge1xuICAgICAgICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXMsIHJlaik9PiB7XG4gICAgICAgICAgICByZXNvbHZlID0gcmVzO1xuICAgICAgICAgICAgcmVqZWN0ID0gcmVqO1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvbWlzZSxcbiAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICByZWplY3RcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBrZXlCeVZhbHVlKG9iaiwgdmFsdWUpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9ialtrZXldID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgc3RhdGljIHN1YkFBKGExLCBhMikge1xuICAgICAgICByZXR1cm4gYTEubWFwKCh2LCBpKT0+IHtcbiAgICAgICAgICAgIHJldHVybiB2IC0gYTJbaV07XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhdGljIGFkZEFBKGExLCBhMikge1xuICAgICAgICByZXR1cm4gYTEubWFwKCh2LCBpKT0+IHtcbiAgICAgICAgICAgIHJldHVybiB2ICsgYTJbaV07XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhdGljIG11bHRpQVYoYTEsIHZhbCkge1xuICAgICAgICByZXR1cm4gYTEubWFwKCh2LCBpKT0+IHtcbiAgICAgICAgICAgIHJldHVybiB2ICogdmFsO1xuICAgICAgICB9KVxuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0ICBVdGlscyIsImltcG9ydCBMaW5lIGZyb20gXCIuL0xpbmUuanNcIjtcblxuY2xhc3MgWUF4aXNTY2VuZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICB0aGlzLmRyYXduID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGF0YSA9IG9wdHMuZGF0YTtcblxuICAgICAgICB0aGlzLmxhYmVscyA9IFtdO1xuICAgICAgICB0aGlzLmxpbmVzID0gW107XG5cbiAgICAgICAgdGhpcy5yZWN0ID0gb3B0cy5yZWN0O1xuICAgICAgICB0aGlzLmJnID0gb3B0cy5iZztcbiAgICAgICAgdGhpcy5wYWRkaW5nID0gb3B0cy5wYWRkaW5nIHx8IDU7XG4gICAgICAgIHRoaXMubGluZUNvbG9yID0gb3B0cy5saW5lQ29sb3IgfHwgJ2dyZXknO1xuICAgICAgICB0aGlzLmxpbmVXaWR0aCA9IG9wdHMubGluZVdpZHRoIHx8IDAuMztcbiAgICAgICAgdGhpcy5mb250Q29sb3IgPSBvcHRzLmZvbnRDb2xvciB8fCAnYmxhY2snO1xuICAgICAgICB0aGlzLmZvbnRTaXplID0gb3B0cy5mb250U2l6ZSB8fCAxNDtcblxuICAgICAgICB0aGlzLmNhbGN1bGF0ZSgpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZSgpIHtcbiAgICAgICAgLy90b3AgdG8gYm90dG9tXG4gICAgICAgIGxldCBzdGFydFkgPSB0aGlzLnJlY3QueTtcbiAgICAgICAgbGV0IHlQaXhlbFN0ZXAgPSB0aGlzLnJlY3QuaGVpZ2h0IC8gKHRoaXMuZGF0YS5sYWJlbHMubGVuZ3RoIC0gMSk7XG4gICAgICAgIHRoaXMuZGF0YS5sYWJlbHMuZm9yRWFjaChsYmw9PiB7XG5cbiAgICAgICAgICAgIHRoaXMubGFiZWxzLnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGxibC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgIGZvbnRDb2xvcjogdGhpcy5mb250Q29sb3IsXG4gICAgICAgICAgICAgICAgeDogdGhpcy5yZWN0LnggKyB0aGlzLnBhZGRpbmcsXG4gICAgICAgICAgICAgICAgeTogc3RhcnRZIC0gdGhpcy5wYWRkaW5nXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5saW5lcy5wdXNoKG5ldyBMaW5lKHtcbiAgICAgICAgICAgICAgICBwb2ludHM6IFtcbiAgICAgICAgICAgICAgICAgICAgW3RoaXMucmVjdC54LCBzdGFydFldLFxuICAgICAgICAgICAgICAgICAgICBbdGhpcy5yZWN0LndpZHRoLCBzdGFydFldXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IHRoaXMubGluZVdpZHRoLFxuICAgICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmxpbmVDb2xvclxuICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICBzdGFydFkgKz0geVBpeGVsU3RlcDtcbiAgICAgICAgfSlcbiAgICAgICAgLy9ob3RmaXggZm9yIG5vdCBkcmF3aW5nIHRvcCBsaW5lID8gaXMgaXQgZXZlbiBuZWVkZWQ/XG4gICAgICAgIC8vdGhpcy5saW5lcy5zcGxpY2UoMCwxKVxuICAgICAgICAvL3RoaXMubGFiZWxzLnNwbGljZSgwLDEpXG4gICAgfVxuXG4gICAgdXBkYXRpbmcoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5kcmF3bjtcbiAgICB9XG5cbiAgICBkcmF3KGN0eCkge1xuICAgICAgICBsZXQgciA9IHRoaXMucmVjdDtcblxuICAgICAgICBpZiAodGhpcy5iZykge1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuYmc7XG4gICAgICAgICAgICBjdHguZmlsbFJlY3Qoci54LCByLnksIHIud2lkdGgsIHIuaGVpZ2h0KVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubGluZXMuZm9yRWFjaChsaW5lPT5saW5lLmRyYXcoY3R4KSk7XG4gICAgICAgIHRoaXMubGFiZWxzLmZvckVhY2goKGxibCwgaSk9PiB7XG4gICAgICAgICAgICBjdHguZm9udCA9IGAke2xibC5mb250U2l6ZX1weCBBcmlhbGA7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gbGJsLmZvbnRDb2xvcjtcblxuICAgICAgICAgICAgbGV0IHkgPSBpID09IDAgPyBsYmwueSArIGxibC5mb250U2l6ZSArIHRoaXMucGFkZGluZyA6IGxibC55O1xuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGxibC50ZXh0LCBsYmwueCwgeSlcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5kcmF3biA9IHRydWU7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBZQXhpc1NjZW5lIl0sInNvdXJjZVJvb3QiOiIifQ==