const FewComponent = require("./FewComponent");

const FewFactory = require('./FewFactory');

/**Function node is a wrapper for a function that draws
 * the component. The function should accept as parameters
 * attributes passed by parent component
 * the state of the component
 * the children of the component
 */
 class FewFunctionNode extends FewComponent {
    /**Drawing of a function node is simply made by
     * calling the function, passing the attributes,
     * the state of current nodes and children of
     * this node
     * 
     * @returns 
     */
    draw() {
        return this.f(this.attrs || {}, this.state, this.childrenSeq);
    }

    /**As type method should be used to determine if two node
     * are the same, returns the pointer to the function.
     * This is used in applyRemoveDom method to avoid
     * calling 
     */
    get type() {
        return this.f;
    }
}

FewFactory.types.FewFunctionNode = FewFunctionNode;

module.exports = FewFunctionNode;
