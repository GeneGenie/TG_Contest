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
export default  ScaleBar