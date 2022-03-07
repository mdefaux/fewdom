
if(typeof exports != "undefined"){
const { FewComponent, FewNode } = require("../../src/FewDom");
}

// gets the root node element and appends the Root component
window.onload = function() {
    FewNode.select( "#root" )
        .div( { 
            style: { 
                border: "1px solid black", 
                borderRadius: "4px", 
                backgroundColor: "#EEEEFF",
                width: "50%",
                padding: "10px"
            } } )
            .label$( {}, "Basic example" )  // { inner: "Base example" } 
        .$div()
        .apply();

        // .replace( Root, { name: "Base example", description: "Few Dom Management"} )
        //.apply();

        // .child( Root, { name: "Base example", description: "Few Dom Management"} )
        // .apply();
}