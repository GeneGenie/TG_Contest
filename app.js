import Graph from './src/Graph.js';
function getData() {
    return fetch('./chart_data.json')
        .then(s=>s.json())
        .then(data=> {
            window.g = Graph.initFromData(data[4]);
        })
}
getData();

