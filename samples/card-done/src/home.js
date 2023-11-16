
const flod = require( "../../../src/few" );
const {div} = flod;

flod.types.Home = function ( attrs, state ) {

    return div({
        style: {
            color: 'blue',
            display: "inline-flex",
            minHeight: 'calc( 100% - 20px )',
            paddingLeft: "76px"
        }
    })
        .span$({ inner: state.saluto ? state.saluto : 'HOME' })
    .$div
}

module.exports = flod.types.Home;
