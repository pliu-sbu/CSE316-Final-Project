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
        owner: '',
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
                <h5 className="grey-text text-darken-3">text to add
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
                <div className="input-field">
                    <label htmlFor="password" className={wireframe.owner === "" ? "" : "active"}>Owner</label>
                    <input className="active" type="text" name="owner" id="owner" onChange={this.handleChange} value={wireframe.owner} />
                </div>
                <Link to={'/wireframe/' + wireframe.id + "/new"}>
                    <Button floating large className="red addItem">+</Button>
                </Link>
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
    firestoreConnect([
        { collection: 'wireframes' },
    ]),
)(EditScreen);