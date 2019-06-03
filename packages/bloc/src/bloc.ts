import { Subject, BehaviorSubject, Observable, Subscriber } from "rxjs";
import { concatMap } from "rxjs/operators";
import { deepEqual } from "fast-equals";
import { Transition } from "./transition";
import { BlocDelegate } from "./delegate";

export abstract class Bloc<E, S> {
  constructor(initialState: S) {
    this._state$ = new BehaviorSubject(initialState);
    this.bindStateSubject();
  }

  public get delegate() {
    return BlocDelegate.default;
  }

  protected _events$ = new Subject<E>();
  protected _state$: BehaviorSubject<S>;

  public get events$(): Observable<E> {
    return this._events$;
  }
  public get state$(): Observable<S> {
    return this._state$;
  }

  abstract mapEventToState(event: E): AsyncIterableIterator<S>;

  public get currentState() {
    return this._state$.value;
  }

  public dispatch(event: E) {
    this.delegate.onEvent(this, event);
    this.onEvent(event);
    this._events$.next(event);
  }

  public dispose() {
    this._events$.complete();
    this._state$.complete();
  }

  public onEvent(event: E) {}
  public onTransition(transition: Transition<E, S>) {}
  public onError(error: any) {}

  public transform(
    events$: Observable<E>,
    next: (event: E) => Observable<S>
  ): Observable<S> {
    return events$.pipe(concatMap(next));
  }

  private bindStateSubject() {
    let currentEvent: E;

    this.transform(this._events$, event => {
      currentEvent = event;
      return this.observableFrom(this.mapEventToState(currentEvent));
    }).forEach(nextState => {
      const currentState = this.currentState;
      if (deepEqual(currentState, nextState) || this._state$.closed) {
        return;
      }

      const transition = new Transition({
        currentState,
        event: currentEvent,
        nextState
      });
      this.delegate.onTransition(this, transition);
      this.onTransition(transition);

      this._state$.next(nextState);
    });
  }

  private observableFrom<T>(iterator: AsyncIterable<T>): Observable<T> {
    return new Observable(observer => {
      asyncIterableForEach(iterator, observer)
        .catch(error => {
          this.delegate.onError(this, error);
          this.onError(error);
        })
        .finally(() => observer.complete());
    });
  }
}

async function asyncIterableForEach<T>(
  iterator: AsyncIterable<T>,
  subscriber: Subscriber<T>
) {
  for await (const value of iterator) {
    subscriber.next(value);
  }
}
