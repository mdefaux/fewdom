

const { types, Component, span$, textarea$ } = require("../../../src/few");

class EditableText extends Component {

    draw() {
        return (!this.state.editing)? 
            span$( {
                key: 'span0',
                style: {
                    // padding: "20px", 
                    margin: "16px 8px 32px 16px", 

                    width: 'calc( 100% - 48px )',
                    // this div is displayed basing on state
                    display: "block"
                },
                // attributes can specify event management handlers
                onClick: ()=>{
                    // state change will cause the redraw asynchronously
                    this.state.editing = true;
                },
                inner: this.attrs.value
            } )
        
        :
            textarea$( {
                key: 'textarea0',
                style: { 
                    margin: "13px 6px 2px 12px", 
                    width: 'calc( 100% - 48px )',
                    height: 156,
                    fontFamily: 'arial',
                    fontSize: '20px'
                    // this div is displayed basing on state
                },
                // attributes can specify event management handlers
                onChange: ( evt )=>{
                    // state change will cause the redraw asynchronously
                    if ( typeof this.attrs.onChange === 'function' ) {
                        this.attrs.onChange( evt.target.value )
                    }
                    {
                        this.attrs.value = evt.target.value;
                    }
                    this.state.editing = false;
                    evt.stopPropagation();
                },
                // attributes can specify event management handlers
                onBlur: ( evt )=>{
                    // state change will cause the redraw asynchronously
                    if ( typeof this.attrs.onChange === 'function' ) {
                        this.attrs.onChange( evt.target.value )
                    }
                    {
                        this.attrs.value = evt.target.value;
                    }
                    this.state.editing = false;
                    evt.stopPropagation();
                },
                onReady: (obj) => {
                    obj.dom.focus();
                    obj.dom.setSelectionRange(0, obj.dom.value.length);
                },
                onMouseDown: ( evt ) => {
                    evt.stopPropagation();
                },
                inner: this.attrs.value
            } )
    }
}

types.EditableText = EditableText;
module.exports = types.EditableText;
