
if (typeof Proxy == "undefined") {
    throw new Error("This browser doesn't support Proxy");
}

function notifierProxy( obj, parent )
{
    let subs = {};
    let subscribedCallback = undefined;
    let subscribedTreeCallback = undefined;
    let fireNotify = function( valueChange )
    {
        if( subscribedCallback )
            subscribedCallback?.( obj, valueChange );
    }
    let recursiveCallback = function( valueChange )
    {
        // recursively calls upwards if any parent
        subscribedTreeCallback?.( obj, valueChange );
        parent?.recursiveCallback( valueChange );
    }
    let subscribeOnChange = function( callback )
    {
        subscribedCallback = callback 
    }
    let unsubscribe = function( name )
    {
        subscribedCallback = false;
    }
    let subscribeOnTreeChange = function( callback )
    {
        subscribedTreeCallback = callback;
    }
    let unsubscribeTreeChange = function( name )
    {
        subscribedTreeCallback = false;
    }
    let transferDelegate = function( value, oldParent )
    {
        let otherProxy = notifierProxy( value, oldParent )
        otherProxy.subscribeOnChange( subscribedCallback );
        otherProxy.subscribeOnTreeChange( subscribedTreeCallback );

        Object.entries( subs ).map( 
            ( [key,s]) => ([key, s.transferDelegate( value[key], this ) ] ) );

        // otherProxy.fireNotify();
        return otherProxy;
    }

    // if( typeof obj === 'object' && obj instanceof Proxy )
    // {
    //     return obj;

    // }
    let ref = {
        _this: this, 
        proxy: undefined
    };

    ref.proxy = new Proxy( obj, {
        get(target, name, receiver) {
            if( name === "subscribeOnChange" )
                return subscribeOnChange;
            if( name === "unsubscribe" )
                return unsubscribe;
            if( name === "subscribeOnTreeChange" )
                return subscribeOnTreeChange;
            if( name === "unsubscribeTreeChange" )
                return unsubscribeTreeChange;
            if( name === "transferDelegate" )
                return transferDelegate;
            if( name === "fireNotify" )
                return fireNotify;
            if( name === "recursiveCallback" )
                return recursiveCallback;
            if( name === "iterable" )
            {
                Object.entries( target ).forEach( ([name,value]) => {
                    if( !subs[ name ] )
                    {
                        subs[ name ] = notifierProxy( value, ref.proxy );
                    }
                })
                return subs;
            }

            if (!Reflect.has(target, name)) {
                // console.log("Getting non-existent property '" + name + "'");
                return undefined;
            }
            // 
            if( subs[ name ] )
            {
                return subs[ name ];
            }
            let value = Reflect.get(target, name, receiver);
            if( value && typeof value === 'object' )
            {
                return subs[ name ] = notifierProxy( value, ref.proxy );
            }
            return value;
        },
        set(target, name, value, receiver) 
        {
            if (!Reflect.has(target, name)) 
            {
                // console.log(`Setting non-existent property '${name}', initial value: ${value}`);
                if( typeof value === 'object' )
                {
                    subs[ name ] = notifierProxy( value, ref.proxy );
                    // return;
                }
            }
            if( Array.isArray( value ) )
            {
                // https://stackoverflow.com/questions/51096547/how-to-get-the-target-of-a-javascript-proxy
                value = value.map( (v) => (  Object.assign({}, v) ) );
            }
            else if( typeof value === 'object' )
            {
                value = Object.fromEntries(
                    Object.entries( value ).map( ([key,v]) => ( [ key, v /*Object.assign({}, v)*/ ] ) )
                );
            }
            let result = Reflect.set(target, name, value, receiver);
            const valueChange = { key: name, value: value };
            if( subs[ name ] )
            {
                subs[ name ] = subs[ name ].transferDelegate( value, ref.proxy );
                subs[ name ].fireNotify( valueChange );
            }
            fireNotify( valueChange );
            recursiveCallback( valueChange );

            return result;
        }
    });

    return ref.proxy;
}
