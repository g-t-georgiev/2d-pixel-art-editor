// Register web components
import "color-picker";
import "@modules/layers";

import Application from "@modules/editor/Application";

window.addEventListener("DOMContentLoaded", () => {
  const canvasElement = document.querySelector<HTMLCanvasElement>("#paintCanvas");

  if (!canvasElement) return;

  const application = new Application(canvasElement);

  // @ts-ignore Development only
  window.__pixelEditor__ = application;
});