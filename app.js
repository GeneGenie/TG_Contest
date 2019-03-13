import Graph from './src/Graph.js';

function getData() {
    return fetch('./chart_data.json')
        .then(s=>s.json())
        .then(data=> {
            var g1 = Graph.initFromData(data[5]);

            //x.toLocaleString('en-us', { day:'2-digit',month: 'short' });
        })
}
getData();

