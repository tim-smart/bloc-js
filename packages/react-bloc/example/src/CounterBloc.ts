import { Bloc, BlocAction } from "@bloc-js/bloc";
import { timer, Observable } from "rxjs";
import { debounce } from "rxjs/operators";
import { useBloc, useBlocState } from "@bloc-js/react-bloc";

export const useCounterBloc = () =>
  useBloc<number>("counter", (v = 0) => new CounterBloc(v));

export const useCounterState = () => useBlocState(useCounterBloc());

export const increment: BlocAction<number> = (b, f) => f(b.value + 1);
export const decrement: BlocAction<number> = (b, f) => f(b.value - 1);

export class CounterBloc extends Bloc<number> {
  transformState(input$: Observable<number>) {
    return input$.pipe(debounce(() => timer(1000)));
  }
}
