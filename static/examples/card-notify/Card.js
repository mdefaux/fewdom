
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
    onInit()
    {
        this.proxy = notifierProxy( this.attrs.card );
        this.proxy.subscribeOnChange( () => {
            this.update();
        });
    }

    draw() {
        // e$() is an empty node to start with
        return e$()
            // opens the root 'div' tag and defines its attributes
            .div( { style: CardStyle } )
                // child title div
                .title$( {text:this.proxy.name } )
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
                            this.proxy.description = "Modified text";
                            // this.setState( { hidden: !this.state.hidden } );
                        },
                    }, this.proxy.description )
                .$div()     // closes the content div
            .$div();        // closes the card div
    }
}

registerClass( Card );
