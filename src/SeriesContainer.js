import Line from "./Line.js";
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
                let line = new Line({points: initPoints, color: ser.color})
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
export default SeriesContainer