import { Entity } from "./entity";
import * as Entities from "./entity";
import { Point } from "./point";


const PATH_UUID_NAMESPACE = "a26890ae-979e-44c4-b131-46d4d6f17872"

export interface Path extends Entity {
    points: Point[]
}

/**
 * Update the given path to contains a new point. If this path already contains a point with the given id
 * replace it at the same index.
 * 
 * @param path the path to update
 * @param point the point to update or insert
 * @returns An updated path
 */
export function upsert(path: Path, point: Point): Path {
    const replacedPointIndex = findIndex(path, point)
    const newPoints = path.points.slice();
    if (replacedPointIndex == -1) {
        newPoints.push(point)
    } else {
        newPoints[replacedPointIndex] = point
    }
    return Entities.update(path, { points: newPoints });
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
export function remove(path: Path, pointOrPointId: Point | string): Path {
    const removedPointIndex = findIndex(path, pointOrPointId)
    if (removedPointIndex == -1) {
        return path
    } else {
        const updatedPoints = path.points.splice(removedPointIndex, 1)
        return Entities.update(path, { points: updatedPoints })
    }
}

export function findIndex(path: Path, pointOrPointId: Point | string): number {
    const pointId = typeof pointOrPointId == "string"
        ? pointOrPointId
        : pointOrPointId.uuid

    return path.points.findIndex(p => p.uuid == pointId)
}

export function create(): Path {
    return {
        points: [],
        uuid: Entities.newUUID(PATH_UUID_NAMESPACE)
    }
}