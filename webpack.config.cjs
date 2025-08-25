const path = require('path');
//import path from 'path';

module.exports = {
    mode: 'development',
    // mode: 'production',
    entry: './src/few.js',
    
  // this needs to be added to build a library target as ESM
  experiments: {
    outputModule: true
  },
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
