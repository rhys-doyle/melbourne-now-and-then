import React from "react";
import mapboxgl from "mapbox-gl";
import _points from "../assets/data/points_with_coords.json";
import references from "../assets/data/references.json";
import development from "../assets/data/development.json";
import "./map.css";
import creeks from "../assets/data/creeks.json";
import lakes_wetlands from "../assets/data/lakes_wetlands.json";

let referencesPIDsImages = [];
let referencesPIDsMaps = [];

window.globalDangerousThing = () => {};

Object.keys(references).forEach(key => {
  referencesPIDsImages.push(key);

  // if (references[key] && references[key].includes("google")) {
  //   referencesPIDsMaps.push(key);
  // } else {
  //   referencesPIDsImages.push(key);
  // }
});

const points = _points.filter(point =>
  referencesPIDsImages.includes(point.PID)
);

const parseDate = date => {
  if (date.includes("/")) {
    return parseInt(date.split("/")[1]);
  }

  const jsDate = new Date(date);

  return jsDate.getFullYear();
};

const pointsYears = points
  .map(point => {
    return parseDate(point.Date);
  })
  .sort((a, b) => a - b);

const minYear = pointsYears[0];
const maxYear = pointsYears[pointsYears.length - 1];

console.log(minYear, maxYear, pointsYears);

const differ = value => {
  return Math.round(((parseDate(value) - minYear) / (maxYear - minYear)) * 100);
};

const mapPoints = _points.filter(point =>
  referencesPIDsMaps.includes(point.PID)
);

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
      date: obj.Date,
      diff: differ(obj.Date),
      source: references[obj.PID]
    }
  }))
};

const mapData = {
  name: "State Library Victoria, Melbourne City Landmarks",
  type: "FeatureCollection",

  features: mapPoints.map(obj => ({
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

console.log(data, mapData);

mapboxgl.accessToken =
  "pk.eyJ1Ijoicmh5cy0tIiwiYSI6ImNqbGJ2aDNzNDJya24zd3E4Yjg1dGswbHEifQ.OBOUcCT7jvj3dE8AifzbBw";

export default class Map extends React.Component {
  state = {
    map: null
  };

  patchCoords = (bounds, coordinates) => {
    const { _ne, _sw } = bounds;

    const maxLat = _sw.lat;
    const minLat = _ne.lat;

    const diff = (maxLat - minLat) * 0.25;

    var patchedCoords = coordinates;
    patchedCoords[1] = patchedCoords[1] - diff;

    return patchedCoords;
  };

  closeHandler = popup => {
    popup.on("close", () => this.props.onCloseTray());
  };

  componentWillMount() {
    window.globalDangerousThing = details => {
      this.props.onToggleTray(details);
    };
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/dark-v9",
      zoom: 13.3,
      center: [144.961418, -37.814048]
    });

    map.on("load", () => {
      map.addSource("pins", { type: "geojson", data: data });
      map.addSource("mapPins", { type: "geojson", data: mapData });
      map.addSource("development", { type: "geojson", data: development });
      map.addSource("lakes", { type: "geojson", data: lakes_wetlands });
      map.addSource("creeks", { type: "geojson", data: creeks });
      map.addLayer({
        id: "development",
        type: "fill",
        source: "development",
        paint: {
          "fill-opacity": 0.1,
          "fill-color": "#ec9eec"
        }
      });

      map.addLayer({
        id: "pins",
        type: "circle",
        source: "pins",
        paint: {
          "circle-blur": 0,
          "circle-radius": 5,
          "circle-color": [
            "interpolate",
            ["linear"],
            ["number", ["get", "diff"]],
            0,
            "#f7bb04",
            100,
            "#00d8b0"
          ]
        }
      });

      map.addLayer({
        id: "lakes",
        type: "fill",
        source: "lakes",
        paint: {
          "fill-outline-color": "#5d9cee",
          "fill-color": "#5d9cee",
          "fill-opacity": 0.1
        }
      });

      map.addLayer({
        id: "lakeslabels",
        type: "symbol",
        source: "lakes",
        layout: {
          "symbol-placement": "point",
          "text-field": "{type}",
          "text-size": 12
        },
        paint: {
          "text-color": "#59dcee"
        }
      });

      map.addLayer({
        id: "creeks",
        type: "line",
        source: "creeks",
        paint: {
          "line-color": "#5d9cee"
        }
      });
    });

    map.on("click", "pins", e => {
      var coordinates = e.features[0].geometry.coordinates.slice();

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      let html = "";

      if (!e.features[0].properties.source.includes("google")) {
        html = `<div class='popup'><span class='title'>${
          e.features[0].properties.title
        }</span><div class='Container'><div class='imgBox'><span class="date"><span>${parseDate(
          e.features[0].properties.date
        )}</span></span><a href="${
          e.features[0].properties.digital_uri
        }" target="_blank"><img src='${require(`../assets/historic_images/${
          e.features[0].properties.ID
        }.jpg`)}' /></a></div><div class='imgBox'><span class="date"><span>now</span></span><a href="${
          references[e.features[0].properties.ID]
        }" target="_blank"><img src='${require(`../assets/modern_images/${
          e.features[0].properties.ID
        }.jpg`)}' /></a></div></div><button class='more' onclick='globalDangerousThing(${JSON.stringify(
          e.features[0].properties
        )})'>Read More...</button></div>`;
      } else {
        html = `<div class='popup'><span class='title'>${
          e.features[0].properties.title
        }</span><div class='Container'><div class='imgBox'><span class="date"><span>${parseDate(
          e.features[0].properties.date
        )}</span></span><a href="${
          e.features[0].properties.digital_uri
        }" target="_blank"><img src='${require(`../assets/historic_images/${
          e.features[0].properties.ID
        }.jpg`)}' /></a></div><div class='imgBox'><span class="date"><span>now</span></span><iframe src='${
          references[e.features[0].properties.ID]
        }' width="100%" height="200" frameborder="0" style="border:0" allowfullscreen></iframe></div></div><button class='more' onclick='globalDangerousThing(${JSON.stringify(
          e.features[0].properties
        )})'>Read More...</button></div>`;
      }

      const pop = new mapboxgl.Popup({
        closeButton: false,
        offset: 5,
        anchor: "bottom"
      })
        .setLngLat(coordinates)
        .setHTML(html)
        .addTo(map);

      this.closeHandler(pop);

      map.easeTo({
        center: this.patchCoords(map.getBounds(), coordinates),
        duration: 1600
      });
    });

    // map.on("click", "lakes", e => {
    //   new mapboxgl.Popup({
    //     closeButton: false,
    //     offset: 2,
    //     anchor: "bottom"
    //   }).setLngLat(e.features[0].geometry.coordinates);
    // });

    map.on("click", "development", e => {
      var coordinates = e.features[0].geometry.coordinates.slice();
      coordinates = coordinates[0][0];

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      console.log(e.features[0]);

      new mapboxgl.Popup({
        closeButton: false,
        offset: 5,
        anchor: "top"
      })
        .setLngLat(coordinates)
        .setHTML(
          `<span class='devTitle'>${e.features[0].properties.shape_type.replace(
            "_",
            " "
          )}: ${e.features[0].properties.status}</span>`
        )
        .addTo(map);

      map.easeTo({
        center: this.patchCoords(map.getBounds(), coordinates),
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
      </div>
    );
  }
}
