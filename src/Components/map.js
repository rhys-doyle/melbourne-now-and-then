import React from "react";
import mapboxgl from "mapbox-gl";
import { add } from "gl-matrix/src/gl-matrix/vec3";

mapboxgl.accessToken =
  "pk.eyJ1Ijoicmh5cy0tIiwiYSI6ImNqbGJ2aDNzNDJya24zd3E4Yjg1dGswbHEifQ.OBOUcCT7jvj3dE8AifzbBw";

export default class Map extends React.Component {
  state = {};

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/dark-v9",
      zoom: 10.5
    });
  
  map.on('load', () => {
    map.addSource('pins', { type:})
  })
  
  }
}
