import { v5 as uuidv5 } from "uuid";

/**
 * Represent a uniquely identified business object.
 * Two entity should not have the same id unless they should be considered as two states of a same thing.
 */
export interface Entity {
  uuid: string;
}

export function same(e1: Entity, e2: Entity): boolean {
  return e1.uuid == e2.uuid;
}

export type Update<E extends Entity> = Partial<Omit<E, "uuid">>;

export function update<E extends Entity>(
  currentState: E,
  update: Update<E>
): E {
  return currentState != update
    ? Object.assign({}, currentState, update)
    : currentState;
}

/**
 * Create a new id in the given id namespace.
 * Use [uuid v5](https://www.npmjs.com/package/uuid#uuidv5name-namespace-buffer-offset)
 *
 * @param nameSpace The namespace where to create the id
 * @param data Some data to be hashed to reduce the chance of collisions in a same namespace.
 */
export function newUUID(nameSpace: string | ArrayLike<number>): string {
  return uuidv5(
    `${Date.now()}${Math.random()}`, // This will be hashed, so it doesn't need to represent the entities itself itself.
    nameSpace
  );
}
