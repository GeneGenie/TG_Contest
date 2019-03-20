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
            window.g = _src_Graph_js__WEBPACK_IMPORTED_MODULE_0__["default"].initFromData(data[5]);

            //x.toLocaleString('en-us', { day:'2-digit',month: 'short' });
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





class Graph {
    constructor(opts) {
        var canvas = opts.el;
        this.series = opts.series;
        this.drawables = {};
        this.xRangePercent = opts.defaultXRangePercent || {start: 20, end: 50};
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
        this.ctx = canvas.getContext("2d");
        this.setupScene();
        this.addSceneObjects({series: this.series});
    }

    setupScene() {
        var self = this;
        var nextFrameHandler = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;

        function renderer(tfDiff) {
            // self.ctx.clearRect(0, 0, self.width, self.height);
            self.sceneObjectGroups.forEach(group=> {
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

    updateRange(newRange) {
        this.xRangePercent = newRange;
    }

    addSceneObjects({series}) {
        const paddingTopBot = 10;
        const ScaleBarHeight = 80;
        const yAxisData = this.calcYAxis({serieValues: series.map(s=>s.values), steps: 6});
        const scaleFactor = 1 / ((this.xRangePercent.end - this.xRangePercent.start ) / 100);
        const pixelPerPercent = this.width / 100;
        let mainRect = {
            x: 0,
            y: paddingTopBot,
            width: this.width,
            height: this.height - ScaleBarHeight - paddingTopBot * 2,
        };
        let seriesRect = {
            x: pixelPerPercent * this.xRangePercent.start * scaleFactor * -1,
            y: mainRect.y,
            width: this.width * scaleFactor,
            height: mainRect.height,
        };
        let scaleBarRect = {
            x: 0, y: this.height - ScaleBarHeight,
            width: this.width, height: ScaleBarHeight
        };

        this.drawables.yAxis = new _yAxis_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
            rect: mainRect,
            data: yAxisData,
            orientation: 'left', //todo
        });
        this.drawables.scMain = new _SeriesContainer_js__WEBPACK_IMPORTED_MODULE_2__["default"]({
            yAxisData,
            rect: seriesRect,
            visibleRect: mainRect,
            series
        });
        this.drawables.scUnderScaleBar = new _SeriesContainer_js__WEBPACK_IMPORTED_MODULE_2__["default"]({
            yAxisData,
            rect: scaleBarRect,
            series
        });
        this.drawables.sb = new _ScaleBar_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
            bg: 'rgba(225,225,225,0.5)',
            rect: scaleBarRect,
            range: this.xRangePercent,
            pixelPerPercent
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
        xAxis.values = xAxis.values.map(v=> new Date(v).toLocaleString('en-us', {day: '2-digit', month: 'short'}))
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
        this.animOpts = {
            orig: {
                points: this.points
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
        this.points = opts.orig.points.map((point, i)=> {
            return _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].addAA(point, _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].multiAV(opts.dir.points[i], opts.progress));
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
class ScaleBar {
    constructor(opts) {
        this.drawn = false;
        this.rect = opts.rect;
        this.bg = opts.bg;
        this.range = opts.range;
        this.onRangeChange = opts.onRangeChange || function () {
            }
        this.pixelPerPercent =opts.pixelPerPercent ||  this.rect.width / 100;
    }

    update() {
        const rect = this.rect;
        const range = this.range;
        const rectWidthPX = ((range.end - range.start) / 100) * rect.width;

        this.visibleRect = [
            rect.x + this.pixelPerPercent * range.start,
            rect.y,
            rectWidthPX,
            rect.height
        ];
    }

    updating() {
        this.update();
        return !this.drawn;
    }

    draw(ctx) {
        const r = this.rect;
        ctx.fillStyle = this.bg;
        //ctx.fillRect(r.x, r.y, r.width, r.height)

        ctx.fillRect.apply(ctx, this.visibleRect);


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
        // opts.series;
        this.drawn = false;

        this.drawables = []
        opts.series.forEach(ser=> {
            if (ser.type == 'line') {
                let values = ser.values;
                let points = this.calculate({
                    yAxis: opts.yAxisData,
                    values,
                    rect: this.rect,
                });

                let initPoints = points.map(p=> {
                    return [p[0], this.rect.height / 2 + this.rect.y]
                });
                let line = new _Line_js__WEBPACK_IMPORTED_MODULE_0__["default"]({points: initPoints, color: ser.color})
                line.animate({points});
                this.drawables.push(line);
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
        let yPixelStep = this.rect.height / (this.data.labels.length-1);
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
        this.lines.splice(0,1)
        this.labels.splice(0,1)
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
        this.labels.forEach(lbl=> {
            ctx.font = `${lbl.fontSize}px Arial`;
            ctx.fillStyle = lbl.fontColor;
            ctx.fillText(lbl.text, lbl.x, lbl.y)
        })
        this.drawn = true;
    }
}

/* harmony default export */ __webpack_exports__["default"] = (YAxisScene);

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9HcmFwaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvTGluZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvU2NhbGVCYXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Nlcmllc0NvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvVXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3lBeGlzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxREFBSzs7QUFFNUIseUNBQXlDLCtCQUErQjtBQUN4RSxTQUFTO0FBQ1Q7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNWQTtBQUFBO0FBQUE7QUFB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QUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDZSw4RTs7Ozs7Ozs7Ozs7O0FDNURmO0FBQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNnQixvRTs7Ozs7Ozs7Ozs7O0FDNUNoQjtBQUFBO0FBQThCOztBQUU5QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsZ0NBQWdDLGdEQUFJO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsYUFBYTtBQUN2QztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFZSx5RSIsImZpbGUiOiJhcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9hcHAuanNcIik7XG4iLCJpbXBvcnQgR3JhcGggZnJvbSAnLi9zcmMvR3JhcGguanMnO1xuZnVuY3Rpb24gZ2V0RGF0YSgpIHtcbiAgICByZXR1cm4gZmV0Y2goJy4vY2hhcnRfZGF0YS5qc29uJylcbiAgICAgICAgLnRoZW4ocz0+cy5qc29uKCkpXG4gICAgICAgIC50aGVuKGRhdGE9PiB7XG4gICAgICAgICAgICB3aW5kb3cuZyA9IEdyYXBoLmluaXRGcm9tRGF0YShkYXRhWzVdKTtcblxuICAgICAgICAgICAgLy94LnRvTG9jYWxlU3RyaW5nKCdlbi11cycsIHsgZGF5OicyLWRpZ2l0Jyxtb250aDogJ3Nob3J0JyB9KTtcbiAgICAgICAgfSlcbn1cbmdldERhdGEoKTtcblxuIiwiaW1wb3J0IFlBeGlzU2NlbmUgZnJvbSBcIi4veUF4aXMuanNcIjtcbmltcG9ydCBTY2FsZUJhciBmcm9tIFwiLi9TY2FsZUJhci5qc1wiO1xuaW1wb3J0IFNlcmllc0NvbnRhaW5lciBmcm9tIFwiLi9TZXJpZXNDb250YWluZXIuanNcIjtcblxuXG5jbGFzcyBHcmFwaCB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICB2YXIgY2FudmFzID0gb3B0cy5lbDtcbiAgICAgICAgdGhpcy5zZXJpZXMgPSBvcHRzLnNlcmllcztcbiAgICAgICAgdGhpcy5kcmF3YWJsZXMgPSB7fTtcbiAgICAgICAgdGhpcy54UmFuZ2VQZXJjZW50ID0gb3B0cy5kZWZhdWx0WFJhbmdlUGVyY2VudCB8fCB7c3RhcnQ6IDIwLCBlbmQ6IDUwfTtcbiAgICAgICAgdGhpcy5zY2VuZU9iamVjdEdyb3VwcyA9IFtdO1xuICAgICAgICBpZiAoY2FudmFzKSB7XG4gICAgICAgICAgICB0aGlzLndpZHRoID0gcGFyc2VJbnQoY2FudmFzLndpZHRoKTtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gcGFyc2VJbnQoY2FudmFzLmhlaWdodCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgIGNhbnZhcy5pZCA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSB0aGlzLndpZHRoID0gb3B0cy53aWR0aDtcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodCA9IG9wdHMuaGVpZ2h0O1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgdGhpcy5zZXR1cFNjZW5lKCk7XG4gICAgICAgIHRoaXMuYWRkU2NlbmVPYmplY3RzKHtzZXJpZXM6IHRoaXMuc2VyaWVzfSk7XG4gICAgfVxuXG4gICAgc2V0dXBTY2VuZSgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgbmV4dEZyYW1lSGFuZGxlciA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZTtcblxuICAgICAgICBmdW5jdGlvbiByZW5kZXJlcih0ZkRpZmYpIHtcbiAgICAgICAgICAgIC8vIHNlbGYuY3R4LmNsZWFyUmVjdCgwLCAwLCBzZWxmLndpZHRoLCBzZWxmLmhlaWdodCk7XG4gICAgICAgICAgICBzZWxmLnNjZW5lT2JqZWN0R3JvdXBzLmZvckVhY2goZ3JvdXA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGFueVVwZGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBncm91cC5mb3JFYWNoKG9iaj0+IHtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnVwZGF0aW5nKHRmRGlmZikgJiYgKGFueVVwZGF0ZXMgPSB0cnVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoYW55VXBkYXRlcykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmN0eC5jbGVhclJlY3QoZ3JvdXBbMF0ucmVjdC54LCBncm91cFswXS5yZWN0LnksIGdyb3VwWzBdLnJlY3Qud2lkdGgsIGdyb3VwWzBdLnJlY3QuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAuZm9yRWFjaChvYmo9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmouZHJhdyhzZWxmLmN0eCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZXh0RnJhbWVIYW5kbGVyKHJlbmRlcmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5leHRGcmFtZUhhbmRsZXIocmVuZGVyZXIpO1xuICAgIH1cblxuICAgIGNhbGNZQXhpcyh7c2VyaWVWYWx1ZXMsIHN0ZXBzLCB5UGFkZGluZ30pIHtcbiAgICAgICAgbGV0IGxpbWl0cyA9IFtdO1xuICAgICAgICBzZXJpZVZhbHVlcy5mb3JFYWNoKHN2PT4ge1xuICAgICAgICAgICAgbGltaXRzLnB1c2goTWF0aC5tYXguYXBwbHkobnVsbCwgc3YpKTtcbiAgICAgICAgICAgIGxpbWl0cy5wdXNoKE1hdGgubWluLmFwcGx5KG51bGwsIHN2KSk7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgICAgICAgeU1heDogTWF0aC5tYXguYXBwbHkobnVsbCwgbGltaXRzKSxcbiAgICAgICAgICAgIHlNaW46IE1hdGgubWluLmFwcGx5KG51bGwsIGxpbWl0cyksXG4gICAgICAgICAgICBsYWJlbHM6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IHlTdGVwID0gKHJlc3VsdC55TWF4IC0gcmVzdWx0LnlNaW4pIC8gKHN0ZXBzIC0gMSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RlcHM7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0LmxhYmVscy5wdXNoKE1hdGgucm91bmQocmVzdWx0LnlNYXggLSB5U3RlcCAqIGkpKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgdXBkYXRlUmFuZ2UobmV3UmFuZ2UpIHtcbiAgICAgICAgdGhpcy54UmFuZ2VQZXJjZW50ID0gbmV3UmFuZ2U7XG4gICAgfVxuXG4gICAgYWRkU2NlbmVPYmplY3RzKHtzZXJpZXN9KSB7XG4gICAgICAgIGNvbnN0IHBhZGRpbmdUb3BCb3QgPSAxMDtcbiAgICAgICAgY29uc3QgU2NhbGVCYXJIZWlnaHQgPSA4MDtcbiAgICAgICAgY29uc3QgeUF4aXNEYXRhID0gdGhpcy5jYWxjWUF4aXMoe3NlcmllVmFsdWVzOiBzZXJpZXMubWFwKHM9PnMudmFsdWVzKSwgc3RlcHM6IDZ9KTtcbiAgICAgICAgY29uc3Qgc2NhbGVGYWN0b3IgPSAxIC8gKCh0aGlzLnhSYW5nZVBlcmNlbnQuZW5kIC0gdGhpcy54UmFuZ2VQZXJjZW50LnN0YXJ0ICkgLyAxMDApO1xuICAgICAgICBjb25zdCBwaXhlbFBlclBlcmNlbnQgPSB0aGlzLndpZHRoIC8gMTAwO1xuICAgICAgICBsZXQgbWFpblJlY3QgPSB7XG4gICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgeTogcGFkZGluZ1RvcEJvdCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCAtIFNjYWxlQmFySGVpZ2h0IC0gcGFkZGluZ1RvcEJvdCAqIDIsXG4gICAgICAgIH07XG4gICAgICAgIGxldCBzZXJpZXNSZWN0ID0ge1xuICAgICAgICAgICAgeDogcGl4ZWxQZXJQZXJjZW50ICogdGhpcy54UmFuZ2VQZXJjZW50LnN0YXJ0ICogc2NhbGVGYWN0b3IgKiAtMSxcbiAgICAgICAgICAgIHk6IG1haW5SZWN0LnksXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCAqIHNjYWxlRmFjdG9yLFxuICAgICAgICAgICAgaGVpZ2h0OiBtYWluUmVjdC5oZWlnaHQsXG4gICAgICAgIH07XG4gICAgICAgIGxldCBzY2FsZUJhclJlY3QgPSB7XG4gICAgICAgICAgICB4OiAwLCB5OiB0aGlzLmhlaWdodCAtIFNjYWxlQmFySGVpZ2h0LFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogU2NhbGVCYXJIZWlnaHRcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRyYXdhYmxlcy55QXhpcyA9IG5ldyBZQXhpc1NjZW5lKHtcbiAgICAgICAgICAgIHJlY3Q6IG1haW5SZWN0LFxuICAgICAgICAgICAgZGF0YTogeUF4aXNEYXRhLFxuICAgICAgICAgICAgb3JpZW50YXRpb246ICdsZWZ0JywgLy90b2RvXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRyYXdhYmxlcy5zY01haW4gPSBuZXcgU2VyaWVzQ29udGFpbmVyKHtcbiAgICAgICAgICAgIHlBeGlzRGF0YSxcbiAgICAgICAgICAgIHJlY3Q6IHNlcmllc1JlY3QsXG4gICAgICAgICAgICB2aXNpYmxlUmVjdDogbWFpblJlY3QsXG4gICAgICAgICAgICBzZXJpZXNcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZHJhd2FibGVzLnNjVW5kZXJTY2FsZUJhciA9IG5ldyBTZXJpZXNDb250YWluZXIoe1xuICAgICAgICAgICAgeUF4aXNEYXRhLFxuICAgICAgICAgICAgcmVjdDogc2NhbGVCYXJSZWN0LFxuICAgICAgICAgICAgc2VyaWVzXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRyYXdhYmxlcy5zYiA9IG5ldyBTY2FsZUJhcih7XG4gICAgICAgICAgICBiZzogJ3JnYmEoMjI1LDIyNSwyMjUsMC41KScsXG4gICAgICAgICAgICByZWN0OiBzY2FsZUJhclJlY3QsXG4gICAgICAgICAgICByYW5nZTogdGhpcy54UmFuZ2VQZXJjZW50LFxuICAgICAgICAgICAgcGl4ZWxQZXJQZXJjZW50XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgdGhpcy5zY2VuZU9iamVjdEdyb3Vwcy5wdXNoKFt0aGlzLmRyYXdhYmxlcy55QXhpcywgdGhpcy5kcmF3YWJsZXMuc2NNYWluXSk7XG4gICAgICAgIHRoaXMuc2NlbmVPYmplY3RHcm91cHMucHVzaChbdGhpcy5kcmF3YWJsZXMuc2NVbmRlclNjYWxlQmFyLCB0aGlzLmRyYXdhYmxlcy5zYl0pO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGluaXRGcm9tRGF0YShkYXRhKSB7XG4gICAgICAgIGxldCBzZXJpZXMgPSB7fTtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGRhdGEudHlwZXMpIHtcbiAgICAgICAgICAgIHNlcmllc1trZXldID0ge1xuICAgICAgICAgICAgICAgIGlkOiBrZXksXG4gICAgICAgICAgICAgICAgdHlwZTogZGF0YS50eXBlc1trZXldLFxuICAgICAgICAgICAgICAgIGxlZ2VuZE5hbWU6IGRhdGEubmFtZXNba2V5XSxcbiAgICAgICAgICAgICAgICBjb2xvcjogZGF0YS5jb2xvcnNba2V5XSxcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IGRhdGEuY29sdW1ucy5maW5kKGNvbD0+Y29sWzBdID09IGtleSkuc2xpY2UoMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgeEF4aXMgPSBzZXJpZXNbJ3gnXTtcbiAgICAgICAgeEF4aXMudmFsdWVzID0geEF4aXMudmFsdWVzLm1hcCh2PT4gbmV3IERhdGUodikudG9Mb2NhbGVTdHJpbmcoJ2VuLXVzJywge2RheTogJzItZGlnaXQnLCBtb250aDogJ3Nob3J0J30pKVxuICAgICAgICBkZWxldGUgc2VyaWVzWyd4J107XG4gICAgICAgIHJldHVybiBuZXcgR3JhcGgoe1xuICAgICAgICAgICAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgICAgICAgICB4QXhpcyxcbiAgICAgICAgICAgIHNlcmllczogT2JqZWN0LnZhbHVlcyhzZXJpZXMpXG4gICAgICAgIH0pXG5cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyYXBoIiwiaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMuanMnXG5cbmNvbnN0IERFRkFVTFRfQU5JTUFUSU9OX0RVUkFUSU9OID0gMzAwO1xuY2xhc3MgTGluZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICB0aGlzLmRyYXduID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMucG9pbnRzID0gb3B0cy5wb2ludHM7XG4gICAgICAgIHRoaXMuY29sb3IgPSBvcHRzLmNvbG9yO1xuICAgICAgICB0aGlzLmxpbmVXaWR0aCA9IG9wdHMubGluZVdpZHRoIHx8IDI7XG4gICAgfVxuXG4gICAgdXBkYXRpbmcoVElNRSkge1xuICAgICAgICB0aGlzLnVwZGF0ZShUSU1FKTtcbiAgICAgICAgcmV0dXJuICF0aGlzLmRyYXduIHx8IHRoaXMuYW5pbWF0aW5nO1xuICAgIH1cblxuICAgIGRyYXcoY3R4KSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMubGluZVdpZHRoO1xuICAgICAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwb2ludCwgaSk9PiB7XG4gICAgICAgICAgICBjdHgubW92ZVRvLmFwcGx5KGN0eCwgcG9pbnQpO1xuICAgICAgICAgICAgY3R4LmxpbmVUby5hcHBseShjdHgsIHRoaXMucG9pbnRzW2kgKyAxXSB8fCBwb2ludCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgdGhpcy5kcmF3biA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGFuaW1hdGUob3B0cykge1xuICAgICAgICB0aGlzLmFuaW1PcHRzID0ge1xuICAgICAgICAgICAgb3JpZzoge1xuICAgICAgICAgICAgICAgIHBvaW50czogdGhpcy5wb2ludHNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXI6IHtcbiAgICAgICAgICAgICAgICBwb2ludHM6IHRoaXMucG9pbnRzLm1hcCgocG9pbnQsIGkpPT5VdGlscy5zdWJBQShvcHRzLnBvaW50c1tpXSwgcG9pbnQpKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkdXJhdGlvbjogb3B0cy5kdXJhdGlvbiB8fCBERUZBVUxUX0FOSU1BVElPTl9EVVJBVElPTixcbiAgICAgICAgICAgIHByb2dyZXNzOiBudWxsLFxuICAgICAgICAgICAgc3RhcnQ6IG51bGxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1cGRhdGUoVElNRSkge1xuXG4gICAgICAgIGlmICghdGhpcy5hbmltYXRpbmcpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBsZXQgb3B0cyA9IHRoaXMuYW5pbU9wdHM7XG4gICAgICAgIGlmIChvcHRzLnByb2dyZXNzID09IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5hbmltT3B0cztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGluZyAmJiAhb3B0cy5zdGFydCkge1xuICAgICAgICAgICAgb3B0cy5zdGFydCA9IFRJTUU7XG4gICAgICAgIH1cblxuICAgICAgICBvcHRzLnByb2dyZXNzID0gKChUSU1FIC0gb3B0cy5zdGFydCkgLyBvcHRzLmR1cmF0aW9uKTtcbiAgICAgICAgaWYgKG9wdHMucHJvZ3Jlc3MgPiAxKSB7XG4gICAgICAgICAgICBvcHRzLnByb2dyZXNzID0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvaW50cyA9IG9wdHMub3JpZy5wb2ludHMubWFwKChwb2ludCwgaSk9PiB7XG4gICAgICAgICAgICByZXR1cm4gVXRpbHMuYWRkQUEocG9pbnQsIFV0aWxzLm11bHRpQVYob3B0cy5kaXIucG9pbnRzW2ldLCBvcHRzLnByb2dyZXNzKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuZXhwb3J0IGRlZmF1bHQgTGluZSIsImNsYXNzIFNjYWxlQmFyIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHRoaXMuZHJhd24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yZWN0ID0gb3B0cy5yZWN0O1xuICAgICAgICB0aGlzLmJnID0gb3B0cy5iZztcbiAgICAgICAgdGhpcy5yYW5nZSA9IG9wdHMucmFuZ2U7XG4gICAgICAgIHRoaXMub25SYW5nZUNoYW5nZSA9IG9wdHMub25SYW5nZUNoYW5nZSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIHRoaXMucGl4ZWxQZXJQZXJjZW50ID1vcHRzLnBpeGVsUGVyUGVyY2VudCB8fCAgdGhpcy5yZWN0LndpZHRoIC8gMTAwO1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMucmVjdDtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJhbmdlO1xuICAgICAgICBjb25zdCByZWN0V2lkdGhQWCA9ICgocmFuZ2UuZW5kIC0gcmFuZ2Uuc3RhcnQpIC8gMTAwKSAqIHJlY3Qud2lkdGg7XG5cbiAgICAgICAgdGhpcy52aXNpYmxlUmVjdCA9IFtcbiAgICAgICAgICAgIHJlY3QueCArIHRoaXMucGl4ZWxQZXJQZXJjZW50ICogcmFuZ2Uuc3RhcnQsXG4gICAgICAgICAgICByZWN0LnksXG4gICAgICAgICAgICByZWN0V2lkdGhQWCxcbiAgICAgICAgICAgIHJlY3QuaGVpZ2h0XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgdXBkYXRpbmcoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHJldHVybiAhdGhpcy5kcmF3bjtcbiAgICB9XG5cbiAgICBkcmF3KGN0eCkge1xuICAgICAgICBjb25zdCByID0gdGhpcy5yZWN0O1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5iZztcbiAgICAgICAgLy9jdHguZmlsbFJlY3Qoci54LCByLnksIHIud2lkdGgsIHIuaGVpZ2h0KVxuXG4gICAgICAgIGN0eC5maWxsUmVjdC5hcHBseShjdHgsIHRoaXMudmlzaWJsZVJlY3QpO1xuXG5cbiAgICAgICAgdGhpcy5kcmF3biA9IHRydWU7XG4gICAgfVxuXG59XG5leHBvcnQgZGVmYXVsdCAgU2NhbGVCYXIiLCJpbXBvcnQgTGluZSBmcm9tIFwiLi9MaW5lLmpzXCI7XG5jbGFzcyBTZXJpZXNDb250YWluZXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgdGhpcy5yZWN0ID0gb3B0cy5yZWN0O1xuICAgICAgICB0aGlzLnZpc2libGVSZWN0ID0gb3B0cy52aXNpYmxlUmVjdCB8fCB0aGlzLnJlY3Q7XG4gICAgICAgIC8vIG9wdHMuc2VyaWVzO1xuICAgICAgICB0aGlzLmRyYXduID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5kcmF3YWJsZXMgPSBbXVxuICAgICAgICBvcHRzLnNlcmllcy5mb3JFYWNoKHNlcj0+IHtcbiAgICAgICAgICAgIGlmIChzZXIudHlwZSA9PSAnbGluZScpIHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVzID0gc2VyLnZhbHVlcztcbiAgICAgICAgICAgICAgICBsZXQgcG9pbnRzID0gdGhpcy5jYWxjdWxhdGUoe1xuICAgICAgICAgICAgICAgICAgICB5QXhpczogb3B0cy55QXhpc0RhdGEsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcyxcbiAgICAgICAgICAgICAgICAgICAgcmVjdDogdGhpcy5yZWN0LFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbGV0IGluaXRQb2ludHMgPSBwb2ludHMubWFwKHA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbcFswXSwgdGhpcy5yZWN0LmhlaWdodCAvIDIgKyB0aGlzLnJlY3QueV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBsZXQgbGluZSA9IG5ldyBMaW5lKHtwb2ludHM6IGluaXRQb2ludHMsIGNvbG9yOiBzZXIuY29sb3J9KVxuICAgICAgICAgICAgICAgIGxpbmUuYW5pbWF0ZSh7cG9pbnRzfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3YWJsZXMucHVzaChsaW5lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjYWxjdWxhdGUoe3ZhbHVlcywgcmVjdCwgeUF4aXN9KSB7XG4gICAgICAgIGxldCB7eU1heCwgeU1pbn0gPSB5QXhpcztcbiAgICAgICAgbGV0IHhTdGVwID0gcmVjdC53aWR0aCAvICh2YWx1ZXMubGVuZ3RoIC0gMSk7XG4gICAgICAgIHJldHVybiB2YWx1ZXMubWFwKCh2YWx1ZSwgaSk9PiB7XG4gICAgICAgICAgICBsZXQgbmV3WSA9IE1hdGguYWJzKCgodmFsdWUgLSB5TWluKSAvICh5TWF4IC0geU1pbikpICogcmVjdC5oZWlnaHQgLSByZWN0LmhlaWdodCkgKyByZWN0Lnk7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIGkgKiB4U3RlcCArIHJlY3QueCxcbiAgICAgICAgICAgICAgICBuZXdZXG4gICAgICAgICAgICBdXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICB1cGRhdGluZyhUSU1FKSB7XG4gICAgICAgIGxldCBhbnlVcGRhdGVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZHJhd2FibGVzLmZvckVhY2goZD0+IHtcbiAgICAgICAgICAgIGxldCByZXMgPSBkLnVwZGF0aW5nKFRJTUUpXG4gICAgICAgICAgICBpZiAoIWFueVVwZGF0ZXMpIHtcbiAgICAgICAgICAgICAgICBhbnlVcGRhdGVzID0gcmVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBhbnlVcGRhdGVzO1xuICAgIH1cblxuICAgIGRyYXcoY3R4KSB7XG4gICAgICAgIHRoaXMuZHJhd2FibGVzLmZvckVhY2goZD0+IHtcbiAgICAgICAgICAgIGQuZHJhdyhjdHgpXG4gICAgICAgIH0pXG5cbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBTZXJpZXNDb250YWluZXIiLCJjbGFzcyBVdGlscyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgc3RhdGljIG5ld0RlZmVycmVkKCkge1xuICAgICAgICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXMsIHJlaik9PiB7XG4gICAgICAgICAgICByZXNvbHZlID0gcmVzO1xuICAgICAgICAgICAgcmVqZWN0ID0gcmVqO1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvbWlzZSxcbiAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICByZWplY3RcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBrZXlCeVZhbHVlKG9iaiwgdmFsdWUpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9ialtrZXldID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgc3RhdGljIHN1YkFBKGExLCBhMikge1xuICAgICAgICByZXR1cm4gYTEubWFwKCh2LCBpKT0+IHtcbiAgICAgICAgICAgIHJldHVybiB2IC0gYTJbaV07XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhdGljIGFkZEFBKGExLCBhMikge1xuICAgICAgICByZXR1cm4gYTEubWFwKCh2LCBpKT0+IHtcbiAgICAgICAgICAgIHJldHVybiB2ICsgYTJbaV07XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhdGljIG11bHRpQVYoYTEsIHZhbCkge1xuICAgICAgICByZXR1cm4gYTEubWFwKCh2LCBpKT0+IHtcbiAgICAgICAgICAgIHJldHVybiB2ICogdmFsO1xuICAgICAgICB9KVxuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0ICBVdGlscyIsImltcG9ydCAgTGluZSBmcm9tICcuL0xpbmUuanMnO1xuXG5jbGFzcyBZQXhpc1NjZW5lIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHRoaXMuZHJhd24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kYXRhID0gb3B0cy5kYXRhO1xuXG4gICAgICAgIHRoaXMubGFiZWxzID0gW107XG4gICAgICAgIHRoaXMubGluZXMgPSBbXTtcblxuICAgICAgICB0aGlzLnJlY3QgPSBvcHRzLnJlY3Q7XG4gICAgICAgIHRoaXMuYmcgPSBvcHRzLmJnO1xuICAgICAgICB0aGlzLnBhZGRpbmcgPSBvcHRzLnBhZGRpbmcgfHwgNTtcbiAgICAgICAgdGhpcy5saW5lQ29sb3IgPSBvcHRzLmxpbmVDb2xvciB8fCAnZ3JleSc7XG4gICAgICAgIHRoaXMubGluZVdpZHRoID0gb3B0cy5saW5lV2lkdGggfHwgMC4zO1xuICAgICAgICB0aGlzLmZvbnRDb2xvciA9IG9wdHMuZm9udENvbG9yIHx8ICdibGFjayc7XG4gICAgICAgIHRoaXMuZm9udFNpemUgPSBvcHRzLmZvbnRTaXplIHx8IDE0O1xuXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlKCkge1xuICAgICAgICAvL3RvcCB0byBib3R0b21cbiAgICAgICAgbGV0IHN0YXJ0WSA9IHRoaXMucmVjdC55O1xuICAgICAgICBsZXQgeVBpeGVsU3RlcCA9IHRoaXMucmVjdC5oZWlnaHQgLyAodGhpcy5kYXRhLmxhYmVscy5sZW5ndGgtMSk7XG4gICAgICAgIHRoaXMuZGF0YS5sYWJlbHMuZm9yRWFjaChsYmw9PiB7XG5cbiAgICAgICAgICAgIHRoaXMubGFiZWxzLnB1c2goe1xuICAgICAgICAgICAgICAgIHRleHQ6IGxibC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgIGZvbnRDb2xvcjogdGhpcy5mb250Q29sb3IsXG4gICAgICAgICAgICAgICAgeDogdGhpcy5yZWN0LnggKyB0aGlzLnBhZGRpbmcsXG4gICAgICAgICAgICAgICAgeTogc3RhcnRZIC0gdGhpcy5wYWRkaW5nXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5saW5lcy5wdXNoKG5ldyBMaW5lKHtcbiAgICAgICAgICAgICAgICBwb2ludHM6IFtcbiAgICAgICAgICAgICAgICAgICAgW3RoaXMucmVjdC54LCBzdGFydFldLFxuICAgICAgICAgICAgICAgICAgICBbdGhpcy5yZWN0LndpZHRoLCBzdGFydFldXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IHRoaXMubGluZVdpZHRoLFxuICAgICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmxpbmVDb2xvclxuICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICBzdGFydFkgKz0geVBpeGVsU3RlcDtcbiAgICAgICAgfSlcbiAgICAgICAgLy9ob3RmaXggZm9yIG5vdCBkcmF3aW5nIHRvcCBsaW5lID8gaXMgaXQgZXZlbiBuZWVkZWQ/XG4gICAgICAgIHRoaXMubGluZXMuc3BsaWNlKDAsMSlcbiAgICAgICAgdGhpcy5sYWJlbHMuc3BsaWNlKDAsMSlcbiAgICB9XG5cbiAgICB1cGRhdGluZygpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmRyYXduO1xuICAgIH1cblxuICAgIGRyYXcoY3R4KSB7XG4gICAgICAgIGxldCByID0gdGhpcy5yZWN0O1xuXG4gICAgICAgIGlmICh0aGlzLmJnKSB7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5iZztcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdChyLngsIHIueSwgci53aWR0aCwgci5oZWlnaHQpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5saW5lcy5mb3JFYWNoKGxpbmU9PmxpbmUuZHJhdyhjdHgpKTtcbiAgICAgICAgdGhpcy5sYWJlbHMuZm9yRWFjaChsYmw9PiB7XG4gICAgICAgICAgICBjdHguZm9udCA9IGAke2xibC5mb250U2l6ZX1weCBBcmlhbGA7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gbGJsLmZvbnRDb2xvcjtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChsYmwudGV4dCwgbGJsLngsIGxibC55KVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmRyYXduID0gdHJ1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFlBeGlzU2NlbmUiXSwic291cmNlUm9vdCI6IiJ9