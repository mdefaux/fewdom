
/* 
 * Everything you should know about ‘module’ & ‘require’ in Node.js
 * https://www.freecodecamp.org/news/require-module-in-node-js-everything-about-module-require-ccccd3ad383/ 
 */

if( !fewd )
    fewd = typeof exports != "undefined" ? require("../../fewdom/FewDom") : fewd;
// if( !Draggable ) 
//     Draggable = require("../../helpers/Draggable")

fewd.types.SplitPanel = function ( attrs, state, innerChildren )
{
    let containerDom;
    let firstSize = state.position ?
        `${state.position}px`
        : attrs.position ?
            `${attrs.position}`
            : `50%`; // default size
    let secondSize = state.secondPosition 
        ? `${state.secondPosition}px` 
        :attrs.position ?
            `calc( 100vw - ${attrs.position} - 32 )`
            :  `50%`; // "calc( 50% - 15px )",
    // console.log( attrs.cellWidth * ( state.draggedStart !== undefined ? state.draggedStart : attrs.start ) );
    return e$().div( {
        style: {
            ...attrs.style,
            position: "relative",
            display: "table"
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
                // position: "absolute",
                width: firstSize,
                maxWidth: firstSize,
                minWidth: firstSize,
                // height: "100%",
                display: "table-cell"
            }
        } )
            .child$( innerChildren?.[0], {
                style: { 
                    width: firstSize,
                    maxWidth: firstSize,
                    minWidth: firstSize,
                }
            } )
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
            // ...Draggable.setup( {
            //     onMove: (e, state) => {
            //         // update state with dragged position
            //         state.position = e.x;
                    
            //         if( state.position < attrs.minSize || 0 )
            //             state.position = attrs.minSize;

            //         state.secondPosition = containerDom.clientWidth - state.position;
            //     },
            //     // onEnd: (e, state) => { attrs.start = state.draggedStart; },
            //     state: state,
            //     instance: {}
            // } )
            Draggable: {
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
            }
        } )
        .$div()
        // second panel
        .div( {
            style: {
                ...attrs.panelStyle,
                position: "relative",
                width: secondSize,
                minWidth: secondSize,
                maxWidth: secondSize,
                display: "table-cell"
            }
        } )
            .child$( innerChildren?.[1], {
                style: { 
                    width: secondSize,
                    maxWidth: secondSize,
                    minWidth: secondSize,
                }
            } )
        .$div()
    .$div()
}
