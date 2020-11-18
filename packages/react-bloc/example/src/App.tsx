import * as React from "react";
import { BlocRoot, createRegistry } from "@bloc-js/react-bloc";

const registry = createRegistry({});
(window as any).registry = registry;

export const App: React.FC = ({ children }) => (
  <BlocRoot registry={registry}>{children}</BlocRoot>
);
