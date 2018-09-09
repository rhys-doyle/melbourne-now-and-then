import React, { Component } from "react";
import "./welcome.css";

class Welcome extends Component {
  state = {
    show: true
  };

  handleContinue = () => {
    localStorage.setItem("melbourne_now_then", "true");
    this.setState({
      show: false
    });
  };

  render() {
    if (localStorage.getItem("melbourne_now_then") || !this.state.show) {
      return null;
    }

    return (
      <div className="welcomeContainer">
        <div className="welcome">
          <div className="welcomeBody">
            <h2>Welcome!</h2>
            <p>
              Melbourne: Now and Then allows you to view historical Melbourne
              Landmarks with <span className="past">past</span> and{" "}
              <span className="present">present</span> images.
            </p>
            <p>
              You can also see buildings that are upcoming and currently under
              construction, allowing you to see the{" "}
              <span className="future">future</span> surrounding these
              landmarks.
            </p>
            <div className="legend">
              <p>
                <strong>KEY</strong>
                <br />
                <span style={{ display: "block", textAlign: "center" }}>
                  Year original photo taken
                </span>
              </p>
              <div className="legend-bar" />
              <div className="futureDev" style={{ marginTop: 40 }}>
                Future Development
              </div>
            </div>
          </div>
          <div className="welcomeFooter">
            <button className="welcomeButton" onClick={this.handleContinue}>
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Welcome;
