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
        historyApiFallback : true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Flods Example',
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './dist'),
        clean: true,
        publicPath: "/"
    },
};