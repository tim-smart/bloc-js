import * as React from "react";
import { BlocRoot, BlocRegistry } from "@bloc-js/react-bloc";

const registry = new BlocRegistry({});
(window as any).registry = registry;

export const App: React.FC = ({ children }) => (
  <BlocRoot registry={registry}>{children}</BlocRoot>
);
