import React, { Component } from 'react';

class PropertiesControl extends Component {
    render() {
        if (!this.props.selectedControl) return null;
        return (<div className="properties">
            <strong>Properties</strong><hr />
            <div className="special_props" hidden={this.props.selectedControl.type === "container"}>
                Text:
            <input className="text_prop" value={this.props.selectedControl.text} onChange={(e) => { this.props.changeControlProps("text", e.target.value || "") }}></input>
                <br />
                Font Size:
            <input className="font-size_prop" value={this.props.selectedControl['font-size']} onChange={(e) => { this.props.changeControlProps("border-width", parseInt(e.target.value) || 0) }}></input>
                Font color:&nbsp;
            <input className="font-color_prop" type="color" value={this.props.selectedControl.color} onChange={(e) => { this.props.changeControlProps("color", e.target.value || "#000000") }}></input>
            </div>
            <br />
            Background color:&nbsp;
        <input className="background-color_prop" type="color" value={this.props.selectedControl['background-color']} onChange={(e) => { this.props.changeControlProps("background-color", e.target.value || "transparent") }}></input>
            <br /><br />
            Border color:&nbsp;
        <input className="border-color_prop" type="color" value={this.props.selectedControl['border-color']} onChange={(e) => { this.props.changeControlProps("border-color", e.target.value || "#000000") }}></input>
            <br /><br />
            Border thickness:
        <input className="border-width_prop" value={this.props.selectedControl['border-width']} onChange={(e) => { this.props.changeControlProps("border-width", parseInt(e.target.value) || 0) }}></input>
            <br />
            Border radius:
        <input className="border-radius_prop" value={this.props.selectedControl['border-radius']} onChange={(e) => { this.props.changeControlProps("border-radius", parseInt(e.target.value) || 0) }}></input>

        </div>)
    }
}

export default PropertiesControl;