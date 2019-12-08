import { useEffect, useState, useRef } from "react";
import { Bloc } from "@bloc-js/bloc";

export type CreateBlocFn<S> = () => Bloc<S>;

export function useBlocState<S>(blocCreator: Bloc<S> | CreateBlocFn<S>) {
  const blocRef = useRef<Bloc<S>>();
  function getBloc() {
    if (blocRef.current) return blocRef.current;
    blocRef.current =
      typeof blocCreator === "function" ? blocCreator() : blocCreator;
    return blocRef.current;
  }

  const [state, setState] = useState<S>(getBloc().value);

  useEffect(() => {
    const shouldDispose = typeof blocCreator === "function";
    const bloc = getBloc();
    setState(bloc.value);
    const subscription = bloc.subscribe(nextState => {
      setState(nextState);
    });
    return () => {
      subscription.unsubscribe();
      if (shouldDispose) bloc.complete();
    };
  }, []);

  return state;
}
