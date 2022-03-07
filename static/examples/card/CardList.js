
if(typeof exports != "undefined"){
const { FewComponent, FewNode } = require("../../src/FewDom");
}

const cardListStyle =  {
    border: "solid black 1px", 
    borderRadius: "8px",
    width: "360px",
    height: "100%",
    overflow: "hidden",
    fontFamily: "arial",
    margin: "5px"
};

class CardList extends FewComponent
{
    draw() {
        // e$() is an empty node to start with
        return e$()
            // opens the root 'div' tag and defines its attributes
            .div( { 
                style: {...cardListStyle, backgroundColor: "#EEEEEF"
            } } )
                // child title div
                .div( {
                    key: "title", // tags can have an id among attributes
                    style: {
                        width: "100%",
                        backgroundColor: this.attrs.color || "#DEDEFF",
                        padding: "10px"
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
                        style: { margin: "10%", fontWeight: "bold" }
                    }, this.attrs.title )    // label content
                .$div() // closes the title div tag
                .div( { // opens text content div tag
                    key: "content", 
                    style: { 
                        padding: "10px", 
                        // this div is displayed basing on state
                        display: !this.state.hidden ? "block" : "none"
                }} )
                    .repeat( this.attrs.cards )
                        .child$( Card, (card) => (card) )
                    .$repeat()
                .$div()     // closes the content div
            .$div();        // closes the card div
    }
}
