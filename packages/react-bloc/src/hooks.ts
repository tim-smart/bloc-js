import * as React from "react";
import { Bloc } from "@bloc-js/bloc";
import { useEffect, useState } from "react";
import { BlocRootContext, TBlocFactory, registerBloc } from "./bloc-root";

export function useBloc<S>(id: string, factory: TBlocFactory<S>) {
  const registry = React.useContext(BlocRootContext);
  const [bloc] = React.useState(() => registerBloc(registry, id, factory));
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
