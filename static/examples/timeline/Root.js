
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
                .Timeline$()
            .$div();        // closes the card div
    }
}

// Initializes document root with my app root component class
FewNode.documentRoot( AppRoot, {} );
