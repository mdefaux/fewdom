const {FewNode} = require("./FewNode");
const {FewFactory} = require("./FewFactory")


class FewEmptyNode extends FewNode
{
    getNodeCount()
    {
        return this.childrenSeq?.length;
    }
    
    // buildNodes( incomingNode )
    // {
        
    //     // 
    //     // if( this.key )
    //     // {
    //     //     this.childrenSeq.forEach( (c) => {
    //     //         c.key= `${this.key}.${c.key}` 
    //     //     });
    //     // }
    //     // 
    //     return this.childrenSeq.reduce( (ic, next) => (
    //         // next instanceof FewEmptyNode ?
    //             [...ic, ...next.buildNodes( incomingNode ) ] 
    //             // :
    //             // [...ic, next]
    //     ), [] );
    // }
    

    applyUpdate() {        
        try {
            this.apply();
        }
        catch ( err ) {

            if ( err instanceof FewFactory.types.Exception ){
                // err.add( this );
                console.error( err.message );
                console.error( 'Stack', err.log() );
            }
            else {
                console.error( err );
                throw err;
            }
        }
    }

    apply( incomingNode, parent, offsetIndex )
    {
        if( !parent && this.dom )
        {
            parent = this;
        }

        return this.applyChildren( incomingNode, parent, offsetIndex );
    }

    removeDomFrom( parent )
    {
        this.childrenSeq?.forEach( (c) => {
            c.removeDomFrom( parent ); 
        });
        this.removed = true;
        // this.virtualNode.removeDomFrom( parent );
        // parent.dom.removeChild(this.parent.dom);
    }

    copy( dest )
    {
        dest = new FewEmptyNode();
        // dest.typeName = this.typeName;

        super.copy( dest )

        return dest;
    }    
}

module.exports = FewEmptyNode;