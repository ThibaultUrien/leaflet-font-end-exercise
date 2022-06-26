import React, { FC, useState } from "react";
import { Path, PathProps } from "./Path";
import { Path as PathData, Paths } from "@model";
import { useMapEvent } from "react-leaflet";

export interface PathEditorProps {
  children?: Omit<PathProps, "edit">[];
  upsertPath(p: PathData): void;
  editedPathId: string | undefined;
  setEditedPathId(id: string | undefined): void;
}
/**
 * Drag event of marker trigger click event which trigger a point addition while the user just intend to move a point.
 * To fix this issue, click
 */
const MAX_CLICK_DURATION_MS = 200;

// Bad but naively using a state somehow mess up with leaflet event system
// and we end up with ,arker than cannot be dragged.
let clickStart: number | undefined;

export const PathEditor: FC<PathEditorProps> = ({
  children,
  editedPathId,
  setEditedPathId,
  upsertPath,
}) => {
  const editedPath = children?.find((p) => p.data.uuid === editedPathId);

  useMapEvent("click", (evt) => {
    const now = Date.now();
    const clickDuration = now - (clickStart ?? NaN);
    clickStart = undefined;
    if (editedPath && clickDuration < MAX_CLICK_DURATION_MS) {
      upsertPath(Paths.addPoint(editedPath.data, evt.latlng));
    }
  });

  useMapEvent("mousedown", (evt) => {
    clickStart = Date.now();
  });

  return (
    <>
      {children?.map((c) => {
        const edited = c.data.uuid === editedPathId;
        return (
          <Path
            {...c}
            key={c.data.uuid}
            edited={edited}
            edit={() =>
              edited ? setEditedPathId(undefined) : setEditedPathId(c.data.uuid)
            }
          />
        );
      })}
    </>
  );
};
