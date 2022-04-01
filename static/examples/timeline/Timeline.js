
if(typeof exports != "undefined"){
    const { FewComponent, FewNode, e$ } = require("../../fewdom/FewDom");
}

fewd.types.TimelineSlots = function( attrs )
{
    return e$()
        .repeat$( Array(attrs.count).fill(false).map( () => ( e$()
            .div$( { style: {
                display: "table-cell", 
                minWidth: attrs.cellWidth-2, maxWidth: attrs.cellWidth-2, 
                border: '1px solid #202030', inner: '&nbsp;'} 
            } )
        )) );
}

const sizes= {
    headHeight: 40
}

class Timeline extends FewComponent
{

    onCreate() {
        this.setState({
            cellWidth: 32, 
            rowHeight: 48
        });
    }

    async load()
    {
        let rows = notifierProxy( [
            { label: "Work One", startAt: 0, duration: 4 },
            { label: "Work Two", startAt: 20, duration: 30 },
            { label: "Work Three", startAt: 0, duration: 20 },
            { label: "Work Four", startAt: 10, duration: 10 },
            { label: "Work Five", startAt: 30, duration: 5 },
        ] );

        rows.subscribeOnChange( (v) => {
            console.log( rows );
        })
        
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
                            background: "#101020",
                            border: "1px solid #707070",
                            display: "-webkit-inline-box"
                        }
                    } )
                        .label$( {}, this.attrs.scene ? "TIMELINE" : "loading..." )
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
                        // background: "gray",
                        border: "1px solid oldlace",
                        display: "table-row",
                        overflowY: 'scroll',
                        color: 'white',
                        fontFamily: 'arial'
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
                        .div( { style: {display: "table-row", height: sizes.headHeight, maxHeight: sizes.headHeight} } )
                            .label$( {display: "inline-flex", inner: "name" } )
                        .$div()
                        .repeat$( rows.map( ( row ) => (e$()
                            .div( { style: {
                                display: "table-row", height: this.state.rowHeight, maxHeight: this.state.rowHeight} } )
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
                            // width: "100%",
                            maxWidth: "calc( 100vw - 220px )",
                            // height: "calc( 20% - 5px )",
                            display: "table-cell",
                            background: "ligthgray",
                            border: "1px solid oldlace",
                            overflowX: 'scroll'
                        }
                    } )
                        .div( { style: {display: "table-row", height: sizes.headHeight, maxHeight: sizes.headHeight, border: '1px solid orange'} } )
                            // .label$( { inner: "timeline" } )
                            .TimelineSlots$( {
                                count: 200,
                                cellWidth: this.state.cellWidth
                            } )
                        .$div()
                        .repeat$( rows.map(( row, rowIndex ) => (e$()
                            .div( { 
                                style: {display: "table-row", position: "relative", height: this.state.rowHeight, minWidth: '200%'} 
                            } )
                                .TimelineSlots$( {
                                    count: 200,
                                    cellWidth: this.state.cellWidth
                                } )
                                
                                .TimelineBar$( {
                                    cellWidth: this.state.cellWidth,
                                    rowHeight: this.state.rowHeight,
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

// registerClass( Timeline );
fewd.types.Timeline = Timeline;
