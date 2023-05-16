/**
 * 
 * https://webpack.js.org/guides/getting-started/
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
