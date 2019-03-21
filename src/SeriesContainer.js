import Line from "./Line.js";
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
                let line = new Line({points: initPoints, color: ser.color})
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
export default SeriesContainer