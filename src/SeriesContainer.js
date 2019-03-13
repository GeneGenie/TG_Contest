import Line from "./Line.js";
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
                let line = new Line({points: initPoints, color: ser.color})
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
export default SeriesContainer