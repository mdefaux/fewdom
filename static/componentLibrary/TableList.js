
// if(typeof exports != "undefined"){
//     const { FewComponent, FewNode, e$ } = require("../../fewdom/FewDom");
// }

fewd.types.TableList = function ( attrs, state, innerChildren )
{
    if ( !attrs.style.width ) {
        throw new fewd.Exception( `Mandatory attribute 'style.width' is '${attrs.style.width}' in '${this.key}'.` )
    }

    // let containerDom;
    let blockWidth = attrs.blockWidth ||
        parseInt( innerChildren?.[0]?.nextAttrs?.style.width );
    let cols = (blockWidth ? parseInt( parseInt( attrs.style.width ) / blockWidth ) : 1);
    let rows = parseInt( Math.ceil( (innerChildren?.length || 0) / cols ) );
    let mps = [];
    for( let r=0; r <= rows; r++ )
    {
        if( r * cols >= innerChildren?.length )
            break;
        mps[r] = [];
        
        for( let c=0; c < cols; c++ )
        {
            if( r * cols + c >= innerChildren?.length )
                break;
            mps[r][c] = innerChildren?.[ r * cols + c ];
        }
    }
    // console.log( attrs.cellWidth * ( state.draggedStart !== undefined ? state.draggedStart : attrs.start ) );
    return e$().div( {
        ...attrs,
        style: {
            // ...attrs.style,
            height: attrs.rowHeight ? attrs.rowHeight * rows : attrs.style.height,
            maxWidth: attrs.style.width,
            display: "table", // "flex", // 
            height: attrs.rowHeight * rows // '100%'
        },
        // ref: (ref) => { 
        //     containerDom = ref.dom;
        // }
        // debug: 'trace'
    } )
        .child$( mps.map( (row,ir) => ( e$()
            .div( { key: `row#${ir}`, 
                style: { 
                    display: 'table-row',
                    height: attrs.rowHeight || 100,
                    width: attrs.style.width
                }
            } )

                .child$( row.map( (cell) => ( e$()
                    .child$( cell, 
                        // {
                        //     style: { width: blockWidth }
                        // } 
                    )
                )) )
            .$div()
        )) )
        // .child$( innerChildren )
    .$div();
}
