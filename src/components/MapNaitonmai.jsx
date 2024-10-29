import React from "react";
import Header from "./Header";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility";
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

export default function MapNaitonmai() {
    const markerIcon = new L.Icon({
        iconUrl: "https://cdn.pixabay.com/photo/2014/04/03/10/03/google-309740_1280.png",
        iconSize: [35,35],
    });
    const position = [13.745972896168352, 100.53439096546253]
  return (
    <div style={{ width: '100%', height: '100%', aspectRatio: 0.5}}>
      <Header />
      <MapContainer style={{width: '100%', height: '100%'}} center={position} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[13.745972896168352, 100.53439096546253]} icon={markerIcon}>
          <Popup>
            ร้านผลไม้นายต้นไม้
          </Popup>
        </Marker>
      </MapContainer>
      ,
    </div>
  );
}