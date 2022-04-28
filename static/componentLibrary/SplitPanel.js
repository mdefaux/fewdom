
if(typeof exports != "undefined"){
    const { FewComponent, FewNode, e$ } = require("../../fewdom/FewDom");
}

fewd.types.SplitPanel = function ( attrs, state, innerChildren )
{
    let containerDom;
    // console.log( attrs.cellWidth * ( state.draggedStart !== undefined ? state.draggedStart : attrs.start ) );
    return e$().div( {
        style: {
            ...attrs.style,
            position: "relative",
            display: "table-row"
        },
        ref: (ref) => { 
            containerDom = ref.dom;
        }
    } )
        // first panel
        .div( {
            style: {
                ...attrs.panelStyle,
                position: "relative",
                width: state.position ?
                    `${state.position}px`
                    : attrs.position ?
                        `${attrs.position}`
                        : `50%`, // default size
                height: "100%",
                display: "table-cell"
            }
        } )
            .child$( innerChildren?.[0] )
        .$div()
        // draggable separator
        .div( {
            style: {
                background: "#A0A0F0", // attrs.selected ? "rgb(28 73 169)" : "rgb(28 173 69)",
                cursor: "col-resize",
                width: "5px",
                minWidth: "5px",
                border: '1px solid #707070',
                ...attrs.separatorStyle,
                position: "relative",
                display: "table-cell",
            },
            ...Draggable.setup( {
                onMove: (e, state) => {
                    // update state with dragged position
                    state.position = e.x;
                    
                    if( state.position < attrs.minSize || 0 )
                        state.position = attrs.minSize;

                    state.secondPosition = containerDom.clientWidth - state.position;
                },
                // onEnd: (e, state) => { attrs.start = state.draggedStart; },
                state: state,
                instance: {}
            } )
        } )
        .$div()
        // second panel
        .div( {
            style: {
                ...attrs.panelStyle,
                position: "relative",
                width: state.secondPosition 
                    ? `${state.secondPosition}px` 
                    :attrs.position ?
                        `calc( 100vw - ${attrs.position} )`
                        :  `50%`, // "calc( 50% - 15px )",
                display: "table-cell"
            }
        } )
            .child$( innerChildren?.[1] )
        .$div()
    .$div()
}
