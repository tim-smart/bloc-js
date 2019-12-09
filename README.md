# @bloc-js

BLoC is an abbreviation for **B**usiness **Lo**gic **C**omponent and was
concieved by some of the guys from the Flutter framework. See this article:
https://medium.com/flutterpub/architecting-your-flutter-project-bd04e144a8f1

It is essentially a framework agnostic state management tool that is
conceptually very simple. It all boils down to this flow:

```
Events -> Logic -> State
```

A stream of events are transformed into a stream of states.

## Basic Todo's example using React

https://github.com/tim-smart/bloc-js-todos-example

## React example

[See here.](packages/react-bloc/example)

## Vue example

```vue
<template>
  <div class="counter">
    <p>Count: {{ counterBloc.value }}</p>
    <p>
      <button @click="counterBloc.increment()">Increment</button>
      <br />
      <button @click="counterBloc.decrement()">Decrement</button>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Bloc } from "@bloc-js/bloc";

class CounterBloc extends Bloc<number> {
  public increment() {
    this.next(this.value + 1);
  }

  public decrement() {
    this.next(this.value - 1);
  }
}

@Component
export default class Counter extends Vue {
  private counterBloc: CounterBloc = new CounterBloc();
}
</script>
```

## Next.js example (with SSR state hydration)

https://github.com/tim-smart/nextjs-bloc-js-example
