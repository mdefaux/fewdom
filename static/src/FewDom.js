/**Smallest assertion facility ever.
 * Activate it with _de = true;
 * Debugger will break at assertion failure before throwing an exception
 * @usage _de&&assert( myTestCondition, "optional failure message" );
 */
let _de = true;
function assert(condition, message, noException ) {
    if (condition === false || condition === null || condition === undefined) {
      debugger;
      if( !noException )
        throw Error( message || "Assertion failed" );
    }
}

/**Deep equal facility 
 * 
 */
const SetHelper = {
    _MAX_DEEP_EQAULITY_DEPTH: 16,
    deepDifference( a, b, maxDepth )
    {
        if( maxDepth === undefined ) maxDepth = this._MAX_DEEP_EQAULITY_DEPTH;
        if( maxDepth === 0 ) return b;

        // one of the two is not an object
        if( typeof a !== "object" || typeof b !== "object" )
        {
            // type and value equality
            if( a === b )
                return {};   // tells that there are no difference
            // returns the new object
            return b;
        }

        let entries = Object.entries( a ).reduce( (p,[key, val])=> {
            // property does not exists in new object
            if( !b[key] )
                return {...p, key: undefined }; // property cancellation
            // checks recursiverly: if false, there are no deep differences
            let recursive = deepDifference( val, b[key], maxDepth-1 );
            return typeof recursive === "object" && Object.keys(recursive).length === 0 ? p : {...p, key: recursive};
        }, {} );

        // adds those properties of b that were not present in a
        return {...entries, 
            ...Object.fromEntries(
                Object.entries( b )
                    .filter( ([bKey,])=> (!a[bKey])   // takes only b keys that are not present in a
                )
            )};
    }
}

class FewNode {
    constructor()
    {
        this.dom = undefined;
        this.id = undefined;
        this.attrs = {};
    }

    setup( node, id, def ){
        this.dom = node;
        this.id = id || node?.id || def?.id;
        this.def = def;

        this.children = {};
        this.childIndex = 0;
        this.childrenSeq = [];

        Array.prototype.forEach.call( ["div", "input", "label", "span", "form", "textarea", "img", "a", 
            "button", "select", "option", "ul", "ol", "li", "canvas"], 
        (t) => { 
            this[t] = function( attribs, inner ){ return this.tagOpen( t, attribs, inner ); } 
            this[`${t}$`] = function( attribs, inner ){ return this.tagVoid( t, attribs, inner ); } 
        } );

        return this;
    }

    setAttrs( attrs )
    {
        if( attrs?.id )
            this.id;
        this.nextAttrs = SetHelper.deepDifference( this.attrs, attrs || {} );
    }

    static select( querySelector ){
        var n = document.querySelector(querySelector);
        _de&&assert( n );
        var wrapped = new FewNode()
        wrapped.setup( n );
        return wrapped;
    }

    static create( xmlString )
    {
      let parser = new DOMParser();
      let doc = parser.parseFromString(xmlString, "text/html");
      return doc.firstChild.childNodes[1].firstChild;
    }

    /**Creates or modify a tag element children of this node element.
     * 
     * @param {*} tagName - name of the element tag
     * @param {*} attributes - attributes of the element
     * @param {*} inner 
     * @returns a 
     */
    tag( tagName, attributes, inner )
    {
      let index = this.childIndex;
      let id = ( attributes && attributes.id ) || (`${tagName}-${this.id}-${index}`);
      let virtualNode = this.children[id];
  
      // TODO: checks if tag is the same of stored one
  
      // finds existing child with same id
      if( !virtualNode )
      {
        virtualNode = new FewNode();
        virtualNode.setup( false, id, tagName );
        virtualNode.tagName = tagName;
        // divCom = $( $dom( `<${tagName} />` ) ); // builds a new DOM object
        // divCom.id = function() { return id; };
      }
      // let divCom = this.findChild( tagName, attributes )
  
      if( inner !== undefined && inner !== this.inner ) // virtualNode.$.innerHTML )
      {
        virtualNode.nextInner = inner;
        // divCom.$.innerHTML = inner;
      }
  
      if( false && !_MdsVirtualTree )  //
      {
        if( attributes )
        {
          virtualNode.setAttributes( attributes );
        }
      }
  
      // is important to define the component id before calling child
  
      this.child( virtualNode, attributes );
  
      return virtualNode;
    }
  
    tagOpen( tagName, attributes, inner )
    {
      let t = this.tag( tagName, attributes, inner );
  
      // closure tag returns to the component parent (actually 'this' component).
      t[`$${tagName}`] = () => (this);
  
      return t;
    }
  
    tagVoid( tagName, attributes, inner )
    {
      this.tag( tagName, attributes, inner );
  
      // closure tag returns to the component parent (actually 'this' component).
      return this;
    }
  
  
    // Array.prototype.forEach.call( ["source", "meta", "param", "track", "input", "br", "img", "div"], 
    // (t) => { this[t] = function( attribs, inner ){ return this.tag( t, attribs, inner ); } } );
  
    setAttributes ( attribs )
    {
        _de&&assert( attribs );
        _de&&assert( this.dom );
      Object.entries( attribs ).forEach( ([name,value]) => {
        // special attributes
        if( name === "render" )
        {
          value( this );        // executes immediatly the render function
          return;
        }
  
        // TODO: checks if attribute didn't change
  
  
        var oldStyleName = "on" + name.charAt(2).toLowerCase() + name.slice(3);
        // checks for handler
        if( oldStyleName in this.dom )
        {
          this.dom[ oldStyleName ] = value;
          return;
        }
        
        // if( name in this.dom )
        // {
        //   this.dom[ name ] = value;
        //   return;
        // }
        
        if( name === "classes" )
        {
          this.dom.setAttribute("class", value);
          return;
        }

        if( name === "style" )
        {
            //   this.dom.style = value;
          Object.entries( value ).forEach( ([styleKey,styleValue]) => {
            this.dom.style[styleKey] = styleValue;
          });
          return;
        }
  
        if( name in this )
        {
          this[ name ]( value );
          return;
        }
  
        this.dom.setAttribute(name, value);
      });
    }

    child( ChildClass, attrs ){
        _de&&assert( ChildClass );
        if( !this.childrenSeq )
            this.childrenSeq = [];
        let id = attrs?.id;
        if( !id && ChildClass.name ){
            let count = this.childrenSeq.reduce( (cnt, prev) => (prev.name === ChildClass.name? cnt+1 : cnt ), 0 )
            id = `${ChildClass.name}#${count}`;
        }
        // if( !id )
        //     id = `n${this.childrenSeq.length}`; // sets an id determined by index

        // finds the node in children map by id
        let virtualNode = this.children[ id ];

        if( !virtualNode )
        {
            if( ChildClass.name )  // if it is a class
            {
                virtualNode = new ChildClass();
                virtualNode.name = ChildClass.name;
            }
            else if( typeof ChildClass === 'string' )
            {
                virtualNode = new FewNode();
                virtualNode.setup( false, id, ChildClass );
            }
            else 
            {
                virtualNode = ChildClass;
            }
        }
        
        virtualNode.setAttrs( attrs );
        this.childrenSeq.push( virtualNode );

        return virtualNode;
    }

    
    replace( ChildClass, attrs ){
    }

    apply(){
        // creates if not exists
        if( !this.dom )
        {
            if( this.tagName )
                this.dom = document.createElement(this.tagName );
            else if( this.xml )
                this.dom = FewNode.create( this.xml );
        }
        _de&&assert( this.dom );
        // changes innerHTML
        if( this.nextInner !== undefined && this.nextInner !== this.dom.innerHTML )
        {
            this.dom.innerHTML = this.nextInner;
            this.nextInner = undefined;
        }

        // changes attributes
        // console.log( this.attrs );
        // console.log( this.nextAttrs );
        this.setAttributes( this.nextAttrs || {} );
        
        // updates children
        // console.log( this.childrenSeq );
        let newIdMap = this.childrenSeq.reduce( (idMap, ch, index) => {

            // TODO: looks for next dom element
            let nextDom = this.dom.childNodes[ index ];

            let childDom = ch.apply();
            this.dom.appendChild( childDom );

            return {...idMap, [ch.id]: ch };
        }, {} );

        delete this.childrenSeq;

        return this.dom;
    }
}

class FewComponent extends FewNode {
    constructor(){
        super();
    }

    onInit( attrs )
    {

    }

    onChangeAttrs( oldAttrs, newAttrs )
    {
        return true;
    }

    onChangeState( oldState, newState )
    {
        return true;
    }

    apply(){
        console.log( this.attrs );

        console.log( this.nextAttrs );
        
        console.log( this.childrenSeq );
    }
}

if(typeof exports != "undefined"){
    exports._de = _de;
    exports.FewNode = FewNode;    
    exports.FewComponent = FewComponent;
}
else{    
}
