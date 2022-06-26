import React, { FC, ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { PathStorePersistanceContext, App, NamedPathData } from "@view";
import { useWebStoragePersistance } from "@infra";
import { Store as StoreData } from "@model";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const Dependencies: FC<{ children?: ReactNode }> = ({ children }) => {
  const persistedPaths = useWebStoragePersistance<StoreData<NamedPathData>>(
    "path-store",
    "path-store",
    "1.0.0",
    {}
  );

  return (
    <PathStorePersistanceContext.Provider value={persistedPaths}>
      {children}
    </PathStorePersistanceContext.Provider>
  );
};
root.render(
  <React.StrictMode>
    <Dependencies>
      <App />
    </Dependencies>
  </React.StrictMode>
);
