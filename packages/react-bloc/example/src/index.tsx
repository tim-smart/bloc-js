import { Bloc, BlocAction } from "@bloc-js/bloc";
import { BlocBuilder, useBlocState } from "@bloc-js/react-bloc";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { timer, Observable } from "rxjs";
import { debounce } from "rxjs/operators";

const increment: BlocAction<number> = (b, f) => f(b.value + 1);
const decrement: BlocAction<number> = (b, f) => f(b.value - 1);

class CounterBloc extends Bloc<number> {
  transformState(input$: Observable<number>) {
    return input$.pipe(debounce(() => timer(1000)));
  }
}

const counterBloc = new CounterBloc(0);

function MultiplicationComponent() {
  const count = useBlocState(counterBloc);
  return <p>Multiplied: {count * 3}</p>;
}

ReactDOM.render(
  <div>
    <BlocBuilder
      bloc={counterBloc}
      builder={state => <p>Counter: {state}</p>}
    />
    <MultiplicationComponent />
    <button onClick={() => counterBloc.next(increment)}>Increment</button>
    <br />
    <button onClick={() => counterBloc.next(decrement)}>Decrement</button>
  </div>,
  document.getElementById("app"),
);
