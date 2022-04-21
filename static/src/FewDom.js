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
                return {...p, [key]: undefined }; // property cancellation
            // checks recursiverly: if false, there are no deep differences
            let recursive = SetHelper.deepDifference( val, b[key], maxDepth-1 );
            return typeof recursive === "object" && 
                Object.keys(recursive).length === 0 ? 
                    p : {...p, [key]: recursive};
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
        this.nextAttrs = attrs; // SetHelper.deepDifference( this.attrs, attrs || {} );
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
        var n = typeof querySelector === 'string' ?
            document.querySelector(querySelector) : querySelector;
        
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

    static documentBody( attrs, callback )
    {
        let root = e$();
        window.onload = async ()=>{
            if( callback && typeof callback === 'function' )
                await callback();
            root.setup( document.body );
            root.setAttrs( attrs );
            root.apply();
        }
        return root;
    }

    static onLoad( callback )
    {
        let root = e$();
        window.onload = async ()=>{
            root.setup( document.body );
            if( callback && typeof callback === 'function' )
                await callback( root );
            root.apply();
        }
        return root;
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
        //   let tagId = (`${tagName}-${this.childrenSeq.length}`);
        let virtualNode  = new FewNode();
        // virtualNode.setup( false, id, tagName );
        virtualNode.tagName = tagName;
  
        if( inner !== undefined && inner !== this.inner ) // virtualNode.$.innerHTML )
        {
            virtualNode.nextInner = inner;
        }
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
      // the 'void' tag returns the component parent (actually 'this' component).
      return this;
    }
  
    /**Adds a child to current node
     * child$ method accept undefined or null childObject parameters
     * 
     * @param {*} childObject 
     * @param {*} attributes 
     * @param {*} inner 
     * @returns 
     */
    child$( childObject, attributes, inner )
    {
        if( !childObject )
            return this;

        if( Array.isArray( childObject) )
        {
            childObject.forEach( (c) => { this.child$( c, attributes, inner ); });
            return this;
        }
        else if( childObject instanceof FewEmptyNode )
        {
            // childObject.childrenSeq.forEach( (c) => { this.child$( c, attributes, inner ); })
        }

        this.child( childObject, attributes, inner );
  
        // closure tag returns to the component parent (actually 'this' component).
        return this;
    }
    

    repeat$( arrayOrFunction )
    {
        let nodes;
        if( typeof arrayOrFunction === 'function' )
        {
            nodes = arrayOrFunction();
        }
        else if( Array.isArray(arrayOrFunction) )
        {
            nodes = arrayOrFunction;
        }

        if( Array.isArray( nodes ) )
        {
            nodes.forEach( (el) => {
                this.child( el, el.nextAttrs );
            } )
        }
        // let e = e$();

        // e.parent = this;
        // e.deferredCallback = (nodeCallback)=>{
        //     arrayOrFunction.forEach( (el,index) => nodeCallback(el, index) )
        // }
        return this;
    }

    repeat( arrayOrFunction )
    {
        let e = e$();
        e.parent = this;

        if( typeof arrayOrFunction === 'function' )
        {
            let node = arrayOrFunction();
            if( Array.isArray( nodes ) )
            {
                node.forEach( (el, index) => {
                    this.child( e, e.nextAttrs );
                } )
            }
            e.$repeat = () => (this);
            return e;
        }

        e.$repeat = () => {

            arrayOrFunction?.forEach( (el,index) => {
                this.child( e.copy().getNode(), e.getNode().nextAttrs, 
                    false /* inner? */, el /* adds argument */, index );
            } );

            return this;
        };
        return e;
    }

    copy( dest )
    {
        dest = dest || new FewNode();

        dest.tagName = this.tagName;
        dest.nextAttrs = this.nextAttrs;
        if( this.childrenSeq )
            dest.childrenSeq = [...this.childrenSeq.map( (e)=>( e.copy() ))];

        return dest;
    }
  
  
    // Array.prototype.forEach.call( ["source", "meta", "param", "track", "input", "br", "img", "div"], 
    // (t) => { this[t] = function( attribs, inner ){ return this.tag( t, attribs, inner ); } } );
  
    _applyAttributes ( attribs )
    {
        _de&&assert( attribs );
        _de&&assert( this.dom );
        let diffAttribs = SetHelper.deepDifference( this.attrs, attribs );

        Object.entries( diffAttribs ).forEach( ([name,value]) => {
            // special attributes
            if( name === "render" )
            {
                value( this );        // executes immediatly the render function
                return;
            }

            if( name === "ref" )
            {
                if( typeof value === 'function' )
                {
                    value( this );
                    return;
                }
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

            if( name === "style" && typeof value === "object")
            {
                //   this.dom.style = value;
                Object.entries( value ).forEach( ([styleKey,styleValue]) => {
                    this.dom.style[styleKey] = styleValue;
                });
                return;
            }

            if( name === "inner" )
            {
                if(/* value !== undefined &&*/ value !== this.dom.innerHTML )
                {
                    this.dom.innerHTML = value;
                }
                return;
            }
            
            if( name === "enabled" )
                if( value )
                {
                    this.dom.removeAttribute( "disabled" );
                }
                else 
                {
                    this.dom.setAttribute( "disabled", value );
                }

            if( value === undefined )
            {
                this.dom.removeAttribute( name );
            }
            else 
            {
                this.dom.setAttribute(name, value);
            }
        });

        this.attrs = attribs;
    }

    child( ChildClass, attrs, inner, argvalue, argIndex ){
        _de&&assert( ChildClass );
        if( !this.childrenSeq )
            this.childrenSeq = [];

        // setups child identifiers
        let id = attrs?.id;
        let typeName = ChildClass.name || ChildClass.typeName || ChildClass.tagName || typeof ChildClass;
        let key = attrs?.key || id;

        // since key is mandatory unique, if not defined by attrs or id 
        // defines by counting children with same type
        if( !key ) {
            let count = this.childrenSeq.reduce( 
                (cnt, prev) => ((prev.typeName||prev.tagName) === typeName? cnt+1 : cnt ),
                0 );
            key = `${typeName}#${count}`;
        }
        else {
            if( this.childrenSeq.find( (prev)=> prev.key === key ) )
                throw new Error( `Duplicate key '${key}' at '${this.key}'. ` );
        }

        // finds the node in children map by key
        let virtualNode = false && this.children?.[ id ];

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
                virtualNode.typeName = ChildClass.name;
            }
            else if( ChildClass instanceof FewEmptyNode )
            {
                virtualNode = ChildClass.getNode();
                attrs = virtualNode.nextAttrs;
            }
            else if( typeof ChildClass === 'function' )
            {
                virtualNode = new FewEmptyNode();
                virtualNode.f = ChildClass;
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
        
        if( attrs?.key )
        {
            delete attrs.key;
        }
        virtualNode.setAttrs( attrs );
        virtualNode.key = key;
        virtualNode.typeName = typeName;

        argvalue = argvalue || this.argvalue;
        argIndex = argIndex || this.argIndex;
        if( argvalue || argIndex )
        {
            virtualNode.argvalue = argvalue;
            virtualNode.argIndex = argIndex;            
        }

        this.childrenSeq.push( virtualNode );

        return virtualNode;
    }

    
    replace( ChildClass, attrs ){
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

        let nextAttrs = incomingNode?.nextAttrs || this.nextAttrs;
        // argvalue = argvalue || this.argvalue;
        // argIndex = argIndex || this.argIndex;
        if( typeof nextAttrs === 'function' )
        {
            nextAttrs = nextAttrs( this.argvalue, this.argIndex );
        }

        // changes attributes
        this._applyAttributes( nextAttrs || {} );
        
        // removes children no longer present in incoming node
        if( incomingNode && this.children )
            Object.entries( this.children )
                .filter( ([k,]) => (!incomingNode.childrenSeq.find((i) => (i.key===k))) )
                .forEach( ([k,n]) => {
                    _de&&assert( n.dom );
                    this.dom.removeChild( n.dom );
                    delete this.children[k];
                });
        let childrenSeq = Object.entries( this.children || {} )
            .sort( ([,a], [,b] ) => (a.index - b.index))
            .map( ([key,child] ) => (child));

        let incoming = incomingNode?.childrenSeq || this.childrenSeq;

        if( !incoming )
            return this.dom;

        let incomingChildren = incoming.reduce( (ic, next) => (
            next instanceof FewEmptyNode ?
                [...ic, ...next.getNodes( this ) ] 
                :
                [...ic, next]
        ), [] );

        this.children = incomingChildren.reduce( (idMap, ch, index) => {

            // tries a match
            if( this.children?.[ ch.key ] )
            {
                // if position does not match
                // if( this.children[ ch.key ].index > index )
                if( this.children[ ch.key ].index > index )
                {
                    // moves here
                    // updates index
                    console.log( 'Move' );
                }
                this.children[ ch.key ].apply( ch );
                return {...idMap, [ch.key]: this.children[ ch.key ] };
            }

            // TODO: looks for next dom element
            let nextDom = this.dom.childNodes[ index ];
            let nextChild = childrenSeq[ index ];

            // this case should never happen
            if( nextChild?.tagName === ch.tagName && !ch.key && !nextChild.key )
            {
                nextChild.apply( ch );
                return {...idMap, [ch.key]: nextChild };
            }

            // creates a new dom tree
            let childDom = ch.apply();

            // inserts new dom if there are next
            if( nextDom )
                nextDom.before( childDom )
            else 
                this.dom.appendChild( childDom );

            return {...idMap, [ch.key]: ch };
        }, {} );

        return this.dom;
    }
}

class FewEmptyNode extends FewNode
{
    getNode() 
    {
        return this.childrenSeq[0];
    }

    callF( f, attrs, state )
    {
        let defer = f( attrs, state );

        return defer.childrenSeq;
    }
    
    getNodes( parent )
    {
        if( this.f )
        {
            let state={
            };

            this.childrenSeq =this.callF( this.f, this.nextAttrs, state );

            
            state.update= ()=>{
                let incoming =this.callF( this.f, this.nextAttrs, state );
                this.childrenSeq[0].apply( incoming[0] );
            }
        }
        
        // 
        this.childrenSeq.forEach( (c) => {
            c.key= `${this.key}.${c.key}` 
        });
        return this.childrenSeq;
    }

    copy( dest )
    {
        dest = new FewEmptyNode();
        // dest.typeName = this.typeName;

        super.copy( dest )

        return dest;
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

const pthis = {
    _callDraw( _this ){

        let drawNode = _this.draw( _this.fnode );

        _de&&assert( drawNode );

        if( !drawNode.getNode?.() )
        {
            if( drawNode.$div() )
            {
                throw new Error( `Missing closing $div() at ${_this.typeName}.` );
            }
        }

        _de&&assert( drawNode.getNode?.() );
        // _de&&assert( drawNode.childrenSeq[0] );

        // gets the first root 
        // let compRoot = drawNode.childrenSeq[0];
        
        if( !_this.virtualNode ) {
            _this.virtualNode = drawNode.getNode();
            _this.virtualNode.apply();
            // return this.virtualNode;
        }
        else 
        {
            
            _this.virtualNode.apply( drawNode.getNode() );
        }
        // let newDom = compareWith.apply( this.virtualNode );

        // _this.virtualNode = drawNode.compare( _this.virtualNode );
        _this.dom = _this.virtualNode.dom;

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

    onInit()
    {

    }

    onCreate()
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
        dest = new this.constructor();
        dest.typeName = this.typeName;

        super.copy( dest )

        return dest;
    }

    apply( newDef ){
        let nextAttrs = newDef?.nextAttrs || this.nextAttrs || {};
        if( typeof nextAttrs === 'function' )
        {
            nextAttrs = nextAttrs( this.argvalue, this.argIndex );
        }
        if( newDef?.childrenSeq?.length > 0 )
        {
            this.newChildrenSeq = newDef.childrenSeq;
        }

        // changes attributes
        this._applyAttributes( nextAttrs );

        // this._applyAttributes( newDef?.nextAttrs || this.nextAttrs || {} );

        if( !this.virtualNode )
        {
            this.onInit();
        }
        
        let rootDom = pthis._callDraw( this );

        this.onCreate();

        return rootDom;
    }

    innerRef()
    {
        return this.newChildrenSeq || this.childrenSeq;
    }

    // get dom()
    // {
    //     this.virtualNode.dom;
    // }

    draw() {
        return undefined;
    }
}


const fewd = {
    types: new Proxy( {}, {
        set(target, name, value, receiver) {
            if (Reflect.has(target, name)) 
            {
                throw new Error( `Type '${name}' already defined.` );
            }
            if( Array.isArray( value ) )
            {
                throw new Error( `Type '${name}' cannot be an array. Should be a function or a sub-class of Component.` );
            }
            else if( typeof value === 'function' && value.constructor && value.name )
            {
                let clazz = value;
                let classname = clazz.name;
            
                FewNode.prototype[classname] = function (attribs, inner) {
                    let c = this.child( clazz, attribs, inner );
                    c[ `$${classname}` ] = ()=>(this);
                    return c;
                }
                FewNode.prototype[`${classname}$`] = function (attribs, inner) {
                    return this.child$( clazz, attribs, inner );
                }
            }
            else if( typeof value === 'function' )
            {
                let f = value;
                
                FewNode.prototype[name] = function (attribs, inner) {

                    return this.child( f( attribs, inner ), attribs, inner );
                }
                FewNode.prototype[`${name}$`] = function (attribs, inner) {
                    return this.child$( f, attribs, inner );
                    // let ref = {
                    //     component: undefined
                    // }

                    // ref.update= ( newAttrs ) => {
                    //     ref.component?.apply( f(newAttrs || attribs, inner, ref ).getNode() );
                    // }

                    // ref.component = this.child( f( attribs, inner, ref ), attribs, inner );

                    return this;
                }

            }
            else if( typeof value === 'object' )
            {
            }
            return Reflect.set(target, name, value, receiver);
        }
    })
}

function $( selector )
{
    return FewNode.select( selector );
}

function $dom( xml )
{
    return FewNode.create( xml );
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
