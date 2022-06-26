import { Path as PathData, Store as StoreData, Paths, Stores } from "@model";
import { Map } from "leaflet";
import React, { useCallback, useState } from "react";
import { FC } from "react";
import styled from "styled-components";
import { NewPathButton } from "./NewPathButton";
import { StoreEntry } from "./StoreEntry";

const NEW_PATH_NAME = "New Path";
export interface NamedPathData extends PathData {
  /**
   * A name to allow the user to now what is this path
   */
  name: string;
}

export interface StoreMenuProps {
  data: StoreData<NamedPathData>;
  /**
   * Set teh state of the store (not an upsert as this menu may need to delete data)
   */
  setData: (s: StoreData<NamedPathData>) => void;

  editedPath?: NamedPathData;
  setEditedPath(editedPath: NamedPathData | undefined): void;
  map?: Map;
}

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Store: FC<StoreMenuProps> = ({
  data,
  setData,
  editedPath,
  setEditedPath,
}) => {
  useCallback;

  const onNewPathClicked = () => {
    if (!editedPath) {
      const newPath: NamedPathData = { name: NEW_PATH_NAME, ...Paths.create() };
      setEditedPath(newPath);
      setData(Stores.upsert(data, newPath));
    } else {
      setEditedPath(undefined);
    }
  };

  return (
    <MenuContainer>
      <NewPathButton
        onClick={onNewPathClicked}
        path={editedPath}
        variant="contained"
      />
      {Stores.values(data).map((pathData) => {
        const edited =
          (editedPath && pathData.uuid === editedPath.uuid) || false;
        return (
          <StoreEntry
            key={pathData.uuid}
            pathId={pathData.uuid}
            setStoreData={setData}
            storeData={data}
            edit={() => setEditedPath((!edited && pathData) || undefined)}
            edited={edited}
          />
        );
      })}
    </MenuContainer>
  );
};
