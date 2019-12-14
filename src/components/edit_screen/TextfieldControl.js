import React, { Component } from 'react';
import { Rnd } from 'react-rnd';

class TextfieldControl extends Component {
    colorToString = (color) => {
        return "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
    }

    render() {
        return (<Rnd
            size={{ width: this.props.control.width * this.props.scale + "px", height: this.props.control.height * this.props.scale + "px" }}
            position={{ x: (this.props.control.x - this.props.scrollOffsets[0]), y: (this.props.control.y - this.props.scrollOffsets[1]) }}
            onDrag={(e, d) => {
                this.props.changePosition(this.props.index, { x: (d.x - this.props.scrollOffsets[0]) < 0 ? 0 : (d.x - this.props.scrollOffsets[0]), y: (d.y - this.props.scrollOffsets[1]) < 0 ? 0 : (d.y - this.props.scrollOffsets[1]) });
            }}
            onResize={(e, direction, ref, delta, position) => {
                this.props.changeSize(
                    this.props.index,
                    {
                        width: parseInt(ref.style.width) / this.props.scale,
                        height: parseInt(ref.style.height) / this.props.scale,
                        x: (position.x + this.props.scrollOffsets[0]),
                        y: (position.y + this.props.scrollOffsets[1])
                    });
            }}
            style={{ transform: "scale(" + this.props.scale + ")" }}
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
                color: this.colorToString(this.props.control.color),
                fontSize: this.props.control["font-size"] + "px",
                wordWrap: "break-word",
                transform: "scale(" + this.props.scale + ")"
            }} onClick={(e) => { e.stopPropagation(); this.props.selectControl(); }}>{this.props.control.text}</div>
        </Rnd>);
    }
}

export default TextfieldControl;