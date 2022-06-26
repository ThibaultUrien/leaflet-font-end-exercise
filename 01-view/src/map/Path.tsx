import { Entities, Formats, Path as PathData, Paths, PoI } from "@model";
import { Button } from "@mui/material";
import { DivIcon, LeafletMouseEvent } from "leaflet";
import React, { FC, ReactElement, useState } from "react";
import { Marker, Polyline, Popup } from "react-leaflet";
import styled from "styled-components";

const LINE_WEIGHT_DEFAULT = 2;
const LINE_WEIGHT_FOCUS = 8;
const DELETE_BUTTON_TEXT = "Delete";

export interface PathProps {
  data: PathData;
  setData(data: PathData): void;
  edited?: boolean;
  edit(): void;
}

const StyledLine = styled(Polyline)`
  stroke: ${(p) => p.theme?.palette?.primary?.dark};
  transition: stroke-width 200ms;
`;

const EditMarkerPopUp: FC<{
  point: PoI;
  deletePoint(): void;
}> = ({ point, deletePoint }) => (
  <Popup>
    <div>{Formats.formatPoint(point)}</div>
    <Button color="error" size="small" onClick={deletePoint}>
      {DELETE_BUTTON_TEXT}
    </Button>
  </Popup>
);

const EditMarker: FC<{
  edited?: boolean;
  point?: PoI;
  setPoint(p: PoI): void;
  deletePoint(): void;
  // We intercept the className injected by styled component to manually inject in on the DivIcon
  // as styling the Marker have no effect.
  className?: string;
  iconClassName?: string;
}> = ({ edited, point, className, setPoint, deletePoint }) => {
  if (!(edited && point)) return null;

  const [drivingMarker, setDrivingMarker] = useState<
    ReactElement | undefined
  >();

  // If one marker is being dragged, leaflet control its position:
  // it must not be rerendered by react so we return its state a the time the drag started
  if (drivingMarker) return drivingMarker;

  const currentMarker = (
    <Marker
      position={point}
      icon={
        new DivIcon({
          className: className,
        })
      }
      draggable
      eventHandlers={{
        dragstart: () => setDrivingMarker(currentMarker),
        dragend: () => setDrivingMarker(undefined),
        drag: (evt) => {
          if (isMouseEvent(evt)) {
            setPoint(Entities.update(point, evt.latlng));
          }
        },
      }}
    >
      <EditMarkerPopUp point={point} deletePoint={deletePoint} />
    </Marker>
  );

  return currentMarker;
};

const HeadEditMakerStyled = styled(EditMarker)`
  color: ${(p) => p.theme?.palette?.error?.dark};
  &::after {
    content: "⬬";
    font-size: 2.5em;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    color: #1b1b1b70;
  }

  &::before {
    content: "▿";
    position: absolute;
    font-size: 7em;
    bottom: -25%;
    left: 50%;
    transform: translate(-50%, 25%);
    font-weight: bold;
    animation: MoveUpDown 3s cubic-bezier(0.46, 0.03, 0.52, 0.96) infinite;
  }

  @keyframes MoveUpDown {
    0%,
    100% {
      bottom: -25%;
    }
    50% {
      bottom: 25%;
    }
  }
`;

const EditMakerStyled = styled(EditMarker)`
  color: ${(p) => p.theme?.palette?.primary?.main};

  &::before {
    content: "⬤";
    position: absolute;
    font-size: 2.5em;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const Path: FC<PathProps> = ({ data, setData, edited, edit }) => {
  if (!data.points.length) {
    return null;
  }
  const lineWeight = edited ? LINE_WEIGHT_FOCUS : LINE_WEIGHT_DEFAULT;
  const [head, ...tail] = data.points;
  return (
    <>
      <StyledLine
        positions={data.points}
        pathOptions={{ weight: lineWeight }}
        eventHandlers={{
          click: edit,
        }}
      />
      {tail.map((point) => (
        <EditMakerStyled
          key={point.uuid}
          edited={edited}
          point={point}
          setPoint={(p) => setData(Paths.upsert(data, p))}
          deletePoint={() => setData(Paths.remove(data, point))}
        />
      ))}
      <HeadEditMakerStyled
        edited={edited}
        point={head}
        setPoint={(p) => setData(Paths.upsert(data, p))}
        deletePoint={() => setData(Paths.remove(data, head))}
      />
    </>
  );
};

function isMouseEvent(a: any): a is LeafletMouseEvent {
  return a["latlng"] !== undefined;
}
