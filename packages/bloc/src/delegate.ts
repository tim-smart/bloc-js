import { Bloc } from "./bloc";
import { Transition } from "./transition";

export class BlocDelegate {
  public onEvent(bloc: Bloc<any, any>, event: any) {}
  public onTransition(bloc: Bloc<any, any>, transition: Transition<any, any>) {}
  public onError(bloc: Bloc<any, any>, error: any) {}

  public static current: BlocDelegate = new BlocDelegate();
}
