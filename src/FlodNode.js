const AbstractNode = require("./AbstractNode");

class FlodNode extends AbstractNode {
    toString() {
        console.llllog('bau');
        
        return 'FlodNode -> ' + super.toString();
    }
}

module.exports = FlodNode;
