import React, { Component } from "react";
import "./tray.css";

class Tray extends Component {
  render() {
    return (
      <div className="tray">
        <div>
          {this.props.title} <p>{this.props.description}</p>
        </div>
      </div>
    );
  }
}

export default Tray;
