import { Bloc } from "@bloc-js/bloc";
import { NextComponentType, NextPageContext } from "next";
import React from "react";
import { AppContextType } from "next/dist/next-server/lib/utils";

const isServer = typeof window === "undefined";

type ExtractBlocState<B> = B extends Bloc<infer S> ? S : never;

export type BlocStateMap<M> = { [K in keyof M]: ExtractBlocState<M[K]> };

export type CreateBlocsFn<B, C> = (data: BlocStateMap<B>, ctx: C) => B;

function getStateFromBlocs<M extends { [key: string]: any }>(
  map: M
): BlocStateMap<M> {
  const state: { [key: string]: any } = {};

  Object.keys(map).forEach(key => {
    state[key] = map[key].currentState;
  });

  return state as BlocStateMap<M>;
}

export function withBlocs<M, C = any>(
  createBlocs: CreateBlocsFn<M, C>,
  Component: NextComponentType<any, any, any>,
  InheritedCtx?: React.Context<Partial<C>>
) {
  let blocs: M;

  function initializeBlocs(data: any, ctx: C) {
    if (isServer) {
      return createBlocs(data, ctx);
    }
    if (!blocs) {
      blocs = createBlocs(data, ctx);
    }
    return blocs;
  }

  const WithBlocs: NextComponentType<
    NextPageContext | AppContextType,
    any,
    any
  > = props => {
    let blocs: M;

    if (InheritedCtx) {
      const inheritedBlocs = React.useContext(InheritedCtx) as C;
      blocs = initializeBlocs(props.initialBlocState, inheritedBlocs);
    } else {
      blocs = initializeBlocs(props.initialBlocState, {} as any);
    }

    return <Component {...props} blocs={blocs} />;
  };

  WithBlocs.getInitialProps = async nextCtx => {
    const ctx = (nextCtx as AppContextType).ctx || nextCtx;
    let blocs: M;

    if (InheritedCtx) {
      blocs = initializeBlocs({}, ctx as any);
    } else {
      blocs = initializeBlocs({}, {} as C);
    }

    Object.assign(ctx, blocs);

    let pageProps = {};
    if (typeof Component.getInitialProps === "function") {
      pageProps = await Component.getInitialProps(nextCtx as any);
    }

    return {
      ...pageProps,
      initialBlocState: getStateFromBlocs(blocs)
    };
  };

  return WithBlocs;
}
