import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { wireframeChangeHandler } from '../../store/database/asynchHandler';
import { wireframeDeleteHandler } from '../../store/database/asynchHandler';
import { Modal, Button } from 'react-materialize';
import PropertiesControl from './PropertiesControl';
import ContainerControl from './ContainerControl';
import LabelControl from './LabelControl';

class EditScreen extends Component {
    markForDeletion = false;
    state = {
        name: '',
        selectedControl: null,
        selectedIndex: -1,
        controls: null,
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
                controls: this.props.wireframe ? this.props.wireframe.controls : null
            }))
        }
    }

    handleChange = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }), () => {
            const wireframe = this.props.wireframe;
            this.props.wireframeChange(wireframe.id, target.id, this.state[target.id]);
        });
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
        let controls = this.state.controls;
        updatedControl.x += 100;
        updatedControl.y += 100;
        controls.push(updatedControl);
        this.setState(state => ({
            ...state,
            selectedControl: updatedControl,
            selectedIndex: controls.length - 1,
            controls: controls
        }));
        //console.log(updatedControl);
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
                        <i className="small zoom material-icons">zoom_in</i>
                        <i className="small zoom material-icons">zoom_out</i>
                        &nbsp;&nbsp;
                    <Button className="save-btn waves-effect">Save</Button>
                        &nbsp;
                    <Link to="/"><Button className="close-btn waves-effect">Close</Button></Link>
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
                    <div className="input-field">
                        <label htmlFor="email" className={wireframe.name === "" ? "" : "active"}>Name</label>
                        <input className="active" type="text" name="name" id="name" onChange={this.handleChange} value={wireframe.name} />
                    </div>
                    <div className="control-collection">
                        <div className="rectangle control-demo"></div>
                        <label>Container</label>
                        <br /><br />
                        <div className="control-demo">Prompt for Input:</div>
                        <label>Label</label>
                        <br /><br />
                        <button className="button-demo control-demo" disabled>Submit</button><br />
                        <label>Button</label>
                        <br /><br />
                        <input className="input-demo control-demo" placeholder='Input' disabled></input>
                        <br />
                        <label>Textfield</label>
                    </div>
                </div> <br />
                <PropertiesControl selectedControl={this.state.selectedControl} changeControlProps={(type, value) => { this.changeControlProps(type, value) }}></PropertiesControl>}
                <div className="wireframe" onClick={(e) => this.clearSelectionDetection(e)}>
                    {controls.map((control, index) => {
                        switch (control.type) {
                            case "container":
                                return (
                                    <ContainerControl key={index}
                                        selectControl={() => this.setState(state => ({ ...state, selectedControl: control, selectedIndex: index }))}
                                        index={index}
                                        control={control}
                                        changePosition={(index, posObj) => { this.changePosition(index, posObj) }}
                                        changeSize={(index, sizeObj) => { this.changeSize(index, sizeObj) }}></ContainerControl>);
                            case "label":
                                return (
                                    <LabelControl key={index}
                                        selectControl={() => this.setState(state => ({ ...state, selectedControl: control, selectedIndex: index }))}
                                        index={index}
                                        control={control}
                                        changePosition={(index, posObj) => { this.changePosition(index, posObj) }}
                                        changeSize={(index, sizeObj) => { this.changeSize(index, sizeObj) }}></LabelControl>);
                            default:
                                return "";
                        }
                    })}
                    <canvas id="rectSelection"
                        width={this.state.selectedControl ? this.state.selectedControl.width + 6 : 0}
                        height={this.state.selectedControl ? this.state.selectedControl.height + 6 : 0}
                        style={{
                            position: "relative", border: "2px solid #d3d3d3", zIndex: 0, pointerEvents: "none", borderColor: "red", borderStyle: "dashed",
                            left: (this.state.selectedControl ? this.state.selectedControl.x - 6 : 0) + "px",
                            top: (this.state.selectedControl ? this.state.selectedControl.y - 6 : 0) + "px"
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