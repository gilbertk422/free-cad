/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from 'react'
import './material.scss'
import MaterialMod from './../../../../../model/Material'

const materialList = MaterialMod.listOfMaterials()

class Material extends React.Component {
    constructor (props, context) {
        super(props, context)
        this.state = {
            displayMenu: false,
            material: container.resolve('config').material,
            desktop: container.resolve('mobileDetector').mobile() == null
        }
    }

    showDropdownMenu = event => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ displayMenu: true }, () => {
            document.addEventListener('click', this.hideDropdownMenu)
        })
    }

    hideDropdownMenu = () => {
        event.stopPropagation();
        this.setState({ displayMenu: false }, () => {
            document.removeEventListener('click', this.hideDropdownMenu)
        })
    }

    chengeMaterial (material) {
        // if(!this.isCompatible(material)){
        //     return;
        // }
        container.resolve('config').material = material;
        this.setState({ material: material });
    }

    openWindow = () => {
        window.open('https://www.emachineshop.com/materials/')
    }

    isCompatible (material) {
        let finish = container.resolve('config').finishes;
        if (!finish) {
            return true
        }
        return material.isCompatible(finish);
    }

    render() {
        if (this.state.desktop) {
            return this.desktopView();
        } else {
            return this.mobileView();
        }
    }

    mobileView() {
        return (
            <li className="metismenu-item" onClick={this.showDropdownMenu}>
                <a className="metismenu-link metismenu-hasborder" href="#">{this.state.material.name}</a>
                <ul className={this.state.displayMenu ? "metismenu-container visible" : "metismenu-container"}>
                    {materialList.map((material, i) => (
                        <li value={material.name} onClick={() => this.chengeMaterial(material)} key={material.id} className={this.isCompatible(material) ? "metismenu-item" : "metismenu-item disableItem"}>
                            <a className="metismenu-link" href="#">{material.name}</a>
                        </li>
                    ))}
                    <li className="metismenu-item" onClick={this.openWindow}>
                        <a className="metismenu-link" href="https://www.emachineshop.com/" target="_blank" rel="noreferrer noopener">Help</a>
                    </li>
                </ul>
            </li>
        )
    }

    desktopView () {
        // console.log(this.props,'material-props')
        return (
            <div className="Material">
                <button className="btn-Material" onClick={this.showDropdownMenu} tabIndex={-1}>
                    {/* Material */}
                    {this.state.material.name}
                </button>

                {this.state.displayMenu ? (
                    <ul className="ul-Material">
                        {materialList.map((material, i) => (
                            <li value={material.name}
                                onClick={() => this.chengeMaterial(material)} key={material.id}
                                // className={this.isCompatible(material)?"":"disableItem"}
                            >
                                <a href="#">{material.name}</a>
                            </li>
                        ))}
                        <li onClick={this.openWindow}>
                            <a
                                href="https://www.emachineshop.com/"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                Help
                            </a>
                        </li>
                    </ul>
                ) : null}
            </div>
        )
    }
}

export default Material
