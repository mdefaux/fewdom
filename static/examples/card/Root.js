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
                .repeat( this.attrs.list )
                    // it can use CardList$ function as CardList class was registered
                    // CardList has a function instead object in attribs parameter
                    .CardList$( ( entry, index ) => ({
                        id: `list${index}`,
                        title: entry.title,
                        cards: entry.cards,
                        color: colors[ index ]
                    }))
                .$repeat()
            .$div();        // closes the main UI div
    }
}

// Initializes document root with my app root component class
FewNode.documentBody( { style: { background: "#E0E0F0" } } )
    .child(
        AppRoot, { 
        name: "Basic component example", 
        list: [ 
            {
                title: "Incoming", 
                cards: [ 
                    { name: "first", description: "Few Dom Component can be used to build a structure over a state. Click on header to toggle card collapse. The line setState() will cause the component to redraw." },
                    { name: "second", description: "Component can be iterable with repeat$ method" } 
                ] 
            }, 
            {title: "Work in progress"}, 
            {title: "Done"}
        ]
    } );
