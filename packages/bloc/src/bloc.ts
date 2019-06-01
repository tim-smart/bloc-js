import { Subject, BehaviorSubject, Observer, Observable } from "rxjs";
import { concatMap } from "rxjs/operators";
import { deepEqual } from "fast-equals";
import { Transition } from "./transition";
import { BlocDelegate } from "./delegate";

export abstract class Bloc<E, S> {
  constructor() {
    this.bindStateSubject();
  }

  private _events$ = new Subject<E>();
  private _state$ = new BehaviorSubject<S>(this.initialState());

  public get events$(): Observable<E> {
    return this._events$;
  }
  public get state$(): Observable<S> {
    return this._state$;
  }

  abstract initialState(): S;
  abstract mapEventToState(event: E): AsyncIterableIterator<S>;

  public get currentState() {
    return this._state$.value;
  }

  public dispatch(event: E) {
    this._events$.next(event);
  }

  public dispose() {
    this._events$.complete();
    this._state$.complete();
  }

  public onEvent(event: E) {}
  public onTransition(transition: Transition<E, S>) {}
  public onError(error: any) {}

  private bindStateSubject() {
    this._events$.pipe(concatMap(event => this.handleEvent(event))).subscribe();
  }

  private async handleEvent(event: E) {
    try {
      BlocDelegate.current.onEvent(this, event);
      this.onEvent(event);

      for await (const nextState of this.mapEventToState(event)) {
        const currentState = this.currentState;
        if (deepEqual(currentState, nextState) || this._state$.closed) {
          continue;
        }

        const transition = new Transition({
          currentState,
          event,
          nextState
        });
        BlocDelegate.current.onTransition(this, transition);
        this.onTransition(transition);

        this._state$.next(nextState);
      }
    } catch (error) {
      BlocDelegate.current.onError(this, error);
      this.onError(error);
    }
  }
}
