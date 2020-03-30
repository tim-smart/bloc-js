import { Bloc } from "@bloc-js/bloc";
import { Component, ComponentType, createElement } from "react";

export type BlocMap<M> = {
  [K in keyof M]: M[K] extends Bloc<any> ? M[K] : never;
};

export function withBlocs<P extends {}, M>(creator: (props: P) => BlocMap<M>) {
  return function injectBlocProps(Comp: ComponentType<P & BlocMap<M>>) {
    return class WithBlocsHOC extends Component<P> {
      constructor(props: P) {
        super(props);
        this.blocs = creator(props);
      }

      blocs: BlocMap<M>;

      componentWillUnmount() {
        for (const key in this.blocs) {
          const bloc = this.blocs[key];
          bloc.complete();
        }
      }

      render() {
        return createElement(Comp, {
          ...this.props,
          ...this.blocs,
        });
      }
    };
  };
}
