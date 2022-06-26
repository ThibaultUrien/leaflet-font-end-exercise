import { Persisted } from "@model";
import { useState } from "react";

export function useNoPersistance<Data>(defaultValue: Data): Persisted<Data> {
  const [data, setData] = useState(defaultValue);

  return {
    data,
    setData,
  };
}
