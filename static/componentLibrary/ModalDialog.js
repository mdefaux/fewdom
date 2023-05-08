
if(typeof require != "undefined"){
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
                // title
                .div( { style: {
                    width: '100%',
                    height: 24,
                    // marginBottom: 0, 
                    // position: 'absolute',
                    // textAlign: 'end',
                    backgroundColor: '#e1e1f1',
                    display: this.attrs.title ? "table-row" : 'none',
                } } )
                    .span$( { inner: this.attrs.title })
                .$div()
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
                    height: 60,
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
                            // this.attrs.onClose?.();
                        }
                    })
                    // cancel
                    .input$( {
                        type: 'button',
                        value: this.attrs.cancelLabel || 'cancel',
                        style: {...toolbarButtonStyle},
                        onClick: ()=> { 
                            this.attrs.onCancel?.();
                            this.attrs.onClose?.();
                        }
                    })
                .$div()
            .$div();        // closes the main UI div
    }
}


fewd.types.ModalDialog = ModalDialog;
