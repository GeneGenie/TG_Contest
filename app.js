import Graph from "./src/Graph.js";
function getData() {
    return fetch('./chart_data.json')
        .then(s=>s.json())
        .then(data=> {
            window.g = Graph.initFromData(data[0]);

            //minify webpack
            //y on scale  /animate / on legend
            // recalculate x on scale / animate / on legend
            //night shift

            // tooltips ? fuck


            //multiseries
        })
}
getData();

