import React, {Component} from 'react';
import PropsTypes from 'prop-types';

import './option-menu.scss';

import File from "../DropDownMenu/File/File";
import Edit from "../DropDownMenu/Edit/Edit";

import Line from "../DropDownMenu/Line/Line";
import Job from "../DropDownMenu/Job/Job";
import Help from "../DropDownMenu/Help/Help";
import View from '../DropDownMenu/View/View';

class OptionMenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="OptionMenu">
                <div className="metismenu">
                    <ul className="metismenu-container">
                        <File history={this.props.history}/>
                        <Edit />
                        <Line/>
                        <View />
                        <Job history={this.props.history}/>
                        <Help />                    
                    </ul>
                </div>
            </div>
        )
    }
}

OptionMenu.PropsTypes = {
    closeCallback: PropsTypes.func.isRequired
}

export default OptionMenu