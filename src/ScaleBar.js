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
        this.canvasOffset = {
            x: this.canvas.offsetLeft,
            y: this.canvas.offsetTop
        }

    }

    getRelativeTouchX(e) {
        return (e.touches[0].pageX - this.canvasOffset.x)
    }

    getRelativeTouchY(e) {
        return (e.touches[0].pageY - this.canvasOffset.y)
    }

    move(e) {
        let eX = e.layerX || e.offsetX || this.getRelativeTouchX(e),
            eY = e.layerY || e.offsetY || this.getRelativeTouchY(e),
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
            eX = e.layerX || e.offsetX || this.getRelativeTouchX(e),
            eY = e.layerY || e.offsetY || this.getRelativeTouchY(e),
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
export default  ScaleBar