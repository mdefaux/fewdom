
const flod = require( "../../../src/few" );
const {div} = flod;
// const RouteHelper = require("./RouteHelper");
// const { Home$ } = require( './home' );
// const { Hello$ } = require( './hello' );
// const { MyList$ } = require( './list' );


flod.types.Route = function ( attrs, state, innerChildren ) {
    if( window.location.pathname === attrs.path ){
        return false
    }
    return innerChildren;
}

flod.types.Router = function ( attrs ) {

    return div( {
        style: {
            ...attrs.style
        }
    } )
        .child$( attrs.paths[ window.location.pathname ].page )
        // .Route( { path: '/'} )
        //     .Home$( { saluto: 'oK.!'} )     
        // .$Route
        // .Route( { path: '/hello'} )
        //     .Hello$( { saluto: 'oK.!'} )     
        // .$Route
        // .Route( { path: '/tre'} )
        //     .span$( { inner: attrs.lista[ attrs.activeIndex ] } )     
        // .$Route

    .$div;
}

module.exports = flod.types.Router;