import { BehaviorSubject, Subject } from "rxjs";

export abstract class Bloc<S> extends BehaviorSubject<S> {}
