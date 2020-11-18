import * as React from "react";
import { Bloc } from "@bloc-js/bloc";

export type BlocRegistry = {
  blocs: { [id: string]: Bloc<any> };
  initialState: { [id: string]: any };
};

export const BlocRootContext = React.createContext<BlocRegistry>({
  blocs: {},
  initialState: {},
});

export type TBlocFactory<S> = (is?: S) => Bloc<S>;

export function registerBloc<S>(
  r: BlocRegistry,
  id: string,
  factory: TBlocFactory<S>,
) {
  let bloc = r.blocs[id] as Bloc<S> | undefined;
  if (!bloc) {
    bloc = factory(r.initialState[id]);
    r.blocs[id] = bloc;
  }

  return bloc;
}

export function createRegistry(
  initialState: BlocRegistry["initialState"],
): BlocRegistry {
  return {
    blocs: {},
    initialState,
  };
}

export function stateFromRegistry(
  r: BlocRegistry,
): BlocRegistry["initialState"] {
  return Object.keys(r).reduce(
    (o, id) => ({
      ...o,
      [id]: r.blocs[id].value,
    }),
    {},
  );
}

export interface BlocRootProps {
  registry: BlocRegistry;
}

export const BlocRoot: React.FC<BlocRootProps> = ({ children, registry }) => (
  <BlocRootContext.Provider value={registry}>
    {children}
  </BlocRootContext.Provider>
);
