import { Bloc } from "@bloc-js/bloc";
import { useEffect, useState } from "react";

export type CreateBlocFn<S> = () => Bloc<S>;

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
