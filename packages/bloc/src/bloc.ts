import { Subject, BehaviorSubject, Subscription } from "rxjs";
import { concatMap } from "rxjs/operators";
import { deepEqual } from "fast-equals";
import { Transition } from "./transition";
import { BlocDelegate } from "./delegate";

export abstract class Bloc<E, S> {
  constructor() {
    this.bindStateSubject();
  }

  public events$ = new Subject<E>();
  public state$ = new BehaviorSubject<S>(this.initialState());

  abstract initialState(): S;
  abstract mapEventToState(event: E): AsyncIterableIterator<S>;

  public get currentState() {
    return this.state$.value;
  }

  public dispatch(event: E) {
    this.events$.next(event);
  }

  public dispose() {
    this.events$.complete();
    this.state$.complete();
  }

  public onEvent(event: E) {}
  public onTransition(transition: Transition<E, S>) {}
  public onError(error: any) {}

  private bindStateSubject() {
    this.events$.pipe(concatMap(event => this.handleEvent(event))).subscribe();
  }

  private async handleEvent(event: E) {
    try {
      BlocDelegate.current.onEvent(this, event);
      this.onEvent(event);

      for await (const nextState of this.mapEventToState(event)) {
        const currentState = this.currentState;
        if (deepEqual(currentState, nextState) || this.state$.closed) {
          continue;
        }

        const transition = new Transition({
          currentState,
          event,
          nextState
        });
        BlocDelegate.current.onTransition(this, transition);
        this.onTransition(transition);

        this.state$.next(nextState);
      }
    } catch (error) {
      BlocDelegate.current.onError(this, error);
      this.onError(error);
    }
  }
}
