
const flod = require( "flod" );
const {div,li$} = flod;

flod.types.MyList = function ( attrs, state ) {

    return div( {} )
        .ul( {
            style: {
                color: 'coral',
                fontFamily: 'fantasy'
            }
        } )
            .child$( attrs.lista.map( elem => 
                li$( { inner: elem } )
            ) )
        .$ul
    .$div;
}

module.exports = flod.types.MyList;