
/**
 * 
 * https://javascript.info/mouse-drag-and-drop
 */
 class Draggable {

    setup( virtualNode, attrs )
    {
        // let state = params.state;
        // let instance = params.instance;

        // if( !params.state )
        //     throw new Error( `state parameter is mandatory for Draggable.setup`)

        // if( !instance.instance )
        // {
        //     instance.instance = new Draggable();
        //     instance.instance.onMove = params.onMove;
        //     instance.instance.onEnd = params.onEnd;
        //     instance.instance.state = state;
        // }
        // instance.instance.attrs = params.attrs;

        return {
            ...attrs,
            onMouseDown: (e) => {this.start(e);},
        }
    }
    
    start( e )
    {
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

        if( this.state )
            this.state.dragging = true;
        e.preventDefault();
    }
    move( e )
    {
        e.deltaX = e.clientX - this.startX;
        e.deltaY = e.clientY - this.startY;
        this.onMove?.( e, this.state );
        this.state?.update?.( /*this.attrs*/ );
    }
    end( e )
    {
        document.removeEventListener( 'mousemove', this.moveHandler );
        document.removeEventListener( 'mouseup', this.endHandler );
        // e.target.releasePointerCapture(e.pointerId);
        
        if( this.state )
            this.state.dragging = false;
        
        this.dragging = false;
        this.onEnd?.(e, this.state);
        // this.state?.update?.( /*this.state*/ );
    }
};
