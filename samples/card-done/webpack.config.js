const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        few: '../../src/few.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Flod Example',
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './dist'),
        clean: true
    },
};