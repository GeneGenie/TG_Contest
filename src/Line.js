import Utils from "./Utils.js";

const DEFAULT_ANIMATION_DURATION = 300;
class Line {
    constructor(opts) {
        this.drawn = false;
        this.animating = false;
        this.points = opts.points;
        this.color = opts.color;
        this.opacity=1;
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
        ctx.globalAlpha = this.opacity;
        this.points.forEach((point, i)=> {
            ctx.moveTo.apply(ctx, point);
            ctx.lineTo.apply(ctx, this.points[i + 1] || point);
        });

        ctx.stroke();
        //ctx.globalAlpha=1;
        this.drawn = true;
        return this;
    }

    animate(opts) {
        if (this.animating) {
            //continue current animation during range change, makes it smooth
            this.animOpts.dir.points = this.animOpts.orig.points.map((point, i)=>Utils.subAA(opts.points[i], point))
            return this;
        }
        this.animOpts = {
            orig: {
                points: this.points.map(v=>v),
                opacity: this.opacity
            },
            dir: {
                points: this.points.map((point, i)=>Utils.subAA(opts.points[i], point)),
                opacity:(opts.opacity===undefined? 1:opts.opacity) - this.opacity,
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
        if (opts.dir.opacity != 0) {
            console.log(this.opacity)
            this.opacity = opts.orig.opacity+ opts.dir.opacity * opts.progress;
        }
        this.points = opts.orig.points.map((orpoint, i)=> {
            return Utils.addAA(orpoint, Utils.multiAV(opts.dir.points[i], opts.progress));
        });
    }

}
export default Line