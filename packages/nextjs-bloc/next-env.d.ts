import { BlocRegistry } from "@bloc-js/react-bloc";
import "next";

declare module "next" {
  export interface NextPageContext {
    blocRegistry: BlocRegistry;
  }
}
