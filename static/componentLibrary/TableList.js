
if(typeof exports != "undefined"){
    const { FewComponent, FewNode, e$ } = require("../../fewdom/FewDom");
}

fewd.types.TableList = function ( attrs, state, innerChildren )
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
        .child$( innerChildren )
    .$div();
}
