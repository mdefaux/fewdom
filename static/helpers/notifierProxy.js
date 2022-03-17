
if (typeof Proxy == "undefined") {
    throw new Error("This browser doesn't support Proxy");
}

function notifierProxy( obj, parent )
{
    let subs = {};
    let subscribedCallback = false;
    let recursiveCallback = function( )
    {
        if( subscribedCallback )
            subscribedCallback?.( obj );
    }
    let subscribeOnChange = function( callback ) { 
        subscribedCallback = callback 
    }

    // if( obj instanceof Proxy )
    // {
    //     return obj;
    // }

    let proxy = new Proxy( obj, {
        get(target, name, receiver) {
            if( name === "subscribeOnChange" )
                return subscribeOnChange;
            if (!Reflect.has(target, name)) {
                console.log("Getting non-existent property '" + name + "'");
                return undefined;
            }
            if( typeof obj === 'array' )
            {
                console.log( 'array' );
            }
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
                console.log(`Setting non-existent property '${name}', initial value: ${value}`);
                if( typeof value === 'object' )
                {
                    subs[ name ] = notifierProxy( value, this );
                    // return;
                }
            }
            let result = Reflect.set(target, name, value, receiver);
            recursiveCallback();

            return result;
        }
    });

    return proxy;
}
