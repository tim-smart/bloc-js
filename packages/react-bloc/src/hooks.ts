import * as React from "react";
import { Bloc } from "@bloc-js/bloc";
import { useEffect, useState } from "react";
import { BlocRootContext } from "./bloc-root";
import { BlocGetter, blocGetter, TBlocFactory } from "./registry";

export function useBloc<S>(fn: BlocGetter<S>) {
  const registry = React.useContext(BlocRootContext);
  const [bloc] = React.useState(() => fn(registry));
  return bloc;
}

export function useBlocState<S>(bloc: Bloc<S>) {
  const [state, setState] = useState<S>(bloc.value);

  useEffect(() => {
    const subscription = bloc.subscribe(nextState => {
      setState(nextState);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
}

export function createHooks<S>(id: string, factory: TBlocFactory<S>) {
  const getBloc = blocGetter(id, factory);
  const useBlocHook = () => useBloc(getBloc);
  const useState = () => useBlocState(useBlocHook());
  return { getBloc, useBloc: useBlocHook, useState };
}
