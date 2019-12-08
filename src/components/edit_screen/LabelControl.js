import React, { Component } from 'react';
import { Rnd } from 'react-rnd';

class LabelControl extends Component {
    colorToString = (color) => {
        return "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
    }

    render() {
        return (<Rnd
            size={{ width: this.props.control.width + "px", height: this.props.control.height + "px" }}
            position={{ x: this.props.control.x, y: this.props.control.y }}
            onDrag={(e, d) => {
                this.props.changePosition(this.props.index, { x: d.x, y: d.y });
            }}
            onResize={(e, direction, ref, delta, position) => {
                this.props.changeSize(
                    this.props.index,
                    {
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height),
                        x: position.x,
                        y: position.y
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
                color: this.colorToString(this.props.control.color),
                fontSize: this.props.control["font-size"] + "px",
                wordWrap: "break-word"
            }} onClick={(e) => { e.stopPropagation(); this.props.selectControl(this.props.control) }}>{this.props.control.text}</div>
        </Rnd>);
    }
}

export default LabelControl;