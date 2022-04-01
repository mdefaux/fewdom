
if(typeof exports != "undefined"){
    const { FewComponent, FewNode, e$ } = require("../../fewdom/FewDom");
}

fwdtypes.TimelineBar = function ( attrs, inner, state )
{
    return e$().div( {
        style: {
            position: "absolute",
            background: "rgb(28 173 69)",
            border: '1px solid #707070',
            borderRadius: '6px',
            overflow: "auto",
            height: attrs.rowHeight,
            left: attrs.cellWidth * ( state.draggedStart !== undefined ? state.draggedStart : attrs.start ),
            minWidth: attrs.cellWidth * ( state.draggedSize !== undefined ? state.draggedSize : attrs.duration )
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
                    height: attrs.rowHeight,
                    background: "rgb(28 125 69)",
                    inner: "&nbsp;"
                },
                onMouseEnter: (e) => {e.target.style.background= "rgb(28 255 69)"},
                onMouseLeave: (e) => {e.target.style.background= "rgb(28 125 69)"},
                ...Draggable.setup( {
                    onMove: (e, state) => {
                        let delta = parseInt( e.deltaX / attrs.cellWidth );
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
                    height: attrs.rowHeight,
                    background: "rgb(28 125 69)",
                    inner: "&nbsp;"
                },
                onMouseEnter: (e) => {e.target.style.background= "rgb(28 255 69)"},
                onMouseLeave: (e) => {e.target.style.background= "rgb(28 125 69)"},
                ...Draggable.setup( {
                    onMove: (e, state) => {
                        let delta = parseInt( e.deltaX / attrs.cellWidth );
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
