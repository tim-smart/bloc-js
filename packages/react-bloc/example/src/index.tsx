import { Bloc } from "@bloc-js/bloc";
import { BlocBuilder, useBlocState } from "@bloc-js/react-bloc";
import * as React from "react";
import * as ReactDOM from "react-dom";

type TCounterEvent = "increment" | "decrement";

class CounterBloc extends Bloc<TCounterEvent, number> {
  constructor() {
    super(0);
  }

  public async *mapEventToState(event: TCounterEvent) {
    if (event === "increment") {
      yield this.currentState + 1;
    } else if (event === "decrement") {
      yield this.currentState - 1;
    }
  }
}

const counterBloc = new CounterBloc();

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
    <button onClick={() => counterBloc.dispatch("increment")}>Increment</button>
    <br />
    <button onClick={() => counterBloc.dispatch("decrement")}>Decrement</button>
  </div>,
  document.getElementById("app")
);
