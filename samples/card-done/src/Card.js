

const { types, Component, div } = require("../../../src/few");
require( './Title.js' );
require( './EditableText.js' );

const CardStyle =  {
    border: "solid black 1px", 
    borderRadius: "8px", 
    backgroundColor: "#FFFFF8",
    width: "calc( 100% - 10px )",
    overflow: "hidden",
    fontFamily: "arial",
    margin: "5px",
    position: 'relative',
};

const titleBackground = {
    "Asset Inventory": "#aadfdf",
    "PPM": "#e3e3a9",
    "Contratti": "#7f7fe1",
    "CRM-HDA": "orange",
    "Acquisti": "rgb(231 125 125)"
};

class Card extends Component {

    draw() {
        return div( { 
            style: {
                ...CardStyle,
                width: this.attrs.dragged ? 300 : "calc( 100% - 10px )"
            },
        } )
            // child title div
            .title( {
                text: this.attrs.card.name,
                style: {
                    backgroundColor: titleBackground[ this.attrs.card.name ] || '#AAAAAA'
                }
            } )
                // .span$( {inner: 'buu'} )
            .$title
            // opens text content div tag
            .div( {
                id: "content",
                style: { 
                    minHeigth: 128,
                    fontFamily: 'arial',
                    fontSize: '20px'
                }
            } )
                .EditableText$( {
                    value: this.attrs.card.description,
                    onChange: (newValue) => {
                        this.attrs.card.description = newValue;
                    }
                } )
                
                // .child$( checks.map( (c) => 
                //     div( { style: {display: "table"} } )
                //         .input$( { type: 'checkbox' } )
                //         .label$( { inner: c } )
                //     .$div
                // ) )
            .$div     // closes the content div
            .span$( {
                style: { 
                    position: 'absolute',
                    top: 4,
                    right: 20,
                    fontSize: '2em',
                    color: '#AA0000'
                },
                inner: this.attrs.card.points || '??'
            } )
        .$div;        // closes the card div
    }
}

types.Card = Card;
module.exports = types.Card;
// registerClass( Card );
