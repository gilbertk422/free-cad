
export default class ZipCode{

    constructor(okCallback, cancelCallback){
        this.okCallback=okCallback;
        this.cancelCallback=cancelCallback;

    }

    show(){
        store.dispatch({
            type:'OPEN_ZIP_CODE_MODAL',
            okCallback:this.okCallback,
            cancelCallback:this.cancelCallback,
            payload:true
        });
    }


    get data(){
        let state = store.getState().zipCodeWindowReducer;
        return {country:state.country, zipCode:state.zipCode};
    }

}