
class ObjectPtr {

    constructor( obj )
    {

    }

    addProperty( key, value )
    {

    }



}

if (typeof Proxy == "undefined") {
    throw new Error("This browser doesn't support Proxy");
}

function notifierProxy( obj, parent )
{
    let subs = {};
    let subscribedCallback = false;
    let recursiveCallback = function( )
    {
        subscribedCallback?.( obj );
    }
    let subscribeOnChange = function( callback ) { 
        subscribedCallback = callback 
    }

    let proxy = new Proxy( obj, {
        get(target, name, receiver) {
            if( name === "subscribeOnChange" )
                return subscribeOnChange;
            if (!Reflect.has(target, name)) {
                console.log("Getting non-existent property '" + name + "'");
                return undefined;
            }
            return Reflect.get(target, name, receiver);
        },
        set(target, name, value, receiver) {
            if (!Reflect.has(target, name)) {
                console.log(`Setting non-existent property '${name}', initial value: ${value}`);
                if( typeof value === 'object' )
                {
                    subs[ name ] = notifierProxy( value, this );
                    return;
                }
            }
            let result = Reflect.set(target, name, value, receiver);
            recursiveCallback();

            return result;
        }
    });

    return proxy;
}