
if (typeof Proxy == "undefined") {
    throw new Error("This browser doesn't support Proxy");
}

function notifierProxy( obj, parent )
{
    let subs = {};
    let subscribedCallback = false;
    let fireNotify = function( )
    {
        if( subscribedCallback )
            subscribedCallback?.( obj );
    }
    let recursiveCallback = function( )
    {
        fireNotify();
        // TODO: recursively call downwards if any subs
        // parent.recursiveCallback()
    }
    let subscribeOnChange = function( callback ) { 
        subscribedCallback = callback 
    }
    let unsubscribe = function( name ) { 
        // subscribedCallback = callback 
    }
    let transferDelegate = function( value, oldParent )
    {
        let otherProxy = notifierProxy( value, oldParent )
        otherProxy.subscribeOnChange( subscribedCallback );

        // Object.entries( subs ).map( 
        //     ( [key,s]) => ([key, s.transferDelegate( value[key], this ) ] ) );

        // otherProxy.fireNotify();
        return otherProxy;
    }

    // if( typeof obj === 'object' && obj instanceof Proxy )
    // {
    //     return obj;
    // }

    let proxy = new Proxy( obj, {
        get(target, name, receiver) {
            if( name === "subscribeOnChange" )
                return subscribeOnChange;
            if( name === "unsubscribe" )
                return unsubscribe;
            if( name === "transferDelegate" )
                return transferDelegate;
            if( name === "fireNotify" )
                return fireNotify;

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
            if( typeof value === 'object' )
            {
                return subs[ name ] = notifierProxy( value, this );
            }
            return value;
        },
        set(target, name, value, receiver) {
            if (!Reflect.has(target, name)) {
                // console.log(`Setting non-existent property '${name}', initial value: ${value}`);
                if( typeof value === 'object' )
                {
                    subs[ name ] = notifierProxy( value, this );
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
                    Object.entries( value ).map( ([key,v]) => ( [ key, Object.assign({}, v) ] ) )
                );
            }
            let result = Reflect.set(target, name, value, receiver);
            if( subs[ name ] )
            {
                subs[ name ] = subs[ name ].transferDelegate( value, this );
                subs[ name ].fireNotify();
            }
            recursiveCallback();

            return result;
        }
    });

    return proxy;
}
