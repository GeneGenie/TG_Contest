import YAxisScene from "./yAxis.js";
import ScaleBar from "./ScaleBar.js";
import SeriesContainer from "./SeriesContainer.js";

class Graph {
    constructor(opts) {
        var canvas = opts.el;
        this.series = opts.series;
        this.xRangePercent = opts.defaultXRangePercent || {start:50,end:100};
        this.sceneObjects = [];
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
        console.log(this.countXRange())
        this.ctx = canvas.getContext("2d");
        //this.ctx.translate(0.1, 0.5);
        this.setupScene();
        this.addSceneObjects({series: this.series});
    }
    countXRange(){
        let columnsTotal = this.series[0].values.length-1;
        return {
            startI:Math.round((this.xRangePercent.start/100) * columnsTotal),
            endI:Math.round((this.xRangePercent.end/100) * columnsTotal)
        }

    }
    setupScene() {
        var self = this;
        var nextFrameHandler = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;

        function renderer(tfDiff) {
            // self.ctx.clearRect(0, 0, self.width, self.height);
            self.sceneObjects.forEach(group=> {
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

        // this.ctx.fillStyle = 'grey';
        // this.ctx.fillRect(0,0,1000,1000);
        //todo remove

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

    addSceneObjects({series}) {

        let yAxisData = this.calcYAxis({serieValues: series.map(s=>s.values), steps: 6});
        const paddingTopBot = 10;
        const ScaleBarHeight = 80;

        let chartRect = {
            x: 0,
            y: paddingTopBot,
            width: this.width,
            height: this.height - ScaleBarHeight - paddingTopBot * 2,
        };


        let yAxis = new YAxisScene({
            rect: chartRect,
            data: yAxisData,
            orientation: 'left', //todo
        });
        let scMain = new SeriesContainer({
            yAxisData,
            rect: chartRect,
            series
        });


        let scaleBarRect = {
            x: 0, y: this.height - ScaleBarHeight,
            width: this.width, height: ScaleBarHeight
        };
        let scUnderScaleBar = new SeriesContainer({
            yAxisData,
            rect: scaleBarRect,
            series
        });
        let sb = new ScaleBar({
            bg: 'rgba(225,225,225,0.5)',
            rect: scaleBarRect,
            range:this.xRangePercent
        });


        this.sceneObjects.push([yAxis, scMain]);
        this.sceneObjects.push([scUnderScaleBar, sb]);

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

export default Graph