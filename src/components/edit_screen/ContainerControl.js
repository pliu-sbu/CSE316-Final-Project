import React, { Component } from 'react';
import { Rnd } from 'react-rnd';

class ContainerControl extends Component {
    state = {
        index: this.props.index,
        x: this.props.control.x,
        y: this.props.control.y,
    }

    render() {
        return (<Rnd
            size={{ width: this.props.control.width + "px", height: this.props.control.height + "px" }}
            position={{ x: this.state.x, y: this.state.y }}
            onDrag={(e, d) => {
                this.props.changePosition(this.state.index, { x: d.x, y: d.y });
                this.setState(state => ({
                    ...state,
                    x: d.x,
                    y: d.y
                }));
            }}
            onResize={(e, direction, ref, delta, position) => {
                this.props.changeSize(
                    this.state.index,
                    {
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height),
                        x: position.x,
                        y: position.y
                    });
                this.setState(state => ({
                    ...state,
                    x: position.x,
                    y: position.y,
                }));
            }}
        >
            <div style={{
                position: "relative",
                width: this.props.control.width + "px",
                height: this.props.control.height + "px",
                border: "solid",
                borderColor: this.props.control["border-color"],
                backgroundColor: this.props.control["background-color"],
                borderWidth: this.props.control["border-width"] + "px",
                borderRadius: this.props.control["border-radius"] + "px",
            }} onClick={(e) => { e.stopPropagation(); this.props.selectControl(this.props.control) }}></div>
        </Rnd>);
    }
}

export default ContainerControl;