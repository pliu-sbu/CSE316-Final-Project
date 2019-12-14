import * as actionCreators from '../actions/actionCreators.js'
import { getFirestore } from 'redux-firestore';

export const loginHandler = ({ credentials, firebase }) => (dispatch, getState) => {
    firebase.auth().signInWithEmailAndPassword(
        credentials.email,
        credentials.password,
    ).then(() => {
        console.log("LOGIN_SUCCESS");
        dispatch({ type: 'LOGIN_SUCCESS' });
    }).catch((err) => {
        dispatch({ type: 'LOGIN_ERROR', err });
    });
};

export const logoutHandler = (firebase) => (dispatch, getState) => {
    firebase.auth().signOut().then(() => {
        dispatch(actionCreators.logoutSuccess);
    });
};

export const registerHandler = (newUser, firebase) => (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firebase.auth().createUserWithEmailAndPassword(
        newUser.email,
        newUser.password,
    ).then(resp => firestore.collection('users').doc(resp.user.uid).set({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        initials: `${newUser.firstName[0]}${newUser.lastName[0]}`,
        isAdmin: false
    })).then(() => {
        dispatch(actionCreators.registerSuccess);
    }).catch((err) => {
        dispatch(actionCreators.registerError);
    });
};

export const createWireframeHandler = (key, uid) => (dispatch, getState) => {
    const fireStore = getFirestore();
    fireStore.collection('wireframes').add({
        key: key,
        name: "Unknown",
        uid: uid,
        width: 500,
        height: 500,
        controls: []
    }).then((ref) => {
        ref.get().then(async (doc) => {
            let initObj = doc.data();
            initObj.id = ref.id;
            await moveWireframeToTopHelper(initObj);
            dispatch(actionCreators.createWireframe);
        });
    }).catch((err) => {
        console.log(err);
        dispatch(actionCreators.createWireframeError);
    });
};

export const moveWireframeToTopHandler = (wireframe) => async (dispatch, getState) => {
    if (!wireframe) return;
    await moveWireframeToTopHelper(wireframe);
};

const moveWireframeToTopHelper = (wireframe) => {
    return new Promise(resolve => {
        const fireStore = getFirestore();
        const batch = fireStore.batch();
        let initRef = fireStore.collection('wireframes').doc(wireframe.id);
        batch.update(initRef, { key: -2 });
        fireStore.collection("wireframes").where("uid", "==", wireframe.uid).get().then((querySnapshot) => { //need to perform query here, will do that later
            querySnapshot.docs.forEach((doc) => {
                let docref = fireStore.collection('wireframes').doc(doc.id);
                /*fireStore.runTransaction((transaction) => {
                    return transaction.get(docref).then(function (doc) {
                        if (!doc.exists) {
                            return;
                        }
                        let wireframekey = doc.data().key;
                        if (wireframekey < wireframe.key) {
                            transaction.update(docref, { key: wireframekey + 1 });
                            return wireframekey+1;
                        } else {
                            return wireframekey;
                        };
                    });
                })*/
                let wireframekey = doc.data().key;
                if (wireframekey < wireframe.key) {
                    batch.update(docref, { key: wireframekey + 1 });
                }
            })
        }).then(() => {
            batch.update(initRef, { key: 0 });
            batch.commit();
            console.log("resolved");
            resolve("resolved");
        }).catch((err) => {
            //console.log(err);
            //dispatch(actionCreators.moveWireframeError);
        });;
    });
}

export const wireframeChangeHandler = (id, field, to) => (dispatch, getState) => {
    const fireStore = getFirestore();
    const batch = fireStore.batch();
    let initRef = fireStore.collection('wireframes').doc(id);
    batch.update(initRef, { [field]: to });
    batch.commit();
};

export const wireframeDeleteHandler = (wireframe) => (dispatch, getState) => {
    const fireStore = getFirestore();
    const batch = fireStore.batch();
    fireStore.collection("wireframes").doc(wireframe.id).delete().then(function () {
        console.log("Document successfully deleted!");

        fireStore.collection("wireframes").where("uid", "==", wireframe.uid).get().then((querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {
                let docref = fireStore.collection('wireframes').doc(doc.id);
                let wireframekey = doc.data().key;
                batch.update(docref, { key: wireframekey - 1 });
            });
        }).then(() => {
            batch.commit().then(() => {
                dispatch(actionCreators.deleteWireframe);
            });
        }).catch(function (error) {
            console.error("Error removing document: ", error);
            dispatch(actionCreators.deleteWireframeError);
        });
    });
};