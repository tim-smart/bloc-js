import { Bloc, BlocAction } from "@bloc-js/bloc";
import { BlocBuilder, useBlocState } from "@bloc-js/react-bloc";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as C from "./CounterBloc";
import { App } from "./App";

const Counter: React.FC = () => {
  const count = C.useState();
  return <p>Counter: {count}</p>;
};

const Buttons: React.FC = () => {
  const bloc = C.useBloc();
  return (
    <>
      <button onClick={() => bloc.next(C.increment)}>Increment</button>
      <br />
      <button onClick={() => bloc.next(C.decrement)}>Decrement</button>
    </>
  );
};

function MultiplicationComponent() {
  const count = C.useState();
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
