
if(typeof exports != "undefined"){
const { FewComponent, FewNode } = require("../../src/FewDom");
}

const CardStyle =  {
    border: "solid black 1px", 
    borderRadius: "8px", 
    backgroundColor: "#EEEEFF",
    width: "calc( 100% - 10px )",
    overflow: "hidden",
    fontFamily: "arial",
    margin: "5px"
};

class Card extends FewComponent
{
    draw() {
        // e$() is an empty node to start with
        return e$()
            // opens the root 'div' tag and defines its attributes
            .div( { style: CardStyle } )
                // child title div
                .div( {
                    id: "title", // tags can have an id among attributes
                    style: {
                        width: "100%",
                        backgroundColor: "#DEDEFF",
                        padding: "10px",
                        height: "10px"
                    },
                    // attributes can specify event management handlers
                    onClick: ()=>{
                        // state change will cause the redraw asynchronously
                        this.setState( { hidden: !this.state.hidden } );
                    },
                    // prevents text selection
                    onSelectStart: (e) => {e.preventDefault();}
                })
                    // this tag$ is self-closing, like a void tag
                    .label$( {
                        style: { margin: "20%", fontWeight: "bold" }
                    }, this.attrs.name )    // label content
                .$div() // closes the title div tag
                .div( { // opens text content div tag
                    id: "content",
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

fewd.types.Card = Card;
