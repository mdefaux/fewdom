
if(typeof exports != "undefined"){
const { FewComponent, FewNode } = require("../../src/FewDom");
}

class AppRoot extends FewComponent
{
    draw( root ) {
        return root 
            .div( {
                style: { 
                    border: "1px solid black", 
                    borderRadius: "4px", 
                    backgroundColor: "#EEEEFF",
                    width: "50%",
                    padding: "10px" } 
                } )
                .label$( {}, this.attrs.name )
                .label$( {}, this.attrs.description )
            .$div();
    }
}

// 
FewNode.documentRoot( AppRoot, { name: "Basic component example", description: "Few Dom Management"} );
