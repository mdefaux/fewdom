
const few = require("../../../src/few");
const { div, div$ } = few;

require( './Card' );

const dragListStyle = {
    width: "360px",
    height: "100%",
    // position: "relative",
};


let startX, startY; //, deltaX, deltaY;

function disableSelect(event) {
    event.preventDefault();
}

const Dragged = {
    item: undefined,
    sourceContainer: undefined,
    dropContainer: undefined,
    clear() { this.item = this.sourceContainer = this.dropContainer = undefined; },
    
    dragStart( evt ) {
        
        startX = evt.clientX;
        startY = evt.clientY;

        // this.state.dragging = true;
        evt.stopPropagation();
        document.addEventListener( 'mouseup', this.mouseup );
        document.addEventListener( 'mousemove', this.mousemove );
        window.addEventListener( 'dragstart', disableSelect );
        window.addEventListener( 'selectstart', disableSelect );
    },
    dragEnd () {
        
        // if ( this.state.dropIndex !== undefined &&
        //     this.state.dropIndex !== this.state.draggedIndex &&
        //     this.state.dropIndex -1 !== this.state.draggedIndex ) 
        // {
        //     let newArray = [...this.attrs.array];
        //     var element = newArray[this.state.draggedIndex];
        //     newArray.splice(this.state.draggedIndex, 1);
        //     newArray.splice(this.state.dropIndex - 
        //      (this.state.dropIndex > this.state.draggedIndex ? 1 : 0), 0, element);

        //     this.attrs.array = newArray;
        //     // this.attrs.array.splice(this.state.dropIndex, 0, 
        //     //     this.attrs.array.splice(this.state.draggedIndex, 1)[0]);


        //     this.attrs.onChangeOrder?.( this.attrs.array );
        // }
        // startX = undefined, 
        // startY = undefined, 
        // this.state.deltaX = undefined, 
        // this.state.deltaY = undefined;
        // this.state.draggedIndex = undefined;
        // this.state.dropIndex = undefined;
        // this.state.dragging = false;
        let dropContainer =  Dragged.dropContainer;
        if( Dragged.dropContainer && Dragged.sourceContainer ) {
            Dragged.sourceContainer.onItemRemove( Dragged.sourceIndex );
            Dragged.dropContainer.onItemMove( Dragged.item, Dragged.destIndex );
            Dragged.dropContainer.onDragOut();
        }
        Dragged.sourceContainer.update();
        Dragged.clear();
        
        dropContainer?.update();
        document.removeEventListener( 'mouseup', this.mouseup );
        document.removeEventListener( 'mousemove', this.mousemove );
        window.removeEventListener( 'dragstart', disableSelect );
        window.removeEventListener( 'selectstart', disableSelect);
    },
    mousemove (evt) {

        Dragged.mouseX = evt.clientX;
        Dragged.mouseY = evt.clientY;
        Dragged.deltaX = evt.clientX - startX;
        Dragged.deltaY = evt.clientY - startY;
        Dragged.sourceContainer.update();

        if ( Math.abs( Dragged.deltaX) > 30 || Math.abs( Dragged.deltaY) > 30 ) {

            Dragged.dragging = true;
        }

        evt.stopPropagation();
    },
    mouseup(evt) {
        return Dragged.dragEnd( evt );
        // 
    }
};

class DragList extends few.Component {
    // onInit() {
    //     // subscribes to list.cards proxy for change
    //     // changes include the reassignment to cards array with a new array
    //     // for example following line will fire the callback:
    //     // this.attrs.list.cards = []; 
    //     this.attrs.list?.subscribeOnChange(() => {
    //         this.update();
    //     });
    // }


    onItemMove(item, position){
        this.attrs.list.splice( position, 0, item );
        this.attrs.onArray( this.attrs.list );
    }

    onItemRemove(position){

        this.attrs.list.splice( position, 1 );
        
        this.attrs.onArray( this.attrs.list );
    }

    onDragOut() {
        // leave
        Dragged.dropContainer = undefined;
        this.state.dropIndex = undefined;
    }

    draw() {
        // e$() is an empty node to start with
        return div( {
            style: {...dragListStyle, ...this.attrs.style,
                ...this === Dragged.dropContainer ? {
                    border: '1px solid red'
                } : {
                    border: 'none'
                }
            },
            onMouseMove: () => {
                if ( Dragged.sourceContainer && Dragged.dropContainer !== this ) {
                    Dragged.dropContainer?.onDragOut();
                    Dragged.dropContainer = this;
                    this.state.dropIndex = this.attrs.list.lenght;
                }
            },
            onMouseOut: () => {
                if ( Dragged.dropContainer === this ) {
                    this.onDragOut();
                }
            }
        } )
            // for each card in attribute list
            .child$( this.attrs.list
                .map( (card, ir) =>
                    div( {
                        style: {
                            ...card === Dragged.item ? {
                                position: 'absolute',
                                left: `${Dragged.mouseX}px`,
                                top: `${Dragged.mouseY}px`,
                                pointerEvent: 'none',
                                transform: 'rotate(5deg)',
                                zIndex: 256
                            }:{
                                position: 'relative',
                                left: '0px',
                                top: '0px',
                                pointerEvent: 'all',
                                transform: 'rotate(0deg)',
                                zIndex: 0
                            }
                        },                      
                        onMouseDown: !Dragged.item && ((evt) => {
                            Dragged.item = card;
                            Dragged.sourceContainer = this;
                            Dragged.sourceIndex = ir;
                            Dragged.dragStart( evt );
                            this.state.draggedIndex = ir;
                            evt.stopPropagation();
                        }),
                        onMouseOver: card !== Dragged.item && ((evt) => {
                            // if ( this.state.dragging ){
                            //     this.state.dropIndex = ir;
                            // }
                            if( Dragged.item ) {
                                Dragged.dropContainer = this;
                                Dragged.destIndex = ir;
                                this.state.dropIndex = ir;
                                console.log( `drop index: '${ir}'.`);
                            }
                            evt.stopPropagation();
                        }),
                    })
                        .child$( this.state.dropIndex === ir && div$( {
                            key: 'drop-space-between',
                            style: {
                                height: '50px'
                            },
                            inner: 'Drag HERE'
                        } ) )        
                        .Card$( {
                            key: `element-list-${card.id}`,
                            id: card.id, 
                            card: card,
                        })
                    .$div
                )
            )
            .div$( {
                key: 'drop-space-last',
                style: {
                    height: '30px'
                },
                inner: Dragged.dropContainer === this 
                    && this.state.dropIndex === undefined ? 
                    'Drag HERE': ''
            } )
        .$div;            // closes the card div
    }
}

few.types.DragList = DragList;

module.exports = few.types.DragList;