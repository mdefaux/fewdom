
const FewFactory = {

    types: {
        FewFunctionNode: undefined,
    
        Component: undefined,
        
        Exception: class Exception extends Error {

            add( comp )
            {
                if ( !this.fewdStackTrace )
                {
                    this.fewdStackTrace = [];
                }
                this.fewdStackTrace.push( comp );
            }

            log()
            {
                return this.fewdStackTrace ? 
                    this.fewdStackTrace.map( (e)=> ({
                        key: e.key,
                        attrs: e.attrs,
                        // state: {...e.state.#private_state}
                    })) : [];
            }
        },
    },

    create( /*type*/ ) {
        return undefined;
    },

    
    
    anonymousCharId: '*',

    checkDebugStep: function ( element, eventTriggeredName, args ) {

        if ( element.getAttrs().debugOn === eventTriggeredName ) {
            fewd.onDebug( element, eventTriggeredName, args );
            return true;
        }
        return false;
    },

    onDebug: function ( element, eventTriggeredName, args ) {
        console.warn( `Debug trigger '${eventTriggeredName}' on '${element.key}'.`);
        if ( args ) {
            console.warn( args );
        }
    }
}

module.exports = FewFactory;