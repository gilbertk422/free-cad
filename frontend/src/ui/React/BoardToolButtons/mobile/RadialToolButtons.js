
import './radialSeparateButtons.scss';
import React from "react";
import {connect} from "react-redux";

let Trigonometric = container.resolve('math').Trigonometric;

const buttons = [
    {imgPath:"resources/images/Select.png", toolName:"Pointer"},
    {imgPath:"icons.svg#LineTool", toolName:"Line"},
    {imgPath:"icons.svg#RectTool", toolName:"Rectangle"},
    {imgPath:"icons.svg#CircleTool", toolName:"Circle"},
    {imgPath:"resources/images/Eraser.png", toolName:"Eraser"},
    {imgPath:"resources/images/Text.png", toolName:"Text"},
    {imgPath:"icons.svg#EditLineTool", toolName:"EditLine"},
    {imgPath:"resources/images/Ruler.png", toolName:"Ruler"},
    {imgPath:"icons.svg#drag-hand", toolName:"Drag"},
    // {imgPath:""},
    // {imgPath:"resources/images/Help.png", toolName:"Pointer"},
];

class RadialToolButtons extends React.Component {

    constructor(props) {
        super(props);



        this.state = {
            isOpen:false,
        }
    }

    getTransformPropertyFor(i){
        let angle = (360/(buttons.length))*i;
        let x = Math.sin(Trigonometric.gradToRad(angle))*100;
        let y = Math.cos(Trigonometric.gradToRad(angle))*100;

        let res = `translate(${x.toFixed(0)}px,${y.toFixed(0)}px)`;
        return res;
    }

    selectTool(index){
        this.props.setTool(buttons[index].toolName);
        this.setState({isOpen:false});
    }

    openList(){
        this.setState({isOpen:!this.state.isOpen});
    }

    getCurrentButton(){
        return buttons.filter(b=>b.toolName==this.props.tool)[0];
    }

    render() {
        return (
            <div className={"RadialButtons "+ (this.state.isOpen?"open":"")}>
                <div className="MainButton"
                     onClick={this.openList.bind(this)}
                    >
                    {this.getImage(this.getCurrentButton().imgPath)}
                </div>
                {this.state.isOpen && buttons.map((button, index)=>{
                    if(button.toolName == this.props.tool){
                        return;
                    }
                    return (<div className="Button" key={index}
                                 style={{transform:this.getTransformPropertyFor(index)}}
                                 onClick={()=>this.selectTool(index)}
                    >
                        {this.getImage(button.imgPath)}
                    </div>);
                })}
            </div>
        );
    }

    getImage(path){
        if(path.endsWith('.png')) {
            return (<img src={path} alt=""/>);
        }else{
            return (
                <svg className="icon"><use xlinkHref={path}></use></svg>
            );
        }
    }
}

const mapStateToProps = state => {
    return {
        tool: state.borderToolPanelReducer.tool,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setTool: name => {
            dispatch({type: "SET_BORDER_TOOL", toolName: name});
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RadialToolButtons);