const SCHEMES = {
    DAY: {
        bg: 'transparent',
        font:'black',
    },
    NIGHT: {
        bg: '#242f3d',
        font:'white',
    }
}
class ColorShifter {
    constructor(opts={}) {
        const cntr = document.createElement('div')
        Object.assign(cntr.style, {
            textAlign: 'center',
            position: 'fixed',
            bottom: 0,
            fontSize: '24px',
            height: '40px',
            lineHeight: '40px',
            borderTop: '2px solid grey',
            width: '100%'
        })
        cntr.innerHTML = 'Switch Colors';
        document.body.appendChild(cntr);
        let theme = 'DAY';
        this.container = cntr;
        this.applyTheme(SCHEMES[theme])
        cntr.addEventListener('click', ()=> {
            if (theme == 'DAY') {
                theme = 'NIGHT'
            } else if (theme == 'NIGHT') {
                theme = 'DAY'
            }

            let cur = SCHEMES[theme];
            opts.onSwitch && opts.onSwitch(SCHEMES[theme])

            this.applyTheme(cur)
        })
    }
    applyTheme(cur){
        Object.assign(document.body.style,{
            backgroundColor:cur.bg,
            color:cur.font
        })
    }
}

export default ColorShifter




