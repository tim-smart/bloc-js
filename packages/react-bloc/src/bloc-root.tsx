import * as React from "react";
import { Bloc } from "@bloc-js/bloc";

export class BlocRegistry {
  constructor(initialState: { [id: string]: any } = {}) {
    this.initialState = initialState;
  }

  private blocs: { [id: string]: Bloc<any> } = {};
  private initialState: { [id: string]: any };

  public getState() {
    return Object.keys(this.blocs).reduce(
      (o, id) => ({
        ...o,
        [id]: this.blocs[id].value,
      }),
      {},
    );
  }

  public register<S>(id: string, factory: TBlocFactory<S>) {
    if (this.blocs[id]) {
      return this.blocs[id] as Bloc<S>;
    }
    const state = this.initialState[id];
    const bloc = factory(state);
    this.blocs[id] = bloc;
    return bloc;
  }
}

export const BlocRootContext = React.createContext<BlocRegistry>(
  new BlocRegistry({}),
);

export type TBlocFactory<S> = (is?: S) => Bloc<S>;

export type BlocGetter<S> = (registry: BlocRegistry) => Bloc<S>;

export function blocGetter<S>(
  id: string,
  factory: TBlocFactory<S>,
): BlocGetter<S> {
  return registry => registry.register(id, factory);
}

export interface BlocRootProps {
  registry: BlocRegistry;
}

export const BlocRoot: React.FC<BlocRootProps> = ({ children, registry }) => (
  <BlocRootContext.Provider value={registry}>
    {children}
  </BlocRootContext.Provider>
);
