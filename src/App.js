import React, { Component } from "react";
import "./App.css";
import Map from "./Components/map";
import Welcome from "./Components/welcome";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="headerBox">
          <h1 className="header">Melbourne: Now and Then</h1>
        </div>
        <Map />
        <Welcome />
      </div>
    );
  }
}

export default App;
