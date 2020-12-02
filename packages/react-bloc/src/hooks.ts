import * as React from "react";
import { Bloc } from "@bloc-js/bloc";
import { useEffect, useState } from "react";
import { BlocRootContext } from "./bloc-root";
import {
  BlocGetter,
  blocGetter,
  TBlocFactory,
  BlocCompleter,
} from "./registry";

export function useBloc<S>(fn: BlocGetter<S>, ...args: any[]) {
  const registry = React.useContext(BlocRootContext);
  const bloc = React.useMemo(() => fn(registry, ...args), [registry, ...args]);
  return bloc;
}

export function useBlocScoped<S>(
  fn: BlocGetter<S>,
  done: BlocCompleter,
  ...args: any[]
) {
  const registry = React.useContext(BlocRootContext);
  const bloc = React.useMemo(() => fn(registry, ...args), [registry, ...args]);
  React.useEffect(() => {
    return () => done(registry);
  }, [registry]);
  return bloc;
}

export function useBlocState<S>(bloc: Bloc<S>) {
  const [state, setState] = useState<S>(bloc.value);

  useEffect(() => {
    const subscription = bloc.subscribe(setState);
    return () => subscription.unsubscribe();
  }, [bloc]);

  return state;
}

export function createHooks<S>(id: string, factory: TBlocFactory<S>) {
  const [getBloc, done] = blocGetter(id, factory);
  const useBlocHook = (...args: any[]) => useBloc(getBloc, ...args);
  const useBlocScopedHook = (...args: any[]) =>
    useBlocScoped(getBloc, done, ...args);
  const useState = () => useBlocState(useBlocHook());

  return {
    getBloc,
    useBloc: useBlocHook,
    useBlocScoped: useBlocScopedHook,
    useState,
  };
}
