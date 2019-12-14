import React from 'react'
import { connect } from 'react-redux';
import wireframeJson from './TestWireframerData.json';
import { Redirect } from 'react-router-dom';
import { getFirestore } from 'redux-firestore';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';

class DatabaseTester extends React.Component {

    // NOTE, BY KEEPING THE DATABASE PUBLIC YOU CAN
    // DO THIS ANY TIME YOU LIKE WITHOUT HAVING
    // TO LOG IN
    handleClear = () => {
        const fireStore = getFirestore();
        fireStore.collection('wireframes').get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                console.log("deleting " + doc.id);
                fireStore.collection('wireframes').doc(doc.id).delete();
            })
        });
    }

    handleReset = () => {
        const fireStore = getFirestore();
        wireframeJson.wireframes.forEach(wireframeJson => {
            let payload = {};
            if (wireframeJson.uid) {
                payload = {
                    key: wireframeJson.key,
                    name: wireframeJson.name,
                    uid: wireframeJson.uid,
                    width: wireframeJson.width,
                    height: wireframeJson.height,
                    controls: wireframeJson.controls,
                }
            } else {
                payload = {
                    key: wireframeJson.key,
                    name: wireframeJson.name,
                    uid: this.props.auth.uid,
                    width: wireframeJson.width,
                    height: wireframeJson.height,
                    controls: wireframeJson.controls,
                }
            }
            fireStore.collection('wireframes').add(payload).then(() => {
                console.log("DATABASE RESET");
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    render() {
        if (!this.props.auth.uid || (this.props.users && this.props.users.filter(user => { return user.id === this.props.auth.uid && user.isAdmin }).length === 0)) {
            return <Redirect to="/" />;
        }

        return (
            <div>
                <button onClick={this.handleClear}>Clear Database</button>
                <button onClick={this.handleReset}>Reset Database</button>
            </div>)
    }
}

const mapStateToProps = function (state) {
    return {
        auth: state.firebase.auth,
        firebase: state.firebase,
        users: state.firestore.ordered.users
    };
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect((props) => [
        {
            collection: 'users',
        }
    ]),
)(DatabaseTester);