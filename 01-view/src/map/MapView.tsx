import React, { useContext } from "react";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import styled from "styled-components";
import { PropsOf } from "../types";

const DEFAULT_LOCATION = {
  lat: 46.5189468,
  lng: 6.5709049,
};

const StyledMapContainer = styled(MapContainer)``;
export interface MapViewProps extends PropsOf<typeof MapContainer> {
  attribution: string;
  url: string;
}

export const MapView: React.FC<MapViewProps> = ({
  attribution,
  url,
  children,
  ...mapProps
}) => {
  return (
    <MapContainer zoom={13} center={DEFAULT_LOCATION} {...mapProps}>
      <TileLayer
        attribution={attribution} //'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={url} //"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
};
