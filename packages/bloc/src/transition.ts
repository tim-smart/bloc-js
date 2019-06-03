export interface Transition<E, S> {
  currentState: S;
  event: E;
  nextState: S;
}
