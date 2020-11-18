import { Bloc, BlocAction } from "@bloc-js/bloc";
import { timer, Observable } from "rxjs";
import { debounce } from "rxjs/operators";
import { useBloc, useBlocState, blocGetter } from "@bloc-js/react-bloc";

// hooks
export const getCounterBloc = blocGetter<number>(
  "counter",
  (v = 0) => new CounterBloc(v),
);
export const useCounterBloc = () => useBloc<number>(getCounterBloc);
export const useCounterState = () => useBlocState(useCounterBloc());

// actions
type Action = BlocAction<number>;
export const increment: Action = (b, f) => f(b.value + 1);
export const decrement: Action = (b, f) => f(b.value - 1);

export class CounterBloc extends Bloc<number> {
  transformState(input$: Observable<number>) {
    return input$.pipe(debounce(() => timer(1000)));
  }
}
