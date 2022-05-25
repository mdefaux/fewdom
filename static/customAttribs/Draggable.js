
/**
 * 
 * https://javascript.info/mouse-drag-and-drop
 */
 class Draggable {

    setup( virtualNode, attrs ) {

        return {
            ...attrs,
            onMouseDown: (e) => {this.start(e);},
        }
    }

    apply ( attrs ) {
        Object.entries( attrs ).forEach( ([name,value]) => {
            this[name] = value;
        } );
    }
    
    start( e ) {
        if( this.dragging )
            return;
        this.dragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;


        this.moveHandler = this.move.bind(this);
        this.endHandler = this.end.bind(this);
        document.addEventListener( 'mousemove', this.moveHandler );
        document.addEventListener( 'mouseup', this.endHandler );
        // e.target.setPointerCapture(e.pointerId);

        e.preventDefault();
    }
    move( e ) {
        e.deltaX = e.clientX - this.startX;
        e.deltaY = e.clientY - this.startY;
        this.onMove?.( e, this.state );
        this.state?.update?.( /*this.attrs*/ );
    }
    end( e ) {
        document.removeEventListener( 'mousemove', this.moveHandler );
        document.removeEventListener( 'mouseup', this.endHandler );
        // e.target.releasePointerCapture(e.pointerId);
                
        this.dragging = false;
        this.onEnd?.(e, this.state);
    }
}
