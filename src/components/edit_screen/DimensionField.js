import React, { Component } from 'react';

class DimensionField extends Component {
    state = {
        disableUpdate: true,
        oldCopy: [this.props.width, this.props.height],
        width: this.props.width,
        height: this.props.height
    }

    handleChange = (e) => {
        const { target } = e;
        this.setState(state => ({
            ...state,
            [target.id]: parseInt(target.value) || "",
            disableUpdate: false
        }));
    }

    updateDimensions = () => {
        //check data first, limit data to integers reset parameter if num<1 or num>5000, else pass parameter to parent and change its actual dimension, re-disable the button
        let { width, height, oldCopy } = this.state;
        if (Number.isInteger(width) && Number.isInteger(height) && width >= 1 && height >= 1 && width <= 5000 && height <= 5000) {
            //pass dimension to parent
            oldCopy = [width, height];
        } else {
            width = this.state.oldCopy[0];
            height = this.state.oldCopy[1];
        }
        this.setState(state => ({
            ...state,
            disableUpdate: true,
            oldCopy: oldCopy,
            width: width,
            height: height
        }));
        this.props.updateDimensions(width, height);
    }

    render() {
        return (
            <React.Fragment>
                <div className="input-field small">
                    <label htmlFor="email" className={this.state.width === "" ? "" : "active"}>Width</label>
                    <input className="active" type="text" name="width" id="width" onChange={this.handleChange} value={this.state.width} />
                </div>
                <div className="input-field small">
                    <label htmlFor="email" className={this.state.height === "" ? "" : "active"}>Height</label>
                    <input className="active" type="text" name="height" id="height" onChange={this.handleChange} value={this.state.height} />
                </div>
                <button className="btn-small" onClick={this.updateDimensions} disabled={this.state.disableUpdate}>Update</button> <br /> <br />
            </React.Fragment>
        );
    }
}

export default DimensionField;