import "color-picker";
import Application from "./editor/Application";

window.addEventListener("DOMContentLoaded", () => {
  const canvasElement = document.querySelector<HTMLCanvasElement>("#paintCanvas");

  if (!canvasElement) return;

  const application = new Application(canvasElement);

  // Development only
  // @ts-ignore
  window.__pixelEditor__ = application;
});