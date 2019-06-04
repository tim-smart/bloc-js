import * as React from "react";
import { Bloc } from "@bloc-js/bloc";
import NextApp, { NextAppContext, AppProps, DefaultAppIProps } from "next/app";

const isServer = typeof window === "undefined";

export interface BlocMap {
  [key: string]: Bloc<any, any>;
}

export type CreateBlocsFn<B extends BlocMap> = (
  data: { [K in keyof B]?: any }
) => B;

function getStateFromBlocs<B extends BlocMap>(map: B) {
  const state: { [key: string]: any } = {};

  Object.keys(map).forEach(key => {
    state[key] = map[key].currentState;
  });

  return state;
}

export function withBlocs<B extends BlocMap>(
  createBlocs: CreateBlocsFn<B>,
  App: typeof NextApp
) {
  let blocs: B;

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

    public blocs: B;

    render() {
      return <App {...this.props} blocs={this.blocs} />;
    }
  };
}
