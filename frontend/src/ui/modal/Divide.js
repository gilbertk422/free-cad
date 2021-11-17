
export default class Divide{

    constructor(okCallback, cancelCallback){
        this.okCallback=okCallback;
        this.cancelCallback=cancelCallback;

    }

    show(){
        store.dispatch({
            type:'OPEN_DIVIDE_MODAL',
            okCallback:this.okCallback,
            cancelCallback:this.cancelCallback,
            payload:true
        });
    }


    get data(){
        return {countParts:store.getState().divideWindowReducer.countParts};
    }

}