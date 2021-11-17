
export default class Simplify{

    constructor(okCallback, cancelCallback){
        this.okCallback=okCallback;
        this.cancelCallback=cancelCallback;

    }

    show(){
        store.dispatch({
            type:'OPEN_SIMPLIFY_MODAL',
            okCallback:this.okCallback,
            cancelCallback:this.cancelCallback,
            payload:true
        });
    }


    get data(){
        return {errorThreshold:store.getState().simplifyWindowReducer.errorThreshold};
    }

}