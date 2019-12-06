import React, { Component } from 'react';

class PropertiesControl extends Component {
    render() {
        if (!this.props.selectedControl) return null;
        return (<div className="properties">
            <strong>Properties</strong><hr />
            <div className="special_props" hidden={this.props.selectedControl.type === "container"}>
                Text:
            <input className="text_prop" value={this.props.selectedControl.text}></input>
                <br />
                Font Size:
            <input className="font-size_prop" value={this.props.selectedControl['font-size']}></input>
                Font color:&nbsp;
            <input className="font-color_prop" type="color" value={this.props.selectedControl.color}></input>
            </div>
            <br />
            Background color:&nbsp;
        <input className="background-color_prop" type="color" value={this.props.selectedControl['background-color']}></input>
            <br /><br />
            Border color:&nbsp;
        <input className="border-color_prop" type="color" value={this.props.selectedControl['border-color']}></input>
            <br /><br />
            Border thickness:
        <input className="border-width_prop" value={this.props.selectedControl['border-width']}></input>
            <br />
            Border radius:
        <input className="border-radius_prop" value={this.props.selectedControl['border-radius']}></input>

        </div>)
    }
}

export default PropertiesControl;