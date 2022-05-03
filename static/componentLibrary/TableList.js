
if(typeof exports != "undefined"){
    const { FewComponent, FewNode, e$ } = require("../../fewdom/FewDom");
}

fewd.types.TableList = function ( attrs, state, innerChildren )
{
    let containerDom;
    let blockWidth = attrs.blockWidth ||
        parseInt( innerChildren?.[0]?.nextAttrs?.style.width );
    let cols = (blockWidth ? parseInt( attrs.style.width ) / blockWidth : 0);
    let rows = parseInt(innerChildren.length / cols);
    let mps = [];
    for( let r=0; r <= rows; r++ )
    {
        if( r * cols >= innerChildren.length )
            break;
        mps[r] = [];
        
        for( let c=0; c < cols; c++ )
        {
            if( r * cols + c >= innerChildren.length )
                break;
            mps[r][c] = innerChildren[ r * cols + c ];
        }
    }
    // console.log( attrs.cellWidth * ( state.draggedStart !== undefined ? state.draggedStart : attrs.start ) );
    return e$().div( {
        style: {
            ...attrs.style,
            position: "relative",
            display: "table-row", // "flex", // 
            overflowY: "scroll"
        },
        ref: (ref) => { 
            containerDom = ref.dom;
        }
    } )
        .child$( mps.map( (row,ir) => ( e$()
            .div( { key: `row#${ir}`, style: { display: 'table-row' } } )

                .child$( row.map( (cell) => ( e$()
                    .child$( cell )
                )) )
            .$div()
        )) )
        // .child$( innerChildren )
    .$div();
}
