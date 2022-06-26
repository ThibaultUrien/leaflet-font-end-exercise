import { Point } from "./point";

const NORTH = "N";
const SOUTH = "S";
const EAST = "E";
const WEST = "W";
const ALTITUDE = "Altitude";

export function formatPoint(p: Point): string {
  const latDir = p.lat > 0 ? EAST : WEST;
  const lonDir = p.lng > 0 ? NORTH : SOUTH;
  const altitude = p.alt !== undefined ? ` ${ALTITUDE}: ${p.alt}m` : "";

  return `${Math.abs(p.lat)}${latDir} ${Math.abs(p.lng)}${lonDir}${altitude}`;
}
