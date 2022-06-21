import { Entity } from "./entity";

export interface Store<Data extends Entity> {
    getData():Data[]
    upsert(d:Data)
    remove(dataOrUuid:Data | string)
}