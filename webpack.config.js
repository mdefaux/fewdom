const path = require('path');

module.exports = {
    // mode: 'development',
    entry: './src/few.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'flod.js',
        globalObject: 'this',
        library: {
            name: 'flod',
            type: 'umd',
        },
        clean: true
    },
};
