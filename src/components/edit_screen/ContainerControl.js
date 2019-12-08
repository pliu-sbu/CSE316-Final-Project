import React, { Component } from 'react';
import { Rnd } from 'react-rnd';

class ContainerControl extends Component {
    colorToString = (color) => {
        return "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
    }

    render() {
        return (<Rnd
            size={{ width: this.props.control.width + "px", height: this.props.control.height + "px" }}
            position={{ x: this.props.control.x - this.props.scrollOffsets[0], y: this.props.control.y - this.props.scrollOffsets[1] }}
            onDrag={(e, d) => {
                this.props.changePosition(this.props.index, { x: d.x - this.props.scrollOffsets[0], y: d.y - this.props.scrollOffsets[1] });
            }}
            onResize={(e, direction, ref, delta, position) => {
                this.props.changeSize(
                    this.props.index,
                    {
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height),
                        x: position.x + this.props.scrollOffsets[0],
                        y: position.y + this.props.scrollOffsets[1]
                    });
            }}
        >
            <div style={{
                position: "relative",
                width: this.props.control.width + "px",
                height: this.props.control.height + "px",
                border: "solid",
                borderColor: this.colorToString(this.props.control["border-color"]),
                backgroundColor: this.colorToString(this.props.control["background-color"]),
                borderWidth: this.props.control["border-width"] + "px",
                borderRadius: this.props.control["border-radius"] + "px",
            }} onClick={(e) => { e.stopPropagation(); this.props.selectControl(); }}></div>
        </Rnd>);
    }
}

export default ContainerControl;