/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import {DraggablePopup} from "../popup";

import View3D from './../3Dview';

export default class ThreeDView{
    constructor(board, app){
        this.popup3DView = new DraggablePopup();


        if(container.resolve('mobileDetector').mobile()==null) {
            this.popup3DView.setSize(800, 600)
              .setPosition(200, 100)
              .moveToCenter();

            this.view3D = new View3D({ width: 800, height: 600 });
        }else{
            this.popup3DView.setSize(window.innerWidth, window.innerHeight);
            this.view3D = new View3D({ width: window.innerWidth, height:window.innerHeight });
        }

        this.popup3DView.setTitle("3D view")
            .hide()
            .addContent(this.view3D.getContent())
            .addHandler('hide', ()=>{
                this.view3D.clearMemory();
                this.popup3DView.destroy();
            });
        this.board =board;
        this.app=app;
    }

    show3D() {
        this.app.clearSelectElements();
        if(this.board.tool && this.board.tool['clearSelectElements']!=undefined) {
            this.board.tool.clearSelectElements();
        }
        gtag('event', '3D view', {
            'event_category': 'Web CAD'
        });
        container.resolve('analyzer', this.app.currentDocument).analyze().then((res)=>{
            if(res){
                try {
                    this.view3D.setGeometry(app.currentDocument).then(res=>{
                        this.popup3DView.show();
                    });
                } catch (e) {
                    if (e instanceof Exception) {
                        console.log(e.message);
                        new MessagePopup(null, e.message)
                            .setTitle("Error")
                            .moveToCenter()
                            .show();
                    } else {
                        throw e;
                    }
                }
            }
        });
    }
}