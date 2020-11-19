import { Bloc, BlocAction } from "@bloc-js/bloc";
import { timer, Observable } from "rxjs";
import { debounce } from "rxjs/operators";
import { createHooks } from "@bloc-js/react-bloc";

type State = number;

// hooks
export const { useBloc, useState, getBloc } = createHooks<State>(
  "counter",
  (s = 0) => new CounterBloc(s),
);

// actions
type Action = BlocAction<State>;
export const increment: Action = (b, f) => f(b.value + 1);
export const decrement: Action = (b, f) => f(b.value - 1);

export class CounterBloc extends Bloc<State> {
  transformState(input$: Observable<State>) {
    return input$.pipe(debounce(() => timer(1000)));
  }
}
