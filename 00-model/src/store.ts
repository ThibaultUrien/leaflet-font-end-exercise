import { Entity, Update, update as updateEntity } from "./entity";

export type Store<Data extends Entity> = Record<string, Data>;
export type StoreUpdate<T> = Partial<T> & Entity;

export function values<Data extends Entity>(s: Store<Data>): Data[] {
  return Object.values(s).filter((x) => x !== undefined);
}

export function upsert<Data extends Entity>(
  s: Store<Data>,
  d: Data
): Store<Data> {
  return { ...s, [d.uuid]: d };
}

export function update<Data extends Entity>(
  s: Store<Data>,
  update: StoreUpdate<Data>
): Store<Data> {
  const data = s[update.uuid];
  return data ? { ...s, [update.uuid]: updateEntity(data, update) } : s;
}

export function remove<Data extends Entity>(
  s: Store<Data>,
  dataOrUuid: Data | string
): Store<Data> {
  const id = typeof dataOrUuid === "string" ? dataOrUuid : dataOrUuid.uuid;

  if (s[id] === undefined) {
    return s;
  } else {
    return Object.assign({}, s, { [id]: undefined });
  }
}
