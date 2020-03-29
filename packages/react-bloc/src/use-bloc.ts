import { Bloc } from "@bloc-js/bloc";
import { useMemo } from "react";

export function useBloc<B extends Bloc<any>>(creator: () => B) {
  return useMemo(creator, []);
}
