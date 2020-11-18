/// <reference path="../next-env.d.ts" />

import { BlocRegistry, BlocRoot } from "@bloc-js/react-bloc";
import React from "react";
import { AppContext } from "next/app";
import { NextComponentType, NextPageContext } from "next";

const isServer = typeof window === "undefined";

export function wrapper(Component: NextComponentType<any, any, any>) {
  let registry: BlocRegistry;

  function initializeRegistry(data: any) {
    if (isServer) {
      return new BlocRegistry(data);
    }
    if (!registry) {
      registry = new BlocRegistry(data);
    }
    return registry;
  }

  const WithBlocRoot: NextComponentType<
    NextPageContext | AppContext,
    any,
    any
  > = props => {
    const registry = initializeRegistry(props.initialBlocState);
    return (
      <BlocRoot registry={registry}>
        <Component {...props} />
      </BlocRoot>
    );
  };

  WithBlocRoot.getInitialProps = async nextCtx => {
    const ctx = (nextCtx as AppContext).ctx || nextCtx;
    const registry = new BlocRegistry({});

    (ctx as any).blocRegistry = registry;

    let pageProps = {};
    if (typeof Component.getInitialProps === "function") {
      pageProps = await Component.getInitialProps(nextCtx);
    }

    return {
      ...pageProps,
      initialBlocState: registry.getState(),
    };
  };

  return WithBlocRoot;
}
