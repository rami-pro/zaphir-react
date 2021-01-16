import React, { useRef, useEffect, Component } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: props.center.lng,
      lat: props.center.lat,
      zoom: props.zoom,
    };
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    console.log(this.state);
    const map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.state.lat, this.state.lng],
      zoom: this.state.zoom,
    });
    new mapboxgl.Marker()
      .setLngLat([this.state.lat, this.state.lng])
      .addTo(map);
    map.on("move", () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });
  }

  render() {
    return (
      <div
        ref={this.mapRef}
        className={`map ${this.props.className}`}
        style={this.props.style}
      ></div>
    );
  }
}

export default Map;
