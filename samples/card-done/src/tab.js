
const flod = require( "../../../src/few" );
const {div,li$} = flod;

flod.types.Tab = function ( attrs, state ) {

    let active = attrs.active || state.active;
    let idField = attrs.idField || 'id';
    return div( {} )
        .ul( {
            style: {
                ...attrs.style
            }
        } )
            .child$( attrs.list.map( elem => 
                li$( {
                    style: {
                        leftMargin: state.over === elem[ idField ] ? 15 : 0,
                        color: 
                            state.over === elem[ idField ] ? 'grey' : 
                            active === elem[ idField ] ? 'blue' : 'white',
                        background: active === elem[ idField ] ? 'white' : 'blue',
                        ...attrs.tabStyle
                    },
                    inner: elem.label,
                    onMouseEnter: ()=> {
                        state.over = elem[ idField ];
                    },
                    onMouseOut: ()=> {
                        state.over = undefined;
                    },
                    onClick: ()=> {
                        state.active = elem[ idField ];
                        attrs.onSelect( elem )
                    }
                } )
            ) )
        .$ul

    .$div;
}

module.exports = flod.types.Tab;