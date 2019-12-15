import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeCard from './WireframeCard';
import { moveWireframeToTopHandler } from '../../store/database/asynchHandler'
import { Modal, Button } from 'react-materialize';
import { wireframeDeleteHandler } from '../../store/database/asynchHandler';

class WireframeLinks extends React.Component {
    handleWireframeDelete = (key, index) => {
        this.props.wireframeDelete(key, index, this.props.auth.uid);
    }

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
                    <div key={wireframe.key}>
                        <Modal
                            header="Confirm Deleting Wireframe"
                            trigger={<p className="btn trashcan">×</p>}
                            actions={
                                <div>
                                    <Button modal="close" className="red darken-2" onClick={() => this.handleWireframeDelete(wireframe.id, wireframe.key)}>Confirm</Button>
                                    &nbsp;&nbsp;&nbsp;
                                                                    <Button modal="close" >dismiss</Button>
                                </div>
                            }
                        >
                            <h5>Are you sure you want to delete this Wireframe?</h5>
                        </Modal>
                        <Link to={'/wireframe/' + wireframe.id} key={wireframe.key} className="collection-item" onClick={() => this.props.moveWireframeToTop(wireframe)}>
                            <WireframeCard wireframe={wireframe} />
                        </Link>
                    </div>
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
    wireframeDelete: (key, index, uid) => dispatch(wireframeDeleteHandler(key, index, uid))
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(WireframeLinks);