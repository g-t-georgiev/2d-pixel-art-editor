import Application from "./editor/Application.js";

window.addEventListener("DOMContentLoaded", () => {
  const canvasElement = document.getElementById("paintCanvas");

  // Development only
  window.__pixelEditor__ = new Application(canvasElement);
});