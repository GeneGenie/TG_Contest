import Line from "./Line.js";

class YAxisScene {
    constructor(opts) {
        this.drawn = false;
        this.data = opts.data;

        this.labels = [];
        this.lines = [];

        this.rect = opts.rect;
        this.bg = opts.bg;
        this.padding = opts.padding || 5;
        this.lineColor = opts.lineColor || 'grey';
        this.lineWidth = opts.lineWidth || 0.3;
        this.fontColor = opts.fontColor || 'grey';
        this.fontSize = opts.fontSize || 14;
        this.labelFormatFn = opts.labelFormatFn || this.labelFormatFnDefault;

        this.calculate();
    }
    updateValues(data){
        this.data=data;
        this.calculate();
        this.drawn = false;
    }
    labelFormatFnDefault(value) {
        value = parseInt(value)
        if (value / 1e9 >= 1) {
            value = (value / 1e9).toFixed(2) + 'b'
        } else if (value / 1e6 >= 1) {
            value = (value / 1e6).toFixed(2) + 'm'
        } else if (value / 1e3 >= 1) {
            value = (value / 1e3).toFixed(2) + 'k'
        }
        return value
    }

    calculate() {
        //top to bottom
        let startY = this.rect.y;
        let yPixelStep = this.rect.height / (this.data.labels.length - 1);
        this.labels = [];
        this.lines = [];
        this.data.labels.forEach(lbl=> {

            this.labels.push({
                text: lbl.toString(),
                fontSize: this.fontSize,
                fontColor: this.fontColor,
                x: this.rect.x + this.padding,
                y: startY - this.padding
            })
            this.lines.push(new Line({
                points: [
                    [this.rect.x, startY],
                    [this.rect.width, startY]
                ],
                lineWidth: this.lineWidth,
                color: this.lineColor
            }))
            startY += yPixelStep;
        })
        //hotfix for not drawing top line ? is it even needed?
        //this.lines.splice(0,1)
        //this.labels.splice(0,1)
    }

    updating() {
        return !this.drawn;
    }

    draw(ctx) {
        let r = this.rect;

        if (this.bg) {
            ctx.fillStyle = this.bg;
            ctx.fillRect(r.x, r.y, r.width, r.height)
        }
        this.lines.forEach(line=>line.draw(ctx));
        this.labels.forEach((lbl, i)=> {
            ctx.font = `${lbl.fontSize}px Arial`;
            ctx.textAlign = 'left';
            ctx.fillStyle = lbl.fontColor;

            let y = i == 0 ? lbl.y + lbl.fontSize + this.padding : lbl.y;
            ctx.fillText(this.labelFormatFnDefault(lbl.text), lbl.x, y)
        })
        this.drawn = true;
    }
}

export default YAxisScene