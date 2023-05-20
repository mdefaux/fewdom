

const { types, Component, div } = require("../../../src/few");
// const notifierProxy = require("./notifierProxy");
require( './Title.js' );

const CardStyle =  {
    border: "solid black 1px", 
    borderRadius: "8px", 
    backgroundColor: "#EEEEFF",
    width: "calc( 100% - 10px )",
    overflow: "hidden",
    fontFamily: "arial",
    margin: "5px"
};

class Card extends Component
{
    // onInit()
    // {
    //     this.proxy = notifierProxy( this.attrs.card );
    //     this.proxy.subscribeOnChange( () => {
    //         this.update();
    //     });
    // }

    draw() {
        let checks = [ "uno", "due", "tre" ];
        // e$() is an empty node to start with
        return div( { style: CardStyle } )
            // child title div
            .title$( {text:this.attrs.card.name } )
            // opens text content div tag
            .div( {
                id: "content",
                style: { 
                    padding: "30px", 
                    // this div is displayed basing on state
                    display: !this.state.hidden ? "block" : "none"
            }} )
                .span$( {
                    // attributes can specify event management handlers
                    onClick: ()=>{
                        // state change will cause the redraw asynchronously
                        this.attrs.card.description = "Modified text";
                        // this.setState( { hidden: !this.state.hidden } );
                    },
                    inner: this.attrs.card.description
                } )
                
                .child$( checks.map( (c) => 
                    div( { style: {display: "table"} } )
                        .input$( { type: 'checkbox' } )
                        .label$( { inner: c } )
                    .$div
                ) )
            .$div     // closes the content div
        .$div;        // closes the card div
    }
}

types.Card = Card;
module.exports = types.Card;
// registerClass( Card );
