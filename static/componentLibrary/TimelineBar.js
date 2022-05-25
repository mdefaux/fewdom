
if(typeof exports != "undefined"){
    const { FewComponent, FewNode, e$ } = require("../../fewdom/FewDom");
}

fewd.types.TimelineBar = function ( attrs, state )
{
    // console.log( attrs.cellWidth * ( state.draggedStart !== undefined ? state.draggedStart : attrs.start ) );
    return e$().div( {
        style: {
            position: "absolute",
            background: attrs.selected ? "rgb(28 73 169)" : "rgb(28 173 69)",
            border: '1px solid #707070',
            zIndex: state.dragging !== undefined ? 10 : 0,
            borderRadius: '6px',
            overflow: "auto",
            height: attrs.rowHeight,
            left: attrs.cellWidth * ( state.draggedStart !== undefined ? state.draggedStart : attrs.start ),
            width: attrs.cellWidth * ( state.draggedSize !== undefined ? state.draggedSize : attrs.duration )
        },
        onClick: attrs.onClick
    } )
        .div( {
            style: {
                position: "relative"
            }
        } )
            .child$( attrs.changeStarting && e$().div$( {
                style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 10,
                    height: attrs.rowHeight,
                    background: "rgb(28 125 69)",
                    inner: "&nbsp;",
                    cursor: "e-resize"
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
                    onEnd: (e, state) => { 
                        // attrs.start = state.draggedStart;
                        attrs.changeStarting( state.draggedSize );
                        state.draggedSize = undefined;
                    },
                    state: state,
                    instance: {}
                } )
            } ) )
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
                    inner: "&nbsp;",
                    cursor: "e-resize"
                },
                onMouseEnter: (e) => {e.target.style.background= "rgb(28 255 69)"},
                onMouseLeave: (e) => {e.target.style.background= "rgb(28 125 69)"},
                // ...Draggable.setup( {
                Draggable: {
                    onMove: (e, mystate) => {
                        let delta = parseInt( e.deltaX / attrs.cellWidth );
                        state.draggedSize = attrs.duration + delta;
                        
                        if( state.draggedSize < 1 )
                            state.draggedSize = 1;
                    },
                    onEnd: (e, mystate) => { 
                        attrs.changeDuration( state.draggedSize ); 
                        state.draggedSize = undefined;
                    },
                    state: state,
                    instance: {}
                }
            } )
        .$div()
    .$div();
}
