import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { wireframeChangeHandler } from '../../store/database/asynchHandler';
import { wireframeDeleteHandler } from '../../store/database/asynchHandler';
import { Modal, Button } from 'react-materialize';
import ContainerControl from './ContainerControl';

class EditScreen extends Component {
    markForDeletion = false;

    state = {
        name: '',
        selectedControl: null,
        controls: this.props.wireframe ? this.props.wireframe.controls : null,
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
        let controls = this.state.controls ? this.state.controls : this.props.wireframe.controls;
        controls[index].x = posObj.x;
        controls[index].y = posObj.y;
        this.setState(state => ({
            ...state,
            controls: controls,
        }));
        console.log(this.state.controls[index]);
    }

    changeSize = (index, sizeObj) => {
        let controls = this.state.controls ? this.state.controls : this.props.wireframe.controls;
        controls[index].width = sizeObj.width;
        controls[index].height = sizeObj.height;
        this.setState(state => ({
            ...state,
            controls: controls,
        }));
        console.log(this.state.controls[index]);
    }

    render() {
        const auth = this.props.auth;
        const wireframe = this.props.wireframe;
        let controls = this.state.controls ? this.state.controls : this.props.wireframe ? this.props.wireframe.controls : null;
        console.log(controls);
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
        return (
            <div className="container">
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
                </div><br />
                <div className="properties">
                    <strong>Properties</strong><hr />
                    Text:
                    <input className="text_prop" disabled={this.value ? false : true}></input>
                    <br />
                    Font Size:
                    <input className="font-size_prop" disabled={this.value ? false : true}></input>
                    Font color:&nbsp;
                    <input className="font-color_prop" type="color" disabled={this.value ? false : true}></input>
                    <br /><br />
                    Background color:&nbsp;
                    <input className="background-color_prop" type="color" disabled={this.value ? false : true}></input>
                    <br /><br />
                    Border color:&nbsp;
                    <input className="border-color_prop" type="color" disabled={this.value ? false : true}></input>
                    <br /><br />
                    Border thickness:
                    <input className="border-thickness_prop" disabled={this.value ? false : true}></input>
                    <br />
                    Border radius:
                    <input className="border-radius_prop" disabled={this.value ? false : true}></input>

                </div>
                <div className="wireframe">
                    {controls.map((control, index) => {
                        switch (control.type) {
                            case "container":
                                return (<ContainerControl key={index} selectControl={(index) => this.setState(state => ({ ...state, selectedControl: this.state.controls[index] }))} index={index} control={control} changePosition={(index, posObj) => { this.changePosition(index, posObj) }} changeSize={(index, sizeObj) => { this.changeSize(index, sizeObj) }}></ContainerControl>);
                            default:
                                return "";
                        }
                    })}
                </div><br />
                <canvas id="rectSelection" width={this.state.selectedControl ? this.state.selectedControl.width + 2 : 0} height={this.state.selectedControl ? this.state.selectedControl.height + 2 : 0} left={this.state.selectedControl ? this.state.selectedControl.x + 1 : 0} top={this.state.selectedControl ? this.state.selectedControl.y + 1 : 0} style={{ border: "1px solid #d3d3d3" }} hidden={this.state.selectedControl ? false : true}></canvas>
            </div>
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