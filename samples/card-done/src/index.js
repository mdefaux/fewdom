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

const { Component, e$, div } = require("../../../src/few");
const notifierProxy = require("./notifierProxy");
const { CardList$ } = require( './CardList' );

// colors of card lists
const colors = ["#FFEFEF", "#FFFFEF", "#EFFFEF"];

class AppRoot extends Component
{
    onInit() {
        this.proxy = notifierProxy( this.attrs );
    }
    draw() {
        // e$() is an empty node to start with
        // opens the root 'div' tag and defines its attributes
        return div( { style: { 
                display: "inline-flex", 
                minHeight: 'calc( 100% - 20px )',
                padding: "10px" 
        } } )
            // repeats for each element in array list
            .child$( this.proxy.list
                .map((entry, index) =>
                    // it can use CardList$ function as CardList class was registered
                    // 
                    CardList$({
                        key: `${entry.title}`,
                        list: entry,
                        color: colors[index]
                    })
                )
            )
        .$div;        // closes the main UI div
    }
}


window.onload = async function () {
    // Initializes the AppRoot gui attaching its node to document body root
    e$().attach(document.body)
        .child$(AppRoot, { 
            name: "Basic component example", 
            list: [ 
                {
                    title: "Incoming", 
                    cards: [ 
                        { name: "first", description: "Few Dom Component can be used to build a structure over a state. Click on header to toggle card collapse. The line setState() will cause the component to redraw." },
                        { name: "second", description: "Component can be iterable with repeat$ method" } 
                    ] 
                }, 
                {title: "Work in progress", cards: [] }, 
                {title: "Done", cards: [] }
            ]
        } )
    .$attach();
}
   
