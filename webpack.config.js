const path = require('path');

module.exports = {
    // mode: 'development',
    mode: 'production',
    entry: './src/few.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'flods.js',
        globalObject: 'this',
        library: {
            name: 'flods',
            type: 'umd',
        },
        clean: true
    },
};
