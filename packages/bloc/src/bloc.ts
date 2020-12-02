import { BehaviorSubject, Subscription, Subject, Observable } from "rxjs";
import * as RxOp from "rxjs/operators";
import deepEqual from "fast-deep-equal";

export interface BlocActionWrap<S> {
  action: BlocAction<S>;
  resolve: () => void;
}

export type BlocAction<S, B extends Bloc<S> = Bloc<S>> = (
  b: B,
  next: (s: S) => void,
) => void | Promise<void>;

interface NextStateWithResolve<S> {
  next: S;
  resolve: () => void;
}

const observableFromAction = <S>(b: Bloc<S>) => ({
  action,
  resolve,
}: BlocActionWrap<S>) =>
  new Observable<NextStateWithResolve<S>>(s => {
    Promise.resolve(action(b, (next: S) => s.next({ next, resolve })))
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
        ({ next, resolve }) => {
          if (deepEqual(this.value, next)) return resolve();
          this._state$.next(next);
          resolve();
        },
        err => this._state$.error(err),
      );
  }

  protected _actions$ = new Subject<BlocActionWrap<S>>();
  protected _state$: BehaviorSubject<S>;
  protected _cleanupHandlers: (() => void)[] = [];

  public get value() {
    return this._state$.value;
  }

  public next = (action: BlocAction<S>): Promise<void> =>
    new Promise(resolve =>
      this._actions$.next({
        action,
        resolve,
      }),
    );

  protected transformActions(input$: Observable<BlocActionWrap<S>>) {
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
