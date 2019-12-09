import { BehaviorSubject, Observable, Subscription } from "rxjs";

export abstract class Bloc<S> extends BehaviorSubject<S> {
  protected _cleanupHandlers: (() => void)[] = [];

  // consume is a utility method for consuming other Observables and cleaning
  // them up without having to write complete() boilerplate code.
  protected consume(o: Observable<S>, cleanup: () => void) {
    const s = o.subscribe(value => this.next(value));
    this._cleanupHandlers.push(() => {
      s.unsubscribe();
      cleanup();
    });
  }

  public complete() {
    this._cleanupHandlers.forEach(fn => fn());
    super.complete();
  }
}
