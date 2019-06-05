import * as React from "react";
import { Bloc } from "@bloc-js/bloc";
import NextApp, { NextAppContext, AppProps, DefaultAppIProps } from "next/app";

const isServer = typeof window === "undefined";

type ExtractBlocState<B> = B extends Bloc<any, infer S> ? S : never;

export type BlocStateMap<M> = { [K in keyof M]: ExtractBlocState<M[K]> };

export type CreateBlocsFn<B> = (data: BlocStateMap<B>) => B;

function getStateFromBlocs<M extends { [key: string]: any }>(
  map: M
): BlocStateMap<M> {
  const state: { [key: string]: any } = {};

  Object.keys(map).forEach(key => {
    state[key] = map[key].currentState;
  });

  return state as BlocStateMap<M>;
}

export function withBlocs<M>(
  createBlocs: CreateBlocsFn<M>,
  App: typeof NextApp
) {
  let blocs: M;

  function initializeBlocs(data: any) {
    if (isServer) {
      return createBlocs(data);
    }

    if (!blocs) {
      blocs = createBlocs(data);
    }

    return blocs;
  }

  return class AppWithBlocs extends React.Component<
    AppProps & DefaultAppIProps
  > {
    static async getInitialProps(appContext: NextAppContext) {
      const blocs = initializeBlocs({});
      Object.assign(appContext.ctx, blocs);

      let appProps = {};
      if (typeof App.getInitialProps === "function") {
        appProps = await App.getInitialProps(appContext);
      }

      return {
        ...appProps,
        initialBlocState: getStateFromBlocs(blocs)
      };
    }

    constructor(props: any) {
      super(props);
      this.blocs = initializeBlocs(props.initialBlocState);
    }

    public blocs: M;

    render() {
      return <App {...this.props} blocs={this.blocs} />;
    }
  };
}
