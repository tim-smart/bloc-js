import { Subject, BehaviorSubject, Observable, Subscriber } from "rxjs";
import { concatMap, map } from "rxjs/operators";
import { deepEqual } from "fast-equals";
import { Transition } from "./transition";
import { BlocDelegate } from "./delegate";

interface BlocEvent<E> {
  payload: E;
  resolve: () => void;
}

export abstract class Bloc<E, S> {
  constructor(initialState: S) {
    this._state$ = new BehaviorSubject(initialState);
    this.bindStateSubject();
  }

  public get delegate() {
    return BlocDelegate.default;
  }

  protected _events$ = new Subject<BlocEvent<E>>();
  protected _state$: BehaviorSubject<S>;

  public get events$(): Observable<E> {
    return this._events$.pipe(map(e => e.payload));
  }
  public get state$(): Observable<S> {
    return this._state$.asObservable();
  }

  abstract mapEventToState(event: E): AsyncIterableIterator<S>;

  public get currentState() {
    return this._state$.value;
  }

  public dispatch(payload: E) {
    this.delegate.onEvent(this, payload);
    this.onEvent(payload);

    return new Promise<void>(resolve => {
      this._events$.next({ payload, resolve });
    });
  }

  public dispose() {
    this._events$.complete();
    this._state$.complete();
  }

  public onEvent(event: E) {}
  public onTransition(transition: Transition<E, S>) {}
  public onError(error: any) {}

  public transform(
    events$: Observable<BlocEvent<E>>,
    next: (event: BlocEvent<E>) => Observable<S>
  ): Observable<S> {
    return events$.pipe(concatMap(next));
  }

  private bindStateSubject() {
    let currentEvent: BlocEvent<E>;

    this.transform(this._events$, event => {
      currentEvent = event;
      return this.handleEvent(currentEvent);
    }).forEach(nextState => {
      const currentState = this.currentState;
      if (deepEqual(currentState, nextState) || this._state$.closed) {
        return;
      }

      const transition: Transition<E, S> = {
        currentState,
        event: currentEvent.payload,
        nextState
      };

      this.delegate.onTransition(this, transition);
      this.onTransition(transition);

      this._state$.next(nextState);
    });
  }

  private handleEvent(event: BlocEvent<E>): Observable<S> {
    const iterator = this.mapEventToState(event.payload);
    return new Observable(observer => {
      asyncIterableForEach(iterator, observer)
        .catch(error => {
          this.delegate.onError(this, error);
          this.onError(error);
        })
        .finally(() => {
          observer.complete();
          event.resolve();
        });
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
