import { Button } from "@mui/material";
import React, { FC } from "react";
import styled from "styled-components";
import { PropsOf } from "../types";
import { NamedPathData } from "./Store";

const NEW_POINT_MESSAGE = "Create a new path";
const TUTO_MESSAGE_ADD_POINT = "Click on the map to add points";
const TUTO_MESSAGE_DONE = "Done";

const SECONDARY_MESSAGE =
  "You can also drag points on the map. Everything you do is saved automatically.";
export interface NewPathButtonProps extends PropsOf<typeof Button> {
  path?: NamedPathData;
}

const StyledButton = styled(Button)`
  display: flex;
  flex-direction: column;

  & > div:first-of-type {
    padding-top: 0.5em;
    padding-top: 0.5em;
    padding-bottom: 0.2em;
  }

  & > div + div {
    text-transform: none;
    font-size: 0.8em;
  }
`;
export const NewPathButton: FC<NewPathButtonProps> = ({ path, ...rest }) => {
  const message =
    path == undefined
      ? NEW_POINT_MESSAGE
      : path.points.length == 0
      ? TUTO_MESSAGE_ADD_POINT
      : TUTO_MESSAGE_DONE;

  const secondaryMessage = path?.points?.length ? SECONDARY_MESSAGE : undefined;

  const color =
    path == undefined
      ? "primary"
      : path.points.length === 0
      ? "secondary"
      : "success";

  return (
    <>
      <StyledButton color={color} {...rest}>
        <div>{message}</div>
        {(secondaryMessage && <div>{secondaryMessage}</div>) || null}
      </StyledButton>
    </>
  );
};
