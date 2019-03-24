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

export default XAxisScene