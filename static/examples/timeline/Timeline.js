
if(typeof exports != "undefined"){
    const { FewComponent, FewNode, e$ } = require("../../fewdom/FewDom");
}



class Timeline extends FewComponent
{

    onCreate() {
        console.log( "SCore created" );
     }

    async load()
    {
        let rows = notifierProxy( [
            { label: "Work One", startAt: 10, duration: 20 },
            { label: "Work Two", startAt: 20, duration: 30 },
            { label: "Work Three", startAt: 0, duration: 20 },
            { label: "Work Four", startAt: 10, duration: 10 },
            { label: "Work Five", startAt: 30, duration: 5 },
        ] );

        
        this.setState({ rows: rows });
    }

    draw() {
        if( !this.state.rows )
        {
            this.load();
            return e$()
                // opens the root 'div' tag and defines its attributes
                .div( {} )
                    .div( {
                        style: {
                            width: "100%",
                            height: "calc( 20% - 5px )",
                            background: "gray",
                            border: "1px solid oldlace",
                            display: "-webkit-inline-box"
                        }
                    } )
                        .label$( {}, this.attrs.scene ? "SCORE" : "loading..." )
                    .$div()
                .$div();
        }
        let rows = this.state.rows;
        // e$() is an empty node to start with
        return e$()
            // opens the root 'div' tag and defines its attributes
            .div( {} )
                .div( {
                    style: {
                        width: "100%",
                        height: "calc( 20% - 5px )",
                        background: "gray",
                        border: "1px solid oldlace",
                        display: "table-row",
                        overflowY: 'scroll'
                    }
                } )
                
                    .div( {
                        style: {
                            width: this.state.leftFrame || 200,
                            // height: "calc( 20% - 5px )",
                            display: "table-cell",
                            background: "ligthgray",
                            border: "1px solid oldlace"
                        }
                    } )
                        .div( { style: {display: "table-row", height: 32, maxHeight: 32} } )
                            .label$( {display: "inline-flex", inner: "name" } )
                        .$div()
                        .repeat$( rows.map( ( row ) => (e$()
                            .div( { style: {
                                display: "table-row", height: 32, maxHeight: 32} } )
                                .label$( { 
                                    // type: "text",
                                    display: "inline-flex",
                                    inner: row.label
                                } )
                            .$div()
                        )) )
                    .$div()
                    .div( {
                        style: {
                            width: "100%",
                            // height: "calc( 20% - 5px )",
                            display: "table-cell",
                            background: "ligthgray",
                            border: "1px solid oldlace",
                            overflowX: 'scroll'
                        }
                    } )
                        .div( { style: {display: "inline", height: 32} } )
                            .label$( { inner: "timeline" } )
                        .$div()
                        .repeat$( rows.map( ( row, rowIndex ) => (e$()
                            .div( { 
                                style: {display: "table-row", position: "relative", height: 32, minWidth: '200%'} 
                            } )
                                .repeat$( Array(200).fill(false).map( (e, i) => ( e$()
                                    .div$( { style: 
                                        {display: "table-cell", minWidth: 32, maxWidth: 32, border: '1px solid', inner: '&nbsp;'}  } )
                                )) )
                                
                                .TimelineBar$( {
                                    // row: row,
                                    label: row.label,
                                    rowIndex: rowIndex,
                                    start: row.startAt || 0,
                                    duration: row.duration
                                } )
                            .$div()
                        )) )
                    .$div()
                .$div()
            .$div();        // closes the main UI div
    }
}

registerClass( Timeline );
