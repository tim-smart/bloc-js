import { useContext, Context } from "react";

// Simple helper to make sure the context value is wrapped in Required
export function useBlocContext<C extends Context<T>, T>(context: C) {
  return useContext(context) as Required<T>;
}
