import { BehaviorSubject, Subscription, Subject, Observable } from "rxjs";
import * as RxOp from "rxjs/operators";
import deepEqual from "fast-deep-equal";

export type BlocAction<S> = (
  b: Bloc<S>,
  next: (s: S) => void,
) => void | Promise<void>;

const observableFromAction = <S>(b: Bloc<S>) => (f: BlocAction<S>) =>
  new Observable<S>(s => {
    Promise.resolve(f(b, s.next.bind(s)))
      .catch(err => s.error(err))
      .finally(() => {
        s.complete();
      });
  });

export abstract class Bloc<S> extends Observable<S> {
  constructor(initialState: S) {
    super();

    this._state$ = new BehaviorSubject(initialState);
    this.source = this.transformState(this._state$);

    this.transformActions(this._actions$)
      .pipe(RxOp.concatMap(observableFromAction(this)))
      .subscribe(
        nextState => {
          if (deepEqual(this.value, nextState)) return;
          this._state$.next(nextState);
        },
        err => this._state$.error(err),
      );
  }

  protected _actions$ = new Subject<BlocAction<S>>();
  protected _state$: BehaviorSubject<S>;
  protected _cleanupHandlers: (() => void)[] = [];

  public get value() {
    return this._state$.value;
  }

  public next = (action: BlocAction<S>) => {
    this._actions$.next(action);
  };

  protected transformActions(input$: Observable<BlocAction<S>>) {
    return input$;
  }

  protected transformState(input$: Observable<S>) {
    return input$;
  }

  // unsubscribeOnComplete is a utility method for consuming other Observables
  // and cleaning them up without having to write complete() boilerplate code.
  protected unsubscribeOnComplete(s: Subscription, cleanup?: () => void) {
    this._cleanupHandlers.push(() => {
      s.unsubscribe();
      if (cleanup) cleanup();
    });
  }

  public complete() {
    this._cleanupHandlers.forEach(fn => fn());
    this._actions$.complete();
  }
}
