# @bloc-js

An implementation of the BLoC pattern in Typescript heavily inspired by
https://github.com/felangel/bloc

BLoC is an abbreviation for **B**usiness **Lo**gic **C**omponent and was
concieved by some of the guys from the Flutter framework. See this article:
https://medium.com/flutterpub/architecting-your-flutter-project-bd04e144a8f1

It is essentially a framework agnostic state management tool that is
conceptually very simple. It all boils down to this flow:

```
Events -> Logic -> State
```

A stream of events are transformed into a stream of states.

## React example

[See here.](packages/react-bloc/example)

## Vue example

```vue
<template>
  <div class="counter">
    <p>Count: {{ counterBloc.currentState }}</p>
    <p>
      <button @click="counterBloc.dispatch('increment')">Increment</button>
      <br />
      <button @click="counterBloc.dispatch('decrement')">Decrement</button>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Bloc } from "@bloc-js/bloc";

type TCounterEvent = "increment" | "decrement";

class CounterBloc extends Bloc<TCounterEvent, number> {
  public initialState() {
    return 0;
  }

  public async *mapEventToState(event: TCounterEvent) {
    if (event === "increment") {
      yield this.currentState + 1;
    } else if (event === "decrement") {
      yield this.currentState - 1;
    }
  }
}

@Component
export default class Counter extends Vue {
  private counterBloc: CounterBloc = new CounterBloc();
}
</script>
```
