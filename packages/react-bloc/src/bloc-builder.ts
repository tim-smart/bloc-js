import { useEffect, useState } from "react";
import { Bloc } from "@bloc-js/bloc";

export interface IBlocBuilderProps<S> {
  bloc: Bloc<S>;
  builder: (state: S) => JSX.Element;
}

export function BlocBuilder<S>(props: IBlocBuilderProps<S>) {
  const [state, setState] = useState<S>(props.bloc.value);

  useEffect(() => {
    const subscription = props.bloc.subscribe(data => {
      setState(data);
    });
    return () => subscription.unsubscribe();
  });

  return props.builder(state);
}
