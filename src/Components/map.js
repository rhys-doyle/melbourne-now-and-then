import React from "react";
import mapboxgl from "mapbox-gl";
import points from "../assets/data/points_with_coords.json";
import "./map.css";

const parseCoords = str => {
  const splitter = str.replace(/\s/g, "").split(",");
  const floated = splitter.map(num => parseFloat(num, 10));
  return floated.reverse();
};

const data = {
  name: "State Library Victoria, Melbourne City Landmarks",
  type: "FeatureCollection",

  features: points.map(obj => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: parseCoords(obj.Location)
    },
    properties: {
      ID: obj.PID,
      title: obj.Title,
      description: obj.Description,
      digital_uri: obj["Digital URI"],
      contributor: obj["Creator/Contributor"],
      date: obj.Date
    }
  }))
};

console.log(data);

mapboxgl.accessToken =
  "pk.eyJ1Ijoicmh5cy0tIiwiYSI6ImNqbGJ2aDNzNDJya24zd3E4Yjg1dGswbHEifQ.OBOUcCT7jvj3dE8AifzbBw";

export default class Map extends React.Component {
  state = {
    map: null
  };

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/dark-v9",
      zoom: 13.3,
      center: [144.961418, -37.814048]
    });

    map.on("load", () => {
      map.addSource("pins", { type: "geojson", data: data });
      map.addLayer({
        id: "pins",
        type: "circle",
        source: "pins",
        paint: {
          "circle-color": "#1dcead",
          "circle-blur": 1,
          "circle-radius": 3
        }
      });
    });

    map.on("click", "pins", e => {
      var coordinates = e.features[0].geometry.coordinates.slice();

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup({
        closeButton: false,
        offset: 5,
        anchor: "bottom"
      })
        .setLngLat(coordinates)
        .setHTML(
          `<span class='title'>${
            e.features[0].properties.title
          }</span><div class='Container'><div class='imgBox'><img src='#' /></div><div class='imgBox'><img src='#' /></div></div>`
        )
        .addTo(map);

      map.easeTo({
        center: coordinates,
        zoom: 13.3,
        duration: 1600
      });
    });

    map.on("mouseenter", "pins", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "pins", () => {
      map.getCanvas().style.cursor = "";
    });

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-left"
    );

    this.setState({ map });
  }

  render() {
    return (
      <div className="mapParent">
        <div className="mapContainer" ref={el => (this.mapContainer = el)} />
        <div className="tray" />
      </div>
    );
  }
}
