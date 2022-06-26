export function serializeEntity(
  data: string,
  type: string,
  schemaVersion: string
): string {
  return JSON.stringify({ type, version: schemaVersion, data });
}

export function deserializeEntity<E>(
  data: string,
  type: string,
  schemaVersion: string
): E | string {
  try {
    // Replace this with yup eventually
    const objData = JSON.parse(data);
    if (!("type" in objData)) {
      return `serialized data declare no field "type"`;
    }
    if (objData["type"] !== type) {
      return `expected type "${type}" but serialized data declare a type with value ${JSON.stringify(
        objData["type"]
      )}`; // Re-stringify the type to ,ake it visible if it is not even a string
    }
    if (!("version" in objData)) {
      return `serialized data declare no field "version"`;
    }
    if (objData["version"] !== schemaVersion) {
      return `expected version "${schemaVersion}" but serialized data declare a version with value ${JSON.stringify(
        objData["version"]
      )}`; // Re-stringify the type to ,ake it visible if it is not even a string
    }

    if (!("data" in objData)) {
      return `serialized data declare no field "data"`;
    }

    return objData.data as E;
  } catch (e) {
    if (typeof e === "string") {
      return e;
    }
    if (e instanceof Error) {
      return e.message;
    }
    return "" + e;
  }
}
