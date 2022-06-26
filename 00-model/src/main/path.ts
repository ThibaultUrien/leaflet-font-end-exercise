import { Entity } from "./entity";
import * as Entities from "./entity";
import { PoI, create as createPoI } from "./poi";
import { Point } from "./point";
import { LatLngBounds } from "leaflet";

const PATH_UUID_NAMESPACE = "a26890ae-979e-44c4-b131-46d4d6f17872";

export interface Path extends Entity {
  /**
   * List of waypoint that the drone should travel.
   * Stored in reverse order as is it more convenient for edition operation
   * points[0] is the latest point added by the user and should be the en of the path
   */
  points: PoI[];
}

/**
 * Update the given path to contains a new point of interest. If this path already contains a point with the given id
 * replace it at the same index. Overwise, unshift the point
 *
 * @param path the path to update
 * @param point the point to update or insert
 * @returns An updated path
 */
export function upsert(path: Path, point: PoI): Path {
  const replacedPointIndex = findIndex(path, point);
  const newPoints = path.points.slice();
  if (replacedPointIndex == -1) {
    newPoints.unshift(point);
  } else {
    newPoints[replacedPointIndex] = point;
  }
  return Entities.update(path, { points: newPoints });
}

/**
 * Update the given path to contains a new point. As new point of interest at the given coordinate will be created
 *
 * @param path the path to update
 * @param point the point create
 * @returns An updated path
 */
export function addPoint(path: Path, point: Point): Path {
  return upsert(path, createPoI(point.lat, point.lng, point.alt));
}

/**
 * Update the given path remove one of its point.
 * Remaining point after the one that get deleted are shifted to the left.
 * If the given path do not contain the given point, the path is returned.
 *
 * @param path The path to update
 * @param pointOrPointId The path or the point to update. If a point is passed and the path contains a point with the same id, this point will be removed even if it is not equals to the provided point.
 * @returns An updated path
 */
export function remove(path: Path, pointOrPointId: PoI | string): Path {
  const removedPointIndex = findIndex(path, pointOrPointId);
  if (removedPointIndex == -1) {
    return path;
  } else {
    const updatedPoints = path.points.slice();
    updatedPoints.splice(removedPointIndex, 1);
    return Entities.update(path, { points: updatedPoints });
  }
}

export function findIndex(path: Path, pointOrPointId: PoI | string): number {
  const pointId =
    typeof pointOrPointId == "string" ? pointOrPointId : pointOrPointId.uuid;

  return path.points.findIndex((p) => p.uuid == pointId);
}

export function bound(path: Path): LatLngBounds | undefined {
  if (!path.points.length) return;
  const [head, ...tail] = path.points;
  const bound0 = new LatLngBounds(head, head);
  return tail.reduce(
    (boundBuilder, point) => boundBuilder.extend(point),
    bound0
  );
}

export function create(): Path {
  return {
    points: [],
    uuid: Entities.newUUID(PATH_UUID_NAMESPACE),
  };
}
