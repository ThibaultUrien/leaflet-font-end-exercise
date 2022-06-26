export interface Persisted<Data> {
  data: Data;
  setData(d: Data): void;
}
