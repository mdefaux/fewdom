
if(typeof exports != "undefined"){
    const { FewComponent, FewNode, e$ } = require("../../fewdom/FewDom");
}

const TimelineBar = function ( attrs, inner, state )
{
    return e$().div( {
        style: {
            position: "absolute", 
            background: "rgb(28 173 69)",
            border: '1px solid black',
            borderRadius: '6px',
            overflow: "auto",
            height: 32,
            left: 32 * ( state.draggedStart || attrs.start ), 
            minWidth: 32 * ( state.draggedSize || attrs.duration )
        } 
    } )
        .div( {
            style: {
                position: "relative"
            } 
        } )
            .div$( {
                style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 10, 
                    height: 32,
                    background: "rgb(28 255 69)",
                    inner: "&nbsp;"
                },
                ...Draggable.setup( {
                    onMove: (e, state) => {
                        let delta = parseInt( e.deltaX / 32 );
                        state.draggedStart = attrs.start + delta;
                        
                        if( state.draggedStart < 0 )
                            state.draggedStart = 0;
                    },
                    onEnd: (e, state) => { attrs.start = state.draggedStart; },
                    state: state,
                    instance: {}
                } )
            } )
            .label$( {
                style: {marginLeft: 20},
                inner: attrs.label
            } )
            .div$( {
                style: {
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 10, 
                    height: 32,
                    background: "rgb(28 255 69)",
                    inner: "&nbsp;"
                },
                ...Draggable.setup( {
                    onMove: (e, state) => {
                        let delta = parseInt( e.deltaX / 32 );
                        state.draggedSize = attrs.duration + delta;
                        
                        if( state.draggedSize < 1 )
                            state.draggedSize = 1;
                    },
                    onEnd: (e, state) => { attrs.duration = state.draggedSize; },
                    state: state,
                    instance: {}
                } )
            } )
        .$div()
    .$div();
}

registerFunction( TimelineBar );
