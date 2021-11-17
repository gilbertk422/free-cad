
export default class Corner{

    constructor(okCallback, cancelCallback){
        this.okCallback=okCallback;
        this.cancelCallback=cancelCallback;

    }

    show(){
        store.dispatch({
            type:'OPEN_CORNER_MODAL',
            okCallback:this.okCallback,
            cancelCallback:this.cancelCallback,
            payload:true
        });
    }


    get data(){
        let state = store.getState().cornerWindowReducer;
        return {type:state.type, radius:state.radius, distance:state.distance};
    }

}