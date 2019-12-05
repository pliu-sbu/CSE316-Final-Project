import * as actionCreators from '../actions/actionCreators'
const initState = {
    wireframes: []
};

const wireframeReducer = (state = initState, action) => {
    console.log(action.type);
    console.log("action prototype: "+Object.getPrototypeOf(action));
    switch (action.type) {
        /* IF YOU HAVE ANY TODO LIST EDITING REDUCERS ADD THEM HERE */
        case actionCreators.CREATE_WIREFRAME:
            return state;
        case actionCreators.CREATE_WIREFRAME_ERROR:
            return state;
        default:
            return state;
    }
};

export default wireframeReducer;