import YAxisScene from "./yAxis.js";
import XAxisScene from "./xAxis.js";
import ScaleBar from "./ScaleBar.js";
import SeriesContainer from "./SeriesContainer.js";

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

        this.drawables.yAxis = new YAxisScene({
            rect: mainRect,
            data: yAxisData,
            orientation: 'left', //todo
        });
        this.drawables.xAxis = new XAxisScene({
            rect: xAxisRect,
            data: this.xAxisData,
            ctx:this.ctx
        });
        this.drawables.scMain = new SeriesContainer({
            yAxisData,
            rect: seriesRect,
            visibleRect: mainRect,
            series: this.series
        });
        this.drawables.scUnderScaleBar = new SeriesContainer({
            yAxisData,
            rect: scaleBarRect,
            series: this.series
        });
        this.drawables.sb = new ScaleBar({
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

export default Graph