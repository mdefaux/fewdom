/**
 * 
 * https://webpack.js.org/guides/getting-started/
    npm install webpack webpack-cli --save-dev
 * 
 * html-webpack-plugin:
    npm install --save-dev html-webpack-plugin

 * 
    npm install --save-dev webpack-dev-server
 * replace:
    "start": "node --use_strict index.js",
 * with:
    "start": "webpack serve --open",
 * https://webpack.js.org/guides/development/
    
 * 
 * @returns 
 */
const FlodNode = require( './FlodNode' );


function component() {
    const element = document.createElement('div');
    const nd = new FlodNode();

   // Lodash, now imported by this script
    element.innerHTML = 'Hello' + 'webpack' + nd.toString();
 
    return element;
  }
 
  document.body.appendChild(component());
