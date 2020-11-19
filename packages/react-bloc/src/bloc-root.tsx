import * as React from "react";
import { BlocRegistry } from "./registry";

export const BlocRootContext = React.createContext<BlocRegistry>(
  new BlocRegistry({}),
);

export interface BlocRootProps {
  registry: BlocRegistry;
}

export const BlocRoot: React.FC<BlocRootProps> = ({ children, registry }) => (
  <BlocRootContext.Provider value={registry}>
    {children}
  </BlocRootContext.Provider>
);
