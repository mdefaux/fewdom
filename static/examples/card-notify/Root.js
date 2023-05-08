/**This sample draws 3 columns container for cards.
 * Card list are defined by an array of objects, each containing
 * a title and a nested array of cards.
 * 
 */
if(typeof exports != "undefined"){
const { FewComponent, FewNode } = require("../../src/FewDom");
}

// colors of card lists
const colors = ["#FFEFEF", "#FFFFEF", "#EFFFEF"];

class AppRoot extends FewComponent
{
    onInit() {
        this.proxy = notifierProxy( this.attrs );
    }
    draw() {
        // e$() is an empty node to start with
        return e$()
            // opens the root 'div' tag and defines its attributes
            .div( { style: { 
                display: "inline-flex", 
                minHeight: 'calc( 100% - 20px )',
                padding: "10px" 
            } } )
                // repeats for each element in array list
                .child$( this.proxy.list
                    .map( ( entry, index ) => (
                        // it can use CardList$ function as CardList class was registered
                        // CardList has a function instead object in attribs parameter
                        e$().CardList$( {
                            key: `${entry.title}`,
                            list: entry,
                            color: colors[ index ]
                        })
                    ))
                )
            .$div();        // closes the main UI div
    }
}

// Initializes document root with my app root component class
// FewNode.documentBody( { style: { background: "#E0E0F0" } } )
//     .child(
//         AppRoot, { 
//         name: "Basic component example", 
//         list: [ 
//             {
//                 title: "Incoming", 
//                 cards: [ 
//                     { name: "first", description: "Few Dom Component can be used to build a structure over a state. Click on header to toggle card collapse. The line setState() will cause the component to redraw." },
//                     { name: "second", description: "Component can be iterable with repeat$ method" } 
//                 ] 
//             }, 
//             {title: "Work in progress", cards: [] }, 
//             {title: "Done", cards: [] }
//         ]
//     } );

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
