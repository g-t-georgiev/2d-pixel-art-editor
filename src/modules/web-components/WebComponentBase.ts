import type { WebComponent, WebComponentBaseOptions } from "./types";

export default function WebComponentBase(
  shadowRootInit: ShadowRootInit,
  options: WebComponentBaseOptions
) {
  return class WebComponentBase extends HTMLElement implements WebComponent {
    protected _shadowRoot: ShadowRoot;

    constructor() {
      super();

      if (options.abstract && new.target === WebComponentBase) {
        throw new Error("Cannot construct abstract class WebComponentBase directly.");
      }

      this._shadowRoot = this.attachShadow(shadowRootInit);
    }
  }
}