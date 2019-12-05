import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeCard from './WireframeCard';
import { moveWireframeToTopHandler } from '../../store/database/asynchHandler'

class WireframeLinks extends React.Component {
    render() {
        const wireframes = this.props.wireframes;
        console.log(wireframes);
        return (
            <div className="wireframes section collection blue lighten-2">
                {wireframes && wireframes.sort((a, b) => {
                    if (a.key < b.key) return -1;
                    if (a.key > b.key) return 1;
                    return 0;
                }).map(wireframe => (
                    <Link to={'/wireframe/' + wireframe.id} key={wireframe.key} className="collection-item" onClick={() => this.props.moveWireframeToTop(wireframe)}>
                        <WireframeCard wireframe={wireframe} />
                    </Link>
                ))}
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
    moveWireframeToTop: wireframe => dispatch(moveWireframeToTopHandler(wireframe)),
});

export default compose(connect(mapStateToProps,mapDispatchToProps))(WireframeLinks);