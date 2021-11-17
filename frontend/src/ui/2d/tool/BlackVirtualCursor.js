import Cursor from "./Cursor";


export default class BlackVirtualCursor extends Cursor{
    constructor(){
        super();
        app._board._canvas.style.cursor="url(\"resources/images/blackCursor.png\"), auto";
    }

    render(position) {
        app._board._canvas.style.cursor="url(\"resources/images/blackCursor.png\"), auto";
    }
}