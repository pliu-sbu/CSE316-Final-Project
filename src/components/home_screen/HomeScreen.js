import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import WireframeLinks from './WireframeLinks';
import { createWireframeHandler } from '../../store/database/asynchHandler'

class HomeScreen extends Component {
    newWireframeCreated = false;
    handleNewWireframe = () => {
        const wireframes = this.props.wireframes;
        this.props.createWireframe(wireframes.length, this.props.auth.uid);
        this.newWireframeCreated = true;
    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        if (this.newWireframeCreated) {
            this.newWireframeCreated = false;
            return <Redirect to={"/wireframe/" + this.props.wireframes.find(wireframe => {
                return wireframe.key === this.props.wireframes.length - 1;
            }).id} />;
        }

        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <br /><h5 className="center blue lighten-2 white-text card-panel">Recent Work</h5>
                        <WireframeLinks />
                    </div>

                    <div className="col s8">
                        <div className="banner">
                            Wireframer™<br /><br /><br />
                        </div>

                        <div className="home_new_wireframe_container">
                            <button className="home_new_wireframe_button btn-large waves-effect" onClick={this.handleNewWireframe}>
                                Create New Wireframe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        wireframes: state.firestore.ordered.wireframes,
        auth: state.firebase.auth,
    };
};

const mapDispatchToProps = dispatch => ({
    createWireframe: (key, uid) => dispatch(createWireframeHandler(key, uid)),
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props) => [
        {
            collection: 'wireframes',
            where: [
                ['uid', '==', props.auth.uid]
            ]
        }
    ]),
)(HomeScreen);