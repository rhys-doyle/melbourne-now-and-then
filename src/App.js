import React, { Component } from "react";
import "./App.css";
import Map from "./Components/map";
import Welcome from "./Components/welcome";
import Tray from "./Components/tray";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="headerBox">
          <h1 className="header">Melbourne: Now and Then</h1>
        </div>
        <Map />
        <div className="perm-legend">
          <div className="image">Landmark with Image</div>
          <div className="streetview">Landmark with Streetview</div>
          <div className="futureDev">Future Development</div>
        </div>
        <Welcome />
        <Tray />
      </div>
    );
  }
}

export default App;
