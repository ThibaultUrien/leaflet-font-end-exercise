import * as Entities from "./entity";
import { Entity } from "./entity";
import { Point } from "./point";

const POINT_UUID_NAMESPACE = "4a8ce340-d7ba-49a4-a580-7cf4cf24f63d";

/**
 * A point of interest: coordinate that have intrinsic significance (ie. that other class may refer to, or that may be persisted in memory etc...).
 * Implicitly, a PoI is "the position of something" while a Point is just "a position"
 */
export type PoI = Point & Entity;

export function create(lat: number, lng: number, alt?: number): PoI {
  return {
    lat,
    lng,
    alt,
    uuid: Entities.newUUID(POINT_UUID_NAMESPACE),
  };
}
