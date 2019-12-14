import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { wireframeChangeHandler } from '../../store/database/asynchHandler';
import { wireframeDeleteHandler } from '../../store/database/asynchHandler';
import { Modal, Button } from 'react-materialize';
import PropertiesControl from './PropertiesControl';
import ContainerControl from './ContainerControl';
import LabelControl from './LabelControl';
import ButtonControl from './ButtonControl';
import TextfieldControl from './TextfieldControl';
import DimensionField from './DimensionField';

class EditScreen extends Component {
    markForDeletion = false;
    controlsOnline = null;
    state = {
        name: null,
        width: null,
        height: null,
        selectedControl: null,
        selectedIndex: -1,
        controls: null,
        scrollOffsets: [0, 0],
        scale: 1,
        enableSave: false
    }

    defaultControls = {
        defaultContainer: {
            "type": "container",
            "x": 6,
            "y": 6,
            "width": 150,
            "height": 50,
            "border-color": {
                "r": 0,
                "g": 0,
                "b": 0,
                "a": 1
            },
            "background-color": {
                "r": 255,
                "g": 255,
                "b": 255,
                "a": 0
            },
            "border-width": 1,
            "border-radius": 3
        },
        defaultLabel: {
            "type": "label",
            "x": 6,
            "y": 6,
            "width": 120,
            "height": 22,
            "text": "Prompted for Input:",
            "font-size": 14,
            "color": {
                "r": 0,
                "g": 0,
                "b": 0,
                "a": 1
            },
            "border-color": {
                "r": 255,
                "g": 255,
                "b": 255,
                "a": 0
            },
            "background-color": {
                "r": 255,
                "g": 255,
                "b": 255,
                "a": 0
            },
            "border-width": 0,
            "border-radius": 0
        },
        defaultButton: {
            "type": "button",
            "x": 6,
            "y": 6,
            "width": 63,
            "height": 23,
            "text": "Submit",
            "font-size": 14,
            "color": {
                "r": 255,
                "g": 255,
                "b": 255,
                "a": 1
            },
            "border-color": {
                "r": 255,
                "g": 255,
                "b": 255,
                "a": 0
            },
            "background-color": {
                "r": 38,
                "g": 164,
                "b": 152,
                "a": 1
            },
            "border-width": 0,
            "border-radius": 10
        },
        defaultTextfield: {
            "type": "textfield",
            "x": 6,
            "y": 6,
            "width": 150,
            "height": 25,
            "text": "Input",
            "font-size": 15,
            "color": {
                "r": 209,
                "g": 209,
                "b": 209,
                "a": 1
            },
            "border-color": {
                "r": 0,
                "g": 0,
                "b": 0,
                "a": 1
            },
            "background-color": {
                "r": 255,
                "g": 255,
                "b": 255,
                "a": 0
            },
            "border-width": 1,
            "border-radius": 3
        }
    }

    keydownHandler = (e) => {
        try {
            e.stopImmediatePropagation();
            let controls = this.state.controls;
            if (e.keyCode === 8 && this.state.selectedControl && !(document.activeElement instanceof HTMLInputElement)) {
                controls.splice(this.state.selectedIndex, 1);
                this.setState(state => ({
                    ...state,
                    selectedControl: null,
                    selectedIndex: -1,
                    controls: controls
                }));
                console.log(controls);
                e.preventDefault();
            } else if (e.keyCode === 68 && e.ctrlKey && this.state.selectedControl) {
                this.duplicateControl();
                e.preventDefault();
            }
        } catch (e) {
            //do nothing
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keydownHandler);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.keydownHandler);
    }

    componentDidUpdate = (nextProps) => {
        if (this.props.wireframe !== nextProps.wireframe) {
            this.setState(state => ({
                ...state,
                name: this.props.wireframe ? this.props.wireframe.name : null,
                width: this.props.wireframe ? this.props.wireframe.width : 500,
                height: this.props.wireframe ? this.props.wireframe.height : 500,
                controls: this.props.wireframe ? this.props.wireframe.controls : null
            }))
            if (!this.props.wireframe) {
                this.markForDeletion = true;
                return;
            }
            if (!this.state.enableSave) this.controlsOnline = JSON.stringify(this.props.wireframe.controls);
            return;
        }
        if (!this.state.enableSave && this.controlsOnline && this.controlsOnline !== JSON.stringify(this.state.controls)) {
            this.setState(state => ({ ...state, enableSave: true }));
            console.log("changed");
        }
    }

    handleChange = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
        this.setState(state => ({ ...state, enableSave: true }));
    }

    handleWireframeDelete = () => {
        this.markForDeletion = true;
        this.props.wireframeDelete(this.props.wireframe);
    }

    changePosition = (index, posObj) => {
        let controls = this.state.controls;
        controls[index].x = posObj.x;
        controls[index].y = posObj.y;
        this.setState(state => ({
            ...state,
            controls: controls,
            selectedControl: controls[index]
        }));
        //console.log(this.state.controls[index]);
    }

    changeSize = (index, sizeObj) => {
        let controls = this.state.controls;
        controls[index].width = sizeObj.width;
        controls[index].height = sizeObj.height;
        controls[index].x = sizeObj.x;
        controls[index].y = sizeObj.y;
        this.setState(state => ({
            ...state,
            controls: controls,
            selectedControl: controls[index]
        }));
        //console.log(this.state.controls[index]);
    }

    changeControlProps = (type, value) => {
        if (!this.state.selectedControl) return;
        let updatedControl = this.state.selectedControl;
        let controls = this.state.controls;
        updatedControl[type] = value;
        controls[updatedControl.index] = updatedControl;
        this.setState(state => ({
            ...state,
            selectedControl: updatedControl,
            controls: controls
        }));
    }

    clearSelectionDetection = (e) => {
        e.stopPropagation();
        let elem = document.getElementById("rectSelection");
        let topLeft = Math.min(Math.abs(e.clientX - (elem.getBoundingClientRect().left)), Math.abs(e.clientY - (elem.getBoundingClientRect().top)));
        let bottomLeft = Math.min(Math.abs(e.clientX - (elem.getBoundingClientRect().left)), Math.abs(e.clientY - (elem.getBoundingClientRect().top + elem.offsetHeight)));
        let topRight = Math.min(Math.abs(e.clientX - (elem.getBoundingClientRect().left + elem.offsetWidth)), Math.abs(e.clientY - (elem.getBoundingClientRect().top)));
        let bottomRight = Math.min(Math.abs(e.clientX - (elem.getBoundingClientRect().left + elem.offsetWidth)), Math.abs(e.clientY - (elem.getBoundingClientRect().top + elem.offsetHeight)));
        if (topLeft > 5 && bottomLeft > 5 && topRight > 5 && bottomRight > 5) this.setState(state => ({ ...state, selectedControl: null }));
    }

    duplicateControl = () => {
        let updatedControl = JSON.parse(JSON.stringify(this.state.selectedControl));
        updatedControl.x += 100 * this.state.scale;
        updatedControl.y += 100 * this.state.scale;
        this.addControl(updatedControl);
        //console.log(updatedControl);
    }

    updateScrollOffsets = (e) => {
        let left = e.target.scrollLeft;
        let top = e.target.scrollTop;
        this.setState(state => ({ ...state, scrollOffsets: [left, top] }));
    }

    addDefaultControl = (type) => {
        let updatedControl = JSON.parse(JSON.stringify(this.defaultControls[type]));
        updatedControl.x += this.state.scrollOffsets[0];
        updatedControl.y += this.state.scrollOffsets[1];
        this.addControl(updatedControl);
    }

    addControl = (updatedControl) => {
        let controls = this.state.controls;
        controls.push(updatedControl);
        this.setState(state => ({
            ...state,
            selectedControl: updatedControl,
            selectedIndex: controls.length - 1,
            controls: controls
        }));
    }

    updateScale = (num) => {
        if (this.state.scale * num < 0.25 || this.state.scale * num > 4) return;
        this.setState(state => ({ ...state, enableSave: true }));
        let controls = this.state.controls;
        let selectedControl = this.state.selectedControl;
        controls.forEach(control => {
            control.x *= num;
            control.y *= num;
        });
        if (selectedControl) {
            selectedControl = controls[this.state.selectedIndex];
        }
        this.setState(state => (
            {
                ...state,
                scale: this.state.scale * num,
                selectedControl: selectedControl,
                controls: controls
            }
        ));
    }

    handleWireframeChange = () => {
        let correctedControls = this.state.controls.map(control => {
            control.x /= this.state.scale;
            control.y /= this.state.scale;
            return control;
        });
        this.props.wireframeChange(this.props.wireframe.id, "controls", correctedControls);
        this.props.wireframeChange(this.props.wireframe.id, "name", this.state.name);
        this.props.wireframeChange(this.props.wireframe.id, "width", this.state.width);
        this.props.wireframeChange(this.props.wireframe.id, "height", this.state.height);
        this.controlsOnline = null;
        this.setState(state => ({ ...state, enableSave: false, scale: 1 }));
    }

    updateDimensions = (width, height) => {
        this.setState(state => ({
            ...state,
            width: width,
            height: height
        }));
        this.setState(state => ({ ...state, enableSave: true }));
    }

    render() {
        const auth = this.props.auth;
        const wireframe = this.props.wireframe;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        if (!wireframe) {
            if (this.markForDeletion) {
                this.markForDeletion = false;
                return <Redirect to="/" />;
            } else {
                return <React.Fragment />;
            }
        }
        if (!this.state.controls) return <React.Fragment />;
        let controls = this.state.controls;
        return (
            <div className="container" >
                <div className="toolbar">
                    <h5 className="grey-text text-darken-3">
                        <i className="small zoom material-icons" onClick={() => this.updateScale(2)}>zoom_in</i>
                        <i className="small zoom material-icons" onClick={() => this.updateScale(0.5)}>zoom_out</i>
                        &nbsp;&nbsp;
                    <Button className={"save-btn waves-effect" + (this.state.enableSave ? "" : " disabled")} onClick={this.handleWireframeChange}>Save</Button>
                        &nbsp;
                        <Link to="/"><span hidden={this.state.enableSave}><Button className="close-btn waves-effect">Close</Button></span></Link>
                        <Modal
                            header="Close without saving"
                            trigger={<span hidden={!this.state.enableSave}><Button className="close-btn waves-effect">Close</Button></span>}
                            actions={
                                <div>
                                    <Link to="/"><Button modal="close" className="red darken-2">Confirm</Button></Link>
                                    &nbsp;&nbsp;&nbsp;
                                <Button modal="close">dismiss</Button>
                                </div>
                            }
                        >
                            <h5>Are you sure you want to close this Wireframe without saving?</h5>
                        </Modal>
                        &nbsp;&nbsp;
                    <Modal
                            header="Confirm Deleting Wireframe"
                            trigger={<p className="btn trashcan">🗑</p>}
                            actions={
                                <div>
                                    <Button modal="close" className="red darken-2" onClick={this.handleWireframeDelete}>Confirm</Button>
                                    &nbsp;&nbsp;&nbsp;
                                <Button modal="close">dismiss</Button>
                                </div>
                            }
                        >
                            <h5>Are you sure you want to delete this Wireframe?</h5>
                        </Modal>
                    </h5>
                    <div className="input-field small">
                        <label htmlFor="email" className={wireframe.name === "" ? "small" : "active small"}>Name</label>
                        <input className="active" type="text" name="name" id="name" onChange={this.handleChange} value={this.state.name} />
                    </div>
                    <DimensionField width={this.state.width} height={this.state.height} updateDimensions={this.updateDimensions}></DimensionField>
                    <div className="control-collection">
                        <div className="rectangle control-demo" onClick={() => this.addDefaultControl("defaultContainer")}></div>
                        <label>Container</label>
                        <br /><br />
                        <div className="control-demo" onClick={() => this.addDefaultControl("defaultLabel")}>Prompt for Input:</div>
                        <label>Label</label>
                        <br /><br />
                        <div className="button-demo control-demo" onClick={() => this.addDefaultControl("defaultButton")}>Submit</div>
                        <label>Button</label>
                        <br /><br />
                        <div className="input-demo control-demo" placeholder='Input' onClick={() => this.addDefaultControl("defaultTextfield")}>Input</div>
                        <label>Textfield</label>
                    </div>
                </div> <br />
                <PropertiesControl selectedControl={this.state.selectedControl} changeControlProps={(type, value) => { this.changeControlProps(type, value) }}></PropertiesControl>
                <div className="wireframe" style={{ width: this.state.width + "px", height: this.state.height + "px" }} onClick={(e) => this.clearSelectionDetection(e)} onScroll={this.updateScrollOffsets}>
                    {controls.map((control, index) => {
                        switch (control.type) {
                            case "container":
                                return (
                                    <ContainerControl key={index}
                                        selectControl={() => this.setState(state => ({ ...state, selectedControl: control, selectedIndex: index }))}
                                        index={index}
                                        control={control}
                                        changePosition={(index, posObj) => { this.changePosition(index, posObj) }}
                                        changeSize={(index, sizeObj) => { this.changeSize(index, sizeObj) }}
                                        scrollOffsets={this.state.scrollOffsets}
                                        scale={this.state.scale}></ContainerControl>);
                            case "label":
                                return (
                                    <LabelControl key={index}
                                        selectControl={() => this.setState(state => ({ ...state, selectedControl: control, selectedIndex: index }))}
                                        index={index}
                                        control={control}
                                        changePosition={(index, posObj) => { this.changePosition(index, posObj) }}
                                        changeSize={(index, sizeObj) => { this.changeSize(index, sizeObj) }}
                                        scrollOffsets={this.state.scrollOffsets}
                                        scale={this.state.scale}></LabelControl>);
                            case "button":
                                return (
                                    <ButtonControl key={index}
                                        selectControl={() => this.setState(state => ({ ...state, selectedControl: control, selectedIndex: index }))}
                                        index={index}
                                        control={control}
                                        changePosition={(index, posObj) => { this.changePosition(index, posObj) }}
                                        changeSize={(index, sizeObj) => { this.changeSize(index, sizeObj) }}
                                        scrollOffsets={this.state.scrollOffsets}
                                        scale={this.state.scale}></ButtonControl>);
                            case "textfield":
                                return (
                                    <TextfieldControl key={index}
                                        selectControl={() => this.setState(state => ({ ...state, selectedControl: control, selectedIndex: index }))}
                                        index={index}
                                        control={control}
                                        changePosition={(index, posObj) => { this.changePosition(index, posObj) }}
                                        changeSize={(index, sizeObj) => { this.changeSize(index, sizeObj) }}
                                        scrollOffsets={this.state.scrollOffsets}
                                        scale={this.state.scale}></TextfieldControl>);
                            default:
                                return "";
                        }
                    })}
                    <canvas id="rectSelection"
                        width={this.state.selectedControl ? this.state.selectedControl.width + (2 * this.state.scale) : 0}
                        height={this.state.selectedControl ? this.state.selectedControl.height + (2 * this.state.scale) : 0}
                        style={{
                            position: "relative", border: "2px solid #d3d3d3", zIndex: 0, pointerEvents: "none", borderColor: "red", borderStyle: "dashed",
                            left: (this.state.selectedControl ? this.state.selectedControl.x - (3 * this.state.scale) : 0) + "px",
                            top: (this.state.selectedControl ? this.state.selectedControl.y - (3 * this.state.scale) : 0) + "px",
                            transform: "scale(" + this.state.scale + ")"
                        }}
                        hidden={!this.state.selectedControl}></canvas>
                </div> <br />
            </div >
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    const { wireframes } = state.firestore.data;
    const wireframe = wireframes ? wireframes[id] : null;
    if (wireframe)
        wireframe.id = id;
    return {
        wireframe,
        auth: state.firebase.auth,
    };
};

const mapDispatchToProps = dispatch => ({
    wireframeChange: (id, field, to) => dispatch(wireframeChangeHandler(id, field, to)),
    wireframeDelete: (wireframe) => dispatch(wireframeDeleteHandler(wireframe))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props) => [
        {
            collection: 'wireframes',
            where: [
                ['uid', '==', props.auth.uid || ""]
            ]
        }
    ]),
)(EditScreen);