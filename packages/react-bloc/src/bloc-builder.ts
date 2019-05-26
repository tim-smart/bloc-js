import { ReactNode, useEffect, useState } from "react";
import { Bloc } from "@bloc-js/bloc";

export interface IBlocBuilderProps<S> {
  bloc: Bloc<any, S>;
  builder: (state: S) => ReactNode;
}

export function BlocBuilder<S>(props: IBlocBuilderProps<S>) {
  const [state, setState] = useState<S>(props.bloc.currentState);

  useEffect(() => {
    const subscription = props.bloc.state$.subscribe(data => {
      setState(data);
    });
    return () => subscription.unsubscribe();
  });

  return props.builder(state);
}
