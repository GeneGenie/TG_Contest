import Graph from "./src/Graph.js";
import ColorShifter from './src/ColorShift.js'
function getData() {
    return fetch('./chart_data.json')
        .then(s=>s.json())
        .then(data=> {
            let CS = new ColorShifter()
            window.g = Graph.initFromData(data[4]);
            //minify webpack
            // tooltips ? fuck
        })
}
getData();

