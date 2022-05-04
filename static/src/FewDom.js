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

/**Virtual node, an element of the virtual dom tree structure.
 * 
 */
class FewNode 
{
    constructor()
    {
    }

    setup( node, id, def )
    {
        this.dom = node;
        this.id = id || node?.id || def?.id;
        this.def = def;

        return this;
    }

    /**Sets the wrapper attributes.
     * 
     * @param {*} attrs 
     */
    setAttrs( attrs )
    {
        if( attrs?.id ) // as a special attrib id is handled separately
            this.id;
            
        this.nextAttrs = attrs; // 
    }

    /**Sets the wrapper attributes.
     * Only changing attributes will be applied.
     * 
     * @param {*} attrs 
     */
    addAttrs( attrs )
    {
        if( this.nextAttrs )
        {
            attrs = {...this.nextAttrs, ...attrs};
        }
        // if( this.attrs )
        // {
        //     attrs = {...this.attrs, ...attrs};
        // }
        this.setAttrs( attrs ); // 
    }

    // static empty() {
    //     var n = new FewNode();
    //     n.setup();
    //     return n;
    // }

    /**Query select an existing DOM element and return a 
     * wrap reference to it.
     * 
     * @param {string} querySelector 
     * @returns FewNode wrapper pointing to selected element
     */
    static select( querySelector )
    {
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
        window.onload = ()=>
        {
            let root= new FewEmptyNode()
            root.setup( document.body );
            root.child( rootComponentClass, attrs );
            root.apply();
        }
    }

    static documentBody( attrs, callback )
    {
        let root = e$();
        window.onload = async ()=>
        {
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
        window.onload = async ()=>
        {
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
     * @returns the new created child tag that can be chained with 
     * its children definition list.
     */
    tag( tagName, attributes )
    {
        // let id = ( attributes && attributes.id ); // 
        let virtualNode  = new FewNode();
        virtualNode.tagName = tagName;
  
        this.child( virtualNode, attributes );

        return virtualNode;
    }
  
    /**Creates or modify a tag element children of this node element.
     * 
     * @example 
        tag( 'div', {} )
            .label$( { title: 'First child' } )
            .label$( { title: 'Second child' } )
        .$div()
     * However this method is generally not used directly but with 
     * method shortcuts:
     * @example 
        div( {} )
            .label$( { title: 'First child' } )
            .label$( { title: 'Second child' } )
        .$div()
     * 
     * @param {*} tagName - name of the element tag
     * @param {*} attributes - attributes of the element
     * @returns the new created child tag that can be chained with 
     * its children definition list.
     */
    tagOpen( tagName, attributes )
    {
      let t = this.tag( tagName, attributes );
  
      // TODO: adds all closure mehods and checks if closure name match opening
      // closure tag returns to the component parent (actually 'this' component).
      t[`$${tagName}`] = () => (this);  
      return t;
    }
  
    tagVoid( tagName, attributes )
    {
      this.tag( tagName, attributes );  
      // the 'void' tag returns this component and not the created child.
      return this;
    }
  
    /**Adds a child or a set of children to current node. This method is 
     * self-colosing and should be followed-chained with brother nodes.
     * @example 
        div( {} )
            .child$( FirstChildComponentClass, { title: 'First child' } )
            .child$( SecondChildComponentClass, { title: 'Second child' } )
        .$div()
     * 
     * It accepts an array as parameter:
     * @example 
        div( {} )
            .child$( 
                myArray.map( arrayElement => (
                    e$().ul$( { inner: arrayElement } ) 
                ) ) 
            )
        .$div()
     * 
     * child$ method accept undefined or null childObject parameters: in this
     * case it will no affects the children sequence.  This can be useful for
     * conditional sub tree structures:
     * @example e$().child$( isVisible && e$().span$( { inner: 'visibile' } ) )
     * 
     * @param {*} childObject 
     * @param {*} attributes 
     * @param {*} inner 
     * @returns current node
     */
    child$( childObject, attributes, argvalue, argIndex )
    {
        if( !childObject )
            return this;

        if( Array.isArray( childObject ) )
        {
            childObject.forEach( (c) => { this.child$( c, attributes, argvalue, argIndex ); });
            return this;
        }
        else if( childObject instanceof FewEmptyNode )
        {
            // childObject.childrenSeq.forEach( (c) => { this.child$( c, attributes, inner ); })
            
            // this.child$( childObject.map( (c) => { this.child$( c, attributes, inner ); });

            this.child$( childObject.getNodes(), attributes, argvalue, argIndex );
            return this;
        }

        this.child( childObject, attributes, argvalue, argIndex );
  
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
            nodes.forEach( (el, argIndex) => {
                this.child( el, el.nextAttrs/*, argvalue, argIndex */ );
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
                    this.child( e, e.nextAttrs, el, index );
                } )
            }
            e.$repeat = () => (this);
            return e;
        }

        e.$repeat = () => {

            arrayOrFunction?.forEach( (el,index) => {
                this.child( e.copy()/*.getNode()*/, /*e.getNode().nextAttrs*/false, 
                    /* false inner? ,*/ el /* adds argument */, index );
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
  
  
    /**Applies the attribute change to dom of current node.
     * 
     * @param {*} attribs 
     */
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

    /**Adds a child to this node. It accepts various type as 
     * child definition such a component class or a virtual node,
     * and even a function. It returns always a node wrapping the
     * new child. The child node is appended to array of children
     * of current node, that will be 'applied' later to effective
     * dom element.
     * 
     * @param {*} childDefinition could be one of:
     *  - another node, 
     *  - a sub class of Component, 
     *  - a function
     * @param {*} attrs attributes to aply to new child
     * @param {*} argvalue 
     * @param {*} argIndex 
     * @returns the new child node
     */
    child( childDefinition, attrs, argvalue, argIndex ){
        _de&&assert( childDefinition );
        if( !this.childrenSeq )
            this.childrenSeq = [];

        // setups child identifiers
        // id is determined in attributes
        let id = attrs?.id;
        // type could be the class name of a component or the name of he html tag
        let typeName = childDefinition.name || childDefinition.typeName
            || childDefinition.tagName || attrs?.typeName
            || typeof childDefinition;
        // key is used to index this child among brothers
        // notice: keys starting with fewd.anonymousCharId char
        // (by default '*') are not considered and will be redefined
        let key = attrs?.key 
            || (childDefinition.key?.[0] !== fewd.anonymousCharId && childDefinition.key) || id;

        // since key is mandatory unique, if not defined by attrs or id 
        // defines by counting children with same type
        if( !key )
        {
            let count = this.childrenSeq.reduce( 
                (cnt, prev) => ((prev.typeName||prev.tagName) === typeName? cnt+1 : cnt ),
                0 );
            // creates an unique id with prefix char that tells that this key was
            // generated automatically and should be redefined when moved to another level
            key = `${fewd.anonymousCharId}${typeName}#${count}`;
        }
        else {
            // key must be unique among brothers
            if( this.childrenSeq.find( (prev)=> prev.key === key ) )
                throw new Error( `Duplicate key '${key}' at '${this.key}'. ` );
        }

        // finds the node in children map by key
        let virtualNode = false && this.children?.[ id ];

        if( !virtualNode )
        {
            // checks if definition is a class
            if( childDefinition.name && childDefinition.constructor )
            {
                // instantiate the new component
                virtualNode = new childDefinition();
                // checks if it is an instance of subclass of Component, as required
                if( ! childDefinition instanceof FewComponent )
                {
                    throw new Error( `Child '${key}' is a Class but is not a component.` );
                }
                virtualNode.typeName = childDefinition.name;
            }
            else if( childDefinition instanceof FewEmptyNode )
            {
                virtualNode = childDefinition; // .getNode();
                // virtualNode = childDefinition.getNode();
                // if( !virtualNode )
                //     return;
                // attrs = virtualNode.nextAttrs;
            }
            else if( typeof childDefinition === 'function' )
            {
                // creates a wrapper componet that will 
                // call the function when told to redraw
                virtualNode = new FewFunctionNode();
                virtualNode.f = childDefinition;
            }
            else if( typeof childDefinition === 'string' )
            {
                // TODO: handle string case: creates a wrapper 
                // that will parse the string when applied
                virtualNode = new FewNode();
                virtualNode.setup( false, id, childDefinition );
            }
            else if( childDefinition instanceof FewNode )
            {
                virtualNode = childDefinition;
            }
            else
            {
                throw new Error( `Child '${key}' is instance of unsupported type '${typeof childDefinition}'.` );
            }
        }
        
        if( attrs?.key )
        {
            delete attrs.key;
        }
        // if attrs are not defined, leave the virtual node nextAttr (as probabily were defined before)
        if( attrs )
            virtualNode.addAttrs( attrs );
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

    buildNodes( incomingNode )
    {
        return [this];
    }

    moveToParent( parent, offsetIndex )
    {
        _de&&assert( this.dom );
        _de&&assert( parent?.dom );
        _de&&assert( offsetIndex !== undefined );
        _de&&assert( !isNaN(offsetIndex) );

        // gets element at current position
        let nextDom = parent.dom.childNodes[ offsetIndex ];

        // inserts new dom if there are next
        if( nextDom )
            nextDom.before( this.dom )
        else 
            parent.dom.appendChild( this.dom );

        this.index = offsetIndex;
    }

    apply( incomingNode, parent, offsetIndex )
    {
        _de&&assert( parent?.dom );
        _de&&assert( offsetIndex !== undefined );
        _de&&assert( !isNaN(offsetIndex) );
        // creates if not exists
        if( !this.dom )
        {
            if( this.tagName )
                this.dom = document.createElement( this.tagName );
            else if( this.xml )
                this.dom = FewNode.create( this.xml );
                
            this.moveToParent( parent, offsetIndex );
        }
        // if existing, checks if should be moved from its parent to another
        else if( /*parent?.dom &&*/ this.dom.parentNode !== parent.dom )
        {
            this.moved = true;
            this.moveToParent( parent, offsetIndex );
        }
        else if( this.index > offsetIndex )
        {
            // TODO: 
            // this.moveToParent( parent, offsetIndex );
        }

        _de&&assert( this.dom );

        let nextAttrs = incomingNode?.nextAttrs || this.nextAttrs;
        // argvalue = argvalue || this.argvalue;
        // argIndex = argIndex || this.argIndex;
        if( typeof nextAttrs === 'function' )
        {
            nextAttrs = nextAttrs( this.argvalue, this.argIndex );
        }

        // changes attributes
        this._applyAttributes( nextAttrs || {} );

        // applies virtual dom modifications to children, taking this as a parent
        this.applyChildren( incomingNode, this, 0 );

        return offsetIndex + 1;
    }

    /**Applies virtual dom modifications to children of a given parent.
     * First will remove children no more existing
     * 
     * @param {*} incomingNode the virtual node that contains new attribs and structure
     * @param {*} parent of children nodes
     * @param {*} offsetIndex 
     * @returns 
     */
    applyChildren( incomingNode, parent, offsetIndex )
    {
        // removes children no longer present in incoming node
        this.applyRemoveDom(incomingNode, parent);


        // let childrenSeq = Object.entries( this.children || {} )
        //     .sort( ([,a], [,b] ) => (a.index - b.index))
        //     .map( ([key,child] ) => (child));

        let incoming = incomingNode? incomingNode.childrenSeq : this.childrenSeq;

        // checks if there are no children: exits immediately
        if( !incoming )
            return offsetIndex; // this.dom;

        let incomingChildren = incoming.reduce( (ic, next) => (
            // next instanceof FewEmptyNode ?

            // this.children?.[ next.key ] && next instanceof FewComponent ?
            //     [...ic, ...this.children[ next.key ].buildNodes( next ) ] 
            //     :
            //     [...ic, ...next.buildNodes() ] // this, ic.length ) ]
                // :

            [...ic, next]
        ), [] );
        
        
        // removes children no longer present in incoming node
        // this.applyRemoveDom(incomingNode, parent);

        let index = offsetIndex || 0;
        this.children = incomingChildren.reduce( (idMap, ch /*, index*/) => {

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
                index = this.children[ ch.key ].apply( ch, parent, index );
                return {...idMap, [ch.key]: this.children[ ch.key ] };
            }

            // this case should never happen
            // if( nextChild?.tagName === ch.tagName && !ch.key && !nextChild.key )
            // {
            //     nextChild.apply( ch );
            //     return {...idMap, [ch.key]: nextChild };
            // }

            // creates a new dom tree
            index = ch.apply( false, parent, index );

            return {...idMap, [ch.key]: ch };
        }, {} );

        return index + 1;
    }

    applyRemoveDom(incomingNode, parent)
    {
        if (!incomingNode || !this.children)
            return;

        Object.entries(this.children)
            .filter( ([k,]) => (!incomingNode.childrenSeq?.find((i) => (i.key === k))) )
            .forEach( ([k, n]) => 
            {
                _de && assert(n.dom);
                if( !n.moved )
                    parent.dom.removeChild(n.dom);
                else 
                    delete n.moved;
                delete this.children[k];
            });
    }

    getNodes()
    {
        return !this.childrenSeq ? [] : this.childrenSeq.reduce( (ic, next) => (
            next instanceof FewEmptyNode ?
                [...ic, ...next.getNodes() ] 
                :
                [...ic, next]
        ), [] );
    }
}

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

    apply( incomingNode, parent, offsetIndex )
    {
        if( !parent && this.dom )
        {
            parent = this;
        }

        return this.applyChildren( incomingNode, parent, offsetIndex );
    }

    copy( dest )
    {
        dest = new FewEmptyNode();
        // dest.typeName = this.typeName;

        super.copy( dest )

        return dest;
    }    
}

// this.tagOpen( t, attribs, inner ); } 
//             this[`${t}$`] = function( attribs, inner ){ return this.tagVoid( t, attribs, inner ); } 
// https://stackoverflow.com/questions/32496825/proper-way-to-dynamically-add-functions-to-es6-classes
["div", "input", "label", "span", "form", "textarea", "img", "a", 
    "button", "select", "option", "ul", "ol", "li", "i",
    "canvas"].forEach((tagName) => {
    FewNode.prototype[tagName] = function (attribs, inner) {
      return this.tagOpen( tagName, attribs, inner );
    }
    FewNode.prototype[`${tagName}$`] = function (attribs, inner) {
      return this.tagVoid( tagName, attribs, inner );
    }
  });

const pthis = 
{
    _callDraw( _this )
    {
        let drawNode = _this.draw(); // _this.fnode );

        _de&&assert( drawNode );

        // TODO: checks Node closure and cardinality
        if( ! (drawNode instanceof FewEmptyNode) ) //  drawNode.getNode?.() )
        {
            if( drawNode.$div() )
            {
                throw new Error( `Missing closing $div() at ${_this.typeName}.` );
            }
        }

        _de&&assert( drawNode instanceof FewEmptyNode ); // drawNode.getNode?.() );
        // _de&&assert( drawNode.childrenSeq[0] );

        return drawNode;
    }
}

class FewComponent extends FewNode 
{
    constructor()
    {
        super();
        this._state = {};
    }

    /**Returns a proxy for the state of this component. 
     * 
     */
    get state() 
    {
        if( !this.stateProxy )
        {
            this.stateProxy = new Proxy( this, {
                get(target, name, receiver) {
                    let value = Reflect.get(target._state, name, receiver);
                    return value;
                },
                set(target, name, value, receiver) 
                {
                    target.setState( {[name]: value } );
                    return true;
                }
            });
        }
        return this.stateProxy;
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

    setState( newstate )
    {
        this.nextState = {...this.nextState || {},...newstate };
        clearTimeout( this._stateChangeTimeout );

        return new Promise( ( resolve, reject ) => {
            // TODO: store resolve callbacks in an array
            this._stateChangeTimeout = setTimeout( () => {
                // if( this.stateChanged ) // if component is still to be updated...
                this.update();            // updates.
                resolve();                 // resolves the promise
            }, 1 );                    // delays the updating by 1 millisecond making asynch.
        });
    }

    update()
    {
        // calculates new state
        let newstate = { ...this._state, ...this.nextState || {} };
        // notifies the change status
        this.onChangeState( this._state, newstate, this.nextState );
        // changes the component state
        this._state = newstate;
        this.nextState = {};

        // redraws ******************
        // let drawNode = pthis._callDraw( this );

        // notifies all subscribers
        
        // this.index = this.virtualNode.apply( drawNode, this.parent, this.index );
        // this.index = this.virtualNode.apply( false, this.parent, this.index );
        this.index = this.apply( false, this.parent, this.index );

        // TODO: afterChangeState( oldState )
    }

    copy( dest )
    {
        dest = new this.constructor();
        dest.typeName = this.typeName;

        super.copy( dest )

        return dest;
    }

    buildNodes( incomingNode )
    {
        let nextAttrs = incomingNode?.nextAttrs || this.nextAttrs || this.attrs || {};
        if( typeof nextAttrs === 'function' )
        {
            nextAttrs = nextAttrs( this.argvalue, this.argIndex );
        }
        // if( newDef?.childrenSeq?.length > 0 )
        // {
        //     this.newChildrenSeq = newDef.childrenSeq;
        // }

        // changes attributes
        this._applyAttributes( nextAttrs );
        if( !this.virtualNode )
        {
            this.onInit();
        }
        
        // **************
        // this.incomingVirtual = pthis._callDraw( this );

        return [this]; // rootDom;
    }

    apply( newDef, parent, index )
    {
        this.parent = parent;
        this.index = index;
        
        let nextAttrs = newDef?.nextAttrs || this.nextAttrs || {};
        if( typeof nextAttrs === 'function' )
        {
            nextAttrs = nextAttrs( this.argvalue, this.argIndex );
        }
        // TODO: handle children sequence!
        // if( newDef?.childrenSeq?.length > 0 )
        // {
        //     this.newChildrenSeq = newDef.childrenSeq;
        // }

        // changes attributes
        this._applyAttributes( nextAttrs );

        
        if( !this.virtualNode )
        {
            this.onInit();
        }
        this.incomingVirtual = pthis._callDraw( this );
        if( !this.virtualNode )
        {
            this.virtualNode = this.incomingVirtual; // .getNode();
            index = this.virtualNode.apply( false, parent, index );
            
            this.onCreate();
        }
        else
        {
            // this.incomingVirtual = pthis._callDraw( this );
            
            index = this.virtualNode.apply( this.incomingVirtual, parent, index );
        }

        // this.onCreate();

        return index;
    }

    innerRef()
    {
        return this.newChildrenSeq || this.childrenSeq;
    }

    draw() {
        return undefined;
    }
}

class FewFunctionNode extends FewComponent
{
    draw()
    {
        // if( !this._f_state )
        // {
        //     this._f_state = {};
        // }
        return this.f( this.nextAttrs || this.attrs || {}, this.state, this.childrenSeq );
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
                    let c = this.child( clazz, attribs );
                    c[ `$${classname}` ] = ()=>(this);
                    return c;
                }
                FewNode.prototype[`${classname}$`] = function (attribs, inner) {
                    return this.child$( clazz, attribs );
                }
            }
            else if( typeof value === 'function' )
            {
                let f = value;
                
                FewNode.prototype[name] = function (attribs)
                {
                    if( !f.name && !attribs?.typeName )
                    {
                        attribs = {...attribs, typeName: name };
                    }
                    let c = this.child( f/*( attribs, inner )*/, attribs );
                    // let c = this.child$( f, attribs, inner );
                    c[ `$${name}` ] = ()=>(this);
                    return c;
                }
                FewNode.prototype[`${name}$`] = function (attribs) {
                    if( !f.name && !attribs?.typeName )
                    {
                        attribs = {...attribs, typeName: name };
                    }
                    return this.child$( f, attribs );
                }

            }
            else if( typeof value === 'object' )
            {
            }
            return Reflect.set(target, name, value, receiver);
        }
    }),
    FewComponent: FewComponent,
    e$() 
    {
        return new FewEmptyNode();
    },

    
    anonymousCharId: '*'
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
    return new FewEmptyNode();
}

if(typeof exports != "undefined"){
    exports._de = _de;
    exports.assert = assert;
    exports.FewNode = FewNode;    
    exports.FewComponent = FewComponent;
    exports.fewd = fewd;
    exports.e$ = e$;
}
else{    
}
