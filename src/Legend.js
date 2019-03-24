class Legend {
    constructor({series, canvas, onClickSerie}) {
        this.onClickSerie = onClickSerie;
        let legendContainer = document.createElement('div');
        Object.assign(legendContainer.style, {
            overflowX: 'scroll',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            padding: '20px 10px',
            width: this.width + 'px'
        })
        series.forEach((s)=> {
            legendContainer.appendChild(this.createLegendButton(s));
        })
        canvas.parentElement.appendChild(legendContainer)
    }

    createLegendButton(serieInfo) {
        let butEl = document.createElement('span');
        Object.assign(butEl.style, {
            display: 'inline-block',
            border: `1px solid rgba(0,0,0,0.3)`,
            borderRadius: '10px',
            minWidth: '80px',
            padding: '10px',
            textAlign: 'center',
            marginRight: '20px',
            lineHeight:'20px'
        })
        let iconEl = document.createElement('span');
        Object.assign(iconEl.style, {
            display: 'inline-block',
            width: '20px',
            height: '20px',
            borderRadius:'20px',
            boxSizing: 'border-box',
            backgroundColor: serieInfo.color,
            border: `1px solid rgba(0,0,0,0.3)`,
            float:'left',
            color:'white'
        })
        iconEl.innerHTML='<span>&#10003;</span>'
        butEl.appendChild(iconEl);
        let text = document.createElement('span');
        text.innerText = serieInfo.name;
        butEl.appendChild(text);

        butEl.addEventListener('click', ()=> {
            let result = this.onClickSerie(serieInfo.id);
            if (result) {
                Object.assign(iconEl.style, {
                    backgroundColor: serieInfo.color,
                    border: `1px solid rgba(0,0,0,0.3)`,
                    color:'white'
                })
            } else {
                Object.assign(iconEl.style, {
                    backgroundColor: 'transparent',
                    border: `1px solid ${serieInfo.color}`,
                    color:'transparent'

                })
            }

        })
        return butEl;
    }

}
export default Legend