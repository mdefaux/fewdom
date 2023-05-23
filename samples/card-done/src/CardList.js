
const few = require("../../../src/few");
const { div } = few;
const { Card$ } = require( './Card' );
require( './DragList' );

const cardListStyle = {
    borderRadius: "8px",
    width: "360px",
    height: "100%",
    overflow: "hidden",
    fontFamily: "arial",
    margin: "5px"
};

class CardList extends few.Component {
    onInit() {
        // subscribes to list.cards proxy for change
        // changes include the reassignment to cards array with a new array
        // for example following line will fire the callback:
        // this.attrs.list.cards = []; 
        this.attrs.list?.subscribeOnChange(() => {
            this.update();
        });
    }

    draw() {
        // e$() is an empty node to start with
        return div( {
            style: {...cardListStyle, backgroundColor: "#FFFFFF"}
        } )
            .title$( { text: this.attrs.list.title, color: this.attrs.color } )
            .div( {         // opens cards container div
                key: "content",
                style: { 
                    // padding: "10px", 
                    // this div is displayed basing on state
                    display: !this.state.hidden ? "block" : "none"
                }
            } )
                // for each card in attribute list
                // .child$( this.attrs.list.cards
                //     .map( (card) =>
                //         Card$( {id: card.id, card: card}) 
                //     )
                // )
                .DragList$( {
                    list: this.attrs.list.cards,
                    style: { padding: '0px' },
                    onArray: (arr) => { this.attrs.list.cards = arr; },
                    // onItemMove: (item, position)=>{},
                    // onItemRemove: (position)=>{}
                    foreach: ( card ) =>         
                        Card$( {
                            key: `element-list-${card.id}`,
                            id: card.id,
                            card: card,
                        })
                } )
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
                    .span$( { inner: '+' } )
                .$div
            .$div         // closes the content div
        .$div;            // closes the card div
    }
}

few.types.CardList = CardList;

module.exports = few.types.CardList;
