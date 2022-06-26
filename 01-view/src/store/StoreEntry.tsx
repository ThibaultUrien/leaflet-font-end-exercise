import { Entities, Paths, Store as StoreData, Stores } from "@model";
import { IconButton, ListItem, TextField } from "@mui/material";
import React, { FC, useCallback } from "react";
import { useNeighborMap } from "../contexts";

import { PropsOf } from "../types";
import { NamedPathData } from "./Store";

const TITLE_DELETE = "Delete";
const TITLE_CENTER = "Center the view";
const TITLE_EDIT = "Edit";
const PATH_NAME_TEXT = "Path name";

export interface StoreEntryProps {
  storeData: StoreData<NamedPathData>;
  pathId: string;
  setStoreData(s: StoreData<NamedPathData>): void;
  edit(): void;
  edited: boolean;
}
interface EntryActionButtonProps extends PropsOf<typeof IconButton> {
  iconClass: string;
  title: string;
}
const EntryActionButton: FC<EntryActionButtonProps> = ({
  iconClass,
  title,
  ...buttonProps
}) => (
  <IconButton {...buttonProps} title={title} size="small">
    <i className={iconClass} />
  </IconButton>
);

export const StoreEntry: FC<StoreEntryProps> = ({
  pathId,
  storeData,
  setStoreData,
  edit,
  edited,
}) => {
  const map = useNeighborMap();
  const pathData = storeData[pathId];

  if (!pathData) return null;

  const buttons: EntryActionButtonProps[] = [
    {
      iconClass: "fa-solid fa-location-crosshairs",
      title: TITLE_CENTER,
      disabled: pathData.points.length == 0,
      onClick() {
        const pathBound = Paths.bound(pathData);
        if (pathBound) map.flyToBounds(pathBound);
      },
    },
    {
      iconClass: "fa-solid fa-pen",
      title: TITLE_EDIT,
      color: edited ? "primary" : "default",
      onClick: edit,
    },
    {
      iconClass: "fa-solid fa-xmark",
      title: TITLE_DELETE,
      onClick() {
        setStoreData(Stores.remove(storeData, pathData));
      },
    },
  ];

  const setPathName = useCallback(
    (name: string) => {
      setStoreData(
        Stores.update(storeData, Entities.update(pathData, { name }))
      );
    },
    [storeData, pathData]
  );

  return (
    <ListItem
      secondaryAction={
        <>
          {buttons.map((props) => (
            <EntryActionButton {...props} key={props.title} />
          ))}
        </>
      }
    >
      <TextField
        id="standard-basic"
        variant="standard"
        size="small"
        value={pathData?.name}
        onChange={(evt) => setPathName(evt.target.value)}
        label={edited ? PATH_NAME_TEXT : undefined}
      ></TextField>
    </ListItem>
  );
};
