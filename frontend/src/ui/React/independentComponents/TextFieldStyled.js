import {withStyles} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

export default withStyles({
    root: {
        '& .MuiFormControl-root':{
            marginTop: '0px'
        },

        '& .MuiOutlinedInput-input': {
            padding: '4.5px 14px',

        },

        '&.MuiFormControl-marginNormal': {
            marginBottom: '0px',
            marginTop: '10px'
        },

        '& .MuiInputLabel-outlined':{
            transform:'translate(14px, 7px) scale(1)',

            '&.MuiInputLabel-shrink': {
                transform: "translate(14px, -6px) scale(0.65)"
            }
        },
    },
})(TextField);