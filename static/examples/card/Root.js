
if(typeof exports != "undefined"){
const { FewComponent, FewNode } = require("../../src/FewDom");
}

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
                .repeat( this.attrs.list )
                    .child$( CardList, ( entry, index ) => ({
                        id: `list${index}`,
                        title: entry.title,
                        cards: entry.cards,
                        color: colors[ index ]
                    }))
                .$repeat()
            .$div();        // closes the card div
    }
}

// Initializes document root with my app root component class
FewNode.documentRoot( AppRoot, { 
    name: "Basic component example", 
    list: [ 
        {
            title: "Incoming", 
            cards: [ 
                { name: "first", description: "Few Dom Component can be used to build a structure over a state. Click on header to toggle card collapse. The line setState() will cause the component to redraw." },
                { name: "second", description: "Component can be iterable with repeat$ method" } 
            ] 
        }, 
        {title: "Ready"}, 
        {title: "Done"}
    ]
} );
