import React, { FC, ReactNode, useMemo, useState } from "react";
import { NamedPathData, Store } from "./store/Store";
import styled, { ThemeProvider } from "styled-components";
import { MapView } from "./map/MapView";
import { PathEditor } from "./map/PathEditor";
import { Store as StoreData, Path as PathData, Stores } from "@model";
import { Polyline, useMap } from "react-leaflet";
import { useTheme } from "@mui/system";
import { createTheme } from "@mui/material";
import { NeighborMapContext, usePersistedPathStore } from "./contexts";
import { Map } from "leaflet";

const AppWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 500px;
`;

// We need this as useMap is only available for component within a
// Map container, but we have component, such as the store, that need to access the map.
const MapControlExtractor: FC<{ setMap(m: Map): void }> = ({ setMap }) => {
  setMap(useMap());
  return null;
};

const MapDependency: FC<{
  map: Map | undefined;
  children?: ReactNode;
}> = ({ map, children }) =>
  (map && (
    <NeighborMapContext.Provider value={map}>
      {children}
    </NeighborMapContext.Provider>
  )) ||
  null;

export function App() {
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const { data: storeData, setData: setStoreData } = usePersistedPathStore();
  const upsertPath = (p: PathData) => setStoreData(Stores.update(storeData, p));
  const [map, setMap] = useState<Map | undefined>();

  // Use the id rather than the path itself for the state
  // to reduce the risque of having an edited path that was deleted fro, the store.
  const [editedPathId, setEditedPathId] = useState<string | undefined>();
  const editedPath = (editedPathId && storeData[editedPathId]) || undefined;

  const theme = useMemo(createTheme, []);
  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        <MapView attribution={attribution} url={url}>
          <PathEditor
            upsertPath={upsertPath}
            editedPathId={editedPathId}
            setEditedPathId={setEditedPathId}
          >
            {Stores.values(storeData).map((data) => ({
              data,
              setData: upsertPath,
            }))}
          </PathEditor>
          <MapControlExtractor setMap={setMap} />
        </MapView>
        <MapDependency map={map}>
          <Store
            data={storeData}
            setData={setStoreData}
            setEditedPath={(p) => setEditedPathId(p?.uuid)}
            editedPath={editedPath}
            map={map}
          ></Store>
        </MapDependency>
      </AppWrapper>
    </ThemeProvider>
  );
}

export default App;
