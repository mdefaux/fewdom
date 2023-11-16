/**
 * STARTS WITH:
 * 
        cd samples/card-done/
        npx webpack serve --open
        
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
// const FlodNode = require( './FlodNode' );


// function component() {
//     const element = document.createElement('div');
//     const nd = new FlodNode();

//    // Lodash, now imported by this script
//     element.innerHTML = 'Hello' + 'webpack' + nd.toString();
 
//     return element;
//   }
 
//   document.body.appendChild(component());

/**This sample draws 3 columns container for cards.
 * Card list are defined by an array of objects, each containing
 * a title and a nested array of cards.
 * 
 */

const { Component, attach, div } = require("../../../src/few");
const notifierProxy = require("./notifierProxy");
const RouteHelper = require("./RouteHelper");
require("./router");
require("./tab");
const { CardBoard$ } = require("./CardBoard");
const { Home$ } = require("./home");


const routes = {

    "/": {
        label: "home",
    }, 
    "/backlog":  {
        label: "backlog",
    }, 
    "/sprint": {
        label: "sprint"
    }, 
    "/settings": {
        label: "settings"
    } 
}

class AppRoot extends Component {
    /**Called when component is created
     * 
     */
    onInit() {
        this.proxy = notifierProxy( this.attrs );
        
        RouteHelper.register(this);
    }
    /**
     * 
     * @returns structure of virtual nodes.
     */
    draw() {
        // e$() is an empty node to start with
        // opens the root 'div' tag and defines its attributes
        return div( { style: { 
                display: "inline-flex", 
                minHeight: 'calc( 100% - 20px )',
                padding: "10px" 
        } } )
            // repeats for each element in array list
            .Tab$({
                style: {
                    color: 'white',
                    fontFamily: 'fantasy',
                    fontSize: '2em',
                    background: 'blue',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                },
                tabStyle: { topMargin: 64 },
                list: Object.entries( routes )
                    .map( ([key,el]) => ({...el, url: key})),
                active: RouteHelper.pathname,
                idField: 'url',
                onSelect: ( selection ) => { 
                    // alert( selection.url );
                    RouteHelper.onNavigate( selection.url )
                }
            })
            .Router$({
                
                style: {
                    position: 'relative',
                    // top: 0,
                    left: 130,
                },
                
                paths: {

                    "/": {
                        label: "home", page: Home$( { saluto: 'oK.!'} ),
                    }, 
                    "/backlog":  {
                        label: "backlog", page: CardBoard$( { list: this.proxy.list } )
                    }, 
                    "/sprint": {
                        label: "sprint"
                    }, 
                    "/settings": {
                        label: "settings"
                    } 
                }
            })
            // .CardBoard$( { list: this.proxy.list })
            // .child$( this.proxy.list
            //     .map((entry, index) =>
            //         // it can use CardList$ function as CardList class was registered
            //         // 
            //         CardList$({
            //             key: `${entry.title}`,
            //             list: entry,
            //             color: colors[index]
            //         })
            //     )
            // )
        .$div;        // closes the main UI div
    }
}


window.onload = async function () {
    // Initializes the AppRoot gui attaching its node to document body root
    attach(document.body)
        .child$(AppRoot, { 
            name: "Basic component example", 
            
            
        } )
    .$attach;
}
   
