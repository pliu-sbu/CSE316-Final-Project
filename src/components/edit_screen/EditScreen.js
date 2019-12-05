import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { wireframeChangeHandler } from '../../store/database/asynchHandler';
import { wireframeDeleteHandler } from '../../store/database/asynchHandler';
import { Modal, Button } from 'react-materialize';

class EditScreen extends Component {
    markForDeletion = false;

    state = {
        name: '',
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
        return (
            <div className="container white">
                <h5 className="grey-text text-darken-3">
                    <i class="small zoom material-icons">zoom_in</i>
                    <i class="small zoom material-icons">zoom_out</i>
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
                <div class="control-collection">
                    <div className="rectangle control-demo"></div>
                    <label>Container</label>
                    <br/><br/>
                    <div className="control-demo">Prompt for Input:</div>
                    <label>Label</label>
                    <br/><br/>
                    <button className="button-demo control-demo" disabled>Submit</button><br/>
                    <label>Button</label>
                    <br/><br/>
                    <input className="input-demo control-demo" placeholder='Input' disabled></input>
                    <br/>
                    <label>Textfield</label>
                </div>
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