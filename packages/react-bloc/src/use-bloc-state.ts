import { useEffect, useState } from "react";
import { Bloc } from "@bloc-js/bloc";

export function useBlocState<S>(bloc: Bloc<any, S>) {
  const [state, setState] = useState(bloc.currentState);

  useEffect(() => {
    const subscription = bloc.state$.subscribe(nextState => {
      setState(nextState);
    });
    return () => subscription.unsubscribe();
  });

  return state;
}
