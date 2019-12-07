import React, { Component } from 'react';
import { ChromePicker } from 'react-color';

class PropertiesControl extends Component {
    transparentColor = { r: 255, g: 255, b: 255, a: 0 };
    state = {
        colorControl: "background-color"
    }
    render() {
        if (!this.props.selectedControl) return null;
        return (<div className="properties">
            <strong>Properties</strong><hr />
            <div className="special_props" hidden={this.props.selectedControl.type === "container"}>
                Text:
            <input className="text_prop" value={this.props.selectedControl.text || ""} onChange={(e) => { this.props.changeControlProps("text", e.target.value || "") }}></input>
                <br />
                Font Size:
            <input className="font-size_prop" value={this.props.selectedControl['font-size'] || 0} onChange={(e) => { this.props.changeControlProps("font-size", parseInt(e.target.value) || 0) }}></input>
            </div>
            <select id="colorTarget" className="browser-default" style={{ fontSize: 13.5, height: "2rem" }} onChange={(e) => this.setState({ colorControl: e.target.options[e.target.selectedIndex].value })}>
                <option value="background-color" selected> Background color</option>
                {this.props.selectedControl.type !== "container" ? <option value="color">Font color</option> : ""}
                <option value="border-color">Border color</option>
            </select>
            <ChromePicker
                className="color_picker"
                color={this.props.selectedControl[this.state.colorControl]}
                onChange={(color) => { this.props.changeControlProps(this.state.colorControl, color.rgb || this.transparentColor) }}
                width={"auto"}
            />
            <br />
            Border thickness:
        <input className="border-width_prop" value={this.props.selectedControl['border-width'] || 0} onChange={(e) => { this.props.changeControlProps("border-width", parseInt(e.target.value) || 0) }}></input>
            <br />
            Border radius:
        <input className="border-radius_prop" value={this.props.selectedControl['border-radius'] || 0} onChange={(e) => { this.props.changeControlProps("border-radius", parseInt(e.target.value) || 0) }}></input>

        </div>)
    }
}

export default PropertiesControl;