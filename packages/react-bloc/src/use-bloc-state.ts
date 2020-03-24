import { Bloc } from "@bloc-js/bloc";
import { useEffect, useState } from "react";

export type CreateBlocFn<S> = () => Bloc<S>;

export function useBlocState<S>(blocCreator: Bloc<S> | CreateBlocFn<S>) {
  const [state, setState] = useState<S | null>(null);

  useEffect(() => {
    const shouldDispose = typeof blocCreator === "function";
    const bloc =
      typeof blocCreator === "function" ? blocCreator() : blocCreator;
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
