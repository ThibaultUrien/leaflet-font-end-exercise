import { Persisted, Serdes } from "@model";
import React, { useState } from "react";

const STORAGE_NAMESPACE = "pix4d-fe-task";
const storageId = (id: String) => `${STORAGE_NAMESPACE}/${id}`;

export function isAvailable(): boolean {
  return "localStorage" in window;
}

export function useWebStoragePersistance<Data>(
  id: string,
  type: string,
  schemaVersion: string,
  defaultValue: Data
): Persisted<Data> {
  const [data, setData] = useState(() =>
    loadEntity<Data>(id, type, schemaVersion, defaultValue)
  );

  return {
    data,
    setData: isAvailable()
      ? (d) => {
          persistEntity(id, d, type, schemaVersion);
          setData(d);
        }
      : setData,
  };
}

function loadEntity<Data>(
  id: string,
  type: string,
  schemaVersion: string,
  defaultValue: Data
): Data {
  if (!isAvailable()) return defaultValue;
  const data = localStorage.getItem(storageId(id));
  if (!data) {
    return defaultValue;
  }
  const decodedDataOrError = Serdes.deserializeEntity<Data>(
    data,
    type,
    schemaVersion
  );
  if (typeof decodedDataOrError === "string") {
    console.error(`Failed to load entity ${id}: ${decodedDataOrError}`);
    return defaultValue;
  }
  return decodedDataOrError;
}

function persistEntity(
  id: string,
  data: any,
  type: string,
  schemaVersion: string
) {
  localStorage.setItem(
    storageId(id),
    Serdes.serializeEntity(data, type, schemaVersion)
  );
}
