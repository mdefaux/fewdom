
if(typeof exports != "undefined"){
const { FewComponent, FewNode } = require("../../src/FewDom");
}

class AppRoot extends FewComponent
{
    draw() {
        // e$() is an empty node to start with
        return e$()
            // opens the root 'div' tag and defines its attributes
            .div( { style: { width: "100%", height: "100%" } } )
                
                .SplitPanel( { 
                    direction: "horizontal",
                    position: 400,
                    style: {
                        height: 'calc( 100vh - 14px )',
                        // background: "#101010", // attrs.selected ? "rgb(28 73 169)" : "rgb(28 173 69)",
                        // border: '1px solid #707070',
                    },
                    panelStyle: {
                        // border: '1px solid #707070',
                        // background: "#101010", // attrs.selected ? "rgb(28 73 169)" : "rgb(28 173 69)",
                    },
                    separatorStyle: {

                    }
                } )
                    // .div$( { inner: "splitted ONE" } )
                    .TableList()
                        .child$( [
                            "ONE", "TWO", "THREE", "FOUR", "FIVE",
                            "SIX", "SEVEN", "EIGHT", "NINE", "TEN"
                            ].map( (e,i) => (e$()
                                .div$( {
                                    key: `${e}#${i}`,
                                    style: {
                                        display: 'table-cell',
                                        height: '100px',
                                        width: '100px',
                                        minWidth: '100px',
                                        minHeight: '100px',
                                        border: '1px solid white',
                                        background: 'grey',
                                    },
                                    inner: e
                                } )
                            )) 
                        )
                    .$TableList()
                    .div$( { inner: "splitted TWO" } )
                .$SplitPanel()
                
            .$div();        // closes the card div
    }
}

// Initializes document root with my app root component class
FewNode.documentRoot( AppRoot, {} );
