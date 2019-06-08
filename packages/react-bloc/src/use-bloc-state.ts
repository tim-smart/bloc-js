import { useEffect, useState, useRef } from "react";
import { Bloc } from "@bloc-js/bloc";
import { any } from "prop-types";

export type CreateBlocFn<S> = () => Bloc<any, S>;

export function useBlocState<S>(blocCreator: Bloc<any, S> | CreateBlocFn<S>) {
  const blocRef = useRef<Bloc<any, S>>();
  function getBloc() {
    if (blocRef.current) return blocRef.current;
    blocRef.current =
      typeof blocCreator === "function" ? blocCreator() : blocCreator;
    return blocRef.current;
  }

  const [state, setState] = useState<S>(getBloc().currentState);

  useEffect(() => {
    const shouldDispose = typeof blocCreator === "function";
    const bloc = getBloc();
    setState(bloc.currentState);
    const subscription = bloc.state$.subscribe(nextState => {
      if (state === nextState) return;
      setState(nextState);
    });
    return () => {
      subscription.unsubscribe();
      if (shouldDispose) bloc.dispose();
    };
  }, []);

  return state;
}
