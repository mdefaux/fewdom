const FewComponent = require("./FewComponent");
const FewFunctionNode = require("./FewFunctionNode");
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
                    // c[ `$${name}` ] = ()=>(this);
                    let _this = this;
                    Object.defineProperty(c, `$${name}`, {
                        get() {
                            return _this;
                        },
                    });
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
        },
        get(target, name, receiver) {
            if (!Reflect.has(target, name)) 
            {
                throw new Error( `Unknown type '${name}' already defined.` );
            }
            const f = Reflect.get(target, name, receiver);
            return {
                [name]: function (attribs) {
                    if (!f.name && !attribs?.typeName) {
                        attribs = { ...attribs, typeName: name };
                    }
                    let e = fewd.e$();  // creates a an empty node
                    let c = e.child(f, attribs);    // uses defined function 
                    // adds the closure tag that returns the root 'e' node
                    Object.defineProperty(c, `$${name}`, {
                        get() {
                            return e;
                        },
                    });
                    return c;
                },
                [`${name}$`]: function(attribs) {
                    if (!f.name && !attribs?.typeName) {
                        attribs = { ...attribs, typeName: name };
                    }
                    // no closure tag needed, the child$ function returns the empty node
                    return fewd.e$().child$(f, attribs);
                }
            }
        }
    }),
    Component: FewComponent,
    FunctionNode: FewFunctionNode,
    e$() 
    {
        return new FewEmptyNode();
    },
    attach( existingObject ) {
        return fewd.e$().attach( existingObject );
    },
    append(parent, id, tagName) {
        let node = document.getElementById(id);
        if (!node) {
            node = document.createElement(tagName);
            node.id = id;
            parent.appendChild( node );
        }
        return fewd.e$().setup(node, id);
    }

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

module.exports = fewd;