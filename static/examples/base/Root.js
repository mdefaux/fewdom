
if(typeof exports != "undefined"){
const { FewComponent, FewNode } = require("../../src/FewDom");
}

console.log( "Root.js" );

class Root extends FewComponent
{
    draw( root ) {
        return root 
            .div()
                .label$( {}, this.attrs.name )
                .label$( {}, this.attrs.description )
            .$div();
    }
}

// gets the root node element and appends the Root component
FewNode.select( "#root" )
    .div()
        .label$( {}, "Base example" )  // { inner: "Base example" } 
    .$div()
    .apply();

    // .replace( Root, { name: "Base example", description: "Few Dom Management"} )
    //.apply();

    // .child( Root, { name: "Base example", description: "Few Dom Management"} )
    // .apply();
