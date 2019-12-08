import { BehaviorSubject } from "rxjs";

export abstract class Bloc<S> extends BehaviorSubject<S> {
  protected setState(s: S) {
    return this.next(s);
  }
}
