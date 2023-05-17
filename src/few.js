const FewComponent = require("./FewComponent");
// const FewEmptyNode = require("./FewEmptyNode");
const {FewNode, FewEmptyNode} = require("./FewNode");



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
            
                FewNode.prototype[classname] = function (attribs /*, inner*/) {
                    let c = this.child( clazz, attribs );
                    // TODO: closing tag as a getter to avoid use of ()
                    c[ `$${classname}` ] = ()=>(this);
                    return c;
                }
                FewNode.prototype[`${classname}$`] = function (attribs /*, inner*/) {
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
                    // TODO: closing tag as a getter to avoid use of ()
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

                // TODO:
                // return { [name]: ff, `{name}$`: ff$ };

            }
            else if( typeof value === 'object' )
            {
                throw new Error( 'Unsupported component type.');
            }

            return Reflect.set(target, name, value, receiver);
        }
    }),
    Component: FewComponent,
    e$() 
    {
        return new FewEmptyNode();
    },

    // Exception: class Exception extends Error {

    //     add( comp )
    //     {
    //         if ( !this.fewdStackTrace )
    //         {
    //             this.fewdStackTrace = [];
    //         }
    //         this.fewdStackTrace.push( comp );
    //     }

    //     log()
    //     {
    //         return this.fewdStackTrace ? 
    //             this.fewdStackTrace.map( (e)=> ({
    //                 key: e.key,
    //                 attrs: e.attrs,
    //                 // state: {...e.state.#private_state}
    //             })) : [];
    //     }
    // },
    
    /*
     * MOVED TO FACTORY
     */
    // anonymousCharId: '*',

    // checkDebugStep: function ( element, eventTriggeredName, args ) {

    //     if ( element.getAttrs().debugOn === eventTriggeredName ) {
    //         fewd.onDebug( element, eventTriggeredName, args );
    //         return true;
    //     }
    //     return false;
    // },

    // onDebug: function ( element, eventTriggeredName, args ) {
    //     console.warn( `Debug trigger '${eventTriggeredName}' on '${element.key}'.`);
    //     if ( args ) {
    //         console.warn( args );
    //     }
    // }
};


// this.tagOpen( t, attribs, inner ); } 
//             this[`${t}$`] = function( attribs, inner ){ return this.tagVoid( t, attribs, inner ); } 
// https://stackoverflow.com/questions/32496825/proper-way-to-dynamically-add-functions-to-es6-classes
["div", "input", "label", "span", "form", "textarea", "img", "a", 
    "button", "select", "option", "ul", "ol", "li", "i",
    "canvas", "object"].forEach((tagName) => {
    FewNode.prototype[tagName] = function (attribs, inner) {
      return this.tagOpen( tagName, attribs, inner );
    }
    FewNode.prototype[`${tagName}$`] = function (attribs, inner) {
      return this.tagVoid( tagName, attribs, inner );
    }
    fewd[tagName] = function (attribs, inner) {
      return fewd.e$().tagOpen( tagName, attribs, inner );
    }
    fewd[`${tagName}$`] = function (attribs, inner) {
      return fewd.e$().tagVoid( tagName, attribs, inner );
    }

  });


// function e$() {
//     return new FewEmptyNode();
// }

// if(typeof exports != "undefined"){
//     exports._de = _de;
//     exports.assert = assert;
//     exports.FewNode = FewNode;    
//     exports.FewComponent = FewComponent;
//     exports.fewd = fewd;
//     exports.e$ = e$;
// }

module.exports = fewd;