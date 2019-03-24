import Graph from "./src/Graph.js";
import ColorShifter from './src/ColorShift.js'
function getData() {
    return fetch('./chart_data.json')
        .then(s=>s.json())
        .then(data=> {
            let CS = new ColorShifter()


            data.forEach(dataSet=>{
                Graph.initFromData(dataSet)
            })
            //minify webpack
            // tooltips ? fuck
        })
}
getData();

