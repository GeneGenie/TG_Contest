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
export default  ScaleBar