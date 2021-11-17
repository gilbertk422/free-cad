/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

class Popup{
    constructor(parent){
        this.parent = parent;
        this.popupContainer= element('div').classname('popup-container');
        this.popup = element('div',this.popupContainer).classname('popup');

        this.handlers = [];

        this.size = {width:0,height:0};
        this.position = {x:0,y:0};
        this.visible=false;
        if(parent){
            this.popupContainer.order(parseInt(parent.popup.style.zIndex)+50);
            this.popup.order(parseInt(parent.popup.style.zIndex)+100);
        }else{
            this.popupContainer.order(1950);
            this.popup.order(2000);
        }

        this.popupContainer.onclick = (e)=>{
            if(e.target==this.popupContainer) {
                this.hide();
            }
        };
    }

    setShadow(value){
        if(value){
            this.popupContainer.background("rgba(0,0,0,0.5)");
        }else{
            this.popupContainer.background("rgba(0,0,0,0)");
        }
        return this;
    }

    setSize(width, height){
        if(!width){
            width = this.size.width;
        }
        if(!height){
            height = this.size.height;
        }
        this.size = {width:width,height:height};
        this.popup.size(width, height);
        return this;
    }


    setPosition(x,y){
        this.position = {x:x,y:y};
        this.popup.position(x, y);
        return this;
    }

    moveToCenter(){
        let top = innerHeight/2-this.popup.height/2;
        top=top<0?0:top;

        let left = innerWidth/2-this.popup.width/2;
        left=left<0?0:left;
        this.setPosition(left,top);
        return this;
    }


    /**
     * @public
     * The method adding some content to the popup block
     * @param {HTMLElement} content
     * @returns {Popup}
     */
    addContent(content){
        content.style.position = 'absolute';
        content.style.left = '0px';
        content.style.top = '0px';
        this.popup.appendChild(content);
        return this;
    }

    hide(){
        this.visible=false;
        this.popupContainer.hide();
        this.notifyHandlers("hide");
        return this;
    }

    show(){
        this.visible=true;
        this.popupContainer.show();
        return this;
    }

    isShow(){
        return this.visible;
    }

    addHandler(eventName, handler){
        if(!this.handlers[eventName]){
            this.handlers[eventName]=[];
        }
        this.handlers[eventName].push(handler);
    }

    notifyHandlers(eventName, data){
        if(this.handlers[eventName]) {
            for(let handler of this.handlers[eventName]){
                handler(data);
            }
        }
    }

    destroy(){
        document.body.removeChild(this.popupContainer);
    }
}

class DialogPopup extends Popup{
    constructor(parent){
        super(parent);

        this.header = element('div',this.popup).background('rgb(93, 93, 93)');
        this.close = element('div',this.header).size(20,20).background("rgba(35, 35, 35, 0.0)")
            .fontStyle(18, "Ubuntu", "#fff", "center").text("x", "center", true).cursor("pointer");
        this.close.onclick= ()=>this.hide();
        this.close.onmouseover = ()=>{this.close.style.color = "#f55";};
        this.close.onmouseout = ()=>{this.close.style.color = "#fff";};

        this.title = element('div',this.header).fontStyle(14, "Ubuntu", "#fff", false).position(10,5);
        Helper.Window.addHandler('resize',()=> {
            this.popupContainer.size(innerWidth,innerHeight);
            this.moveToCenter()
        });
    }

    setTitle(title){
        this.title.text(title, false, true);
        return this;
    }

    setPosition(x,y){
        super.setPosition(x,y);
        this.header.position(0,0);

        this.close.position(this.header.width-23,3);
        return this;
    }

    setSize(width, height){
        super.setSize(width,height+25);
        this.header.size(width,25);
        this.close.position(this.header.width-23,0);
        return this;
    }

    addContent(content){
        super.addContent(content);
        content.style.top = '25px';
    }
}

class DraggablePopup extends DialogPopup{
    constructor(parent){
        super(parent);
        this.position={x:0,y:0};

        this.mouseDownPosition = undefined;

        this.header.onmousedown = (e)=>{
            if(e.target==this.header) {
                this.mouseDownPosition = {x: e.clientX, y: e.clientY};
            }
        };

        this.header.onmousemove = (e)=>this.drag(e);
        this.popupContainer.onmousemove = (e)=>this.drag(e);
        this.onmousemove = (e)=>this.drag(e);

        this.header.onmouseup= ()=> {
            this.mouseDownPosition=undefined;
        };

    }

    drag(e){
        if(this.mouseDownPosition){
            let x=this.position.x+e.clientX-this.mouseDownPosition.x;
            let y=this.position.y+e.clientY-this.mouseDownPosition.y;
            this.setPosition(x,y<0?0:y);
            this.mouseDownPosition.x=e.clientX;
            this.mouseDownPosition.y=e.clientY;
        }
    }

    addContent(content){
        super.addContent(content);
        content.onmousemove=(e)=>this.drag(e);
        return this;
    }
}

class MessagePopup extends DialogPopup{
    constructor(parent, message, timeout){
        super(parent);
        this.timeout = timeout;
        let content = element('div',this.popup).text(message).position(150,15).fontStyle(null,null,'rgb(158, 69, 69)','center');
        this.setSize(this._getTextWidth(message,"bold 12pt arial"),100);
        this.addContent(content);
    }

    show(){
        if(this.timeout) {
            setTimeout(()=> {
                this.hide();
            }, this.timeout);
        }
        return super.show();
    }

    hide(){
        super.hide();
        this.popupContainer.remove();
        return this;
    }

    addContent(content){
        super.addContent(content);
        content.style.top = '35px';
        content.style.left = '15px';
    }

    /**
     * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
     *
     * @param {String} text The text to be rendered.
     * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
     *
     * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
     */
    _getTextWidth(text, font) {
        //todo: need re-use canvas object for better performance
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }
}

global.Popup = Popup;
global.DraggablePopup = DraggablePopup;
global.MessagePopup = MessagePopup;

export {Popup, DialogPopup, DraggablePopup};