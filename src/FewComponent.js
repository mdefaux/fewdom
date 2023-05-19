
const { _de, assert } = require( './deassert' );
// const FewEmptyNode = require('./FewEmptyNode');
const {FewNode, FewEmptyNode} = require('./FewNode');
const FewFactory = require('./FewFactory');
const SetHelper = require('./SetHelper');

const pthis = 
{
    _callDraw( _this )
    {
        let drawNode = _this.draw(); // _this.fnode );

        _de&&assert( drawNode );

        // TODO: checks Node closure and cardinality
        if( ! (drawNode instanceof FewEmptyNode) ) //  drawNode.getNode?.() )
        {
            if( drawNode.$div )
            {
                throw new Error( `Missing closing $div() at ${_this.typeName}.` );
            }
        }

        _de&&assert( drawNode instanceof FewEmptyNode ); // drawNode.getNode?.() );
        // _de&&assert( drawNode.childrenSeq[0] );

        return drawNode;
    }
}

/**Component of virtual nodes
 * 
 */
class Component extends FewNode 
{
    /**The state of the component
     * 
     */
    #private_state;

    /**c'tor setups the initial empty state
     * 
     */
    constructor()
    {
        super();
        this.#private_state= { state: {}, proxy: undefined };
        // this.#private_state = {}
    }

    /**Returns a proxy for the state of this component. 
     * 
     */
    get state() 
    {
        let setState = (u)=> (this.setState( u ))
        if( !this.#private_state.proxy )
        {
            this.#private_state.proxy = new Proxy( this.#private_state, {
            // return new Proxy( this.#private_state, {
                get(target, name, receiver) {
                    let value = Reflect.get(target.state, name, receiver);
                    return value;
                },
                set(target, name, value) 
                {
                    // target.setState( {[name]: value } );
                    setState( {[name]: value } );
                    return true;
                }
            });
        }
        return this.#private_state.proxy;
        // return this.stateProxy;
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
        oldAttrs;
        newAttrs;
        differences;
        return true;
    }

    onChangeState( oldState, newState, differences )
    {
        oldState;
        newState;
        differences;
        return true;
    }
    
    _applyAttributes ( attribs )
    {
        let differences = SetHelper.deepDifference( this.attrs, attribs, 1 );
        this.onChangeAttrs( this.attrs, attribs, differences );
        this.attrs = attribs;
    }

    setState( newstate )
    {
        this.nextState = {...this.nextState || {},...newstate };
        clearTimeout( this._stateChangeTimeout );

        return new Promise( ( resolve/*, reject*/ ) => {
            // TODO: store resolve callbacks in an array
            this._stateChangeTimeout = setTimeout( () => {
                // if( this.stateChanged ) // if component is still to be updated...
                this.applyUpdate();            // updates.
                resolve();                 // resolves the promise
            }, 1 );                    // delays the updating by 1 millisecond making asynch.
        });
    }

    update() {
        clearTimeout( this._stateChangeTimeout );
        this._stateChangeTimeout = setTimeout( () => {
            // if( this.stateChanged ) // if component is still to be updated...
            this.applyUpdate();         // updates.
        }, 1 );                    // delays the updating by 1 millisecond making asynch.
    }

    applyUpdate() {
        if( this.removed )
        {
            return;
        }
        // calculates new state
        let newstate = { ...this.#private_state.state, ...this.nextState || {} };
        // notifies the change status
        this.onChangeState( this.#private_state.state, newstate, this.nextState );
        // changes the component state
        this.#private_state.state = newstate;
        // delete this.#private_state.proxy; // = undefined;
        this.nextState = {};

        // redraws ******************
        // let drawNode = pthis._callDraw( this );

        // notifies all subscribers
        // TODO: this.updateSubscribers?.forEach( (c) => (c()) );
        // this.updateSubscribers = [];
        
        try {

            // this.index = this.virtualNode.apply( drawNode, this.parent, this.index );
            // this.index = this.virtualNode.apply( false, this.parent, this.index );
            this.index = this.apply( false, this.parent, this.index );
        }
        catch ( err ) {

            if ( err instanceof fewd.Exception ){
                // err.add( this );
                console.error( err.message );
                console.error( 'Stack', err.log() );
            }
            else {
                console.error( err );
                throw err;
            }
        }

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
        
        let nextAttrs = newDef?.nextAttrs || this.nextAttrs || {}; // || this.attrs;
        if( typeof nextAttrs === 'function' )
        {
            nextAttrs = nextAttrs( this.argvalue, this.argIndex );
        }
        // TODO: handle children sequence!
        if( newDef?.childrenSeq?.length > 0 )
        {
            // this.newChildrenSeq = newDef.childrenSeq;
            this.childrenSeq = newDef.childrenSeq;
        }

        // changes attributes, if requested, then resets change request
        if( !this.attrs || (nextAttrs && Object.keys( nextAttrs ).length > 0) )
            this._applyAttributes( nextAttrs );
        this.nextAttrs = false;

        
        if( !this.virtualNode ) {
            this.onInit();
        }
        if ( typeof this.attrs.beforeApply === 'function' ){ 
            this.attrs.beforeApply( this, {...this.state} );
        }
            // nextAttrs.debug( nextAttrs ) : nextAttrs.debug;
        try {
            this.incomingVirtual = pthis._callDraw( this );
            if( !this.virtualNode ) {
                this.virtualNode = this.incomingVirtual; // .getNode();
                index = this.virtualNode.apply( false, parent, index );
                
                this.onCreate();
            }
            else {
                // this.incomingVirtual = pthis._callDraw( this );
                
                index = this.virtualNode.apply( this.incomingVirtual, parent, index );
            }
        }
        catch ( err ) {

            if ( err instanceof fewd.Exception ) {
                err.add( this );
                throw err;
            }
            else {
                let newExc = new fewd.Exception();
                newExc.message = err.message;
                newExc.add( this );
                throw newExc;
            }
        }
        if ( typeof this.attrs.afterApply === 'function' ){ 
            this.attrs.afterApply( this, {...this.state} );
        }
        
        nextAttrs = this.attrs;

        if( typeof nextAttrs?.ref === 'function' ) {
            nextAttrs.ref( this );
        }

        let debugTrigger = typeof nextAttrs.debug === 'function' ? 
            nextAttrs.debug( nextAttrs ) : nextAttrs.debug;
        if ( debugTrigger === 'exception' ) {
            let ex = new fewd.Exception();
            ex.add( this );
            throw ex;
        }
        else if ( debugTrigger === 'trace' ) {
            console.log( 'trace on' );
        }
        
        let logTrigger = typeof nextAttrs.log === 'function' ? nextAttrs.log( nextAttrs, {...this.#private_state.state } ) : 
            nextAttrs.log === true ? {key: this.key, attrs: nextAttrs, state: {...this.#private_state.state } } :
                nextAttrs.log;
        if( logTrigger )
        {
            console.log( logTrigger );
        }

        // this.onCreate();

        return index;
    }

    removeDomFrom( parent ) {
        this.virtualNode.removeDomFrom( parent );
        this.removed = true;
        this.onRemove?.();
    }

    innerRef() {
        return this.newChildrenSeq || this.childrenSeq;
    }

    draw() {
        return undefined;
    }
}

FewFactory.types.Component = Component;

module.exports = Component;