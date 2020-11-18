import { Bloc, BlocAction } from "@bloc-js/bloc";
import { BlocBuilder, useBlocState } from "@bloc-js/react-bloc";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  useCounterState,
  useCounterBloc,
  increment,
  decrement,
} from "./CounterBloc";
import { App } from "./App";

const Counter: React.FC = () => {
  const count = useCounterState();
  return <p>Counter: {count}</p>;
};

const Buttons: React.FC = () => {
  const bloc = useCounterBloc();

  return (
    <>
      <button onClick={() => bloc.next(increment)}>Increment</button>
      <br />
      <button onClick={() => bloc.next(decrement)}>Decrement</button>
    </>
  );
};

function MultiplicationComponent() {
  const count = useCounterState();
  return <p>Multiplied: {count * 3}</p>;
}

ReactDOM.render(
  <App>
    <Counter />
    <MultiplicationComponent />
    <Buttons />
  </App>,
  document.getElementById("app"),
);
