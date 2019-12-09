import { Bloc } from "@bloc-js/bloc";
import { BlocBuilder, useBlocState } from "@bloc-js/react-bloc";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Subject, timer } from "rxjs";
import { debounce, map } from "rxjs/operators";

class CounterBloc extends Bloc<number> {
  constructor(value: number) {
    super(value);

    this.consume(
      this._subject.pipe(
        debounce(() => timer(1000)),
        map(val => this.value + val)
      ),
      () => this._subject.complete()
    );
  }

  private _subject = new Subject<number>();

  // debounced increment
  public increment() {
    this._subject.next(1);
  }

  public decrement() {
    this.next(this.value - 1);
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
    <button onClick={() => counterBloc.increment()}>Increment</button>
    <br />
    <button onClick={() => counterBloc.decrement()}>Decrement</button>
  </div>,
  document.getElementById("app")
);
