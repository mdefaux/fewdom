const flod = require("../../../src/few");
const {div} = flod;
const { CardList$ } = require( './CardList' );
// colors of card lists
const colors = ["#FFEFEF", "#FFFFEF", "#EFFFEF"];

flod.types.CardBoard = function( attrs ) {
    return div( { style: { 
        display: "inline-flex", 
        minHeight: 'calc( 100% - 20px )',
        padding: "10px" 
    } } )
        // repeats for each element in array list
        .child$( attrs.list
            .map((entry, index) =>
                // it can use CardList$ function as CardList class was registered
                // 
                CardList$({
                    key: `${entry.title}`,
                    list: entry,
                    color: colors[index]
                })
            )
        )
    .$div;        // closes the main UI div
}

module.exports = flod.types.CardBoard;