
if(typeof exports != "undefined"){
const { FewComponent, FewNode, e$ } = require("../../src/FewDom");
}

const cardListStyle = {
    borderRadius: "8px",
    width: "360px",
    height: "100%",
    overflow: "hidden",
    fontFamily: "arial",
    margin: "5px"
};

fewd.types.title = function( attrs )
{
    return e$().div( {
        key: "title", // tags can have an id among attributes
        style: {
            width: "100%",
            backgroundColor: attrs.color || "#DEDEFF",
            padding: "10px"
        },
        // attributes can specify event management handlers
        onClick: attrs.onClick,
        // prevents text selection
        onSelectStart: (e) => {e.preventDefault();}
    } )
        // this tag$ is self-closing, like a void tag
        .label$( {
            style: { margin: "10%", fontWeight: "bold" }
        }, attrs.text )    // label content
    .$div()         // closes the title div tag
}

class CardList extends FewComponent
{
    onInit()
    {
        // subscribes to list.cards proxy for change
        // changes include the reassignment to cards array with a new array
        // for example following line will fire the callback:
        // this.attrs.list.cards = []; 
        this.attrs.list.cards?.subscribeOnChange( () => {
            this.update();
        });
    }

    draw() {
        // e$() is an empty node to start with
        return e$()
            // opens the root 'div' tag and defines its attributes
            .div( {
                style: {...cardListStyle, backgroundColor: "#FFFFFF"}
            } )
                .title$( { text: this.attrs.list.title, color: this.attrs.color } )
                .div( {         // opens cards container div
                    key: "content",
                    style: { 
                        padding: "10px", 
                        // this div is displayed basing on state
                        display: !this.state.hidden ? "block" : "none"
                    }
                } )
                    // for each card in attribute list
                    .child$( this.attrs.list.cards
                        .map( (card) => (
                            e$().Card$( {id: card.id, card: card}) 
                        ))
                    )
                    // adds the plus button to add cards to the list
                    .div( {
                        key: 'plus',
                        style: {    
                            border: '1px solid black', borderRadius: '8px',
                            backgroundColor: 'rgb(238, 238, 255)',
                            width: 'calc(100% - 20px)', overflow: 'hidden',
                            margin: '5px', padding: '5px'
                        },
                        onClick: () => {
                            // list.cards is a proxy but can be assignable with unmutable array
                            // and this component, as a subscriber, will be notified
                            this.attrs.list.cards = 
                                [ ...this.attrs.list.cards, 
                                    // adds a new card with an unique id
                                    { id: `${this.attrs.list.title}#${this.attrs.list.cards?.length || 0}`,
                                      name: 'new', description: 'nuovo' 
                                    } 
                                ];
                        }
                    } )
                        .span$( {}, "+" )
                    .$div()
                .$div()         // closes the content div
            .$div();            // closes the card div
    }
}

fewd.types.CardList = CardList;
