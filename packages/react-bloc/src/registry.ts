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

  public register<S>(id: string, factory: TBlocFactory<S>, args: any[]) {
    if (this.blocs[id]) {
      return this.blocs[id] as Bloc<S>;
    }
    const state = this.initialState[id];
    const bloc = factory(this, state, ...args);
    this.blocs[id] = bloc;
    return bloc;
  }

  public complete(id: string) {
    if (!this.blocs[id]) return;
    this.blocs[id].complete();
    delete this.blocs[id];
  }
}

export type TBlocFactory<S> = (
  r: BlocRegistry,
  is?: S,
  ...args: any[]
) => Bloc<S>;
export type BlocGetter<S> = (registry: BlocRegistry, ...args: any[]) => Bloc<S>;
export type BlocCompleter = (registry: BlocRegistry) => void;
export function blocGetter<S>(
  id: string,
  factory: TBlocFactory<S>,
): [BlocGetter<S>, BlocCompleter] {
  return [
    (registry, ...args) => registry.register(id, factory, args),
    registry => registry.complete(id),
  ];
}
