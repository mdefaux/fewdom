
if(typeof exports != "undefined"){
    const { FewComponent, FewNode, e$ } = require("../../fewdom/FewDom");
}

const modalDialogButtonStyle = {
    width: 128,
    height: 48,
    margin: 2
}

class ModalDialog extends FewComponent
{
    onCreate() {
        Editor.mainToolbar = this;
    }
    
    draw() {
        // e$() is an empty node to start with
        return e$()
            .div( { style: {
                display: "table", // "inline-flex", 
                position: "absolute",
                minHeight: '320px',
                backgroundColor: '#e1e1e1',
                top: '25vh',
                left: '25vw',
                width: '50vw',
                height: '50vh',
                padding: "2px",
                spacing: '2px',
                zIndex: 1000
            } } )
                .div( { style: {
                    width: '100%', 
                    // bottom: 0, 
                    // marginBottom: 0, 
                    // position: 'absolute',
                    // textAlign: 'end',
                    // backgroundColor: '#e1e1f1',
                    display: "table-row",
                } } )
                    // .FileDialog$( {
                    //     updateCallback: this.attrs.onOk
                    // } )
                    .child$( this.innerRef() )
                .$div()
            
                .div( { style: {
                    width: '100%', 
                    bottom: 0, 
                    marginBottom: 0, 
                    // position: 'absolute',
                    textAlign: 'end',
                    backgroundColor: '#e1e1f1',
                    display: "table-row",
                } } )
                    // ok
                    .input$( {
                        type: 'button',
                        value: this.attrs.okLabel || 'ok',
                        style: {...toolbarButtonStyle},
                        // ...!Editor.hasUndo() && {disabled: true},
                        onClick: ()=> {
                            this.attrs.onOk?.();
                        }
                    })
                    // cancel
                    .input$( {
                        type: 'button',
                        value: this.attrs.cancelLabel || 'cancel',
                        style: {...toolbarButtonStyle},
                        onClick: ()=> { 
                            this.attrs.onCancel?.();
                        }
                    })
                .$div()
            .$div();        // closes the main UI div
    }
}


fewd.types.ModalDialog = ModalDialog;
