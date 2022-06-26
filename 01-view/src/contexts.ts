import { Persisted, Store as StoreData } from "@model";
import { Map } from "leaflet";
import { createContext, useContext } from "react";
import { NamedPathData } from "./store/Store";

export type { NamedPathData };

export function usePersistedPathStore(): Persisted<StoreData<NamedPathData>> {
  const p = useContext(PathStorePersistanceContext);
  if (!p) {
    throw new Error(
      "usePersistedPathStore must be used within a PathStorePersistanceContext.Provider"
    );
  }
  return p;
}

/**
 *
 * @returns For component that need the map but cannot call use react-leaflet useMap() to access it as they are not within the map.
 */
export function useNeighborMap(): Map {
  const p = useContext(NeighborMapContext);
  if (!p) {
    throw new Error(
      "useNeighborMap must be used within a NeighborMapContext.Provider"
    );
  }
  return p;
}

export const PathStorePersistanceContext = createContext<
  Persisted<StoreData<NamedPathData>> | undefined
>(undefined);

export const NeighborMapContext = createContext<Map | undefined>(undefined);
