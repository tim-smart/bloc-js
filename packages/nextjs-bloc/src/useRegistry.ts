import { BlocRegistry } from "@bloc-js/react-bloc";
import { useMemo } from "react";

let registry: BlocRegistry | undefined = undefined;

const initRegistry = (preloadedState: any = {}) =>
  new BlocRegistry(preloadedState);

export const initializeRegistry = (preloadedState?: any) => {
  let _registry = registry ?? initRegistry(preloadedState);

  if (preloadedState && registry) {
    _registry = initRegistry({
      ...registry.getState(),
      ...preloadedState,
    });
    registry = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _registry;
  // Create the store once in the client
  if (!registry) registry = _registry;
  return _registry;
};

export function useRegistry(initialState: any) {
  return useMemo(() => initializeRegistry(initialState), [initialState]);
}
