import { Entity } from "./entity"
import * as Entities from "./entity"
import { Path } from "./path"
import { v5 as uuidv5 } from 'uuid';

const POINT_UUID_NAMESPACE = "4a8ce340-d7ba-49a4-a580-7cf4cf24f63d"

/**
 * a geographical point with a certain latitude and longitude.
 * based on leaflet point but do not directly import it.
 */
export interface Point extends Entity {
    /**
     * Latitude
     */
    lat: number
    /**
     * Longitude
     */
    lng: number
    /**
     * Altitude
     */
    alt?: number
}

export function create(
    lat: number,
    lng: number,
    alt?: number
): Point {
    return {
        lat, lng, alt,
        uuid: Entities.newUUID(POINT_UUID_NAMESPACE)
    }
}