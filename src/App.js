import React, { Component } from "react";
import "./App.css";
import Map from "./Components/map";
import Welcome from "./Components/welcome";
import Tray from "./Components/tray";

class App extends Component {
  state = {
    showTray: false
  };

  toggleTray = details => {
    if (details) {
      this.setState({
        showTray: true,
        activePoint: details
      });
    } else {
      this.setState({
        showTray: true
      });
    }
  };

  render() {
    return (
      <div className="App">
        <div className="headerBox">
          <h1 className="header">Melbourne: Now and Then</h1>
        </div>
        <Map
          onToggleTray={this.toggleTray}
          onCloseTray={() => this.setState({ showTray: false })}
        />
        <div className="perm-legend">
          <div className="image">Landmark with Image</div>
          <div className="streetview">Landmark with Streetview</div>
          <div className="futureDev">Future Development</div>
        </div>
        <Welcome />
        {!!this.state.showTray && <Tray {...this.state.activePoint} />}
      </div>
    );
  }
}

export default App;
