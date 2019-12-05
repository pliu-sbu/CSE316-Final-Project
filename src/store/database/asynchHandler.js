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
        fireStore.collection("wireframes").get().then((querySnapshot) => { //need to perform query here, will do that later
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

        fireStore.collection("wireframes").get().then((querySnapshot) => {
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

export const moveItemHandler = (wireframe, index, step) => (dispatch, getState) => {
    let itemsArray = wireframe.items;
    let initItem = itemsArray[index];
    if (step < 0) {
        itemsArray.splice(index + step, 0, initItem);
        itemsArray.splice(index + 1, 1);
    } else {
        itemsArray.splice(index + step + 1, 0, initItem);
        itemsArray.splice(index, 1);
    }
    console.log(itemsArray);
    itemsArray[index + step].key = index + step;
    itemsArray[index].key = index;
    updateItems(wireframe.id, itemsArray);
};

export const removeItemHandler = (wireframe, index) => (dispatch, getState) => {
    let itemsArray = wireframe.items;
    itemsArray.splice(index, 1);
    updateItems(wireframe.id, itemsArray.map(item => {
        if (item.key > index) {
            item.key = item.key - 1;
        }
        return item;
    }));
};

export const editItemHandler = (wireframe, itemToEdit, index) => (dispatch, getState) => {
    let itemsArray = wireframe.items;
    if (index !== "" && index !== undefined) {
        itemsArray[index] = itemToEdit;
    } else {
        itemToEdit.key = itemsArray.length;
        itemsArray.push(itemToEdit);
    }
    updateItems(wireframe.id, itemsArray);
};

export const sortItemHandler = (wireframe, param, increasing) => (dispatch, getState) => {
    let itemsArray = wireframe.items;
    itemsArray.sort((item1, item2) => {
        if (!increasing) {
            let temp = item1;
            item1 = item2;
            item2 = temp;
        }
        switch (param) {
            case ("task"):
                if (item1.description < item2.description) {
                    return -1;
                } else if (item1.description > item2.description) {
                    return 1;
                } else {
                    return 0;
                }
            case ("date"):
                let date1 = new Date(item1.due_date);
                let date2 = new Date(item2.due_date);
                if ((Date.parse(date1) || Number.NEGATIVE_INFINITY) < (Date.parse(date2) || Number.NEGATIVE_INFINITY)) {
                    return -1;
                } else if ((Date.parse(date1) || Number.NEGATIVE_INFINITY) > (Date.parse(date2) || Number.NEGATIVE_INFINITY)) {
                    return 1;
                } else {
                    return 0;
                }
            default:
                if (item1.completed < item2.completed) {
                    return -1;
                } else if (item1.completed > item2.completed) {
                    return 1;
                } else {
                    return 0;
                }
        }
    }).map((item, index) => {
        item.key = index;
        return item;
    });
    updateItems(wireframe.id, itemsArray);
};

const updateItems = (id, items) => {
    const fireStore = getFirestore();
    const batch = fireStore.batch();
    let initRef = fireStore.collection('wireframes').doc(id);
    batch.update(initRef, { items: items });
    batch.commit();
}