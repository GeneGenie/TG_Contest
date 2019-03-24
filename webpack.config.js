const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        index: './app.js',
    },
    //devtool: 'inline-source-map',
    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
};