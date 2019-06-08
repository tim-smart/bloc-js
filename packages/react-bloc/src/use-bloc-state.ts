import { useEffect, useState } from "react";
import { Bloc } from "@bloc-js/bloc";

export type CreateBlocFn<S> = () => Bloc<any, S>;

export function useBlocState<S>(bloc: Bloc<any, S> | CreateBlocFn<S>) {
  const [state, setState] = useState<S>();

  useEffect(() => {
    const actualBloc = typeof bloc === "function" ? bloc() : bloc;
    setState(actualBloc.currentState);

    const subscription = actualBloc.state$.subscribe(nextState => {
      setState(nextState);
    });
    return () => subscription.unsubscribe();
  }, []);

  return state;
}
