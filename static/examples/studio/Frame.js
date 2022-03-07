
if(typeof exports != "undefined"){
const { FewComponent, FewNode } = require("../../src/FewDom");
}

const BorderStyle =  {
    border: "solid black 1px", 
    borderRadius: "8px", 
    backgroundColor: "#EEEEFF",
    width: "400px",
    overflow: "hidden",
    fontFamily: "arial"
};

class Frame extends FewComponent
{
    draw() {
        let size = this.state.size || this.attrs.size;
        // e$() is an empty node to start with
        return e$()
            // opens the root 'div' tag and defines its attributes
            .div( { style: CardStyle } )
                // child title div
                .div( {
                    id: "first", // tags can have an id among attributes
                    style: {
                        width: "100%",
                        backgroundColor: "#DEDEFF",
                        padding: "10px"
                    }
                })
                    // this tag$ is self-closing, like a void tag
                    .label$( {
                        style: { margin: "20%", fontWeight: "bold" }
                    }, this.attrs.name )    // label content
                .$div() // closes the title div tag
                .div( { // opens text content div tag
                    id: "border", 
                    style: { 
                        padding: "30px", 
                        // this div is displayed basing on state
                        display: !this.state.hidden ? "block" : "none"
                }} )
                    .span$( {}, this.attrs.description )
                .$div()     // closes the content div
            .$div();        // closes the card div
    }
}

// Initializes document root with my app root component class
FewNode.documentRoot( AppRoot, { 
    name: "Basic component example", 
    description: "Few Dom Component can be used to build a structure over a state. Click on header to toggle card collapse. The line setState() will cause the component to redraw."
} );
