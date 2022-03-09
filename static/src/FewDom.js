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

/**
 * 
 */
const SetHelper = {
    _MAX_DEEP_EQAULITY_DEPTH: 16,
    /**Deep equal facility 
     * 
     * @param {*} a 
     * @param {*} b 
     * @param {*} maxDepth used to avoid infinite loop in circular references
     * @returns 
     */
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
            let recursive = SetHelper.deepDifference( val, b[key], maxDepth-1 );
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
        this.childrenSeq = [];

        // Array.prototype.forEach.call( ["div", "input", "label", "span", "form", "textarea", "img", "a", 
        //     "button", "select", "option", "ul", "ol", "li", "canvas"], 
        // (t) => { 
        //     this[t] = function( attribs, inner ){ return this.tagOpen( t, attribs, inner ); } 
        //     this[`${t}$`] = function( attribs, inner ){ return this.tagVoid( t, attribs, inner ); } 
        // } );

        return this;
    }

    /**Sets the wrapper attributes.
     * Only changing attributes will be applied.
     * 
     * @param {*} attrs 
     */
    setAttrs( attrs )
    {
        if( attrs?.id ) // as a special attrib id is handled separately
            this.id;
        // compares the new attributes to actuals: only differences will be stored in 'nextAttrs'
        this.nextAttrs = SetHelper.deepDifference( this.attrs, attrs || {} );
    }

    static empty() {
        var n = new FewNode();
        n.setup();
        return n;
    }

    /**Query select an existing DOM element and return a 
     * wrap reference to it.
     * 
     * @param {string} querySelector 
     * @returns FewNode wrapper pointing to selected element
     */
    static select( querySelector ){
        var n = document.querySelector(querySelector);
        _de&&assert( n );
        var wrapped = new FewNode()
        wrapped.setup( n );
        return wrapped;
    }

    /**Creates a DOM element from an xml string
     * 
     * @param {*} xmlString 
     * @returns a DOM element
     */
    static create( xmlString )
    {
      let parser = new DOMParser();
      let doc = parser.parseFromString(xmlString, "text/html");
      return doc.firstChild.childNodes[1].firstChild;
    }

    static documentRoot( rootComponentClass, attrs )
    {
        window.onload = ()=>{
            let root= new FewNode()
            root.setup( document.body );
            root.child( rootComponentClass, attrs );
            root.apply();
        }
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
      let id = ( attributes && attributes.id ); // || (`${tagName}-${this.id}-${index}`);
      let tagId = (`${tagName}-${this.childrenSeq.length}`);
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
  
    child$( childObject, attributes, inner )
    {
      this.child( childObject, attributes, inner );
  
      // closure tag returns to the component parent (actually 'this' component).
      return this;
    }
  
  
    // Array.prototype.forEach.call( ["source", "meta", "param", "track", "input", "br", "img", "div"], 
    // (t) => { this[t] = function( attribs, inner ){ return this.tag( t, attribs, inner ); } } );
  
    _applyAttributes ( attribs )
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
    
    
            var oldStyleName = "on" + name.charAt(2).toLowerCase() + name.slice(3).toLowerCase();
            // var oldStyleName = name.toLowerCase();

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
    
            // if( name in this )
            // {
            //     this[ name ]( value );
            //     return;
            // }
    
            this.dom.setAttribute(name, value);
        });

        this.attrs = attribs;
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
        let virtualNode = this.children?.[ id ];

        if( !virtualNode )
        {
            // if( ChildClass.name )  // if it is a class
            // if( ChildClass instanceof FewComponent )
            if( ChildClass.name && ChildClass.constructor )
            {
                virtualNode = new ChildClass();
                if( ! ChildClass instanceof FewComponent )
                {
                    throw new Error( `Class is not a component.` );
                }
                virtualNode.classname = ChildClass.name;
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

    repeat$( array )
    {
        let e = e$();

        e.parent = this;
        e.deferredCallback = (nodeCallback)=>{
            array.forEach( (el,index) => nodeCallback(el, index) )
        }
        return e;
    }

    repeat( array )
    {
        let e = e$();

        e.parent = this;
        e.$repeat = () => {

            array?.forEach( (el,index) => {

                let nextAttrs = typeof e.getNode().nextAttrs === 'function' ?
                    e.getNode().nextAttrs(el, index) : 
                    e.getNode().nextAttrs || el;
                
                if( ! nextAttrs?.key )
                {
                    console.warn( `Repeated objects should have a key attributes.`)
                }
                this.child( e.copy().getNode(), nextAttrs );
            } );

            return this;
        };
        return e;
    }

    copy( dest )
    {
        dest = dest || e$();

        dest.tagName = this.tagName;
        dest.childrenSeq = [...this.childrenSeq.map( (e)=>( e.copy() ))];

        return dest;
    }



    apply( incomingNode )
    {
        // creates if not exists
        if( !this.dom )
        {
            if( this.tagName )
                this.dom = document.createElement( this.tagName );
            else if( this.xml )
                this.dom = FewNode.create( this.xml );
        }
        _de&&assert( this.dom );
        // changes innerHTML
        this.nextInner = incomingNode?.nextInner || this.nextInner;
        if( this.nextInner !== undefined && this.nextInner !== this.dom.innerHTML )
        {
            this.dom.innerHTML = this.nextInner;
            this.nextInner = undefined;
        }

        // changes attributes
        // console.log( this.attrs );
        // console.log( this.nextAttrs );
        this._applyAttributes( {
            ...this.nextAttrs || {}, ...incomingNode?.nextAttrs  } );
        
        let newIdMap;
        if( !incomingNode ) 
        {
            // updates children
            // console.log( this.childrenSeq );
            newIdMap = this.childrenSeq.reduce( (idMap, ch, index) => {

                // TODO: looks for next dom element
                let nextDom = this.dom.childNodes[ index ];

                ch.index = index;
                let childDom = ch.apply();
                this.dom.appendChild( childDom );

                return {...idMap, [ch.id]: ch };
            }, {} );

        }
        else 
        {
            let childrenSeq = Object.entries( this.children )
                .sort( ([,a], [,b] ) => (a.index - b.index))
                .map( ([,child] ) => (child));

            

            newIdMap = incomingNode.childrenSeq.reduce( (idMap, ch, index) => {

                // tries a match
                if( this.children[ ch.id ] )
                {
                    // if position does not match
                    if( this.children[ ch.id ].index > index )
                    {
                        // moves here
                        // updates index
                    }
                    this.children[ ch.id ].apply( ch );
                    return {...idMap, [ch.id]: this.children[ ch.id ] };
                }

                // TODO: looks for next dom element
                let nextDom = this.dom.childNodes[ index ];
                let nextChild = childrenSeq[ index ];

                if( nextChild?.tagName === ch.tagName )
                {
                    nextChild.apply( ch );
                    return {...idMap, [ch.id]: nextChild };
                }

                let childDom = ch.apply();
                this.dom.appendChild( childDom );

                return {...idMap, [ch.id]: ch };
            }, {} );

        }
        this.children = newIdMap;

        //delete this.childrenSeq;

        return this.dom;
    }
}

class FewEmptyNode extends FewNode
{
    constructor(){
        super();
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
        let id = ( attributes && attributes.id );

        this.virtualNode = new FewNode();
        this.virtualNode.setup( false, id, tagName );
        this.virtualNode.tagName = tagName;
    
        if( inner !== undefined && inner !== this.inner ) // virtualNode.$.innerHTML )
        {
            this.virtualNode.nextInner = inner;
        }
        this.virtualNode.setAttrs( attributes );
        return this.virtualNode;
    }
     
    apply( compareWith ){
        // creates if not exists
        // if( !dom )
        // {
        //     if( this.tagName )
        //         this.dom = document.createElement(this.tagName );
        //     else if( this.xml )
        //         this.dom = FewNode.create( this.xml );
        // }
        // _de&&assert( this.dom );
        // // changes innerHTML
        // if( this.nextInner !== undefined && this.nextInner !== this.dom.innerHTML )
        // {
        //     this.dom.innerHTML = this.nextInner;
        //     this.nextInner = undefined;
        // }

        // // changes attributes
        // // console.log( this.attrs );
        // // console.log( this.nextAttrs );
        // this._applyAttributes( this.nextAttrs || {} );
        
        // // updates children
        // // console.log( this.childrenSeq );
        // let newIdMap = this.childrenSeq.reduce( (idMap, ch, index) => {

        //     // TODO: looks for next dom element
        //     let nextDom = this.dom.childNodes[ index ];

        //     let childDom = ch.apply();
        //     this.dom.appendChild( childDom );

        //     return {...idMap, [ch.id]: ch };
        // }, {} );

        // delete this.childrenSeq;
        debugger;
    }

    getNode() 
    {
        return this.childrenSeq[0];
    }
     
    compare( compareWith ) {
        if( !compareWith ) {
            this.virtualNode.apply();
            return this.virtualNode;
        }
        let newDom = compareWith.apply( this.virtualNode );

        if( newDom !== compareWith?.dom )
        {
            // TODO: replace
        }
        return compareWith;
    }
    
}

// this.tagOpen( t, attribs, inner ); } 
//             this[`${t}$`] = function( attribs, inner ){ return this.tagVoid( t, attribs, inner ); } 
// https://stackoverflow.com/questions/32496825/proper-way-to-dynamically-add-functions-to-es6-classes
["div", "input", "label", "span", "form", "textarea", "img", "a", 
    "button", "select", "option", "ul", "ol", "li", 
    "canvas"].forEach((tagName) => {
    FewNode.prototype[tagName] = function (attribs, inner) {
      return this.tagOpen( tagName, attribs, inner );
    }
    FewNode.prototype[`${tagName}$`] = function (attribs, inner) {
      return this.tagVoid( tagName, attribs, inner );
    }
  });

function registerClass( clazz )
{
    _de&&assert( clazz.name );
    let classname = clazz.name;

    FewNode.prototype[classname] = function (attribs, inner) {
        return this.child( clazz, attribs, inner );
      }
    FewNode.prototype[`${classname}$`] = function (attribs, inner) {
        return this.child$( clazz, attribs, inner );
    }

}

const pthis = {
    _callDraw( _this ){

        let drawNode = _this.draw( _this.fnode );

        _de&&assert( drawNode );
        _de&&assert( drawNode.virtualNode );
        // _de&&assert( drawNode.childrenSeq[0] );

        // gets the first root 
        // let compRoot = drawNode.childrenSeq[0];

        _this.virtualNode = drawNode.compare( _this.virtualNode );

        return  _this.virtualNode.dom;
    }
}

class FewComponent extends FewNode {
    constructor(){
        super();
        this.fnode = FewNode.empty();
        this._state = {};
    }

    get state() {
        return this._state;
    }
    
    __isComponent() { return true; }

    onInit( attrs )
    {

    }

    onChangeAttrs( oldAttrs, newAttrs, differences )
    {
        return true;
    }

    onChangeState( oldState, newState, differences )
    {
        return true;
    }
    
    _applyAttributes ( attribs )
    {
        let differences = SetHelper.deepDifference( this.attrs, attribs );
        this.onChangeAttrs( this.attrs, attribs, differences );
        this.attrs = attribs;
    }

    setState( newstate ){
        this.nextState = {...this.nextState || {},...newstate };
        clearTimeout( this._stateChangeTimeout );

        return new Promise( ( resolve, reject ) => {
            this._stateChangeTimeout = setTimeout( () => {
                // if( this.stateChanged ) // if component is still to be updated...
                this.update();            // updates.
                resolve();                 // resolves the promise
            }, 1 );                    // delays the updating by 1 millisecond making asynch.
        });
    }

    update() {
        // calculates new state
        let newstate = { ...this._state, ...this.nextState || {} };
        // notifies the change status
        this.onChangeState( this._state, newstate, this.nextState );
        // changes the component state
        this._state = newstate;
        this.nextState = {};

        // redraws
        pthis._callDraw( this );

        // notifies all subscribers
    }

    copy( dest )
    {
        // return Object.getPrototypeOf(this);
        // dest = dest || Object.create( Object.getPrototypeOf(this) );
        dest = new this.constructor();

        // dest.childrenSeq = [...this.childrenSeq.map( (e)=>( e.copy() ))];

        return dest;
    }

    apply(){
        this._applyAttributes( this.nextAttrs || {} );
        
        return pthis._callDraw( this );
    }

    draw() {
        return undefined;
    }
}

function e$() { 
    // return FewNode.empty();
    return new FewEmptyNode();
}

if(typeof exports != "undefined"){
    exports._de = _de;
    exports.assert = assert;
    exports.FewNode = FewNode;    
    exports.FewComponent = FewComponent;
    exports.e$ = e$;
}
else{    
}
