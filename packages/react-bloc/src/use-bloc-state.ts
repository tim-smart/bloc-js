import { Bloc } from "@bloc-js/bloc";
import { useEffect, useState, useRef } from "react";

export type CreateBlocFn<S> = () => Bloc<S>;

export function useBlocState<S>(blocCreator: Bloc<S> | CreateBlocFn<S>) {
  const ref = useRef(
    typeof blocCreator === "function" ? blocCreator() : blocCreator,
  );
  const [state, setState] = useState<S>(ref.current.value);

  useEffect(() => {
    const bloc = ref.current;
    const shouldDispose = typeof blocCreator === "function";
    const subscription = bloc.subscribe(nextState => {
      setState(nextState);
    });
    return () => {
      subscription.unsubscribe();
      if (shouldDispose) bloc.complete();
    };
  }, [ref]);

  return state;
}
