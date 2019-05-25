export interface ITransitionOptions<E, S> {
  currentState: S;
  event: E;
  nextState: S;
}

export class Transition<E, S> {
  constructor({ currentState, event, nextState }: ITransitionOptions<E, S>) {
    this.currentState = currentState;
    this.event = event;
    this.nextState = nextState;
  }

  readonly event: E;
  readonly currentState: S;
  readonly nextState: S;
}
