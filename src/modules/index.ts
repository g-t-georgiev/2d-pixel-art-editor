// Register web components
import "color-picker";
import "@modules/ui/components";

import Application from "@modules/Application";

window.addEventListener("DOMContentLoaded", () => {
  const canvasElement = document.querySelector<HTMLCanvasElement>("#paintCanvas");

  if (!canvasElement) return;

  const application = new Application(canvasElement);

  // @ts-ignore Development only
  window.__pixelEditor__ = application;
});