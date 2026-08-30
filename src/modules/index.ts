import "color-picker";
import "@modules/layers/components";
import Application from "@modules/editor/Application";

window.addEventListener("DOMContentLoaded", () => {
  const canvasElement = document.querySelector<HTMLCanvasElement>("#paintCanvas");

  if (!canvasElement) return;

  const application = new Application(canvasElement);

  // Development only
  // @ts-ignore
  window.__pixelEditor__ = application;
});