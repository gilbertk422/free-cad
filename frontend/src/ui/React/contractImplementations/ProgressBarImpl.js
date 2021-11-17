/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import ProgressBar from "../../contracts/ProgressBar";

//todo: rewrite with using React
export default class ProgressBarImpl extends ProgressBar{
    constructor(){
        super();

        this.el = document.createElement('div');

        this.el.style.position=" absolute";
        this.el.style.bottom=" 0px";
        this.el.style.zIndex="10000";
        this.el.style.height="29px";
        this.el.style.width="100%";
        this.el.style.alignItems="center";
        this.el.style.backgroundColor="#d6d6d6";


        this.progress = document.createElement('div');
        this.progress.style.position=" absolute";
        this.progress.style.bottom=" 0px";
        this.progress.style.zIndex="10001";
        this.progress.style.height="29px";
        this.progress.style.width="0%";
        this.progress.style.backgroundColor="#4ab71f";


        let temp = document.createElement('div');
        temp.style.position=" absolute";
        temp.style.bottom=" 0px";
        temp.style.zIndex="10002";
        temp.style.height="29px";
        temp.style.width="100%";
        temp.style.display=" flex";
        temp.style.alignItems="center";

        this.message = document.createElement('div');
        this.procent = document.createElement('div');


        temp.appendChild(this.message);
        temp.appendChild(this.procent);
        this.el.appendChild(this.progress);
        this.el.appendChild(temp);

        document.body.appendChild(this.el);
    }

    /**
     * @param {text} message
     */
    show(message=""){
        super.show(message);
        this.message.innerText=message;
        this.setValue(0);
        this.el.style.display = 'block';
    }

    /**
     * @abstract
     */
    hide(){
        super.hide();
        this.el.style.display = 'none';
    }

    /**
     *
     * @param {number} value
     */
    setValue(value){
        super.setValue(value);
        this.procent.innerHTML=value.toFixed(2)+"%";
        this.progress.style.width=value+"%";
    }

}